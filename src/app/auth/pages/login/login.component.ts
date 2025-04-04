import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoginService } from '../../services/login.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  hayError: boolean = false;
  isLoading: boolean = false;

  frmLogin: FormGroup = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    password2: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService,
  ) {
    if (this.loginService.isAuthenticated()) {
      this.router.navigate(['./bosque/dashboard']);
    }
  }

  ngOnInit(): void {
    // Ensuring proper 3D perspective rendering
    document.body.style.overflow = 'hidden';
    document.body.classList.add('login-page');
  }
  
  ngOnDestroy(): void {
    // Cleanup when component is destroyed
    document.body.style.overflow = '';
    document.body.classList.remove('login-page');
  }

  verficarLogin(): void {
    if (this.frmLogin.invalid) {
      this.frmLogin.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.hayError = false; // Reset error state

    const { usuario, password2 } = this.frmLogin.value;

    this.loginService.verificarLogin(usuario, password2)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (resp) => {
          if (resp != null && resp != undefined && resp.codUsuario! > 0) {
            this.hayError = false;
            if (resp.token != null && resp.token != undefined) {
              // Check if using default password
              if (this.loginService.isDefaultPassword(password2)) {
                // Redirect to change password page
                this.router.navigate(['./auth/change-password']);
              } else {
                // Normal flow - redirect to dashboard
                this.router.navigate(["./bosque/dashboard"]);
              }
            }
          } else {
            this.hayError = true;
          }
        },
        error: (err) => {
          console.error('Error de autenticación:', err);
          this.hayError = true;
        }
      });
  }

  esValido(campo: string): boolean | null {
    return this.frmLogin.controls[campo].errors && this.frmLogin.controls[campo].touched;
  }
}