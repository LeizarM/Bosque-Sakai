import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrarChequeComponent } from './pages/registrar-cheque/registrar-cheque.component';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewChequeComponent } from './pages/view-cheque/view-cheque.component';


@NgModule({
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    RegistrarChequeComponent,
    ViewChequeComponent
  ]
})
export class DepositosChequeModule { }
