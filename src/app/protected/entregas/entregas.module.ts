import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { RevisionEntregasComponent } from './pages/revision/revision-entregas.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimeNgModule
  ],
  declarations: [
    RevisionEntregasComponent,
  ]
})
export class EntregasModule { }
