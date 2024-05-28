import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { CrearLoteProduccionComponent } from './pages/crear-lote-produccion/crearLoteProduccion.component';
import { ResmadoComponent } from './pages/resmado/resmado.component';


@NgModule({

  declarations:[

    CrearLoteProduccionComponent,
    ResmadoComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNgModule
  ],

  exports: []

})
export class LoteProduccionModule {

}
