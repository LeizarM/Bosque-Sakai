import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanLoad {

  constructor(private loginService: LoginService,
    private router: Router) {

  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    this.esTokenExpirado()
    if (this.loginService.codUsuario > 0 &&  this.loginService.isAuthenticated() ){
      if(!this.esTokenExpirado()){
        this.loginService.logout()
        this.router.navigate(['/auth']).then(() => {
          window.location.reload();
        });
        return false;
      }
      return true;
    }else{
      this.router.navigate(['/auth']).then(() => {
        window.location.reload();
      });;
      return false;
    }

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    if (this.loginService.codUsuario > 0 &&  this.loginService.isAuthenticated() ){
      if(!this.esTokenExpirado()){
        this.loginService.logout();
        this.router.navigate(['/auth']).then(() => {
          window.location.reload();
        });;
        return false;
      }
      return true;
    }else{
      this.router.navigate(['/auth']).then(() => {
        window.location.reload();
      });;
      return false;
    }

  }

  /**
   * Metodo para saber si el token expiro
   */
  esTokenExpirado(): boolean{
    let now = new Date().getTime() / 1000;
    let exp = this.loginService.expiracion;
    if (exp > now) return true;
    return false;
  }

}
