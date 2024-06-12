import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ChangePasswordModule } from './change-password/change-password.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FichaTrabajadorModule } from './ficha-trabajador/ficha-trabajador.module';
import { AppConfigModule } from "./layout/config/config.module";
import { LayoutComponent } from './layout/layout.component';
import { LoteProduccionModule } from './lote-produccion/LoteProduccion.module';
import { PollaModule } from './polla/polla.module';
import { PreciosModule } from './precios/precios.module';
import { ProtectedRoutingModule } from './protected-routing.module';
import { RrhhModule } from './rrhh/rrhh.module';
import { SharedModule } from './shared/shared.module';



@NgModule({
    declarations: [
        LayoutComponent,
        DashboardComponent
    ],
    imports: [
        CommonModule,
        PrimeNgModule,
        SharedModule,
        AppConfigModule,
        ProtectedRoutingModule,
        PreciosModule,
        RrhhModule,
        FichaTrabajadorModule,
        ChangePasswordModule,
        LoteProduccionModule,
        PollaModule

    ]
})
export class ProtectedModule { }
