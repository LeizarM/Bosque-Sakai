import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VistaModule } from '../vista/vista.module';
import { AppFooterComponent } from './footer/app.footer.component';
import { AppTopBarComponent } from './navbar/app.topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';



@NgModule({
  declarations: [
    AppTopBarComponent,
    SidebarComponent,
    AppFooterComponent,



  ],
  imports: [
    CommonModule,
    VistaModule,


  ],
  exports:[
    AppTopBarComponent,
    SidebarComponent,
    AppFooterComponent,


  ]
})
export class SharedModule { }
