import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Autorizacion } from 'src/app/protected/interfaces/Autorizacion';
import { environment } from 'src/environments/environment';
import { ArticuloPropuesto } from '../../interfaces/ArticuloPropuesto';
import { CostoIncre } from '../../interfaces/CostoIncre';
import { Producto } from '../../interfaces/Producto';


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

  /**
   * Obtendra la lista de proveedores y codigo de familia
   * @returns
   */
  obtenerListProveedor(): Observable<Producto[]>{

    const url = `${this.baseUrl}/price/lstProveedor`;
    return this.http.post<Producto[]>( url, {} )
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
   * obtendra la lista de familias
   * @returns
   */
  obtenerListFamilia( codFamilia : number ) : Observable<Producto[]> {

    const data : Producto = {
      codigoFamilia : codFamilia
    };

    const url = `${this.baseUrl}/price/listFamilia`;

    return this.http.post<Producto[]>( url, data )
    .pipe(
      catchError(e => {
        if( e.status == 401 ){
          return throwError( () => e );
        }
        if( e.ok === false ){
          console.error(e.error.error);
          return throwError( () => e );
        }
        return throwError( () => e );
      })
    );

  }
  /**
   * Para lista las familias por grupo de familia
   * @param idGrpFamiliaSap
   * @returns
   */
  obtenerListFamiliaXGrupo( idGrpFamiliaSap : number ) : Observable<Producto[]> {

    const data : Producto = {
      idGrpFamiliaSap
    };

    const url = `${this.baseUrl}/price/listFamiliaXGrupo`;

    return this.http.post<Producto[]>( url, data )
        .pipe(
          catchError(e => {
            if( e.status == 401 ){
              return throwError( () => e );
            }
            if( e.ok === false ){
              console.error(e.error.error);
              return throwError( () => e );
            }
            return throwError( () => e );
          })
        );

  }

  /**
   * Para listar los articulos por familias
   * @param codCad
   * @returns
   */
  obtenerListArticulosXFamilia( codCad : string ) : Observable<ArticuloPropuesto[]> {

    const data : ArticuloPropuesto = {
      codCad
    };

    const url = `${this.baseUrl}/price/listFamiliaXArticulo`;

    return this.http.post<ArticuloPropuesto[]>( url, data )
        .pipe(
          catchError(e => {
            if( e.status == 401 ){
              return throwError( () => e );
            }
            if( e.ok === false ){
              console.error(e.error.error);
              return throwError( () => e );
            }
            return throwError( () => e );
          })
        );

  }

}
