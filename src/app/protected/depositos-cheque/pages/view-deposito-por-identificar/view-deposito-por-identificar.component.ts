import { Component, OnInit } from '@angular/core';
import { DepositoCheque } from 'src/app/protected/interfaces/DepositoCheque';
import { DepositoChequeService } from '../../services/deposito-cheque.service';
import { MessageService } from 'primeng/api';
import { finalize, forkJoin } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';

// Import for PDF export
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Imports adicionales necesarios

import { SocioNegocio } from 'src/app/protected/interfaces/SocioNegocio';
import { NotaRemision } from 'src/app/protected/interfaces/NotaRemision';
import { Empresa } from 'src/app/protected/interfaces/Empresa';
import { BancoXCuenta } from 'src/app/protected/interfaces/BancoXCuenta';

@Component({
  selector: 'app-view-deposito-por-identificar',
  templateUrl: './view-deposito-por-identificar.component.html',
  styleUrls: ['./view-deposito-por-identificar.component.css'],
  providers: [MessageService]
})
export class ViewDepositoPorIdentificarComponent implements OnInit {

  depositos: DepositoCheque[] = [];
  loading: boolean = false;

  // Search criteria - only dates
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();

  // Variables para el diálogo de actualización de cliente
  mostrarDialogoCliente: boolean = false;
  depositoSeleccionado: any = null;
  empresas: Empresa[] = [];
  clientes: SocioNegocio[] = [];
  empresaSeleccionada: number = 0;
  clienteSeleccionado: string =  '';
  cargandoClientes: boolean = false;
  guardandoCliente: boolean = false;
  
  // Variables para la selección de documentos y a cuenta
  documentos: NotaRemision[] = [];
  totalMontoDocumentos: number = 0;
  aCuenta: number = 0;
  importesValidos: boolean = false;

  // Variables para bancos
  bancos: BancoXCuenta[] = [];
  bancoSeleccionado: number = 0;
  cargandoBancos: boolean = false;

  constructor(
    private depositoChequeService: DepositoChequeService,
    private messageService: MessageService,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    // Set default dates (today for both)
    this.fechaInicio = new Date();
    this.fechaFin = new Date();
    this.cargarEmpresas();
  }

