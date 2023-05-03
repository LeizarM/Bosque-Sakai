import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/auth/services/login.service';
import { Login } from '../../../../auth/interface/Login';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  providers: [ MessageService ]
})
export class ChangePasswordComponent implements OnInit {


  formChangePassword : FormGroup = new FormGroup({});



  constructor(
    private fb                     : FormBuilder,
    private messageService         : MessageService,
    private loginService           : LoginService,) {

    }

  changePassword() : void {

    const { password, npassword } =  this.formChangePassword.value;

    const {codUsuario, login} = this.loginService.obtenerUsuario;
    let l : Login = {
      codUsuario,
      login,
      password2: password,
      npassword,
    }

    this.loginService.changePassword( l ).subscribe(
      (resp) => {

        if (resp.ok) {
          this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Contraseña Cambiada' });
          this.formChangePassword.reset();
        } else {
          this.messageService.add({ key: 'bc', severity: 'error', summary: 'Accion Invalida', detail: "No se pudo cambiar la contraseña, verifique que su contraseña actual sea la correcta" });
        }
      }, (err) => {
        console.log("Error General", err);

      }
    );
  }
  ngOnInit(): void {
    this.loadForm();
  }

  /**
   * Carga el formulario
   */
  loadForm() : void {

    this.formChangePassword = this.fb.group({
      password      : ['' ,Validators.required],
      npassword     : ['' ,Validators.required],
      vpassword     : ['' ,Validators.required],

    });
  }


  get npassword() {
    return this.formChangePassword.get('npassword');
  }

  get vpassword() {
    return this.formChangePassword.get('vpassword');
  }

}
