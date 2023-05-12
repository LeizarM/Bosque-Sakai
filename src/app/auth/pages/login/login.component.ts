import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';



@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  //providers: [ MessageService ],

})
export class LoginComponent {

  hayError : boolean = false;

  //Objeto formulario
  frmLogin: FormGroup = this.fb.group({
    usuario: [ , [ Validators.required, Validators.minLength(1) ]   ],
    password2: [ , [ Validators.required, Validators.minLength(1)] ],
  })


  constructor(
    private router: Router,
   // private msgs: MessageService,
    private fb: FormBuilder,
    private loginService: LoginService,

  ) {
    this.fb = new FormBuilder();
    if( this.loginService.isAuthenticated() ){
      this.router.navigate(['./bosque/dashboard']);
    }
  }

  /**
   * Verificar las credenciales del usuario
   */
  verficarLogin(): void {

    // Si el formulario es invalido se hace un return solamente
    if ( this.frmLogin.invalid )  {
      this.frmLogin.markAllAsTouched();
      return;
    }
    const { usuario, password2 } = this.frmLogin.value; //desestructuracion del objecto form


    this.loginService.verificarLogin(usuario, password2).subscribe({
      next: (resp) => {

        if (resp != null && resp != undefined) {

          if (resp.token != null && resp.token != undefined) this.router.navigate(["./bosque/dashboard"]);

        } else {
          this.hayError = true;
        }
      },
      error: (err) => {
        if (err.status === 400) {
          console.log("error de credenciales");
        }
      },
    });

  }

  /**
   * Procedimiento para validar los campos
   * @param campo
   * @returns
   */
  esValido( campo: string ): boolean | null {

    return this.frmLogin.controls[campo].errors && this.frmLogin.controls[campo].touched;
  }

}
