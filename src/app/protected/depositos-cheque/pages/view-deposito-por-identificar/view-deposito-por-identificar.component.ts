import { Component, OnInit } from '@angular/core';
import { DepositoCheque } from 'src/app/protected/interfaces/DepositoCheque';
import { DepositoChequeService } from '../../services/deposito-cheque.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';

// Import for PDF export
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Imports adicionales necesarios
import { Empresa } from 'src/app/protected/interfaces/Empresa';
import { SocioNegocio } from 'src/app/protected/interfaces/SocioNegocio';

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
  empresaSeleccionada: number | null = null;
  clienteSeleccionado: string | null = null;
  cargandoClientes: boolean = false;
  guardandoCliente: boolean = false;

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
          if (response.data) {
            this.depositos = response.data;
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar depósitos por identificar: ' + error.message
          });
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
    this.mostrarDialogoCliente = true;
    
    // Si ya tenemos la empresa, cargamos los clientes
    if (this.empresaSeleccionada) {
      this.cargarClientesPorEmpresa({ value: this.empresaSeleccionada });
    }
  }

  // Método para cargar los clientes de una empresa
  cargarClientesPorEmpresa(event: any): void {
    const codEmpresa = event.value;
    
    if (codEmpresa) {
      this.cargandoClientes = true;
      this.clientes = [];
      this.clienteSeleccionado = null;
      
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
      .pipe(finalize(() => this.guardandoCliente = false))
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
          
          // Refrescar la lista de depósitos
          this.buscar();
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
