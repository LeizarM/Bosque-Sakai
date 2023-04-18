import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { Formacion } from 'src/app/protected/interfaces/Formacion';
import { lstTipoFormacion, lstTipoMedicion, Tipos } from 'src/app/protected/interfaces/Tipos';
import { RrhhService } from 'src/app/protected/rrhh/services/rrhh.service';
import { Utiles } from 'src/app/protected/Utiles/Utiles';

@Component({
  selector: 'app-dato-formacion',
  templateUrl: './dato-formacion.component.html',
  styleUrls: ['./dato-formacion.component.css'],
  providers: [ MessageService ]
})
export class DatoFormacionComponent implements OnInit, OnDestroy {

  // Variables
  codEmpleado : number = 0;
  displayModal : boolean = false;

  //Listas o Arrays
  lstFormacion  : Formacion[] = [];
  lstMedicion   : Tipos[] = [];
  lstMedicionDropDown   : Tipos[] = [];

  //Formularios
  formFormacion : FormGroup = new FormGroup({});

  //Suscriptions
  formacionSuscription : Subscription = new Subscription();


  constructor(
    private rrhhService   : RrhhService,
    private loginService  : LoginService,
    private fb            : FormBuilder,
    private messageService : MessageService,
  ) {
    this.codEmpleado = this.loginService.codEmpleado;
    this.obtenerFormacion( this.codEmpleado );

    this.lstMedicion  = lstTipoMedicion();
    this.lstMedicionDropDown =  lstTipoFormacion();

  }
  ngOnDestroy(): void {
    this.formacionSuscription.unsubscribe();
  }

  ngOnInit(): void {
    this.iniciarFormulario();
  }

  /**
   * Iniciara el formulario
   */
  iniciarFormulario(): void {
    this.formFormacion = this.fb.group({
      codFormacion    : [ 0 ],
      codEmpleado     : [ this.codEmpleado ],
      descripcion     : [ '',  [ Validators.required, Validators.minLength(3)] ],
      duracion        : [ 0 ,   [Validators.required]],
      tipoDuracion    : [ 'hrs', [ Validators.required  ] ],
      tipoFormacion   : [ 'cur', [ Validators.required  ] ],
      fechaFormacion  : [ 0, [Validators.required] ],
      audUsuario      : [ this.loginService.codUsuario ]
    });
  }


  /**
   * Procedimiento para obtener la formacion de un empleado
   * @param codEmpleado
   */
  obtenerFormacion( codEmpleado: number ): void {
    this.formacionSuscription = this.rrhhService.obtenerFormacion( codEmpleado ).subscribe((resp) => {
      if (resp) {
        this.lstFormacion = resp;
      }
    }, (err) => {
      this.lstFormacion = [];
      console.log(err);
    });
  }

  guardar():void {
    let temp: Formacion = {};
    temp = this.formFormacion.value;

    this.formacionSuscription = this.rrhhService.registrarFormacion(temp).subscribe((resp) => {


      if ( resp && resp.ok === 'ok') {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Actualizado' });
        this.obtenerFormacion( temp.codEmpleado! );
        this.displayModal = false;
      } else {
        console.log(resp);
        this.messageService.add({ key: 'bc', severity: 'error', summary: 'Accion Invalida', detail: "No se pudo Actualizar la información" });
      }
    }, (err) => {
      console.log("Error General");
      console.log(err);
    });
  }
  /**
   * Para crear un nuevo registro
   */
  nuevoRegistro():void{
    this.formFormacion.reset();

    this.formFormacion = this.fb.group({
      codFormacion    : [ 0 ],
      codEmpleado     : [ this.codEmpleado ],
      descripcion     : [ '',  [ Validators.required, Validators.minLength(3)] ],
      duracion        : [ 0 ,   [Validators.required]],
      tipoDuracion    : [ 'hrs', [ Validators.required  ] ],
      tipoFormacion   : [ 'cur', [ Validators.required  ] ],
      fechaFormacion  : [ 0, [Validators.required] ],
      audUsuario      : [ this.loginService.codUsuario ]
    });

    this.displayModal = true;
  }

  /**
   * Para capturar el registro
   * @param form
   */
  capturarRegistro( form : Formacion ): void {
    let temp : Formacion = {...form };

    temp.fechaFormacion = new Utiles().fechaTStoPrimeNG( temp.fechaFormacion! );


    this.formFormacion = this.fb.group({
      codFormacion    : [ temp.codFormacion, [ Validators.min(1) ] ],
      codEmpleado     : [ temp.codEmpleado ],
      descripcion     : [ temp.descripcion, [ Validators.required ] ],
      duracion        : [ temp.duracion, [ Validators.required ] ],
      tipoDuracion    : [ temp.tipoDuracion, [ Validators.required ] ],
      tipoFormacion   : [ temp.tipoFormacion, [ Validators.required ] ],
      fechaFormacion  : [ temp.fechaFormacion, [ Validators.required ] ],
      audUsuario      : [ temp.audUsuario ]
    });

    this.displayModal = true;

  }

  /**
   * Procedimiento para validar los campos
   * @param campo
   * @returns
   */
  esValido( campo: string ): boolean | null {
    return this.formFormacion.controls[campo].errors && this.formFormacion.controls[campo].touched;
  }

}
