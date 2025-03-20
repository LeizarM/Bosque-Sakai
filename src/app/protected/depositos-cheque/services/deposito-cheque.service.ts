import { DepositoCheque } from 'src/app/protected/interfaces/DepositoCheque';
import { NotaRemision } from 'src/app/protected/interfaces/NotaRemision';
// services/deposito-cheque.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../interfaces/ApiResponse';
import { Empresa } from '../../interfaces/Empresa';
import { SocioNegocio } from '../../interfaces/SocioNegocio';
import { BancoXCuenta } from '../../interfaces/BancoXCuenta';



@Injectable({
    providedIn: 'root'
})
export class DepositoChequeService {
    private baseUrl: string = environment.baseUrl;
    private endpoint: string = '/deposito-cheque';
    private timeoutMs: number = 5000;
    private maxRetries: number = 3;

    constructor(private http: HttpClient) { }

    /**
     * Registra un nuevo depósito de cheque
     * @param depositoCheque Datos del depósito a registrar
     */
    registrarDepositoCheque(depositoCheque: DepositoCheque, file?: File): Observable<ApiResponse<void>> {
        const url = `${this.baseUrl}${this.endpoint}/registro`;
        
        const formData = new FormData();
        
        // Si hay un archivo, lo agregamos. Si no, enviamos un archivo vacío
        if (file && file.size > 0) {
            formData.append('file', file);
        } else {
            // Crear un archivo vacío con un contenido mínimo
            const emptyBlob = new Blob([''], { type: 'text/plain' });
            formData.append('file', emptyBlob, 'empty.txt');
        }
        
        formData.append('depositoCheque', JSON.stringify(depositoCheque));
        
        return this.http.post<ApiResponse<void>>(url, formData)
            .pipe(
                retry(2),
                timeout(this.timeoutMs),
                catchError(this.handleError)
            );
    }


    /**
     * Para registrar una nueva nota de remisión
     * @param notaRemision 
     * @returns 
     */
    registroNotaRemision( notaRemision : NotaRemision): Observable<ApiResponse<void>> {
        const url = `${this.baseUrl}${this.endpoint}/registrar-nota-remision`;
        
        return this.http.post<ApiResponse<void>>(url, notaRemision)
            .pipe(
                retry(2),
                timeout(this.timeoutMs),
                catchError(this.handleError)
            );
    }


    updateTransaccionNum( deposito : DepositoCheque): Observable<ApiResponse<void>> {
        const url = `${this.baseUrl}${this.endpoint}/registrar-nroTransaccion`;
        
        return this.http.post<ApiResponse<void>>(url, deposito)
            .pipe(
                retry(2),
                timeout(this.timeoutMs),
                catchError(this.handleError)
            );
    }


    rechazarDeposito( deposito : DepositoCheque): Observable<ApiResponse<void>> {
        const url = `${this.baseUrl}${this.endpoint}/rechazar-deposito`;
        return this.http.post<ApiResponse<void>>(url, deposito)
        .pipe(
            retry(2),
            timeout(this.timeoutMs),
            catchError(this.handleError)
        );
    }

