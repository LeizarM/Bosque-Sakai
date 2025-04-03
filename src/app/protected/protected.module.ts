import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ChangePasswordModule } from './change-password/change-password.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EntregasModule } from './entregas/entregas.module';
import { FacturaSantaCruzModule } from './facturas-santa-cruz/factura-santa-cruz.module';
import { FichaTrabajadorModule } from './ficha-trabajador/ficha-trabajador.module';
import { AppConfigModule } from "./layout/config/config.module";
import { LayoutComponent } from './layout/layout.component';
import { LoteProduccionModule } from './lote-produccion/LoteProduccion.module';
import { MaterialMalEstadoModule } from './material-mal-estado/material-mal-estado.module';
import { PreciosModule } from './precios/precios.module';
import { ProtectedRoutingModule } from './protected-routing.module';
import { RrhhModule } from './rrhh/rrhh.module';
import { SharedModule } from './shared/shared.module';
import { DepositosChequeModule } from './depositos-cheque/DepositosCheque.module';
import { UsuarioModule } from './usuarios/usuario.module';
import { CombustibleControlModule } from './combustible-control/CombustibleControl.module';




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
        MaterialMalEstadoModule,
        FacturaSantaCruzModule,
        EntregasModule,
        DepositosChequeModule,
        UsuarioModule,
       CombustibleControlModule,


    ]
})
export class ProtectedModule { }
