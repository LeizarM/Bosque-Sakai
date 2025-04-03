import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewCombustibleControlComponent } from './pages/view-combustible-control/view-combustible-control.component';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ViewCombustibleControlComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule
  ],
  
})
export class CombustibleControlModule { }