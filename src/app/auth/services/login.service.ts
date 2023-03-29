import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Login } from '../interface/Login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  private baseUrl: string = environment.baseUrl;
  private _usuario!: Login;
  private _token!: string;


  constructor(private http: HttpClient) { }



   /**
    * ==========================================
    * ========== PROCEDIMIENTOS ================
    * ==========================================
    */

  /**
   * Para verificar las credenciales del usuario
   * @param codUsuario
   * @param password
   * @returns
   */
  verificarLogin(usuario: string, password: string): Observable<Login> {

    const url = `${this.baseUrl}/auth/login`;
    const cabecera = new HttpHeaders();
    cabecera.append('Content-Type', 'application/json');
    const data = {
      "login": usuario,
      "password": password
    };

    return this.http.post<Login>(url, data, { headers: cabecera })
      .pipe(
        tap(resp => {
          if ( resp.token ) {
            this.guardarToken( resp.token );
            this.guardarUsuario( resp );
          }
        }),
        map(resp => resp),
        catchError(err => of(err.error.error))
      );

  }


  /**
   * Guardara el token
   * @param token
   */
  guardarToken( token: string ): void {
    localStorage.setItem('b-tkn', token );
  }

  /**
   * guardara los datos del usuario en el localstorage
   * @param usuario
   */
  guardarUsuario( usuario: Login ): void {
    usuario.token = "";
    this._usuario = usuario;
    localStorage.setItem('b-user', JSON.stringify( this._usuario ) );
  }

  /**
   * Devolvera datos del usuario
   * */
   get obtenerUsuario(): Login {

    if (this._usuario != null || this._usuario != undefined) {
      return this._usuario;
    } else if ( (this._usuario == null || this._usuario == undefined) && localStorage.getItem('b-user') != null) {

      return this._usuario =  JSON.parse( localStorage.getItem('b-user')!) as Login;
    }
    return {};
  }

  /**
   * Devolvera el token
   */
  get obtenerToken(): string {

    if (this._token != null || this._token != undefined   ) {

      return this._token;

    } else if ( (this._token === null || this._token === undefined ) && localStorage.getItem('b-tkn') !== null) {

      return this._token =  ( localStorage.getItem('b-tkn')!);
    }
    return '';
  }

  /**
   * Verificara si ya inicio sesion
   */
  isAuthenticated():boolean{
    let token = this.obtenerToken;
    if( token != null && token.length > 0 ) return true;
    return false;
  }

  /**
   * Para cerrar sesion y borrar datos
   */
  logout():void {
    this._token = '';
    this._usuario = {};
    localStorage.clear();
  }

  /**
   * Para obtener el codigo usuario desde el token de la parte del payload
   */
  get codUsuario() : number {

    let token =  this.obtenerToken;
    if(token == null || token == undefined || token == '') return -1;

    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).jti;
  }

  /**
   * Para obtener el codigo de Empleado desde el token de la parte del payload
   */
   get codEmpleado() : number {

    let token =  this.obtenerToken;
    if(token == null || token == undefined || token == '') return -1;

    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).codEmpleado;
  }


  /**
   * Obtendra el tipo de rol del usuario
   */
  get tipoUsuario() : string {
    let token =  this.obtenerToken;
    if(token == null || token == undefined || token == '') return '';

    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).tipoUsuario;
  }

  /**
   * Obtendra el tiempo de expiracion del token
   */
  get expiracion():number {
    let token =  this.obtenerToken;
    if(token == null || token == undefined || token == '') return -1;
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).exp;
  }
}
