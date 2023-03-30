import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Pais } from '../../interfaces/Pais';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaisService {


  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  /**
    * ===============================================
    * =============== PROCEDIMIENTOS ================
    * ===============================================
    */

  /**
   * Procedimiento para obtener los paises registrados
   * @returns
   */
   obtenerPaises(): Observable<Pais[]>{
    const url = `${this.baseUrl}/rrhh/paises`;

    return this.http.post<Pais[]>(url, {} )
      .pipe(
        catchError(e => {
          if (e.status == 401) {
            return throwError(e);
          }
          if (e.ok === false) {
            console.error(e.error.error);
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }
}
