import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vista } from 'src/app/protected/interfaces/Vista';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VistaService {

  private baseUrl: string = environment.baseUrl;


  constructor( private http: HttpClient ) { }

  /**
   * Procedimiento para obener el menu dinamico por usuario
   */
  obtenerMenuDinamico(codUsuario: number): Observable<Vista[]> {
    const url = `${this.baseUrl}/view/vistaDinamica`;

    const data = { codUsuario: codUsuario };

    return this.http.post<Vista[]>(url, data).pipe(
      catchError((e) => {
        if (e.status === 401) {
          console.error('Error de autorización:', e.error.error);
        } else if (!e.ok) {
          console.error('Error:', e.error.error);
        } else {
          console.error('Error desconocido:', e.error.error);
        }
        return of([]); // Proporciona un valor predeterminado en lugar de propagar el error
      })
    );
  }


}
