import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { Empleado } from 'src/app/protected/interfaces/Empleado';
import { RrhhService } from 'src/app/protected/rrhh/services/rrhh.service';

@Component({
  selector: 'app-dato-ingreso',
  templateUrl: './dato-ingreso.component.html',
  styleUrls: ['./dato-ingreso.component.css']
})
export class DatoIngresoComponent implements OnInit, OnDestroy {

  // objectos
  regEmp : Empleado = {};

  //variables
  codEmpleado : number = 0;

  //Suscriptions
  ingresoSuscription : Subscription = new Subscription();

  constructor(
    private rrhhService   : RrhhService,
    private loginService  : LoginService,
  )
  {
    this.codEmpleado = this.loginService.codEmpleado;
    this.obtenerDatoEmpleado( this.codEmpleado );
  }
  ngOnDestroy(): void {
    this.ingresoSuscription.unsubscribe();
  }

  ngOnInit(): void {
  }


  /**
   * Obtendra los datos de empleado
   * @param codEmpleado
   */
  obtenerDatoEmpleado(codEmpleado: number) {
   this.ingresoSuscription = this.rrhhService.obtenerDetalleEmpleado(codEmpleado).subscribe((resp) => {
      if (resp) {
        this.regEmp = resp;
        console.log(this.regEmp);
      }
    }, (err) => {
      console.log(err);
    });
  }

}
