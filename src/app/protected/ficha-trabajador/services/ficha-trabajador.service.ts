import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { Dependiente } from '../../interfaces/Dependiente';
import { Empleado } from '../../interfaces/Empleado';
import { GaranteReferencia } from '../../interfaces/GaranteReferencia';
import { MapBoxLibre } from '../../interfaces/MapBoxLibre';

@Injectable({
  providedIn: 'root'
})
export class FichaTrabajadorService {

  private baseUrl : string = environment.baseUrl;
  private urlMap  : string = 'https://nominatim.openstreetmap.org/search?q=';
  private styleMap: string = '&format=geojson&polygon_geojson=1&addressdetails=1';

  constructor(private http: HttpClient) { }

  /**
   * ===============================================
   * =============== PROCEDIMIENTOS ================
   * ===============================================
   */

  /**
   * Procedimiento que obtendra la lista de dependientes por empleado
   * @param codEmpleado
   * @returns
   */
  obtenerDependientes(codEmpleado: number): Observable<Dependiente[]> {
    const url = `${this.baseUrl}/fichaTrabajador/dependientes`;

    const dep: Dependiente = {
      codEmpleado: codEmpleado
    };

    return this.http.post<Dependiente[]>(url, dep)
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
   * Procedimiento que obtendra la lista de garantes o referencias por empleado
   * @param codEmpleado
   * @returns
   */
  obtenerGaranteYReferencias(codEmpleado: number): Observable<GaranteReferencia[]> {

    const url = `${this.baseUrl}/fichaTrabajador/garanteReferencia`;

    const garRef: GaranteReferencia = {
      codEmpleado: codEmpleado
    };

    return this.http.post<GaranteReferencia[]>(url, garRef)
      .pipe(
        catchError(e => {
          console.log(e);
          if (e.status === 401) {

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
   * Para el registro de Dependiente
   * @param dependiente
   * @returns
   */
  registrarInfoDependiente(dependiente: Dependiente) {

    const url = `${this.baseUrl}/fichaTrabajador/registrarDependiente`;

    return this.http.post<Dependiente>(url, dependiente)
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
   * Para el registro de Garante y Referencia
   * @param garanteReferencia
   * @returns
   */
  registrarInfoGaranteReferencia(garanteReferencia: GaranteReferencia) {

    const url = `${this.baseUrl}/fichaTrabajador/registrarGaranteReferencia`;

    return this.http.post<GaranteReferencia>(url, garanteReferencia)
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
   * Metodo para subir o enviar imagenes al servidor por empleado
   * @param file
   * @param codEmpleado
   * @returns
   */
  subirFoto(file: File, codEmpleado: any) {
    const url = `${this.baseUrl}/fichaTrabajador/upload`;

    let formData = new FormData();
    formData.append("file", file);
    formData.append("codEmpleado", codEmpleado);

    return this.http.post(url, formData);

  }

  /**
   * Procedimiento para descargar y preparar el PDF
   * @param codEmpleado
   * @returns
   */
  descargarFicha(codEmpleado: number) {

    const url = `${this.baseUrl}/fichaTrabajador/pdf`;

    const nombreReporte: string = "RptFichaTrabajador";

    let empleado: Empleado = {
      codEmpleado: codEmpleado
    };


    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(url, empleado, requestOptions)
      .pipe(map((response) => {
        return {
          filename: `${nombreReporte}_${codEmpleado}`,
          data: new Blob([response], { type: 'application/pdf' })
        };
      }));

  }


  /**
   * para obtener lugares de acuerdo a lo que escriba
   * @param query
   */
  obtenerLugares(query: string = '') : Observable<MapBoxLibre>{

    return this.http.get<MapBoxLibre>(`${this.urlMap}${query}${this.styleMap}`)
      .pipe(
        tap(resp => {
          if (!resp) {
            console.log(resp);
          }
        }),
        map(resp => resp),
        catchError(err => of(err.error))
      );
  }

}
