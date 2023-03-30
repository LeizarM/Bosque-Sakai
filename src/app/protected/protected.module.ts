import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppConfigModule } from "./layout/config/config.module";
import { LayoutComponent } from './layout/layout.component';
import { ProtectedRoutingModule } from './protected-routing.module';
import { SharedModule } from './shared/shared.module';



@NgModule({
    declarations: [
        LayoutComponent,
        DashboardComponent
    ],
    imports: [
        CommonModule,
        PrimeNgModule,
        ProtectedRoutingModule,
        SharedModule,
        AppConfigModule,

    ]
})
export class ProtectedModule { }
