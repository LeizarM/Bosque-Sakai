import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { PollaMainComponent } from './polla-main/polla-main.component';



@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot()

  ],
  declarations: [
    PollaMainComponent
  ]
})
export class PollaModule { }
