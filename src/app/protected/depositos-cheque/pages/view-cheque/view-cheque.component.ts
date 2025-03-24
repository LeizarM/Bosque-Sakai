import { Component, OnInit } from '@angular/core';
import { DepositoCheque } from 'src/app/protected/interfaces/DepositoCheque';
import { DepositoChequeService } from '../../services/deposito-cheque.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { ChBanco } from 'src/app/protected/interfaces/ChBanco';
import { SocioNegocio } from 'src/app/protected/interfaces/SocioNegocio';
import { Empresa } from 'src/app/protected/interfaces/Empresa';
import { BancoXCuenta } from 'src/app/protected/interfaces/BancoXCuenta';
import { LoginService } from 'src/app/auth/services/login.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Try an alternative approach for importing jspdf and autotable
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-view-cheque',
  templateUrl: './view-cheque.component.html',
  styleUrls: ['./view-cheque.component.css'],
  providers: [MessageService]
})
export class ViewChequeComponent implements OnInit {

  depositos: DepositoCheque[] = [];
  loading: boolean = false;

  // New properties for search criteria
  empresas: Empresa[] = [];
  bancos: BancoXCuenta[] = [];
  sociosNegocio: SocioNegocio[] = [];
  
  selectedEmpresa: number = 1; // Default value
  selectedBanco: number | null = null;
  selectedCliente: string | null = null;
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  codEmpresa: number = 1; // Default company code
  
