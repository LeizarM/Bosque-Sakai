import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../app/auth/auth.module').then( m => m.AuthModule )
  },

  {
    path: 'bosque',
    loadChildren: () => import('./protected/protected.module').then( m => m.ProtectedModule ),
    canLoad: [ AuthGuard ],
    canActivate: [ AuthGuard ]
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch : 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot( routes,{
    useHash: true,
  } )],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
