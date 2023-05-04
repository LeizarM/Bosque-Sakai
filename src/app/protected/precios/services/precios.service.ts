import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Autorizacion, Convert } from 'src/app/protected/interfaces/Autorizacion';
import { throwError, Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class PreciosService {

  private baseUrl: string = environment.baseUrl;
  constructor( private http: HttpClient ) { }

  /**
    * ==========================================
    * ========== PROCEDIMIENTOS ================
    * ==========================================
    */
  /**
   * Procedimiento para obtener las propuestas para que se autorizcen
   * @returns
   */
  obtenerListAutorizacion(): Observable<Autorizacion[]>{


    const url = `${this.baseUrl}/price/autorizacion`;
    const data = { };
    return this.http.post<Autorizacion[]>( url, data )
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
