import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Empleado } from '../../interfaces/Empleado';
import { Persona } from '../../interfaces/Persona';
import { Email } from '../../interfaces/Email';
import { Telefono } from '../../interfaces/Telefono';
import { ExperienciaLaboral } from '../../interfaces/ExperienciaLaboral';
import { Formacion } from '../../interfaces/Formacion';
import { Licencia } from '../../interfaces/Licencia';
import { Ciudad } from '../../interfaces/Ciudad';
import { Zona } from '../../interfaces/Zona';
import { Sucursal } from '../../interfaces/Sucursal';
import { CargoSucursal } from '../../interfaces/CargoSucursal';
import { EmpleadoCargo } from '../../interfaces/EmpleadoCargo';
import { RelEmplEmpr } from '../../interfaces/RelEmpEmpr';
import { Lugares, Feature } from '../../interfaces/Lugares';


@Injectable({
  providedIn: 'root'
})
export class RrhhService {

  public isLoading: boolean = false;
  public lugares: Feature[] = [];

  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  /**
    * ===============================================
    * =============== PROCEDIMIENTOS ================
    * ===============================================
    */

  /**
   * Procedimiento que obtendra la lista de empleados
   * @returns List
   */
  obtenerListEmpleado(esActivo: number): Observable<Empleado[]> {

    const url = `${this.baseUrl}/rrhh/listEmpleados`;
    const emp: Empleado = {
      relEmpEmpr: {
        esActivo: esActivo
      }
    };

    return this.http.post<Empleado[]>(url, emp)
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

  /**
   * Procedimiento para obtener Detalle de empleados
   */

  obtenerDetalleEmpleado(codEmpleado: number): Observable<Empleado> {
    const url = `${this.baseUrl}/rrhh/detalleEmpleado`;
    const emp: Empleado = {
      codEmpleado: codEmpleado
    };

    return this.http.post<Empleado>(url, emp)
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
  /**
   * Procedimiento para obtener los datos personales de un empleado
   */
  obtenerDatosPersonales(codPersona: number): Observable<Persona> {
    const url = `${this.baseUrl}/rrhh/datosPersonales`;
    const per: Persona = {
      codPersona: codPersona
    };

    return this.http.post<Persona>(url, per)
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

  /**
   * Procedimiento para obtener los emails por persona
   */
  obtenerDatosEmail(codPersona: number): Observable<Email[]> {

    const url = `${this.baseUrl}/rrhh/emailPersona`;
    const email: Email = {
      codPersona: codPersona
    };

    return this.http.post<Email[]>(url, email)
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

  /**
   * Procedimiento para obtener lo telefonos por persona
   */
  obtenerDatosTelefono(codPersona: number): Observable<Telefono[]> {

    const url = `${this.baseUrl}/rrhh/telfPersona`;
    const telf: Telefono = {
      codPersona: codPersona
    };

    return this.http.post<Telefono[]>(url, telf)
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

  /**
   * Procedimiento para obtener la experiencia laboral por empleado
   * @param codEmpleado
   * @returns
   */
  obtenerExperienciaLaboral(codEmpleado: number): Observable<ExperienciaLaboral[]> {

    const url = `${this.baseUrl}/rrhh/expLabEmpleado`;
    const expLab: ExperienciaLaboral = {
      codEmpleado: codEmpleado
    };

    return this.http.post<ExperienciaLaboral[]>(url, expLab)
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
  /**
   * Obtendra la formacion de un empleado
   * @param codEmpleado
   * @returns
   */
  obtenerFormacion(codEmpleado: number): Observable<Formacion[]> {
    const url = `${this.baseUrl}/rrhh/formacionEmpleado`;
    const form: Formacion = {
      codEmpleado: codEmpleado
    };

    return this.http.post<Formacion[]>(url, form)
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

  /**
   * Procedimiento  para obtener la licencia de conducir de una persona
   * @param codPersona
   * @returns
   */
  obtenerLicencia(codPersona: number): Observable<Licencia[]> {
    const url = `${this.baseUrl}/rrhh/licenciaPersona`;
    const lic: Licencia = {
      codPersona: codPersona
    };

    return this.http.post<Licencia[]>(url, lic)
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



  /**
   * Obtendra las ciudades por pais
   * @param codPais
   * @returns
   */
  obtenerCiudadesXPais(codPais: number): Observable<Ciudad[]> {

    const url = `${this.baseUrl}/rrhh/ciudadxPais`;
    const ciu: Ciudad = {
      codPais: codPais
    };

    return this.http.post<Ciudad[]>(url, ciu)
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

  /**
   * Procedimiento para obtener las Zonas por ciudad
   * @param codCiudad
   * @returns
   */
  obtenerZonaxCiudad(codCiudad: number): Observable<Zona[]> {

    const url = `${this.baseUrl}/rrhh/zonas`;
    const zon: Ciudad = {
      codCiudad: codCiudad
    };

    return this.http.post<Zona[]>(url, zon)
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

  /**
   * Procedimiento para registrar o actualizar la informacion personal de un empleado
   * @param persona
   * @returns
   */
  registrarInfoPersona(persona: Persona): Observable<any> {

    const url = `${this.baseUrl}/rrhh/registroPersona`;

    return this.http.post<Persona>(url, persona)
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

  /**
   * Procedimiento para obtener las sucursales por Empresa
   * @param codEmpresa
   * @returns
   */
  obtenerSucursalesXEmpresa(codEmpresa: number): Observable<Sucursal[]> {

    const url = `${this.baseUrl}/rrhh/sucXEmpresa`;
    const suc: Sucursal = {
      codEmpresa: codEmpresa,
    };

    return this.http.post<Zona[]>(url, suc)
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

  /**
   * Procedimiento que obtendra los cargos por sucursal registrada
   * @param codSucursal
   * @returns
   */
  obtenerCargoXSucursal(codSucursal: number): Observable<CargoSucursal[]> {

    const url = `${this.baseUrl}/rrhh/cargoXSuc`;
    const cs: CargoSucursal = {
      codSucursal: codSucursal,
    };

    return this.http.post<Zona[]>(url, cs)
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

  /**
   * Procedimiento para registrar o actualizar la informacion  de un empleado
   * @param empleado
   * @returns
   */
  registrarInfoEmpleado(empleado: Empleado): Observable<Empleado> {
    console.log("en resgistrarInfoEmpleado servicio****** ", empleado);
    const url = `${this.baseUrl}/rrhh/registroEmpleado`;

    return this.http.post<Empleado>(url, empleado)
      .pipe(
        tap(resp => {
          if (!resp) {
            console.log(resp);
          }
        }),
        catchError(err => of(err.error))
      );

  }


  /**
   * Procedimiento para registro del Empleado Cargo
   * @param empleadoCargo
   * @returns
   */
  registrarInfoEmpleadoCargo(empleadoCargo: EmpleadoCargo): Observable<EmpleadoCargo> {

    const url = `${this.baseUrl}/rrhh/registroEmpleadoCargo`;

    return this.http.post<Empleado>(url, empleadoCargo)
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
  /**
   * Procedimiento para obtener las fechas beneficio por empleado
   * @param codEmpleado
   * @returns
   */
  obtenerFechasBeneficio(codEmpleado: number): Observable<RelEmplEmpr[]> {

    const url = `${this.baseUrl}/rrhh/fechasBeneficio`;
    const ree: RelEmplEmpr = {
      codEmpleado: codEmpleado
    };

    return this.http.post<RelEmplEmpr[]>(url, ree)
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

  /**
   * Procedimiento para registro de relacion con la empresa y el empleado
   * @param ree
   * @returns
   */
  registrarRelacionEmpleadoEmpresa(ree: RelEmplEmpr): Observable<RelEmplEmpr> {

    const url = `${this.baseUrl}/rrhh/registroRelEmp`;

    return this.http.post<RelEmplEmpr>(url, ree)
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
  /**
   * Procedimiento para registrar un Email por empleado
   * @param e
   * @returns
   */
  registrarEmail(e: Email): Observable<Email> {
    const url = `${this.baseUrl}/rrhh/registroEmail`;

    return this.http.post<Email>(url, e)
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

  /**
   * Procedimiento para eliminar un Email
   * @param e
   * @returns
   */
  eliminarEmail(e: Email): Observable<Email> {
    const url = `${this.baseUrl}/rrhh/eliminarEmail`;

    return this.http.post<Email>(url, e)
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

  /**
  * Procedimiento para registrar un Telefono por empleado
  * @param t
  * @returns
  */
  registrarTelefono(t: Telefono): Observable<Telefono> {
    const url = `${this.baseUrl}/rrhh/registroTelefono`;
    console.log("el telefono obj es ");
    console.log(t);
    return this.http.post<Telefono>(url, t)
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

  /**
   * Procedimiento para eliminar un Telefono
   * @param e
   * @returns
   */
  eliminarTelefono(e: Telefono): Observable<Telefono> {
    const url = `${this.baseUrl}/rrhh/eliminarTelefono`;

    return this.http.post<Telefono>(url, e)
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

  /**
  * Procedimiento para registrar la experiencia laboral de un empleado
  * @param expl
  * @returns
  */
  registrarExperienciaLaboral(expl: ExperienciaLaboral): Observable<ExperienciaLaboral> {
    const url = `${this.baseUrl}/rrhh/registrarExpLaboral`;

    return this.http.post<ExperienciaLaboral>(url, expl)
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

  /**
   * Procedimiento para registrar la formacion de un empleado
   * @param fr
   * @returns
   */
  registrarFormacion(fr: Formacion): Observable<any> {

    const url = `${this.baseUrl}/rrhh/registrarFormacion`;

    return this.http.post<Formacion>(url, fr)
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

  /**
 * Procedimiento para actualizar la licencia de conducir de un empleado
 * @param lc
 * @returns
 */
  registrarLicencia(lc: Licencia): Observable<Licencia> {
    const url = `${this.baseUrl}/rrhh/registrarLicencia`;

    return this.http.post<Licencia>(url, lc)
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

  /**
   * para la busqueda del mapa
   * @param query
   */
  buscarLugar(query: string = ""): Feature[] {

    this.isLoading = true;

    this.http.get<Lugares>(`https://nominatim.openstreetmap.org/search?q=${query}&format=geojson&polygon_geojson=1&addressdetails=1`).
      subscribe(resp => {
        this.isLoading = false;
        this.lugares = resp.features;
        console.log("En lugares del servicio");
      });
    return this.lugares;
  }
  /**
   * Obtendra el ulticmo codigo de un empleado agregado
   * @returns
   */
  obtenerUltimoCodigoEmpleado(): Observable<Empleado> {
    const url = `${this.baseUrl}/rrhh/ultimoCodEmpleado`;

    return this.http.post<Empleado>(url, {})
      .pipe(
        tap(resp => {
          if (!resp) {
            console.log(resp);
            resp = {};
          }
        }),
        map(resp => resp),
        catchError(err => of(err.error))
      );

  }

  /**
   * Obtendra el ulticmo codigo de un persona agregado
   * @returns
   */
   obtenerUltimoCodigoPersona(): Observable<Persona> {
    const url = `${this.baseUrl}/rrhh/ultimoCodPersona`;

    return this.http.post<Persona>(url, {})
      .pipe(
        tap(resp => {
          if (!resp) {
            console.log(resp);
            resp = {};
          }
        }),
        map(resp => resp),
        catchError(err => of(err.error))
      );

  }

}
