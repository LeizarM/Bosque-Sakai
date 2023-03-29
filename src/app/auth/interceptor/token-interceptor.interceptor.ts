import { Injectable } from '@angular/core';
import {  HttpRequest,  HttpHandler,  HttpEvent,  HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor( private loginService: LoginService ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = this.loginService.obtenerToken;
    if ( token != null || token != undefined ){
      const authReq  = request.clone({
        headers: request.headers.set('Authorization', 'Bearer '+ token)
      });
      return next.handle(authReq);
    }
    return next.handle(request);
  }
}
