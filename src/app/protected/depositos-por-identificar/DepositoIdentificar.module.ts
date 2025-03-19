import { ViewDepositoPorIdentificarComponent } from './pages/view-deposito-por-identificar/view-deposito-por-identificar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrarDepositoIdentificarComponent } from './pages/registrar-deposito-identificar/registrar-deposito-identificar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
  ],
  declarations: [RegistrarDepositoIdentificarComponent, ViewDepositoPorIdentificarComponent]
})
export class DepositoIdentificarModule { }
