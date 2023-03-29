import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from "./layout/layout.component";


 const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children : [
       {
        path: 'dashboard',
        component: DashboardComponent
      },
      /* {
        path: 'tprAutorizacion/Autorizacion',
        component: AutorizacionComponent
      },
      {
        path: 'tprAutorizacion/Autorizacion/familias',
        component: FamiliasComponent
      },
      {
        path: 'tcrDocumento/Documento',
        component: DocumentoComponent
      },
      {
        path: 'tbEmpleado/empleados',
        component: EmpleadosComponent
      },
      {
        path: 'tbEmpleado/empleados/detalle-empleado',
        component: DetalleEmpleadoComponent
      },
      {
        path: 'tbEmpleado/empleados/registro-empleado',
        component: RegistroEmpleadoComponent
      },
      {
        path: 'tftFichaTrabajador/ficha',
        component: FichaTrabajadorComponent
      }, */
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
