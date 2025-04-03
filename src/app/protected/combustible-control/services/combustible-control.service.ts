import { CombustibleControl } from './../../interfaces/CombustibleControl';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../../interfaces/ApiResponse';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, retry, throwError, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CombustibleControlService {

  private baseUrl: string = environment.baseUrl;
  private endpoint: string = '/gasolina';
  private timeoutMs: number = 5000;
  private maxRetries: number = 3;

  constructor(private http: HttpClient) { }


  obtenerCoches(): Observable<ApiResponse<CombustibleControl[]>> {
    const url = `${this.baseUrl}${this.endpoint}/lst-coches`;

    return this.http.post<ApiResponse<CombustibleControl[]>>(url, {})
      .pipe(
        retry(this.maxRetries),
        timeout(this.timeoutMs),
        catchError(this.handleError)
      );
  }


  obtenerKilometrajes(idCoche: number): Observable<ApiResponse<CombustibleControl[]>> {
    const url = `${this.baseUrl}${this.endpoint}/lst-kilometraje`;

    return this.http.post<ApiResponse<CombustibleControl[]>>(url, {
      idCoche: idCoche
    })
      .pipe(
        retry(this.maxRetries),
        timeout(this.timeoutMs),
        catchError(this.handleError)
      );
  }



  /**
      * Manejo centralizado de errores
      */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del servidor
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Solicitud incorrecta';
            break;
          case 401:
            errorMessage = 'No autorizado';
            break;
          case 403:
            errorMessage = 'Acceso denegado';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 408:
            errorMessage = 'Tiempo de espera agotado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
      }
    }

    console.error('Error en DepositoChequeService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }



}
