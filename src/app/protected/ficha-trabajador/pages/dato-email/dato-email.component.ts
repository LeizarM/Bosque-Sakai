import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { Email } from 'src/app/protected/interfaces/Email';
import { RrhhService } from 'src/app/protected/rrhh/services/rrhh.service';


@Component({
  selector: 'app-dato-email',
  templateUrl: './dato-email.component.html',
  styleUrls: ['./dato-email.component.css'],
  providers: [ ConfirmationService, MessageService ],
})
export class DatoEmailComponent implements OnInit, OnDestroy {

  //varibale de entrada del padre al componente hijo
  @Input() codPersona : number = 0;

  //variables
  displayModal : boolean = false;

  //Inicializando el Formulario
  formEmail: FormGroup = this.fb.group({
    emailArr: this.fb.array([])
  });

  //Listas
  lstEmail : Email[] = [];
  emails   : Email[] = [];

  //Suscripciones
  emailSuscription !: Subscription;

  constructor(
    private rrhhService         : RrhhService,
    private fb                  : FormBuilder,
    private confirmationService : ConfirmationService,
    private messageService      : MessageService,
    private loginService        : LoginService
  ) {


  }
  ngOnDestroy(): void {

    this.emailSuscription.unsubscribe();

  }

  ngOnInit(): void {

    this.obtenerEmails( this.codPersona );

  }


  /**
   *  Procedimiento para obtener los correos de una persona
   * @param codPersona
   */
  obtenerEmails(codPersona: number): void {
    this.emailSuscription =  this.rrhhService.obtenerDatosEmail(codPersona).subscribe((resp) => {
      if (resp) {
        this.lstEmail = resp;
      }
    }, (err) => {
      this.lstEmail = [];
      console.log(err);
    });
  }

  /**
   * Metodo para cargr los Emails y luego editar la informacion
   */
  cargarEmails():void{

    this.emails = [...this.lstEmail];

    this.formEmail = this.fb.group({
      emailArr: this.fb.array(
        this.lstEmail.map(e => this.preCargarFormulario(e))
      )
    });
    this.displayModal = true;

  }

  /**
   * Llenar Formulario
   * @param e
   * @returns
   */
  preCargarFormulario(e: Email): FormGroup {
    return new FormGroup({
      codEmail    : new FormControl(e.codEmail, [Validators.required]),
      codPersona  : new FormControl(e.codPersona, [Validators.required]),
      email       : new FormControl(e.email, [Validators.required, Validators.email]),
      audUsuario  : new FormControl(e.audUsuario, [Validators.required]),
    });
  }

  /**
   * Desplegara los datos del formulario
   * @returns
   */
  lstFormEmail(): FormArray {
    return this.formEmail.get('emailArr') as FormArray;
  }

  /**
   * Agregara un nuevo registro
   */
  agregarNuevoRegistro():void{
    this.lstFormEmail().push(this.crearNuevoRegistro());
  }

  /**
   * Crear nuevo registro
   * @returns
   */
  crearNuevoRegistro(): FormGroup {
    return this.fb.group({
      codEmail    : new FormControl(0),
      codPersona  : new FormControl(this.codPersona!),
      email       : new FormControl('', [Validators.required, Validators.email]),
      audUsuario  : new FormControl(this.loginService.codUsuario)
    });
  }

  /**
   * Procedimiento para eliminar un Email por empleado
   * @param event
   * @param index
   * @param codEmail
   */
  eliminarRegistro(event: Event, index: number, codEmail: number): void {

    if (codEmail === 0) {
      this.lstFormEmail().removeAt(index);
    } else {
      this.confirmationService.confirm({
        target: event.target!,
        message: '¿Esta Seguro(a) de eliminar este registro del sistema?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let em: Email = {
            codEmail: codEmail
          };

          this.emailSuscription = this.rrhhService.eliminarEmail(em).subscribe(
            (resp) => {
              if (resp) {

                this.displayModal = false;
                this.obtenerEmails(this.codPersona);
                this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Eliminado' });

              } else {
                console.log(resp);
                this.messageService.add({ key: 'bc', severity: 'error', summary: 'Accion Invalida', detail: "No se pudo Eliminar el Email" });
              }
            }, (err) => {
              console.log("Error General");
              console.log(err);
            }
          );

        },
        reject: () => {
         // console.log("No se hace nada");
        }
      });
    }
  }


  /**
   * Para guardar los datos del formulario de correo electrónicos
   */
  guardarEmails():void {

    this.lstFormEmail().controls.map(e => {

      const  { codEmail, email } = e.value;
      let em: Email = {
        codEmail,
        codPersona : this.codPersona,
        email,
        audUsuario : this.loginService.codUsuario
      };

      this.emailSuscription = this.rrhhService.registrarEmail(em).subscribe(
        (resp) => {
          if (resp) {

            this.displayModal = false;
            this.obtenerEmails(e.value.codPersona);
            this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Actualizado' });

          } else {
            this.messageService.add({ key: 'bc', severity: 'error', summary: 'Accion Invalida', detail: "No se pudo Actualizar la información" });
          }
        }, (err) => {
          console.log("Error General", err);

        }
      );
    });

  }

}
