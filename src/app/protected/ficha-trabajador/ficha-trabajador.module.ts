import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { DatosPersonalesComponent } from './pages/datos-personales/datos-personales.component';
import { FichaTrabajadorComponent } from './pages/ficha-trabajador/ficha-trabajador.component';
import { CiExpedidoPipe } from './pipes/ci-expedido.pipe';
import { EstadoCivilPipe } from './pipes/estado-civil.pipe';
import { FormacionPipe } from './pipes/formacion.pipe';
import { GeneroPipe } from './pipes/genero.pipe';
import { PaisPipe } from './pipes/pais.pipe';
import { TipoDuracionPipe } from './pipes/tipo-duracion.pipe';



@NgModule({
  declarations: [

    CiExpedidoPipe,
    EstadoCivilPipe,
    FormacionPipe,
    GeneroPipe,
    PaisPipe,
    TipoDuracionPipe,



    FichaTrabajadorComponent,
    DatosPersonalesComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule
  ]
})
export class FichaTrabajadorModule { }
