import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Autorizacion } from 'src/app/protected/interfaces/Autorizacion';
import { environment } from 'src/environments/environment';
import { ArticuloPropuesto } from '../../interfaces/ArticuloPropuesto';
import { CostoIncre } from '../../interfaces/CostoIncre';
import { CostoSug } from '../../interfaces/CostoSug';
import { Precio } from '../../interfaces/Precio';
import { PrecioPropuesta } from '../../interfaces/PrecioPropuesta';
import { Producto } from '../../interfaces/Producto';
import { Propuesta } from '../../interfaces/Propuesta';


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


  /**
   * Obtendra los datos de la familia
   * @param codigoFamilia
   * @returns
   */
  obtenerDatoFamilia( codigoFamilia : number )  : Observable<Producto>{

    const data : Producto = {
      codigoFamilia
    }
    const url = `${this.baseUrl}/price/cargarProducto`;

    return this.http.post<Producto>( url, data )
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
   * Metodo para obtener los precios en tonelada por familia
   * @param codigoFamilia
   * @returns
   */
  obtenerPreciosXToneladaXFamilia(  codigoFamilia : number ) : Observable<Precio[]>{

    const data : Precio = {
      codigoFamilia
    }
    const url = `${this.baseUrl}/price/lstPrecioTonXFamilia`;

    return this.http.post<Precio[]>( url, data )
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
        )

  }


  /**
   * Metodo para registrar la propuesta
   * @param data
   * @returns
   */
  registrarPropuesta( data : Propuesta) : Observable<Propuesta> {

    const url = `${this.baseUrl}/price/registrarPropuesta`;

    return this.http.post<Propuesta>(url, data)
      .pipe(
        tap(resp => {
          if (!resp) {
            console.log(resp);
          }
        }),
        map(resp => resp),
        catchError(err => throwError(()=> err))
      );

  }


  /**
   * Metodo para registrar el costo Incremento por porpuesta
   * @param data
   * @returns
   */
  registrarCostoIncre ( data : CostoIncre) : Observable<CostoIncre>{


    const url = `${this.baseUrl}/price/registrarCostoIncre`;

    return this.http.post<CostoIncre>(url, data)
      .pipe(
        tap(resp => {
          if (!resp) {
            console.log(resp);
          }
        }),
        map(resp => resp),
        catchError(err => throwError(()=> err))
      );


  }

  /**
   * Metodo para registrar el precio propuesta en toneladas
   * @param data
   * @returns
   */
  registrarPrecioPropuesta ( data : PrecioPropuesta ) :  Observable<PrecioPropuesta> {

      const url = `${this.baseUrl}/price/registrarPrecioPropuesta`;

      return this.http.post<PrecioPropuesta>(url, data)
      .pipe(
        tap(resp => {
          if (!resp) {
            console.log(resp);
          }
        }),
        map(resp => resp),
        catchError(err => throwError(()=> err))
      );

  }


  /**
   *
   * @param data
   * @returns
   */
  registrarCostoSugerido ( data : CostoSug ) : Observable<CostoSug> {

    const url = `${this.baseUrl}/price/registrarCostoSug`;

    return this.http.post<CostoSug>(url, data)
      .pipe(
        tap(resp => {
          if (!resp) {
            console.log(resp);
          }
        }),
        map(resp => resp),
        catchError(err => throwError(()=> err))
      );

  }

  /**
   * Cargara una lista para listar los articulos por propuesta
   * @param idPropuesta
   * @returns
   */
  obtenerListaDeArticulosPorPropuesta( idPropuesta : number ) : Observable<ArticuloPropuesto[]> {

    const data : ArticuloPropuesto = {
      idPropuesta
    };

    const url = `${this.baseUrl}/price/lstArticulosXPropuesta`;

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