    /**
     * Obtiene la imagen de un depósito
     */
    obtenerImagen(idDeposito: number): Observable<Blob> {
        const url = `${this.baseUrl}${this.endpoint}/imagen/${idDeposito}`;
        return this.http.get(url, { responseType: 'blob' })
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Obtiene la lista de empresas
     */
    obtenerEmpresas(): Observable<ApiResponse<Empresa[]>> {
        const url = `${this.baseUrl}${this.endpoint}/lst-empresas`;
        
        return this.http.post<ApiResponse<Empresa[]>>(url, {})
            .pipe(
                retry(this.maxRetries),
                timeout(this.timeoutMs),
                catchError(this.handleError)
            );
    }


    /**
     * Obtendra la lista de boncos
     * @returns 
     */
    obtenerBancos(  codEmpresa : number  ): Observable<ApiResponse<BancoXCuenta[]>> {
      const url = `${this.baseUrl}${this.endpoint}/lst-banco`;
      const data = { codEmpresa } as BancoXCuenta;
      return this.http.post<ApiResponse<BancoXCuenta[]>>(url, data)
          .pipe(
              timeout(this.timeoutMs),
              catchError(this.handleError)
          );
  }
    /**
     * Obtiene los socios de negocio por empresa
     * @param codEmpresa Código de la empresa
     */
    obtenerSociosNegocio(codEmpresa: number): Observable<ApiResponse<SocioNegocio[]>> {
        const url = `${this.baseUrl}${this.endpoint}/lst-socios-negocio`;
        const data = { codEmpresa } as DepositoCheque;

        return this.http.post<ApiResponse<SocioNegocio[]>>(url, data)
            .pipe(
                retry(this.maxRetries),
                timeout(this.timeoutMs),
                catchError(this.handleError)
            );
    }


    /**
     * Obtiene la lista de depósitos
     */
    obtenerDepositos( idBxC: number, fechaInicio: Date, fechaFin: Date, codCliente: string ): Observable<ApiResponse<DepositoCheque[]>> {
        
        const deposito : DepositoCheque = {
            idBxC,
            fechaInicio,
            fechaFin,
            codCliente
        }

        
        const url = `${this.baseUrl}${this.endpoint}/listar`;
        return this.http.post<ApiResponse<DepositoCheque[]>>(url, deposito)
            .pipe(
                timeout(this.timeoutMs),
                catchError(this.handleError)
            );
    }


    /**
     * Obtiene la lista de depósitos por identificar
     * @param idBxC 
     * @param fechaInicio 
     * @param fechaFin 
     * @param codCliente 
     * @returns 
     */
    obtenerDepositosXIdentificar( idBxC: number, fechaInicio: Date, fechaFin: Date, codCliente: string ): Observable<ApiResponse<DepositoCheque[]>> {
        
        const deposito : DepositoCheque = {
            idBxC,
            fechaInicio,
            fechaFin,
            codCliente
        }

        
        const url = `${this.baseUrl}${this.endpoint}/listar-dep-identificar`;
        return this.http.post<ApiResponse<DepositoCheque[]>>(url, deposito)
            .pipe(
                timeout(this.timeoutMs),
                catchError(this.handleError)
            );
    }

    /**
     * Descarga la imagen del depósito
     */
    descargarImagen(idDeposito: number): Observable<Blob> {
        const url = `${this.baseUrl}${this.endpoint}/descargar/${idDeposito}`;
        return this.http.get(url, { responseType: 'blob' })
            .pipe(
                catchError(this.handleError)
            );
    }


    descargarPdf(deposito: DepositoCheque): Observable<Blob> {
        const url = `${this.baseUrl}${this.endpoint}/pdf/${deposito.idDeposito}`;
        return this.http.post(url, deposito, { 
            responseType: 'blob'
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Obtiene la lista de documentos disponibles para un cliente
     * @param codEmpresa Código de empresa
     * @param codCliente Código de cliente
     */
    obtenerDocumentosPorCliente(codEmpresa: number, codCliente: string): Observable<ApiResponse<NotaRemision[]>> {
        const url = `${this.baseUrl}${this.endpoint}/lst-notaRemision`;
        const data = { 
            'codEmpresaBosque':codEmpresa
            ,codCliente 
        } as NotaRemision;
        return this.http.post<ApiResponse<NotaRemision[]>>(url, data )
            .pipe(
                timeout(this.timeoutMs),
                catchError(this.handleError)
            );
    }

    

    // Método para actualizar el cliente y detalles de un depósito
    actualizarClienteDeposito(datos: { 
        idDeposito: number, 
        codCliente: string | number,
        importe?: number,
        aCuenta?: number
    }): Observable<ApiResponse<void>> {
        // Cambiamos a un endpoint específico para actualización y usamos POST en lugar de PUT
        const url = `${this.baseUrl}${this.endpoint}/registro`;
        return this.http.post<ApiResponse<void>>(url, datos)
            .pipe(
                retry(2),
                timeout(this.timeoutMs),
                catchError(this.handleError)
            );
    }

    /**
     * Manejo centralizado de errores
     */
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ha ocurrido un error desconocido';

        if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = `Error del cliente: ${error.error.message}`;
        } else {
            // Error del servidor
            if (error.error && error.error.message) {
                errorMessage = error.error.message;
            } else {
                switch (error.status) {
                    case 400:
                        errorMessage = 'Solicitud incorrecta';
                        break;
                    case 401:
                        errorMessage = 'No autorizado';
                        break;
                    case 403:
                        errorMessage = 'Acceso denegado';
                        break;
                    case 404:
                        errorMessage = 'Recurso no encontrado';
                        break;
                    case 408:
                        errorMessage = 'Tiempo de espera agotado';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor';
                        break;
                    default:
                        errorMessage = `Error ${error.status}: ${error.statusText}`;
                }
            }
        }

        console.error('Error en DepositoChequeService:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}