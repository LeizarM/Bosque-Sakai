import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Empresa } from '../../interfaces/Empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {



  private baseUrl: string = environment.baseUrl;
  constructor( private http: HttpClient  ) { }

  /**
    * ===========================================================
    * ======================== PROCEDIMIENTOS ===================
    * ============================================================
    */

   /**
    * Procedimiento para obtener las empresas registradas en la base de datos
    * @returns
    */
    obtenerEmpresas(): Observable<Empresa[]> {
      const url = `${this.baseUrl}/empresa/lstEmpresas`;

      return this.http.post<Empresa[]>(url, {})
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
