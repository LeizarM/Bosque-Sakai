import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

import { Login } from '../interface/Login';
import { UsuarioBtn } from 'src/app/protected/interfaces/UsuarioBtn';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Login;
  private _token!: string;
  // Propiedad para almacenar los botones autorizados
  private _botonesAutorizados: UsuarioBtn[] = [];
  private _botonesCargados: boolean = false;

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
  verificarLogin(usuario: string, password2: string): Observable<Login> {

    const url = `${this.baseUrl}/auth/login`;
    const cabecera = new HttpHeaders();
    cabecera.append('Content-Type', 'application/json');
    const data = {
      "login": usuario,
      "password2": password2
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
   * Procedimiento para cambiar la contraseña del usuario
   * @param login
   * @returns
   */
  changePassword ( login : Login): Observable<Login> {
    console.log(login);
    const url = `${this.baseUrl}/auth/changePassword`;

    return this.http.post<Login>(url, login)
      .pipe(
        tap(resp => {

          if (!resp) {
            console.log(resp);
          }
        }),
        map(resp => resp),
        catchError(err => of(err.error))
      );
  }

  /**
   * Procedimiento para reiniciar la contraseña desde la página de cambio de contraseña por defecto
   * @param login
   * @returns
   */
  reiniciarContrasena(login: Login): Observable<any> {
    // Crear un objeto simple con solo los datos necesarios
    
     
    const datos = {
      codUsuario: login.codUsuario,
      npassword: login.password2
    };
  
    console.log('Enviando datos:', datos);
  
    const url = `${this.baseUrl}/auth/changePasswordDefault`;
    
    return this.http.post<any>(url, datos, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap(resp => {
        if (resp) {
          console.log('Respuesta:', resp);
        }
      }),
      map(resp => resp),
      catchError(err => {
        console.error('Error en reiniciarContrasena:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Verifica si la contraseña es la predeterminada
   * @param password 
   * @returns boolean
   */
  isDefaultPassword(password: string): boolean {
    return password === "123456789";
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
    // Limpiar también los permisos de botones
    this._botonesAutorizados = [];
    this._botonesCargados = false;
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
   * Para obtener el codigo de sucursal del empleado desde el token de la parte del payload
   */
  get codSucursalEmpleado() : number {
    
    let token =  this.obtenerToken;
    if(token == null || token == undefined || token == '') return -1;

    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).codSucursal;

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

  /**
   * Verifica si un botón está autorizado para el usuario actual
   * @param nombreBtn Nombre del botón a verificar
   * @returns Observable<boolean> que indica si el botón está autorizado
   */
  esAutorizado(nombreBtn: string): Observable<boolean> {
    // Si es administrador, siempre retorna true
    if (this.tipoUsuario === 'ROLE_ADM') return of(true);
    
    // Si ya tenemos los permisos en caché, retornamos inmediatamente
    if (this._botonesCargados) {
      return of(this._botonesAutorizados.some(btn => btn.boton === nombreBtn && btn.permiso === 1));
    }
    
    // Si no tenemos los permisos, los solicitamos
    const url = `${this.baseUrl}/view/vistaBtn`;
    const cabecera = new HttpHeaders().set('Content-Type', 'application/json');
    const data = {
      "codUsuario": this.codUsuario
    };
    
    return this.http.post<UsuarioBtn[]>(url, data, { headers: cabecera })
      .pipe(
        map(permisos => {
          // Guardamos los permisos en caché
          this._botonesAutorizados = permisos;
          this._botonesCargados = true;
          // Verificamos si el botón existe y tiene permiso
          return permisos.some(btn => btn.boton === nombreBtn && btn.permiso === 1);
        }),
        catchError(err => {
          console.error('Error al obtener permisos de botones:', err);
          return of(false); // En caso de error, no damos permiso
        })
      );
  }

  /**
   * Método sincrónico para verificar si un botón está autorizado
   * Solo funciona después de haber cargado los permisos con cargarPermisos()
   * @param nombreBtn Nombre del botón a verificar
   * @returns boolean que indica si el botón está autorizado
   */
  estaAutorizadoSync(nombreBtn: string): boolean {
    // Si es administrador, siempre retorna true
    if (this.tipoUsuario === 'ROLE_ADM') return true;
    
    // Verificamos si el botón existe y tiene permiso
    if (this._botonesCargados) {
      return this._botonesAutorizados.some(btn => btn.boton === nombreBtn && btn.permiso === 1);
    }
    
    // Si no hay datos cargados, negamos acceso
    return false;
  }

  /**
   * Método para precargar todos los permisos
   * @returns Observable<UsuarioBtn[]> con la lista de permisos
   */
  cargarPermisos(): Observable<UsuarioBtn[]> {
    // Si ya están cargados, retornamos el valor en caché
    if (this._botonesCargados) {
      return of(this._botonesAutorizados);
    }
    
    const url = `${this.baseUrl}/view/vistaBtn`;
    const cabecera = new HttpHeaders().set('Content-Type', 'application/json');
    const data = {
      "codUsuario": this.codUsuario
    };
    
    return this.http.post<UsuarioBtn[]>(url, data, { headers: cabecera })
      .pipe(
        tap(permisos => {
          this._botonesAutorizados = permisos;
          this._botonesCargados = true;
        }),
        catchError(err => {
          console.error('Error al obtener permisos de botones:', err);
          return of([]);
        })
      );
  }
}