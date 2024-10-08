import { Component, ViewEncapsulation } from '@angular/core';
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
export class LoginComponent {
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

  verficarLogin(): void {
    if (this.frmLogin.invalid) {
      this.frmLogin.markAllAsTouched();
      return;
    }

    this.isLoading = true;

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
              this.router.navigate(["./bosque/dashboard"]);
            }
          } else {
            this.hayError = true;
          }
        },
        error: (err) => {
          if (err.status === 400) {
            console.log("error de credenciales");
          }
          this.hayError = true;
        }
      });
  }

  esValido(campo: string): boolean | null {
    return this.frmLogin.controls[campo].errors && this.frmLogin.controls[campo].touched;
  }
}
