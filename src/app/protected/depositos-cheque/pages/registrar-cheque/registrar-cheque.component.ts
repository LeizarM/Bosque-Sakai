// components/registrar-cheque/registrar-cheque.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DepositoChequeService } from '../../services/deposito-cheque.service';
import { finalize } from 'rxjs/operators';
import { Empresa } from 'src/app/protected/interfaces/Empresa';
import { SocioNegocio } from 'src/app/protected/interfaces/SocioNegocio';
import { DepositoCheque } from 'src/app/protected/interfaces/DepositoCheque';
import { ChBanco } from 'src/app/protected/interfaces/ChBanco';
import { LoginService } from 'src/app/auth/services/login.service';
import { NotaRemision } from 'src/app/protected/interfaces/NotaRemision';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-registrar-cheque',
  templateUrl: './registrar-cheque.component.html',
  styleUrls: ['./registrar-cheque.component.css'],
  providers: [MessageService]
})
export class RegistrarChequeComponent implements OnInit {

  chequeForm!: FormGroup;
  depositSearchForm!: FormGroup;
  depositList: DepositoCheque[] = [];
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  loading: boolean = false;
  isDragging: boolean = false;

  empresas: Empresa[] = [];
  clientes: SocioNegocio[] = [];
  bancos: ChBanco[] = [];
  documentos: NotaRemision[] = [];
  saldoMontoDocumentos: number = 0;

  monedas = [
    { label: 'Bolivianos', value: 'BS' },
    { label: 'Dólares', value: 'USD' }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private depositoChequeService: DepositoChequeService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initSearchForm();
    this.cargarEmpresas();
    //this.cargarBancos(0);
  }

  /**
   * Inicializa el formulario para registrar depósitos.
   */
  private initForm(): void {
    this.chequeForm = this.fb.group({
      codEmpresa: ['', [Validators.required]],
      codCliente: ['', [Validators.required]],
      idBxC: ['', [Validators.required]],
      aCuenta: [0, [Validators.required, Validators.min(0.0)]],
      importe: [{ value: 0, disabled: false }, [Validators.required, Validators.min(0.01)]],
      moneda: ['BS', [Validators.required]],
      fotoPath: ['']
    });
  }

  /**
   * Inicializa el formulario de búsqueda para consultar el estado de los depósitos.
   */
  private initSearchForm(): void {
    this.depositSearchForm = this.fb.group({
      docNum: [''],
      numFact: ['']
    });
  }

