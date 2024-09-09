import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DetalleResmado } from '../../interfaces/DetalleResmado';
import { GrupoProduccion } from '../../interfaces/GrupoProduccion';
import { LoteProduccion } from '../../interfaces/LoteProduccion';
import { MaquinaProduccion } from '../../interfaces/MaquinaProduccion';
import { MaterialIngreso } from '../../interfaces/MaterialIngreso';
import { MaterialSalida } from '../../interfaces/MaterialSalida';
import { Merma } from '../../interfaces/Merma';
import { Resmado } from '../../interfaces/Resmado';

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
  obtenerLoteProduccionNew( idMa : number ): Observable<LoteProduccion[]>{

    const url = `${this.baseUrl}/loteProduccion/newLoteProduccion`;
    const data = {
      idMa : idMa
    };
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


  /**
   * Obtendra las maquinas de produccion
   * @returns
   */
  obtenerMaquina(): Observable<MaquinaProduccion[]>{

    const url = `${this.baseUrl}/loteProduccion/maquina`;
    const data = { };
    return this.http.post<MaquinaProduccion[]>( url, data )
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
   * Metodo para registrar el lote de produccion
   * @param regLoteProd
   * @returns
   */
  registrarLoteProduccion( regLoteProd : LoteProduccion  ): Observable<LoteProduccion> {

    const url = `${this.baseUrl}/loteProduccion/registroLoteProduccion`;


    return this.http.post<LoteProduccion>(url, regLoteProd)
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
   * para registrar el material de ingreso
   * @param regMatIngreso
   * @returns
   */
  registrarMaterialIngreso( regMatIngreso : MaterialIngreso[] ): Observable<MaterialIngreso[]> {

    const url = `${this.baseUrl}/loteProduccion/registroIngreso`;

     return this.http.post<MaterialIngreso[]>(url, regMatIngreso)
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
   * para registrar el material de ingreso
   * @param regMatSalida
   * @returns
   */
  registrarMaterialSalida( regMatSalida : MaterialSalida[] ): Observable<MaterialSalida[]> {

    const url = `${this.baseUrl}/loteProduccion/registroSalida`;


    return this.http.post<MaterialSalida[]>(url, regMatSalida)
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
   * Pare registrar la merma
   * @param regMerma
   * @returns
   */
  registrarMerma( regMerma : Merma[] ): Observable<Merma[]> {

    const url = `${this.baseUrl}/loteProduccion/registroMerma`;


   return this.http.post<Merma[]>(url,  regMerma)
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
   * ===============================================
   * ============= PARA EL RESMADO =================
   * ===============================================
   */

  /**
   * Para obtener los grupos de resmado por maquina
   * @returns
   */
  obtenerGrupoProduccion(): Observable<GrupoProduccion[]>{

    const url = `${this.baseUrl}/resmado/grupoProduccion`;
    const data = { };
    return this.http.post<GrupoProduccion[]>(url, data).pipe(
      catchError((e) => {
        if (e.status === 401) {
          return throwError(() => e);
        }
        console.error(e.error?.error);
        return throwError(() => e);
      })
    );

  }


  /**
   * Metodo para registrar el resmado
   * @param regResmado
   * @returns
   */
  registrarResmado( regResmado : Resmado  ): Observable<Resmado> {

    const url = `${this.baseUrl}/resmado/registroResmado`;


    return this.http.post<Resmado>(url, regResmado)
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
   * Para registrar el detalle de resmado
   * @param regDetResmado
   * @returns
   */
  registroDetalleResmado( regDetResmado : DetalleResmado[] ): Observable<DetalleResmado[]> {

    const url = `${this.baseUrl}/resmado/registroDetResmado`;


   return this.http.post<Merma[]>(url,  regDetResmado)
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

}
