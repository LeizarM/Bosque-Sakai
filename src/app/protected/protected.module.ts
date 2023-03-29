import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/LayoutComponent';
import { ProtectedRoutingModule } from './protected-routing.module';
import { SharedModule } from './shared/shared.module';



@NgModule({
  declarations: [

    LayoutComponent,
		DashboardComponent

  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
		SharedModule,

  ]
})
export class ProtectedModule { }
