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
  loading: boolean = false;

  empresas: Empresa[] = [];
  clientes: SocioNegocio[] = [];
  bancos: ChBanco[] = [];

  monedas = [
    { label: 'Bolivianos', value: 'BS' },
    { label: 'Dólares', value: 'USD' }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private depositoChequeService: DepositoChequeService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initSearchForm();
    this.cargarEmpresas();
    this.cargarBancos( 0 );
  }

  /**
   * Inicializa el formulario para registrar depósitos.
   */
  private initForm(): void {
    this.chequeForm = this.fb.group({
      codEmpresa: ['', [Validators.required]],
      codCliente: ['', [Validators.required]],
      docNum: ['', [Validators.required, Validators.minLength(3)]],
      numFact: [''],
      codBanco: ['', [Validators.required]],
      importe: ['', [Validators.required, Validators.min(0.01)]],
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

  cargarBancos( codEmpresa : number  ): void {
    this.loading = true;
    this.depositoChequeService.obtenerBancos( codEmpresa )
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

  onFileSelect(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (validTypes.includes(file.type)) {
        if (file.size <= maxSize) {
          this.selectedFile = file;
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
  }

  onSubmit(): void {
    if (this.chequeForm.valid && this.selectedFile) {
      this.loading = true;
      const formValue = this.chequeForm.value;

      const depositoCheque: DepositoCheque = {
        idDeposito: 0,
        codEmpresa: formValue.codEmpresa,
        codCliente: formValue.codCliente,
        importe: formValue.importe,
        moneda: formValue.moneda,
        fotoPath: '',  // Se gestionará en el backend
        audUsuario: this.getUser()
      };

      this.depositoChequeService.registrarDepositoCheque(depositoCheque, this.selectedFile)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: response.message || 'Depósito registrado correctamente'
            });
            this.resetForm();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message
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

  /**
   * Actualiza la consulta de depósitos usando como criterios el número de documento o
   * el número de factura. Si un campo está vacío se envía como null para que el query
   * lo trate como "no filtrar" por ese campo.
   */
  onActualizar(): void {
    let {docNum, numFact} = this.depositSearchForm.value;
    
    
    console.log("Valores procesados:", { docNum, numFact });
    
    const depositoCriteria: DepositoCheque = {
      docNum:  parseInt(docNum),
      numFact: parseInt(numFact)
    } as DepositoCheque;
  
    this.loading = true;
    this.depositoChequeService.obtenerDepositosReconciliados(depositoCriteria)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.depositList = response.data;
            if (this.depositList.length === 0) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Sin Datos',
                detail: 'No se encontraron depósitos con los criterios de búsqueda.'
              });
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al obtener depósitos.'
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en la consulta: ' + error.message
          });
        }
      });
  }

  private resetForm(): void {
    this.chequeForm.reset({
      moneda: 'BS'
    });
    this.selectedFile = null;
    this.clientes = [];
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
}