  buscar(): void {
    this.loading = true;
    
    this.depositoChequeService.obtenerDepositosXIdentificar(0,
      this.fechaInicio, 
      this.fechaFin,
      '',
    )
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.depositos = response.data;
            
            // Si no hay datos y las fechas no son de hoy, intentar buscar con la fecha actual
            if (this.depositos.length === 0) {
              const today = new Date();
              const startIsToday = this.isSameDay(this.fechaInicio, today);
              const endIsToday = this.isSameDay(this.fechaFin, today);
              
              if (!startIsToday || !endIsToday) {
                this.buscarConFechaActual();
              }
            }
          } else {
            // Si response o response.data son nulos
            this.depositos = [];
            // Intentar buscar con la fecha actual
            this.buscarConFechaActual();
          }
        },
        error: (error) => {
          this.depositos = [];
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar depósitos por identificar: ' + error.message
          });
        }
      });
  }

  // Método para verificar si dos fechas son el mismo día
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  // Método para buscar con la fecha actual
  private buscarConFechaActual(): void {
    // Establecemos fecha actual para ambos campos
    const today = new Date();
    this.fechaInicio = today;
    this.fechaFin = today;
    
    this.loading = true;
    
    this.depositoChequeService.obtenerDepositosXIdentificar(0, today, today, '')
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.depositos = response.data;
          } else {
            this.depositos = [];
          }
        },
        error: (error) => {
          this.depositos = [];
          // No mostramos mensaje de error para no saturar al usuario
        }
      });
  }

  descargarImagen(deposito: DepositoCheque): void {
    if (!deposito.idDeposito) return;
    this.loading = true;
    this.depositoChequeService.descargarImagen(deposito.idDeposito)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `deposito_${deposito.idDeposito}${this.getFileExtension(deposito.fotoPath)}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al descargar imagen: ' + error.message
          });
        }
      });
  }

  descargarPdf(deposito: DepositoCheque): void {
    this.loading = true;
    this.depositoChequeService.descargarPdf(deposito)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `deposito_${deposito.idDeposito}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al descargar PDF: ' + error.message
                });
            }
        });
  }

  private getFileExtension(fileName: string | undefined): string {
    if (!fileName) return '.jpg';
    return fileName.substring(fileName.lastIndexOf('.'));
  }

  /**
   * Exports the deposits data to a professional PDF document
   */
  exportarPDF(): void {
    if (this.depositos.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay datos para exportar'
      });
      return;
    }

    try {
      // Create PDF document in portrait (letter size)
      const doc = new jsPDF('portrait');
      
      // Add title
      doc.setFontSize(14);
      doc.text(`Reporte de Depósitos por Identificar`, 14, 15);
      
      // Add date range
      const formatDate = (date: Date) => {
        return date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : '';
      };
      
      doc.setFontSize(10);
      doc.text(`Periodo: ${formatDate(this.fechaInicio)} - ${formatDate(this.fechaFin)}`, 14, 22);
      
      // Generate current date for the report
      const today = new Date();
      doc.text(`Fecha de generación: ${formatDate(today)}`, 14, 28);
      
      // Create table header and rows
      const headers = [
        'ID', 'Cliente', 'Empresa', 'Banco', 'Moneda', 'Observaciones'
      ];
      
      const rows = this.depositos.map(d => [
        d.idDeposito || '',
        d.codCliente || '',
        d.nombreEmpresa || '',
        d.nombreBanco || '',
        d.moneda || '',
        d.obs || ''
      ]);
      
      // Use the autoTable function with settings optimized for letter size
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 32,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [60, 60, 60],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 8
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 'auto' },  // ID
          1: { cellWidth: 'auto' },  // Cliente
          2: { cellWidth: 'auto' },  // Empresa
          3: { cellWidth: 'auto' },  // Banco
          4: { cellWidth: 'auto' },  // Moneda
          5: { cellWidth: 'auto' },  // Observaciones
        },
        didDrawPage: (data) => {
          // Add page numbers
          const pageCount = doc.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
          }
        }
      });
      
      // Save the PDF
      doc.save(`Depositos_Por_Identificar_${formatDate(this.fechaInicio)}-${formatDate(this.fechaFin)}.pdf`);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'PDF generado correctamente'
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al generar PDF'
      });
    }
  }

  // Método para cargar las empresas disponibles
  cargarEmpresas(): void {
    this.depositoChequeService.obtenerEmpresas()
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.empresas = response.data;
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar empresas: ' + error.message
          });
        }
      });
  }

  // Método para abrir el diálogo de actualización de cliente
  abrirDialogoActualizarCliente(deposito: any): void {
    this.depositoSeleccionado = deposito;
    this.empresaSeleccionada = deposito.codEmpresa;
    this.clienteSeleccionado = deposito.codCliente;
    this.bancoSeleccionado = deposito.idBxC;
    this.aCuenta = 0;
    this.totalMontoDocumentos = 0;
    this.importesValidos = false;
    this.documentos = [];
    this.mostrarDialogoCliente = true;
    
    // Si ya tenemos la empresa, cargamos los clientes y bancos
    if (this.empresaSeleccionada) {
      this.cargarClientesPorEmpresa({ value: this.empresaSeleccionada });
      this.cargarBancos(this.empresaSeleccionada);
      
      // Si ya tenemos el cliente, cargamos los documentos
      if (this.clienteSeleccionado) {
        this.onClienteChange({ value: this.clienteSeleccionado });
      }
    }
  }

  // Método para cargar los clientes de una empresa
  cargarClientesPorEmpresa(event: any): void {
    const valorOriginal = event.value;
    this.documentos = [];
    this.totalMontoDocumentos = 0;
    this.aCuenta = 0;
    this.importesValidos = false;
    
    // Manejamos el caso especial de Papirus (código 7)
    let codEmpresa = valorOriginal;
    if (valorOriginal === 7) {
      codEmpresa = 1;  // Usamos codEmpresa = 1 para cargar los datos
    }
    
    // Cargar los bancos para la empresa seleccionada
    this.cargarBancos(valorOriginal);
    
    if (codEmpresa) {
      this.cargandoClientes = true;
      this.clientes = [];
      this.clienteSeleccionado = '';
      
      this.depositoChequeService.obtenerSociosNegocio(codEmpresa)
        .pipe(finalize(() => this.cargandoClientes = false))
        .subscribe({
          next: (response) => {
            if (response.data && response.data.length > 0) {
              this.clientes = response.data;
              
              // Si estamos editando y el cliente actual pertenece a esta empresa, lo seleccionamos
              if (this.depositoSeleccionado && this.depositoSeleccionado.codCliente) {
                const clienteExistente = this.clientes.find(c => c.codCliente === this.depositoSeleccionado.codCliente);
                if (clienteExistente) {
                  this.clienteSeleccionado = clienteExistente.codCliente ?? '';
                }
              }
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al cargar clientes: ' + error.message
            });
          }
        });
    }
  }

  // Método para cargar los bancos disponibles para una empresa
  cargarBancos(codEmpresa: number): void {
    this.cargandoBancos = true;
    this.bancos = [];
    
    this.depositoChequeService.obtenerBancos(codEmpresa)
      .pipe(finalize(() => this.cargandoBancos = false))
      .subscribe({
        next: (response) => {
          if (response.data && response.data.length > 0) {
            this.bancos = response.data;
            
            // Si estamos editando y ya hay un banco seleccionado, lo mantenemos
            if (this.depositoSeleccionado && this.depositoSeleccionado.idBxC) {
              const bancoExistente = this.bancos.find(b => b.idBxC === this.depositoSeleccionado.idBxC);
              if (bancoExistente) {
                this.bancoSeleccionado = bancoExistente.idBxC ?? 0;
              } else if (this.bancos.length > 0) {
                // Si el banco anterior no está disponible, seleccionamos el primero
                this.bancoSeleccionado = this.bancos[0].idBxC ?? 0;
              }
            }
          } else {
            this.bancos = [];
            this.bancoSeleccionado = 0;
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar bancos: ' + error.message
          });
          this.bancos = [];
          this.bancoSeleccionado = 0;
        }
      });
  }

  // Método para cargar documentos cuando cambia el cliente
  onClienteChange(event: any): void {
    const codCliente = event.value;
    const codEmpresa = this.empresaSeleccionada;

    if (codCliente && codEmpresa) {
      this.cargandoClientes = true;
      this.documentos = [];
      this.totalMontoDocumentos = 0;
      
      this.depositoChequeService.obtenerDocumentosPorCliente(codEmpresa, codCliente)
        .pipe(finalize(() => this.cargandoClientes = false))
        .subscribe({
          next: (response) => {
            if (response.data && response.data.length > 0) {
              this.documentos = response.data.map(doc => ({
                ...doc,
                selected: false // Inicializamos la selección en false
              }));
              this.calcularTotales();
            } else {
              this.documentos = [];
              // Eliminamos el mensaje informativo
            }
          },
          error: (error) => {
            this.documentos = [];
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al cargar documentos: ' + error.message
            });
          }
        });
    }
  }

  // Métodos para manejo de documentos
  onDocumentSelectChange(documento: NotaRemision): void {
    this.calcularTotales();
  }

  toggleDocumentSelection(documento: NotaRemision): void {
    documento.selected = !documento.selected;
    this.calcularTotales();
  }

  toggleAllDocuments(event: any): void {
    const selectAll = event.checked;
    this.documentos.forEach(doc => doc.selected = selectAll);
    this.calcularTotales();
  }

  get allDocumentsSelected(): boolean {
    return this.documentos.length > 0 && this.documentos.every(doc => doc.selected);
  }

  getSelectedDocumentos(): NotaRemision[] {
    return this.documentos.filter(doc => doc.selected);
  }

  calcularTotales(): void {
    // Calcular el total de los documentos seleccionados
    this.totalMontoDocumentos = this.getSelectedDocumentos().reduce((sum, doc) => {
      return sum + (doc.totalMonto || 0);
    }, 0);

    // Verificar si el total de documentos seleccionados + a cuenta es igual al importe del depósito
    const importeDeposito = this.depositoSeleccionado?.importe || 0;
    const totalCalculado = this.totalMontoDocumentos + (this.aCuenta || 0);
    
    // Permitimos un margen de error muy pequeño por posibles problemas de redondeo
    const EPSILON = 0.01;
    this.importesValidos = Math.abs(importeDeposito - totalCalculado) < EPSILON;
  }

  // Método para actualizar el depósito con los nuevos documentos y a cuenta
  actualizarDeposito(): void {
    const selectedDocs = this.getSelectedDocumentos();
    
    // Validaciones
    if (selectedDocs.length === 0 && this.aCuenta <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar al menos un documento o ingresar un valor en "A Cuenta"'
      });
      return;
    }

    if (!this.importesValidos) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El total de documentos seleccionados más el monto a cuenta debe ser igual al importe del depósito'
      });
      return;
    }

    this.guardandoCliente = true;

    // Crear el objeto con la información actualizada del depósito
    const depositoActualizado: DepositoCheque = {
      idDeposito: this.depositoSeleccionado.idDeposito,
      codEmpresa: this.empresaSeleccionada,
      codCliente: this.clienteSeleccionado,
      idBxC: this.bancoSeleccionado,  // Incluimos el banco seleccionado
      importe: this.depositoSeleccionado.importe,
      aCuenta: this.aCuenta,
      moneda: this.depositoSeleccionado.moneda,
      fotoPath: this.depositoSeleccionado.fotoPath,
      audUsuario: this.getUser()
    };

    // Primero actualizamos la información básica del depósito
    this.depositoChequeService.registrarDepositoCheque(
      depositoActualizado, new File([], 'empty.txt')
    )
      .pipe(finalize(() => {
        this.guardandoCliente = false;
        // Aseguramos que la tabla se recarga después de la actualización
        this.buscar();
      }))
      .subscribe({
        next: (response) => {
          // Crear un array de observables para las notas de remisión
          const notasRemisionObservables = selectedDocs.map((doc) => {
            const notaRemision = {
              idNR: 0, // Nuevo registro
              idDeposito: depositoActualizado.idDeposito,
              docNum: doc.docNum,
              fecha: doc.fecha,
              numFact: doc.numFact,
              totalMonto: doc.totalMonto,
              estado: 1,
              saldoPendiente: doc.saldoPendiente,
              audUsuario: this.getUser()
            };
            // Devuelve el observable sin suscribirse
            return this.depositoChequeService.registroNotaRemision(notaRemision);
          });
          
          // Usar forkJoin para ejecutar todas las solicitudes en paralelo
          if (notasRemisionObservables.length > 0) {
            forkJoin(notasRemisionObservables).subscribe({
              next: (results) => {
                console.log('Todas las notas de remisión registradas correctamente', results);
              },
              error: (error) => {
                console.error('Error al registrar notas de remisión', error);
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Advertencia',
                  detail: 'El depósito se actualizó pero hubo problemas al registrar algunos documentos'
                });
              }
            });
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Depósito actualizado correctamente'
          });
          
          // Cerrar el diálogo
          this.mostrarDialogoCliente = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar depósito: ' + error.message
          });
        }
      });
  }

  // Obtener el usuario actual
  getUser(): number {
    return this.loginService.codUsuario;
  }

  // Método para actualizar el cliente del depósito
  actualizarCliente(): void {
    if (!this.depositoSeleccionado || !this.clienteSeleccionado) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar un cliente'
      });
      return;
    }

    this.guardandoCliente = true;

    // Objeto con la información a actualizar
    const actualizacion = {
      idDeposito: this.depositoSeleccionado.idDeposito,
      codCliente: this.clienteSeleccionado
    };

    // Llamada al servicio para actualizar (debes implementar este método en tu servicio)
    this.depositoChequeService.actualizarClienteDeposito(actualizacion as any)
      .pipe(finalize(() => {
        this.guardandoCliente = false;
        // Aseguramos que la tabla se recarga después de la actualización
        this.buscar();
      }))
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente actualizado correctamente'
          });
          
          // Actualizar la información en la lista
          this.depositoSeleccionado.codCliente = this.clienteSeleccionado;
          // Obtener el nombre del cliente seleccionado para actualizar la UI
          const clienteInfo = this.clientes.find(c => c.codCliente === this.clienteSeleccionado);
          if (clienteInfo) {
            this.depositoSeleccionado.nombreCliente = clienteInfo.nombreCompleto;
          }
          
          // Cerrar el diálogo
          this.mostrarDialogoCliente = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar cliente: ' + error.message
          });
        }
      });
  }
}
