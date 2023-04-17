import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from 'src/app/auth/services/login.service';
import { Telefono } from '../../../interfaces/Telefono';
import { RrhhService } from '../../../rrhh/services/rrhh.service';

@Component({
  selector: 'app-dato-telefonos',
  templateUrl: './dato-telefonos.component.html',
  styleUrls: ['./dato-telefonos.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class DatoTelefonosComponent implements OnInit, OnDestroy {

  //varibale de entrada del padre al componente hijo
  @Input() codPersona: number = 0;

  //variables
  displayModal: boolean = false;
  codUsuario: number = 0;


  //Listas
  lstTelefono: Telefono[] = [];
  telefonos: Telefono[] = [];

  //formularios
  formTelefono: FormGroup = this.fb.group({
    telArr: this.fb.array([])
  });

  //Suscriptions
  telefonoSuscription : Subscription = new Subscription();

  constructor(
    private rrhhService: RrhhService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.codUsuario = this.loginService.codUsuario;
  }
  ngOnDestroy(): void {
    this.telefonoSuscription.unsubscribe();
  }

  ngOnInit(): void {
    this.obtenerTelefonos(this.codPersona);
  }


  /**
   * Procedimiento para Obtener telefonos por persona
   * @param codPersona
   */
  obtenerTelefonos(codPersona: number): void {
    this.telefonoSuscription = this.rrhhService.obtenerDatosTelefono(codPersona).subscribe((resp) => {
      if (resp) {
        this.telefonos = resp;
      }
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Procedimiento para capturar datos de los telefonos en el Form arra
   */
  cargarTelefonos(): void {
    this.lstTelefono = [...this.telefonos];

    this.formTelefono = this.fb.group({
      telArr: this.fb.array(
        this.telefonos.map(t => this.preCargarFormulario(t))
      )
    });

    this.displayModal = true;
  }
  /**
   * Procedimiento para llenar el formulario cuando el modal sea desplegado
   * @param t
   */
  preCargarFormulario(t: Telefono): FormGroup {
    return new FormGroup({
      codTelefono: new FormControl(t.codTelefono),
      codPersona: new FormControl(t.codPersona),
      codTipoTel: new FormControl(t.codTipoTel),
      telefono: new FormControl(t.telefono, [Validators.required]),
      audUsuario: new FormControl(t.audUsuario)
    });
  }

  /**
   * Desplegara los datos del formulario
   * @returns
   */
  lstFormTel(): FormArray {
    return this.formTelefono.get('telArr') as FormArray;
  }

  /**
   * Para agregar nuevo registro a la lista
   */
  agregarNuevoRegistro(): void {
    this.lstFormTel().push(this.crearNuevoRegistro());
  }

  /**
   * Para crear un nuevo registro
   * @returns
   */
  crearNuevoRegistro(): FormGroup {
    return this.fb.group({
      codTelefono: new FormControl(0),
      codPersona: new FormControl(this.codPersona),
      codTipoTel: new FormControl(1),
      telefono: new FormControl('', [Validators.required]),
      audUsuario: new FormControl(this.codUsuario)
    });
  }

  /**
   * Procedimiento para registrar los telefonos de un empleado
   */
  guardarTelefono(): void {
    this.lstFormTel().controls.map(e => {
      //console.log(e.value);
      //let { codEmail, codPersona, email, audUsuario } = e.value;
      this.telefonoSuscription = this.rrhhService.registrarTelefono(e.value).subscribe(
        (resp) => {
          if (resp) {
            console.log("bien");
            this.displayModal = false;
            this.obtenerTelefonos(e.value.codPersona);
            this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Actualizado' });

          } else {
            console.log(resp);
            this.messageService.add({ key: 'bc', severity: 'error', summary: 'Accion Invalida', detail: "No se pudo Actualizar la información" });
          }
        }, (err) => {
          console.log("Error General");
          console.log(err);
        }
      );
    });
  }

  /**
   * Procedimiento para eliminar un registro
   * @param event
   * @param index
   * @param codTelefono
   */
  /*   eliminarRegistro(event: Event, index: number, codTelefono: number): void {

      if (codTelefono === 0) {
        this.lstFormTel().removeAt(index);
      } else {
        this.confirmationService.confirm({
          target: event.target!,
          message: '¿Esta Seguro(a) de eliminar este registro del sistema?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            let tel: Telefono = {
              codTelefono: codTelefono
            };

            this.rrhhService.eliminarTelefono(tel).subscribe(
              (resp) => {
                if (resp) {
                  console.log("bien");
                  this.displayModal = false;
                  this.obtenerTelefonos(this.codPersona);
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
            console.log("No se hace nada");
          }
        });
      }
    }

   */
  eliminarRegistro(event: Event, index: number, codTelefono: number): void {
    if (codTelefono === 0) {
      this.lstFormTel().removeAt(index);
      return;
    }

    this.confirmationService.confirm({
      target: event.target!,
      message: '¿Está seguro(a) de eliminar este registro del sistema?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let tel: Telefono = {
          codTelefono: codTelefono
        };

        this.telefonoSuscription = this.rrhhService.eliminarTelefono(tel)
          .pipe(
            catchError(err => {
              console.log('Error general: ', err);
              this.messageService.add({ key: 'bc', severity: 'error', summary: 'Acción inválida', detail: "No se pudo eliminar el registro" });
              return of(null);
            })
          )
          .subscribe(resp => {
            if (resp) {
              this.displayModal = false;
              this.obtenerTelefonos(this.codPersona);
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Acción realizada', detail: 'Registro eliminado' });
            } else {
              console.log(resp);
              this.messageService.add({ key: 'bc', severity: 'error', summary: 'Acción inválida', detail: "No se pudo eliminar el registro" });
            }
          });
      },
      reject: () => {
        console.log("No se hace nada");
      }
    });
  }
}
