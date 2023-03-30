import { NgModule } from '@angular/core';


import { DatoEmailComponent } from './pages/dato-email/dato-email.component';
import { DatoFormacionComponent } from './pages/dato-formacion/dato-formacion.component';
import { DatoLicenciaConducirComponent } from './pages/dato-licencia-conducir/dato-licencia-conducir.component';
import { DatoTelefonosComponent } from './pages/dato-telefonos/dato-telefonos.component';
import { DatosPersonalesComponent } from './pages/datos-personales/datos-personales.component';
import { DetalleEmpleadoComponent } from './pages/detalle-empleado/detalle-empleado.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';


//Pipes
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { DatoExperienciaLaboralComponent } from './pages/dato-experiencia-laboral/dato-experiencia-laboral.component';
import { RegistroDatoEmpleadoComponent } from './pages/registro-dato-empleado/registro-dato-empleado.component';
import { RegistroDatoPersonaComponent } from './pages/registro-dato-persona/registro-dato-persona.component';
import { ActivoEInactivoPipe } from './pipes/activo-einactivo.pipe';
import { CiExpedidoPipe } from './pipes/ci-expedido.pipe';
import { EstadoCivilPipe } from './pipes/estado-civil.pipe';
import { FormacionPipe } from './pipes/formacion.pipe';
import { GeneroPipe } from './pipes/genero.pipe';
import { PaisPipe } from './pipes/pais.pipe';
import { RelacionEmpresaPipe } from './pipes/relacion-empresa.pipe';
import { TipoDuracionPipe } from './pipes/tipo-duracion.pipe';




@NgModule({
  declarations: [
    EmpleadosComponent,
    DetalleEmpleadoComponent,
    DatosPersonalesComponent,
    DatoEmailComponent,
    DatoTelefonosComponent,
    DatoExperienciaLaboralComponent,
    DatoFormacionComponent,
    DatoLicenciaConducirComponent,

    //Pipes
    GeneroPipe,
    EstadoCivilPipe,
    RelacionEmpresaPipe,
    ActivoEInactivoPipe,
    FormacionPipe,
    CiExpedidoPipe,
    PaisPipe,
    TipoDuracionPipe,
    RegistroDatoPersonaComponent,
    RegistroDatoEmpleadoComponent,
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    EstadoCivilPipe,
    RelacionEmpresaPipe,
    ActivoEInactivoPipe
  ]
})
export class RrhhModule { }
