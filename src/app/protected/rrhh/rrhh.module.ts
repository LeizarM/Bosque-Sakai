import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';
import { EmpleadosComponent } from './empleados/empleados.component';



@NgModule({
  declarations: [
    EmpleadosComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ]
})
export class RrhhModule { }