  // Add estados dropdown options
  estadosDeposito = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Verificado', value: 'Verificado' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Rechazado', value: 'Rechazado' }
  ];
  selectedEstado: string = 'Todos'; // Default value

  // Add these properties to your component class
  editingDeposito: any = null;
  editingTransaccionNum: string = '';

  // Modal properties and methods
  showEditModal: boolean = false;
  updating: boolean = false;

  // Add this property for editing banco
  editingBancoId: number  = 0;

  // Add this property for banks in the edit modal
  bancosModal: BancoXCuenta[] = [];

  // Add form group
  editForm!: FormGroup;

  constructor(
    private depositoChequeService: DepositoChequeService,
    private messageService: MessageService,
    private loginService: LoginService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.cargarEmpresas();
    
    // Set default dates (today for both)
    this.fechaInicio = new Date();
    this.fechaFin = new Date();

    // Initialize the form
    this.initEditForm();
    this.loginService.cargarPermisos().subscribe(() => {
      console.log('Permisos de botones cargados');
    });
  }

  cargarEmpresas(): void {
    this.loading = true;
    this.depositoChequeService.obtenerEmpresas()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.data) {
            // Add "Todos" option at the beginning of the array
            const todosOption: Empresa = {
              codEmpresa: 0,
              codEmpresaBosque: 0,
              nombre: 'Todos',
            };
            
            this.empresas = [todosOption, ...response.data];
            if (this.empresas.length > 0) {
              this.selectedEmpresa = this.empresas[0].codEmpresaBosque || 0;
              this.codEmpresa = this.selectedEmpresa;
              this.cargarBancos();
              this.cargarSociosNegocio();
            }
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

  onEmpresaChange(): void {
    this.codEmpresa = this.selectedEmpresa;
    console.log("la empresa es "+this.codEmpresa);
    this.cargarBancos();
    this.cargarSociosNegocio();
    this.selectedBanco = null;
    this.selectedCliente = null;
  }

  cargarBancos(): void {
    this.loading = true;
    this.depositoChequeService.obtenerBancos(this.selectedEmpresa)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.data) {
            // Add "Todos" option at the beginning of the array
            const todosOption: BancoXCuenta = {
              idBxC: 0,
              nombreBanco: 'Todos',
              codBanco: 0,
              codEmpresa: this.selectedEmpresa
            };
            
            this.bancos = [todosOption, ...response.data];
            
            // Select "Todos" as default
            this.selectedBanco = 0;
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar bancos: ' + error.message
          });
        }
      });
  }

  cargarSociosNegocio(): void {
    this.loading = true;
    this.depositoChequeService.obtenerSociosNegocio(this.selectedEmpresa)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.data) {
            // Add "Todos" option at the beginning of the array
            const todosOption: SocioNegocio = {
              codCliente: '',
              nombreCompleto: 'Todos',
            };
            
            this.sociosNegocio = [todosOption, ...response.data];
            // Select "Todos" as default
            this.selectedCliente = '';
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar socios de negocio: ' + error.message
          });
        }
      });
  }

  cargarDepositos(): void {
    this.loading = true;
    // Use selected criteria for search
    const idBxC = this.selectedBanco;
    const clienteCod = this.selectedCliente || '';
    const estado = this.selectedEstado === 'Todos' ? '' : this.selectedEstado;
    const coEmpresa = this.selectedEmpresa; // Get selected empresa ID
    
    /* console.log(idBxC);
    console.log(this.fechaInicio);
    console.log(this.fechaFin);
    console.log(clienteCod);
    console.log(estado);
    console.log('Empresa seleccionada:', coEmpresa); */

    this.depositoChequeService.obtenerDepositos(
      this.codEmpresa,
      idBxC ?? 0, 
      this.fechaInicio, 
      this.fechaFin, 
      clienteCod,
      estado,
      
    )
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if(response == null){
            this.messageService.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: 'No se encontraron depósitos'
            });
            this.depositos = [];
          }
          if (response.data) {
            this.depositos = response.data;
          }else{
            this.depositos = [];
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar depósitos: ' + error.message
          });
        }
      });
  }

  // Method to handle search when user clicks search button
  buscar(): void {
    this.cargarDepositos();
  }

  descargarImagen(deposito: DepositoCheque): void {

    console.log(deposito);

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
   * Opens the modal for editing transaction number
   */
  openEditModal(deposito: DepositoCheque): void {
    console.log('Editando número de transacción para depósito ID:', deposito.idDeposito);
    console.log('Deposit object:', deposito); // Debug log to see all properties
    
    this.editingDeposito = deposito;
    this.editingTransaccionNum = deposito.nroTransaccion || '';
    
    // Show the modal immediately to ensure UI doesn't break
    this.showEditModal = true;
    
    // Extract the company ID from the deposit or use a default
    // The API response might have the company ID in different properties
    const empresaId = deposito.codEmpresa ||  1;
    
    // Load banks for this deposit's empresa
    this.loading = true;
    console.log("el idBxC:  ",deposito.idBxC);
    this.depositoChequeService.obtenerBancos(empresaId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.bancosModal = response.data;
            // Now set the selected bank ID
            this.editingBancoId = deposito.idBxC!;
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: 'No se pudieron cargar los bancos para esta empresa'
            });
            this.bancosModal = []; // Ensure we have an empty array at minimum
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar bancos para el depósito: ' + (error.message || 'Error desconocido')
          });
          this.bancosModal = []; // Ensure we have an empty array at minimum
        }
      });

    // Reset form and set values
    this.editForm.reset();
    this.editForm.patchValue({
      idDeposito: deposito.idDeposito,
      codCliente: deposito.codCliente,
      idBxC: deposito.idBxC, // Make sure this property matches your data structure
      importe: deposito.importe,
      nroTransaccion: deposito.nroTransaccion
    });
  }

  rechazarDeposito(deposito: DepositoCheque): void {
    deposito.fechaI = undefined;
    console.log(deposito);
    this.loading = true;
    this.depositoChequeService.rechazarDeposito(deposito)
       .pipe(finalize(() => this.loading = false))
       .subscribe({
         next: () => {
          this.messageService.add({
             severity:'success',
             summary: 'Rechazado',
             detail: 'El depósito ha sido rechazado'
           });
           this.cargarDepositos();
          
           },
         error: (error) => {
          this.messageService.add({
             severity: 'error',
             summary: 'Error',
             detail: 'Error al rechazar el depósito:'+ error.message
           });
          }       
    });
  }

  /**
   * Closes the edit modal
   */
  closeModal(): void {
    console.log('Edición cancelada');
    this.showEditModal = false;
    this.editingDeposito = null;
    this.editingTransaccionNum = '';
    this.editingBancoId = 0;
    this.bancosModal = []; // Clear modal banks
  }

  /**
   * Saves the updated transaction number and bank
   */
  saveTransaccionNum(): void {
    if (this.editForm.invalid) {
      return;
    }
    
    this.updating = true;
    
    const formData = this.editForm.getRawValue();
    
    // Use the values from the form instead of component properties
    // Rest of your code using formData.idBxC and formData.nroTransaccion
    // ...

    const deposito: DepositoCheque = {
      idDeposito: formData.idDeposito,
      nroTransaccion: formData.nroTransaccion,
      idBxC: formData.idBxC ?? 0,
      audUsuario: this.loginService.codUsuario
    };
    
    this.updating = true;
    this.depositoChequeService.updateTransaccionNum(deposito)
      .pipe(finalize(() => this.updating = false))
      .subscribe({
        next: (response) => {
          // Update local object if the API call succeeded
          this.editingDeposito.nroTransaccion = formData.nroTransaccion;
          this.editingDeposito.idBxC = formData.idBxC;
          
          // Also update the bank name in the UI
          if (formData.idBxC) {
            const selectedBank = this.bancos.find(b => b.idBxC === formData.idBxC);
            if (selectedBank) {
              this.editingDeposito.nombreBanco = selectedBank.nombreBanco;
            }
          }
          
          this.messageService.add({
            severity: 'success', 
            summary: 'Éxito', 
            detail: 'Información actualizada correctamente'
          });
          this.showEditModal = false;
          this.editingDeposito = null;
          this.editingTransaccionNum = '';
          this.editingBancoId = 0;
        },
        error: (error) => {
          console.error('Error updating deposit information:', error);
          this.messageService.add({
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo actualizar la información. Por favor, inténtelo de nuevo.'
          });
          // Don't close the modal on error so user can try again
        }
      });
  }

  getUser(): number {
    return this.loginService.codUsuario
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
      const empresa = this.empresas.find(e => e.codEmpresa === this.selectedEmpresa);
      doc.setFontSize(14);
      doc.text(`Reporte de Depósitos`, 14, 15);
      
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
        'ID', 'Cliente', 'Banco', 'Empresa', 'Importe', 'Moneda', 
        'Fecha', 'Transacción', 'Estado'
      ];
      
      const rows = this.depositos.map(d => [
        d.idDeposito || '',
        d.codCliente || '',
        d.nombreBanco || '',
        d.nombreEmpresa || '',
        d.importe ? d.importe.toFixed(2) : '0.00',
        d.moneda || '',
        d.fechaI ? formatDate(new Date(d.fechaI)) : '',
        d.nroTransaccion || '',
        d.esPendiente !== undefined ? d.esPendiente : ''
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
          2: { cellWidth: 'auto' },  // Banco
          3: { cellWidth: 'auto' },  // Empresa
          4: { halign: 'right', cellWidth: 'auto' },   // Importe
          5: { cellWidth: 'auto' },  // Moneda
          6: { cellWidth: 'auto' },  // Fecha
          7: { cellWidth: 'auto' },  // Transacción
          8: { cellWidth: 'auto' },  // Estado
        },
        didParseCell: (data) => {
          // Add colors to status cells
          if (data.section === 'body' && data.column.index === 8) {
            if (data.cell.raw === 'Pendiente') {
              data.cell.styles.textColor = [230, 126, 34]; // Orange
            } else if (data.cell.raw === 'Verificado') {
              data.cell.styles.textColor = [46, 125, 50]; // Green
            } else if (data.cell.raw === 'Rechazado') {
              data.cell.styles.textColor = [192, 57, 43]; // Red
            }
          }
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
      doc.save(`Depositos_${formatDate(this.fechaInicio)}-${formatDate(this.fechaFin)}.pdf`);
      
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

  // Method to initialize the form
  private initEditForm(): void {
    this.editForm = this.fb.group({
      idDeposito: [{value: '', disabled: true}],
      codCliente: [{value: '', disabled: true}],
      idBxC: ['', Validators.required],
      importe: [{value: '', disabled: true}],
      nroTransaccion: ['', Validators.required]
    });
  }


  puedeEditar(): boolean {
    return this.loginService.estaAutorizadoSync('btnNroTransac');
  }
  
  puedeRechazar(): boolean {
    return this.loginService.estaAutorizadoSync('btnRechazado');
  }
}
