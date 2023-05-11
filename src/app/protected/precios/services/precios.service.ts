import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Autorizacion } from 'src/app/protected/interfaces/Autorizacion';
import { environment } from 'src/environments/environment';
import { CostoIncre } from '../../interfaces/CostoIncre';




@Injectable({
  providedIn: 'root'
})
export class PreciosService {

  private baseUrl: string = environment.baseUrl;

  // Agrega el BehaviorSubject para la variable compartida
  private sharedVisible = new BehaviorSubject<boolean>(false);
  sharedVisible$ = this.sharedVisible.asObservable();
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

  // Agrega el método para actualizar la variable compartida
  updateSharedVisible(newValue: boolean): void {
    this.sharedVisible.next(newValue);
  }

  /**
   * Metodo para listar el costo de flete
   * @returns []
   */
  obtenerListCostoFlete(): Observable<CostoIncre[]>{

    const url = `${this.baseUrl}/price/costoFlete`;
    const data = { };
    return this.http.post<CostoIncre[]>( url, data )
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
