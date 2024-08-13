import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Empresa } from '../../interfaces/Empresa';
import { RegistroResma } from '../../interfaces/RegistroResma';

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
