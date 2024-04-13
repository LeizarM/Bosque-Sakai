import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoteProduccion } from '../../interfaces/LoteProduccion';

@Injectable({
  providedIn: 'root'
})
export class LoteProduccionService {


  private baseUrl: string = environment.baseUrl;



  constructor(
    private http: HttpClient,

  ) { }

  /**
    * ==========================================
    * ========== PROCEDIMIENTOS ================
    * ==========================================
    */

  /**
   * Obtendra los datos limpios para un nuevo lote de Produccion
   * @returns
   */
  obtenerLoteProduccionNew(): Observable<LoteProduccion[]>{

    const url = `${this.baseUrl}/loteProduccion/newLoteProduccion`;
    const data = { };
    return this.http.post<LoteProduccion[]>( url, data )
    .pipe(

      catchError(e => {
        if (e.status == 401) {
          return throwError(() => e);
        }
        if (e.ok === false) {
          console.error(e.error.error);
          return throwError(() => e);
        }
        return throwError(() => e);
      })
    );

  }



  /**
   * Obtendra los articulos
   * @returns
   */
  obtenerArticulos(): Observable<LoteProduccion[]>{

    const url = `${this.baseUrl}/loteProduccion/articulos`;
    const data = { };
    return this.http.post<LoteProduccion[]>( url, data )
    .pipe(

      catchError(e => {
        if (e.status == 401) {
          return throwError(() => e);
        }
        if (e.ok === false) {
          console.error(e.error.error);
          return throwError(() => e);
        }
        return throwError(() => e);
      })
    );

  }



}
