import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Licencia } from '../../../interfaces/Licencia';
import { RrhhService } from '../../services/rrhh.service';
import { Empleado } from '../../../interfaces/Empleado';
import { Tipos } from 'src/app/protected/interfaces/Tipos';
import { lstTipoLicencia } from '../../../interfaces/Tipos';

@Component({
  selector: 'app-dato-licencia-conducir',
  templateUrl: './dato-licencia-conducir.component.html',
  styleUrls: ['./dato-licencia-conducir.component.css'],
  providers: [ MessageService ]
})
export class DatoLicenciaConducirComponent implements OnInit {

  @Input() regEmp !: Empleado;

  licencia        : Licencia[] = [];
  lstTipoLicencia : Tipos[] = [];

  displayModal    : boolean = false;
  //Inicializando el Formulario
  formLic         : FormGroup = new FormGroup({});

  constructor( private rrhhService : RrhhService,
               private messageService : MessageService,
               private fb          : FormBuilder,) {

    this.lstTipoLicencia = lstTipoLicencia();

    this.formLic = this.fb.group({
      codLicencia     : [ 0 ],
      codPersona      : [ 0 ],
      categoria       : [ '' ],
      fechaCaducidad  : [ 0 ],
      audUsuario      : [ 0 ],

    });

  }

  ngOnInit(): void {
    this.obtenerLicencia(  this.regEmp.codPersona! );
  }


  /**
   * Procedimiento para obtener la licencia de conducir de una persona
   * @param codPersona
   */
   obtenerLicencia( codPersona: number ) {
    this.rrhhService.obtenerLicencia( codPersona ).subscribe((resp) => {
      if (resp) {
        this.licencia = resp;
      }
    }, (err) => {
      console.log(err);
    });

  }

  /**
   * Para cargar datos al formulario
   * @param lic
   */
  cargarLicencia( lic : Licencia):void {
    let temp : Licencia = {};
    temp = {...lic};

    temp.fechaCaducidad = new Date(temp.fechaCaducidad!);
    temp.fechaCaducidad.setDate(temp.fechaCaducidad.getDate() +1 );

    this.formLic = this.fb.group({
      codLicencia     : [ temp.codLicencia ],
      codPersona      : [ temp.codPersona ],
      categoria       : [ temp.categoria ],
      fechaCaducidad  : [ temp.fechaCaducidad ],
      audUsuario      : [ temp.audUsuario ],

    });

    this.displayModal =  true;

  }

  /**
   * Procedimiento para guardar los datos
   */
  guardar(): void {
    let temp : Licencia = {};
    temp = this.formLic.value;

    this.rrhhService.registrarLicencia( temp ).subscribe((resp) => {

      if (resp) {
        this.displayModal = false;
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Actualizado' });
        this.obtenerLicencia( temp.codPersona! );
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
   * Prepara el registro para un nuevo registro
   */
  nuevoRegistro(): void {
    this.formLic.reset();
    this.formLic.controls['codPersona'].setValue( this.regEmp.codPersona );
    this.displayModal =  true;
  }
}
