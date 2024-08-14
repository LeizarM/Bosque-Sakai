import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { RegistroBobinaComponent } from './pages/registro-bobina/registro-bobina.component';
import { RegistroResmaComponent } from './pages/registro-resma/registro-resma.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNgModule
  ],
  declarations: [
    RegistroResmaComponent,
    RegistroBobinaComponent
  ]
})
export class MaterialMalEstadoModule { }
