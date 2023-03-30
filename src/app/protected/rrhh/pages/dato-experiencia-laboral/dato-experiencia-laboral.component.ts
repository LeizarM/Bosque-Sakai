import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ExperienciaLaboral } from '../../../interfaces/ExperienciaLaboral';
import { RrhhService } from '../../services/rrhh.service';
import { Empleado } from '../../../interfaces/Empleado';

@Component({
  selector: 'app-dato-experiencia-laboral',
  templateUrl: './dato-experiencia-laboral.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dato-experiencia-laboral.component.css'],
  providers: [MessageService]
})
export class DatoExperienciaLaboralComponent implements OnInit {

  @Input() regEmp !: Empleado;

  experienciaLaboral: ExperienciaLaboral[] = [];

  displayModal: boolean = false;
  //Inicializando el Formulario
  formExpLab: FormGroup = new FormGroup({});

  constructor(private rrhhService: RrhhService,
    private fb: FormBuilder,
    private messageService: MessageService) {

    this.formExpLab = this.fb.group({
      codExperienciaLaboral : [0],
      codEmpleado           : [0],
      nombreEmpresa         : [''],
      cargo                 : [''],
      descripcion           : [''],
      fechaInicio           : [0],
      fechaFin              : [0],
      nroReferencia         : [0],
      audUsuario            : [0]

    });

  }

  ngOnInit(): void {

    this.obtenerExperienciaLaboral(this.regEmp.codEmpleado!);
  }

  /**
   * Procedimiento para Obtener la experiencia laboral de un empleado
   * @param codEmpleado
   */
  obtenerExperienciaLaboral(codEmpleado: number): void {
    this.rrhhService.obtenerExperienciaLaboral(codEmpleado).subscribe((resp) => {
      if (resp) {
        this.experienciaLaboral = resp;
      }
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Capturar datos para el formulario
   * @param expLab
   */
  capturarRegistro(expLab: ExperienciaLaboral): void {

    let temp = {...expLab };

    temp.fechaInicio = new Date(temp.fechaInicio!);
    temp.fechaFin = new Date(temp.fechaFin!);

    temp.fechaInicio.setDate( temp.fechaInicio.getDate() + 1 );
    temp.fechaFin.setDate( temp.fechaFin.getDate() + 1 );

    this.formExpLab = this.fb.group({

      codExperienciaLaboral : [temp.codExperienciaLaboral],
      codEmpleado           : [temp.codEmpleado],
      nombreEmpresa         : [temp.nombreEmpresa, [Validators.required]],
      cargo                 : [temp.cargo, [Validators.required]],
      descripcion           : [temp.descripcion, [Validators.required]],
      fechaInicio           : [temp.fechaInicio, [Validators.required]],
      fechaFin              : [temp.fechaFin, [Validators.required]],
      nroReferencia         : [temp.nroReferencia,],
      audUsuario            : [temp.audUsuario]

    });
    this.displayModal = true;
  }

  /**
   * procedimiento para guardar la experiencia laboral de un empleado por registro
   */
  guardarExpLab(): void {

    let temp: ExperienciaLaboral = {};
    temp = this.formExpLab.value;

    this.rrhhService.registrarExperienciaLaboral(temp).subscribe((resp) => {
      if (resp) {
        this.displayModal = false;
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Accion Realizada', detail: 'Registro Actualizado' });
        this.obtenerExperienciaLaboral( temp.codEmpleado! );
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
    this.formExpLab.reset();
    this.formExpLab.controls['codEmpleado'].setValue( this.regEmp.codEmpleado );
    this.displayModal = true;
  }

}
