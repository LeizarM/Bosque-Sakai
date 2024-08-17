import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { FacturaSantaCruzComponent } from './pages/registro/factura-santa-cruz.component';
import { RevisionFacturaSantaCruzComponent } from './pages/revision/revision-factura-santa-cruz.component';



@NgModule({
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  declarations: [
    FacturaSantaCruzComponent,
    RevisionFacturaSantaCruzComponent
  ]
})
export class FacturaSantaCruzModule { }
