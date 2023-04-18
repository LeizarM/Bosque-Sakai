import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { ExperienciaLaboral } from 'src/app/protected/interfaces/ExperienciaLaboral';
import { RrhhService } from 'src/app/protected/rrhh/services/rrhh.service';
import { Utiles } from '../../../Utiles/Utiles';

@Component({
  selector: 'app-dato-experiencia',
  templateUrl: './dato-experiencia.component.html',
  styleUrls: ['./dato-experiencia.component.css'],
  providers: [ MessageService ]
})
export class DatoExperienciaComponent implements OnInit, OnDestroy {

  //Formulario
  formExperiencia : FormGroup = new FormGroup({});



  //Variables
  codEmpleado : number = 0;
  displayModal : boolean = false;

  //Listas
  lstExperienciaLaboral : ExperienciaLaboral[] = [];

  //Suscriptions
  experienciaSuscription : Subscription =  new Subscription();

  constructor(
    private rrhhService   : RrhhService,
    private loginService  : LoginService,
    private fb            : FormBuilder,
    private messageService: MessageService
  ) {
    this.codEmpleado = this.loginService.codEmpleado;
    this.obtenerExperienciaLaboral( this.codEmpleado );
  }
  ngOnDestroy(): void {
    this.experienciaSuscription.unsubscribe();
  }

  ngOnInit(): void {
    this.iniciarFormulario();
  }

  /**
   * Procedimiento para cargar el formulario
   */
  iniciarFormulario():void {

    this.formExperiencia = this.fb.group({

      codExperienciaLaboral : [ 0 ],
      codEmpleado           : [ this.codEmpleado ],
      nombreEmpresa         : [ '', [ Validators.required, Validators.minLength(3)] ],
      cargo                 : [ '', [ Validators.required, Validators.minLength(3)] ],
      descripcion           : [ '', [ Validators.required, Validators.minLength(3)] ],
      fechaInicio           : [ 0,  [ Validators.required, Validators.nullValidator] ],
      fechaFin              : [ 0,  [ Validators.required, Validators.nullValidator] ],
      nroReferencia         : [ '', [ Validators.min(1) ] ],
      audUsuario            : [ this.loginService.codUsuario ]

    });
  }

  /**
   * Procedimiento para Obtener la experiencia laboral de un empleado
   * @param codEmpleado
   */
  obtenerExperienciaLaboral(codEmpleado: number): void {

    this.experienciaSuscription = this.rrhhService.obtenerExperienciaLaboral(codEmpleado).subscribe((resp) => {
      if (resp) {
        this.lstExperienciaLaboral = resp;
      }
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Para preparar un nuevo registro
   */
  nuevoRegistro():void {

    this.displayModal = true;
    this.iniciarFormulario();

  }

  /**
   * Cargara un registro para poder editar la informacion
   * @param expLab
   */
  cargarRegistro( expLab : ExperienciaLaboral ):void {

    if(!expLab){
      return;
    }

    this.displayModal = true;


    expLab.fechaInicio = new Utiles().fechaTStoPrimeNG(expLab.fechaInicio!);
    expLab.fechaFin = new Utiles().fechaTStoPrimeNG(expLab.fechaFin!);

    this.formExperiencia = this.fb.group({

      codExperienciaLaboral : [ expLab.codExperienciaLaboral ],
      codEmpleado           : [ expLab.codEmpleado ],
      nombreEmpresa         : [ expLab.nombreEmpresa , [ Validators.required, Validators.minLength(3)] ],
      cargo                 : [ expLab.cargo , [ Validators.required, Validators.minLength(3)] ],
      descripcion           : [ expLab.descripcion , [ Validators.required, Validators.minLength(3)] ],
      fechaInicio           : [ expLab.fechaInicio,  [ Validators.required, Validators.nullValidator] ],
      fechaFin              : [ expLab.fechaFin,  [ Validators.required, Validators.nullValidator] ],
      nroReferencia         : [ expLab.nroReferencia, [ Validators.min(1) ] ],
      audUsuario            : [ this.loginService.codUsuario ]

    });

  }




  /**
   * Procedimiento para guardar la informacion para la experiencia laboral
   */
  guardar():void{

    if(!this.formExperiencia.valid){
      this.formExperiencia.markAllAsTouched();
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Accion Invalida', detail: "Asegurese de que tenga los campos obligatorios" });
      return;
    }


    const { codExperienciaLaboral, codEmpleado, nombreEmpresa, cargo, descripcion, fechaInicio, fechaFin, nroReferencia, audUsuario  } = this.formExperiencia.value;

    const regExpLab : ExperienciaLaboral = {

      codExperienciaLaboral,
      codEmpleado,
      nombreEmpresa,
      cargo,
      descripcion,
      fechaInicio,
      fechaFin,
      nroReferencia,
      audUsuario

    };

    this.experienciaSuscription = this.rrhhService.registrarExperienciaLaboral(regExpLab).subscribe((resp) => {
      if (resp) {
        this.displayModal = false;
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Actualizado' });
        this.obtenerExperienciaLaboral( regExpLab.codEmpleado! );
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
   * Procedimiento para validar los campos
   * @param campo
   * @returns
   */
  esValido( campo: string ): boolean | null {
    return this.formExperiencia.controls[campo].errors && this.formExperiencia.controls[campo].touched;
  }
}
