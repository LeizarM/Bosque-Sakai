import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { DatoEmailComponent } from './pages/dato-email/dato-email.component';
import { DatoExperienciaComponent } from './pages/dato-experiencia/dato-experiencia.component';
import { DatoFormacionComponent } from './pages/dato-formacion/dato-formacion.component';
import { DatoIngresoComponent } from './pages/dato-ingreso/dato-ingreso.component';
import { DatoTelefonosComponent } from './pages/dato-telefonos/dato-telefonos.component';
import { DatosPersonalesComponent } from './pages/datos-personales/datos-personales.component';
import { DependienteComponent } from './pages/dependiente/dependiente.component';
import { FichaTrabajadorComponent } from './pages/ficha-trabajador/ficha-trabajador.component';
import { GaranteReferenciaComponent } from './pages/garante-referencia/garante-referencia.component';
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
    DatosPersonalesComponent,
    DatoTelefonosComponent,
    DatoEmailComponent,
    DatoIngresoComponent,
    DependienteComponent,
    GaranteReferenciaComponent,
    DatoFormacionComponent,
    DatoExperienciaComponent

  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule
  ]
})
export class FichaTrabajadorModule { }
