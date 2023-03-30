import { Component, OnInit } from '@angular/core';
import { RrhhService } from '../../services/rrhh.service';
import { Empleado } from '../../../interfaces/Empleado';
import { Persona } from '../../../interfaces/Persona';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-empleado',
  templateUrl: './detalle-empleado.component.html',
  styleUrls: ['./detalle-empleado.component.css']
})
export class DetalleEmpleadoComponent implements OnInit {

  regEmp  !: Empleado;
  regPer  !: Persona;


  constructor(
    private rrhhService: RrhhService,
    private activeRoute : ActivatedRoute
  ) {

    this.activeRoute.queryParams.subscribe(params => {
      this.obtenerDetalleEmpleado( params.codEmpleado );
    }
  );

  }

  ngOnInit(): void {

  }


  /**
   *  Procedimiento para obtener el detalle empleado
   * @param codEmpleado
   */
  obtenerDetalleEmpleado( codEmpleado: number ) {
    this.rrhhService.obtenerDetalleEmpleado(  codEmpleado ).subscribe((resp) => {
      if (resp) {
        this.regEmp = resp;
        if(this.regEmp.codPersona){
          this.obtenerDatosPersonales( this.regEmp.codPersona );
        }

      }
    }, (err) => {
      console.log(err);
    });

  }

  /**
   * Procedimiento para obtener los datos personales del empleado
   * @param codPersona
   */
   obtenerDatosPersonales(codPersona: number) {
    this.rrhhService.obtenerDatosPersonales(codPersona).subscribe((resp) => {
      if (resp) {
        this.regPer = resp;
      }
    }, (err) => {
      console.log(err);
    });
  }




}
