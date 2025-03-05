import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './pages/usuario.component';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';


@NgModule({
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports: [
    
  ],
  declarations: [UsuarioComponent]
})
export class UsuarioModule { }
