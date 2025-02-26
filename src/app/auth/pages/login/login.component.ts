import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoginService } from '../../services/login.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.3s ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  hayError: boolean = false;
  isLoading: boolean = false;
  bubbles: number[] = Array(10).fill(0).map((_, i) => i + 1);

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
    // Aplicar animación de entrada al componente
    document.querySelector('.login-card')?.classList.add('animate-in');
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
              // Añadir una pequeña animación antes de navegar
              document.querySelector('.login-card')?.classList.add('animate-out');
              setTimeout(() => {
                this.router.navigate(["./bosque/dashboard"]);
              }, 300);
            }
          } else {
            this.hayError = true;
            this.animateErrorMessage();
          }
        },
        error: (err) => {
          if (err.status === 400) {
            console.log("error de credenciales");
          }
          this.hayError = true;
          this.animateErrorMessage();
        }
      });
  }

  animateErrorMessage(): void {
    const errorElem = document.querySelector('.error-message');
    if (errorElem) {
      // Reiniciar animación
      errorElem.classList.remove('shake');
      void (errorElem as HTMLElement).offsetWidth; // Truco para reiniciar la animación
      errorElem.classList.add('shake');
    }
  }

  esValido(campo: string): boolean | null {
    return this.frmLogin.controls[campo].errors && this.frmLogin.controls[campo].touched;
  }
}