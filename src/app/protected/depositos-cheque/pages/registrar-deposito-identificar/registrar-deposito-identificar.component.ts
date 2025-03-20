import { DepositoChequeService } from '../../services/deposito-cheque.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { Empresa } from 'src/app/protected/interfaces/Empresa';
import { ChBanco } from 'src/app/protected/interfaces/ChBanco';
import { LoginService } from 'src/app/auth/services/login.service';
import { DepositoCheque } from 'src/app/protected/interfaces/DepositoCheque';
;

@Component({
  selector: 'app-registrar-deposito-identificar',
  templateUrl: './registrar-deposito-identificar.component.html',
  styleUrls: ['./registrar-deposito-identificar.component.css'],
  providers: [MessageService]
})
export class RegistrarDepositoIdentificarComponent implements OnInit {

  depositoForm!: FormGroup;
  selectedFile: File | null = null;
  loading: boolean = false;

  empresas: Empresa[] = [];
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
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.cargarEmpresas();
  }

  /**
   * Inicializa el formulario para registrar depósitos.
   */
  private initForm(): void {
    this.depositoForm = this.fb.group({
      codEmpresa: ['', [Validators.required]],
      idBxC: ['', [Validators.required]],
      importe: [0, [Validators.required, Validators.min(0.01)]],
      moneda: ['BS', [Validators.required]],
      obs: ['', [Validators.maxLength(250)]],
      fotoPath: ['']
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
    let codEmpresa = event.value;
    
    /* if (codEmpresa === 7) {
      codEmpresa = 1;
      // Actualizamos el valor en el formulario sin emitir un nuevo evento
      this.depositoForm.get('codEmpresa')?.setValue(codEmpresa, { emitEvent: false });
    }
 */
    if (codEmpresa) {
      this.cargarBancos(codEmpresa);
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
    if (this.depositoForm.valid) {
      this.loading = true;
      const formValue = this.depositoForm.value;

      const depositoPorIdentificar: DepositoCheque = {
        idDeposito: 0,
        codEmpresa: formValue.codEmpresa,
        idBxC: formValue.idBxC,
        importe: formValue.importe,
        moneda: formValue.moneda,
        obs: formValue.obs,
        fotoPath: '',  // Se gestionará en el backend
        audUsuario: this.getUser()
      };

      this.depositoChequeService.registrarDepositoCheque(depositoPorIdentificar, this.selectedFile ?? undefined)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (response) => {
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
      this.markFormGroupTouched(this.depositoForm);
    }
  }

  private resetForm(): void {
    this.depositoForm.reset({
      moneda: 'BS',
      importe: 0
    });
    this.selectedFile = null;
    this.bancos = [];
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
    const control = this.depositoForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.depositoForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Este campo es requerido';
      }
      if (control.errors['min']) {
        return `El valor debe ser mayor a ${control.errors['min'].min}`;
      }
      if (control.errors['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
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
