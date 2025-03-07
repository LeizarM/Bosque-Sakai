import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoginService } from '../../services/login.service';
import { Login } from '../../interface/Login';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [MessageService]
})
export class ChangePasswordComponent implements OnInit {

  isLoading: boolean = false;
  errorMsg: string | null = null;

  frmChangePassword: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { 
    validators: this.passwordMatchValidator
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Check if user is authenticated, otherwise redirect to login
    if (!this.loginService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.frmChangePassword.invalid) {
      this.frmChangePassword.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMsg = null;

    const userInfo = this.loginService.obtenerUsuario;
    const loginData: Login = {
      ...userInfo,
      password2: this.frmChangePassword.get('newPassword')?.value
    };

    this.loginService.reiniciarContrasena(loginData)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Contraseña actualizada correctamente'
            });
            
            setTimeout(() => {
              this.loginService.logout();
              this.router.navigate(['/auth/login']);
            }, 1500);
          } else {
            this.errorMsg = resp || 'Error al cambiar la contraseña';
          }
        },
        error: (err) => {
          this.errorMsg = err.error?.mensaje || 'Error al procesar la solicitud';
        }
      });
  }

  backToLogin(): void {
    this.loginService.logout();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/auth/login']).then(() => {
      window.location.reload();
    });
  }

  esValido(campo: string): boolean | null {
    return this.frmChangePassword.controls[campo].errors && this.frmChangePassword.controls[campo].touched;
  }

  tieneError(campo: string, error: string): boolean {
    return this.frmChangePassword.controls[campo].hasError(error) && this.frmChangePassword.controls[campo].touched;
  }
}
