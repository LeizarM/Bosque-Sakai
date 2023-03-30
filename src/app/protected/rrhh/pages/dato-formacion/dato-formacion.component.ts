import { Component, OnInit, Input } from '@angular/core';
import { Formacion } from '../../../interfaces/Formacion';
import { RrhhService } from '../../services/rrhh.service';
import { Empleado } from '../../../interfaces/Empleado';
import { MessageService } from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Tipos } from 'src/app/protected/interfaces/Tipos';
import { lstTipoMedicion, lstTipoFormacion } from '../../../interfaces/Tipos';

@Component({
  selector: 'app-dato-formacion',
  templateUrl: './dato-formacion.component.html',
  styleUrls: ['./dato-formacion.component.css'],
  providers: [ MessageService ]
})
export class DatoFormacionComponent implements OnInit {

  @Input() regEmp !: Empleado;

  lstFormacion  : Tipos[] = [];
  lstMedicion   : Tipos[] = [];
  formacion     : Formacion[] = [];
  displayModal  : boolean = false;

  formFormacion : FormGroup = new FormGroup({});

  constructor( private rrhhService    : RrhhService,
               private messageService : MessageService,
               private fb             : FormBuilder ) {

    this.formFormacion = this.fb.group({
      codFormacion    : [ 0 ],
      codEmpleado     : [ 0 ],
      descripcion     : [ '' ],
      duracion        : [ 0 ],
      tipoDuracion    : [ 0 ],
      tipoFormacion   : [ '' ],
      fechaFormacion  : [ 0 ],
      audUsuario      : [ 0 ]
    });
    this.lstFormacion = lstTipoFormacion();
    this.lstMedicion  = lstTipoMedicion();
  }

  ngOnInit(): void {

    this.obtenerFormacion( this.regEmp.codEmpleado! );
  }

  /**
   * Procedimiento para obtener la formacion de un empleado
   * @param codEmpleado
   */
   obtenerFormacion( codEmpleado: number ): void {
    this.rrhhService.obtenerFormacion( codEmpleado ).subscribe((resp) => {
      if (resp) {
        this.formacion = resp;
      }
    }, (err) => {
      this.formacion = [];
      console.log(err);
    });
  }

  /**
   * Para capturar el registro
   * @param form
   */
  capturarRegistro( form : Formacion ): void {
    let temp : Formacion = {...form };

    temp.fechaFormacion = new Date( temp.fechaFormacion! );
    temp.fechaFormacion.setDate(temp.fechaFormacion.getDate() + 1);



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
   * Para guardar la información de la formacion
   */
  guardar():void{
    let temp: Formacion = {};
    temp = this.formFormacion.value;

    this.rrhhService.registrarFormacion(temp).subscribe((resp) => {
      if (resp) {
        this.displayModal = false;
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Actualizado' });
        this.obtenerFormacion( temp.codEmpleado! );
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
   * Prepara el formulario para un nuevo registro
   */
  nuevoRegistro():void{
    this.formFormacion.reset();
    this.formFormacion.controls['codEmpleado'].setValue( this.regEmp.codEmpleado );
    this.displayModal = true;
  }

}
