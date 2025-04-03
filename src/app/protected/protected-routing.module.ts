import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/pages/change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RevisionEntregasComponent } from './entregas/pages/revision/revision-entregas.component';
import { FacturaSantaCruzComponent } from './facturas-santa-cruz/pages/registro/factura-santa-cruz.component';
import { RevisionFacturaSantaCruzComponent } from './facturas-santa-cruz/pages/revision/revision-factura-santa-cruz.component';
import { FichaTrabajadorComponent } from './ficha-trabajador/pages/ficha-trabajador/ficha-trabajador.component';
import { LayoutComponent } from "./layout/layout.component";
import { CrearLoteProduccionComponent } from './lote-produccion/pages/crear-lote-produccion/crearLoteProduccion.component';
import { ResmadoComponent } from './lote-produccion/pages/resmado/resmado.component';
import { RegistroBobinaComponent } from './material-mal-estado/pages/registro-bobina/registro-bobina.component';
import { RegistroResmaComponent } from './material-mal-estado/pages/registro-resma/registro-resma.component';
import { AutorizacionComponent } from './precios/pages/autorizacion/autorizacion.component';
import { FamiliasComponent } from './precios/pages/familias/familias.component';
import { EmpleadosComponent } from './rrhh/empleados/empleados.component';
import { RegistrarChequeComponent } from './depositos-cheque/pages/registrar-cheque/registrar-cheque.component';
import { ViewChequeComponent } from './depositos-cheque/pages/view-cheque/view-cheque.component';
import { UsuarioComponent } from './usuarios/pages/usuario.component';
import { RegistrarDepositoIdentificarComponent } from './depositos-cheque/pages/registrar-deposito-identificar/registrar-deposito-identificar.component';
import { ViewDepositoPorIdentificarComponent } from './depositos-cheque/pages/view-deposito-por-identificar/view-deposito-por-identificar.component';
import { ViewCombustibleControlComponent } from './combustible-control/pages/view-combustible-control/view-combustible-control.component';


 const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children : [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'tbUsuario/cpassword',
        component: ChangePasswordComponent
      },
      {
        path: 'tprAutorizacion/Autorizacion',
        component: AutorizacionComponent
      },
      {
        path: 'tprAutorizacion/Autorizacion/familias',
        component: FamiliasComponent
      },
      /*{
        path: 'tcrDocumento/Documento',
        component: DocumentoComponent
      },*/
      {
        path: 'tbEmpleado/empleados',
        component: EmpleadosComponent
      },
      /*{
        path: 'tbEmpleado/empleados/detalle-empleado',
        component: DetalleEmpleadoComponent
      },
      {
        path: 'tbEmpleado/empleados/registro-empleado',
        component: RegistroEmpleadoComponent
      },*/
      {
        path: 'tftFichaTrabajador/ficha',
        component: FichaTrabajadorComponent
      },
      {
        path: 'tprod_loteProduccion/loteProduccion',
        component: CrearLoteProduccionComponent
      },
      {
        path: 'tprod_loteProduccion/Resmado',
        component: ResmadoComponent
      },
      {
        path: 'tmme_RegistroResma/resma',
        component: RegistroResmaComponent
      },
      {
        path: 'tmme_RegistroBobina/bobina',
        component: RegistroBobinaComponent
      },
      {
        path: 'tfsc_RegistroFactura/Registro',
        component: FacturaSantaCruzComponent
      },
      {
        path: 'tfsc_RegistroFactura/Revision',
        component: RevisionFacturaSantaCruzComponent
      },
      {
        path: 'trch_choferEntrega/Revision',
        component: RevisionEntregasComponent
      },
      {
        path: 'tdep_Deposito/Registro',
        component: RegistrarChequeComponent
      },
      {
        path: 'tdep_Deposito/View',
        component: ViewChequeComponent
      },
      { 
        path: 'tbUsuario/usuario',
        component: UsuarioComponent
      },
      {
        path: 'tdep_DepositoIde/Registro',
        component: RegistrarDepositoIdentificarComponent
      },
      {
        path: 'tdep_DepositoIde/View',
        component: ViewDepositoPorIdentificarComponent

      },
      {
        path: 'tgas_ControlCombustible/View',
        component: ViewCombustibleControlComponent
      },
      {
        path: '**',
        redirectTo: ''
      },

    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class ProtectedRoutingModule { }