  cargarEmpresas(): void {
    this.loading = true;
    this.depositoChequeService.obtenerEmpresas()
      .pipe(finalize(() => this.loading = false))
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

  cargarBancos(codEmpresa: number): void {
    this.loading = true;
    this.depositoChequeService.obtenerBancos(codEmpresa)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.bancos = response.data;
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

  onEmpresaChange(event: any): void {
    // Nos aseguramos que, en el caso de papirus, el valor se ajuste a 1
    this.bancos = [];
    this.documentos = [];
    this.saldoMontoDocumentos = 0;
    this.chequeForm.get('importe')?.setValue(0);
    this.chequeForm.get('aCuenta')?.setValue(0);

    this.cargarBancos(event.value);
    if (event.value === 7) {
      event.value = 1;
    }
    const codEmpresa = event.value;

    if (codEmpresa) {
      this.loading = true;
      this.chequeForm.get('codCliente')?.setValue('');
      this.clientes = []; // Limpiamos los clientes antes de la llamada

      this.depositoChequeService.obtenerSociosNegocio(codEmpresa)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (response) => {
            if (response.data && response.data.length > 0) {
              this.clientes = response.data;
            } else {
              this.clientes = [];
              this.chequeForm.get('codCliente')?.setValue('');
            }
          },
          error: (error) => {
            this.clientes = [];
            this.chequeForm.get('codCliente')?.setValue('');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al cargar clientes: ' + error.message
            });
          }
        });
    } else {
      this.clientes = [];
      this.chequeForm.get('codCliente')?.setValue('');
    }
  }

  onClienteChange(event: any): void {
    const codCliente = event.value;
    const codEmpresa = this.chequeForm.get('codEmpresa')?.value;

    if (codCliente && codEmpresa) {
      this.loading = true;
      this.documentos = [];
      this.saldoMontoDocumentos = 0;
      this.chequeForm.get('importe')?.setValue(0);
      this.chequeForm.get('aCuenta')?.setValue(0);

      this.depositoChequeService.obtenerDocumentosPorCliente(codEmpresa, codCliente)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (response) => {
            if (response.data && response.data.length > 0) {
              this.documentos = response.data.map(doc => ({
                ...doc,
                selected: false, // Inicializamos la selección en false
                saldoPendienteOriginal: doc.saldoPendiente // Guardamos el valor original
              }));
            } else {
              this.documentos = [];
              this.messageService.add({
                severity: 'info',
                summary: 'Información',
                detail: 'No hay documentos disponibles para este cliente'
              });
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

  /**
   * Maneja la selección/deselección de documentos
   */
  onDocumentSelect(documento: NotaRemision, selected: boolean): void {
    documento.selected = selected;
    this.calcularTotales();
  }

  /**
   * Obtiene los documentos seleccionados
   */
  getSelectedDocumentos(): NotaRemision[] {
    return this.documentos.filter(doc => doc.selected);
  }

  /**
   * Calcula los totales basados en los documentos seleccionados y el monto a cuenta
   */
  calcularTotales(): void {
    // Calcular el total de los documentos seleccionados
    this.saldoMontoDocumentos = this.getSelectedDocumentos().reduce((sum, doc) => {
      return sum + (doc.saldoPendiente || 0);
    }, 0);

    // Obtener el valor de a cuenta del formulario
    const aCuenta = this.chequeForm.get('aCuenta')?.value || 0;

    // Calcular el importe total (documentos + a cuenta)
    const importeTotal = this.saldoMontoDocumentos + aCuenta;

    // Actualizar el importe total en el formulario
    this.chequeForm.get('importe')?.setValue(importeTotal);
  }

  /**
   * Maneja el evento dragover para mostrar feedback visual
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  /**
   * Maneja el evento dragleave para quitar el feedback visual
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  /**
   * Maneja el evento drop para procesar la imagen arrastrada
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  /**
   * Procesa el archivo seleccionado, ya sea por input o por drag & drop
   */
  processFile(file: File): void {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (validTypes.includes(file.type)) {
      if (file.size <= maxSize) {
        this.selectedFile = file;
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El archivo no debe superar los 5MB'
        });
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Solo se permiten archivos JPG, JPEG o PNG'
      });
    }
  }

  onFileSelect(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.processFile(event.target.files[0]);
    }
  }

  onSubmit(): void {
    if (this.chequeForm.valid && this.selectedFile) {
      const selectedDocs = this.getSelectedDocumentos();
      const aCuentaValue = this.chequeForm.get('aCuenta')?.value || 0;

      // Permitir registro sin documentos seleccionados solo si "A Cuenta" tiene un valor
      if (selectedDocs.length === 0 && aCuentaValue <= 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Debe seleccionar al menos un documento o ingresar un valor en "A Cuenta"'
        });
        return;
      }

      this.loading = true;
      const formValue = this.chequeForm.value;

      const depositoCheque: DepositoCheque = {
        idDeposito: 0,
        codEmpresa: formValue.codEmpresa,
        codCliente: formValue.codCliente,
        idBxC: formValue.idBxC,
        importe: formValue.importe,
        aCuenta: formValue.aCuenta,
        moneda: formValue.moneda,
        fotoPath: '',  // Se gestionará en el backend
        audUsuario: this.getUser()
      };

      console.log('Información del formulario:', formValue);
      console.log('Depósito base a registrar:', depositoCheque);

      // Hacer una sola llamada para registrar el depósito
      this.depositoChequeService.registrarDepositoCheque(depositoCheque, this.selectedFile!)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (response) => {
            // Crear un array de observables para las notas de remisión
            const notasRemisionObservables = selectedDocs.map((doc) => {
              const notaRemision = {
                idNR: doc.idNR,
                idDeposito: doc.idDeposito,
                docNum: doc.docNum,
                fecha: doc.fecha,
                numFact: doc.numFact,
                totalMonto: doc.totalMonto,
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
                    detail: 'El depósito se registró pero hubo problemas al registrar algunos documentos'
                  });
                }
              });
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: response.message
            });
            this.resetForm();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Error al registrar depósito'
            });
          }
        });
    } else {
      if (!this.selectedFile) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Debe seleccionar una imagen del cheque'
        });
      }

      this.markFormGroupTouched(this.chequeForm);
    }
  }

  private resetForm(): void {
    this.chequeForm.reset({
      moneda: 'BS',
      aCuenta: 0,
      importe: 0
    });
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.clientes = [];
    this.documentos = [];
    this.saldoMontoDocumentos = 0;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.chequeForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.chequeForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Este campo es requerido';
      }
      if (control.errors['min']) {
        return `El valor debe ser mayor a ${control.errors['min'].min}`;
      }
      if (control.errors['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  onCancel(): void {
    this.resetForm();
    this.messageService.add({
      severity: 'info',
      summary: 'Cancelado',
      detail: 'Se han limpiado todos los campos'
    });
  }

  /**
   * Devuelve el código de usuario actual.
   */
  getUser(): number {
    return this.loginService.codUsuario;
  }

  // Add property to track "select all" state
  get allDocumentsSelected(): boolean {
    return this.documentos.length > 0 && this.documentos.every(doc => doc.selected);
  }

  /**
   * Maneja la selección/deselección de documentos
   */
  onDocumentSelectChange(documento: NotaRemision): void {
    // El modelo ya se actualizó a través del binding ngModel
    // Solo necesitamos recalcular los totales
    this.calcularTotales();
  }

  /**
   * Selecciona o deselecciona un documento al hacer clic en la fila
   */
  toggleDocumentSelection(documento: NotaRemision): void {
    documento.selected = !documento.selected;
    this.calcularTotales();
  }

  /**
   * Selecciona o deselecciona todos los documentos
   */
  toggleAllDocuments(event: any): void {
    const selectAll = event.checked;
    this.documentos.forEach(doc => doc.selected = selectAll);
    this.calcularTotales();
  }

  /**
   * Maneja los cambios en el valor del saldo pendiente
   */
  onSaldoPendienteChange(documento: NotaRemision): void {
    this.validateSaldoPendiente(documento);
    this.calcularTotales();
  }

  /**
   * Valida que el saldo pendiente ingresado no sea mayor al original
   */
  validateSaldoPendiente(documento: NotaRemision): void {
    // Si el valor es mayor al original, restauramos al valor original
    if (documento.saldoPendiente! > documento.saldoPendienteOriginal!) {
      documento.saldoPendiente = documento.saldoPendienteOriginal;
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El valor no puede ser mayor al saldo pendiente original'
      });
    }
    
    // Si el valor es negativo, lo establecemos a 0
    if (documento.saldoPendiente! < 0) {
      documento.saldoPendiente = 0;
    }
    
    this.calcularTotales();
  }
}