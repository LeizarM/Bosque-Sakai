import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';



@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimeNgModule
  ]
})
export class ChangePasswordModule { }
