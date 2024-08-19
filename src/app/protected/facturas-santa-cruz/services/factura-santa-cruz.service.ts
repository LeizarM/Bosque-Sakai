import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { RegistroFacturas } from '../../interfaces/RegistroFacturas';

@Injectable({
  providedIn: 'root'
})
export class FacturaSantaCruzService {


  private baseUrl : string = environment.baseUrl;

  constructor(private http: HttpClient) {

  }

  obtenerEmpresas(): Observable<RegistroFacturas[]> {

    const url = `${this.baseUrl}/registro-facturas/lstEpresas`;
    const data = { };

    return this.http.post<RegistroFacturas[]>( url, data ).pipe(
        retry(3), // Reintenta la petición hasta 3 veces en caso de fallo
        timeout(5000), // Establece un tiempo límite de 5 segundos
        catchError(this.handleError)
      );
  }


  registrarRegistroFacturas(mb: RegistroFacturas): Observable<RegistroFacturas> {

    const url = `${this.baseUrl}/registro-facturas/registroFactura`;
    const data = mb;

    // Realiza la petición POST al backend
    return this.http.post<RegistroFacturas>(url, data )
      .pipe(
         // Reintenta la petición hasta 2 veces en caso de fallo
        catchError(this.handleError) // Maneja errores usando el método handleError
      );
  }

  obtenerFacturasRegistradas( fechaSistema : Date ): Observable<RegistroFacturas[]> {

    const url = `${this.baseUrl}/registro-facturas/lstFacturasRegistradas`;
    const data = {

      "fechaSistema" : fechaSistema

     };

    return this.http.post<RegistroFacturas[]>( url, data ).pipe(
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
