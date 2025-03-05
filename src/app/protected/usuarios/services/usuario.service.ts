import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError, timeout } from 'rxjs';
import { Login } from 'src/app/auth/interface/Login';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


private baseUrl : string = environment.baseUrl;


constructor( private http: HttpClient  ) { }


  /**
   * Para Obtener la lista de choferes
   * @returns
   */
  obtenerUsuarios():Observable<Login[]> {
  
    const url = `${this.baseUrl}/auth/lstUsers`;
    const data = {};
  
    return this.http.post<Login[]>( url, data ).pipe(
        retry(2), // Reintenta la petición hasta 3 veces en caso de fallo
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
