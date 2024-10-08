import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Empresa } from '../../interfaces/Empresa';
import { RegistroDanoBobina } from '../../interfaces/RegistroDanoBobina';
import { RegistroDanoBobinaDetalle } from '../../interfaces/RegistroDanoBobinaDetalle';
import { RegistroResma } from '../../interfaces/RegistroResma';
import { RegistroResmaDetalle } from '../../interfaces/RegistroResmaDetalle';
import { TipoDano } from '../../interfaces/TipoDano';

@Injectable({
  providedIn: 'root'
})
export class MaterialMalEstadoService {


  private baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }


  /**
    * ==========================================
    * ========== PROCEDIMIENTOS ================
    * ==========================================
    */


  /**
   * Para obtener las empresas registradas
   * @returns
   */
  obtenerEmpresas(): Observable<Empresa[]> {

    const url = `${this.baseUrl}/empresa/lstEmpresas`;
    const data = { };

    return this.http.post<Empresa[]>( url, data ).pipe(
        retry(3), // Reintenta la petición hasta 3 veces en caso de fallo
        timeout(5000), // Establece un tiempo límite de 5 segundos
        catchError(this.handleError)
      );
  }


  /**
   * Para obtener los docNum por empresas
   * @returns
   */
  obtenerDocNumXEmpresa( codEmpresa : number ): Observable<RegistroResma[]> {

    const url = `${this.baseUrl}/material-mal-estado/lstDocNum`;
    const data = {
      "codEmpresa" : codEmpresa
    };

    return this.http.post<RegistroResma[]>( url, data ).pipe(
        retry(3), // Reintenta la petición hasta 3 veces en caso de fallo
        timeout(5000), // Establece un tiempo límite de 5 segundos
        catchError(this.handleError)
      );
  }

  /**
   * Obtendra los articulos por DocNum y por Empresa
   * @param codEmpresa
   * @param docNum
   * @returns
   */
  obtenerArticulosXDocNum( codEmpresa : number, docNum : number ): Observable<RegistroResma[]> {

    const url = `${this.baseUrl}/material-mal-estado/lstArticuloXEntrada`;
    const data = {
      "codEmpresa" : codEmpresa,
      "docNum" : docNum
    };

    return this.http.post<RegistroResma[]>( url, data ).pipe(
        retry(3), // Reintenta la petición hasta 3 veces en caso de fallo
        timeout(5000), // Establece un tiempo límite de 5 segundos
        catchError(this.handleError)
      );
  }

  /**
   * Para obtener los tipos de daño
   * @returns
   */
  obtenerTiposDeDano(): Observable<TipoDano[]> {

    const url = `${this.baseUrl}/material-mal-estado/lstTipoDano`;
    const data = { };

    return this.http.post<TipoDano[]>( url, data ).pipe(
        retry(3), // Reintenta la petición hasta 3 veces en caso de fallo
        timeout(5000), // Establece un tiempo límite de 5 segundos
        catchError(this.handleError)
      );
  }


  /**
   * Para registrar el resmado de mal estado
   * @param mb
   * @returns
   */
  registrarResmaMalEstado(mb: RegistroResma): Observable<RegistroResma> {

    const url = `${this.baseUrl}/material-mal-estado/registroResmaMalEstado`;
    const data = mb;

    // Realiza la petición POST al backend
    return this.http.post<RegistroResma>(url, data )
      .pipe(
        retry(2), // Reintenta la petición hasta 2 veces en caso de fallo
        catchError(this.handleError) // Maneja errores usando el método handleError
      );
  }

  /**
   * Para registrar el detalle del resmado de mal estado
   * @param mb
   * @returns
   */
  registrarResmaMalEstadoDet(mb: RegistroResmaDetalle[]): Observable<RegistroResmaDetalle[]> {

    const url = `${this.baseUrl}/material-mal-estado/detRegistroResmaMalEstado`;
    const data = mb;

    // Realiza la petición POST al backend
    return this.http.post<RegistroResmaDetalle[]>(url, data )
      .pipe(
        retry(2), // Reintenta la petición hasta 2 veces en caso de fallo
        catchError(this.handleError) // Maneja errores usando el método handleError
      );
  }




  /**
   * Para obtener los docNum por empresas
   * @returns
   */
  obtenerDocNumXEmpresaBob( codEmpresa : number ): Observable<RegistroDanoBobina[]> {

    const url = `${this.baseUrl}/material-mal-estado/lstDocNumBob`;
    const data = {
      "codEmpresa" : codEmpresa
    };

    return this.http.post<RegistroDanoBobina[]>( url, data ).pipe(
        retry(1), // Reintenta la petición hasta 3 veces en caso de fallo
        timeout(5000), // Establece un tiempo límite de 5 segundos
        catchError(this.handleError)
      );
  }



  /**
   * Obtendra los articulos por DocNum y por Empresa
   * @param codEmpresa
   * @param docNum
   * @returns
   */
  obtenerArticulosXDocNumBob( codEmpresa : number, docNum : number ): Observable<RegistroDanoBobina[]> {

    const url = `${this.baseUrl}/material-mal-estado/lstArticuloXEntradaBob`;
    const data = {
      "codEmpresa" : codEmpresa,
      "docNum" : docNum
    };

    return this.http.post<RegistroDanoBobina[]>( url, data ).pipe(
        retry(2), // Reintenta la petición hasta 3 veces en caso de fallo
        timeout(5000), // Establece un tiempo límite de 5 segundos
        catchError(this.handleError)
      );
  }



  /**
   * Para registrar el resmado de mal estado
   * @param mb
   * @returns
   */
  registrarBobinaMalEstado(mb: RegistroDanoBobina): Observable<RegistroDanoBobina> {

    const url = `${this.baseUrl}/material-mal-estado/registroBobinaMalEstado`;
    const data = mb;

    // Realiza la petición POST al backend
    return this.http.post<RegistroDanoBobina>(url, data )
      .pipe(
        retry(2), // Reintenta la petición hasta 2 veces en caso de fallo
        catchError(this.handleError) // Maneja errores usando el método handleError
      );
  }

  /**
   * Para registrar el detalle del resmado de mal estado
   * @param mb
   * @returns
   */
  registrarBobinaMalEstadoDet(mb: RegistroDanoBobinaDetalle[]): Observable<RegistroDanoBobinaDetalle[]> {

    const url = `${this.baseUrl}/material-mal-estado/detRegistroBobinaMalEstado`;
    const data = mb;

    // Realiza la petición POST al backend
    return this.http.post<RegistroDanoBobinaDetalle[]>(url, data )
      .pipe(
        retry(2), // Reintenta la petición hasta 2 veces en caso de fallo
        catchError(this.handleError) // Maneja errores usando el método handleError
      );
  }



  /**
   * Manejo de errores
   * @param error
   * @returns
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de error
      errorMessage = `Código de error ${error.status}, ` +
                     `mensaje: ${error.error.message || error.statusText}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }




}
