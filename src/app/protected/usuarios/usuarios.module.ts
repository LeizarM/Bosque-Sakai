import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components and Routes
import { UsuarioComponent } from './pages/usuario.component';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    
  ],
  imports: [
    ReactiveFormsModule,
    PrimeNgModule,
  ],
  providers: []
})
export class UsuariosModule { }
