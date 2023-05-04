import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { AutorizacionComponent } from './pages/autorizacion/autorizacion.component';
import { FamiliasComponent } from './pages/familias/familias.component';
import { MenuPreciosComponent } from './pages/menu-precios/menu-precios.component';



@NgModule({
  declarations: [
    AutorizacionComponent,
    FamiliasComponent,
    MenuPreciosComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNgModule
  ]
})
export class PreciosModule { }
