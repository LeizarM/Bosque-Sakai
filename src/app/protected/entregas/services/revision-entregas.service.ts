import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EntregaChofer } from '../../interfaces/EntregaChofer';

@Injectable({
  providedIn: 'root'
})
export class RevisionEntregasService {


  private baseUrl : string = environment.baseUrl;



constructor( private http: HttpClient ) { }



/**
 * Listara las entregas por fecha
 * @param docDate
 * @returns
 */
obtenerEntregasXFecha( docDate : string | Date): Observable<EntregaChofer[]> {

  const url = `${this.baseUrl}/entregas/entregas-fecha`;
  const data = {

    "docDate" : docDate

   };

  return this.http.post<EntregaChofer[]>( url, data ).pipe(
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
