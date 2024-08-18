import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, concatMap, of, throwError } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { RegistroFacturas } from 'src/app/protected/interfaces/RegistroFacturas';
import { lstTipoFacturas, Tipos } from 'src/app/protected/interfaces/Tipos';
import { FacturaSantaCruzService } from '../../services/factura-santa-cruz.service';

@Component({
  selector: 'app-factura-santa-cruz',
  templateUrl: './factura-santa-cruz.component.html',
  styleUrls: ['./factura-santa-cruz.component.css']
})
export class FacturaSantaCruzComponent implements OnInit {

  lstTipoFactura: Tipos[] = [];
  lstEmpresas: RegistroFacturas[] = [];
  facturaForm!: FormGroup;

  mostrarCUF = true;
  mostrarAutorizacionControl = false;

  constructor( private registroFacturaService : FacturaSantaCruzService,
               private fb: FormBuilder,
               private loginService: LoginService,
  ) {

   }

  ngOnInit() {
    this.obtenerTipoFacturas();
    this.obtenerEmpresas();
    this.inicializarFormulario();
  }

  /**
   * Obtendra el tipo de facturas
   */
  obtenerTipoFacturas(){

    this.lstTipoFactura = lstTipoFacturas();

  }

  /**
   * Obtendra la lista de las empresas
   */
  obtenerEmpresas(){

    this.registroFacturaService.obtenerEmpresas().subscribe({
      next: (res) => {
        this.lstEmpresas = res;
      },
      error: (e) => {
        console.log(e);
      }
    });

  }


  inicializarFormulario() {
    this.facturaForm = this.fb.group({
      tipoFact: [0, Validators.required],
      empresa: [0, Validators.required],
      fecha: [new Date(), Validators.required],
      numFact: ['', Validators.required],
      proveedor: ['', Validators.required],
      nit: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      monto: ['', [Validators.required, Validators.min(1)]],
      descripcion: [''],  // Campo opcional
      cuf: [''],
      nroAutorizacion: [''],
      codControl: ['']
    });
  }

  /**
   * Método para manejar el submit del formulario
   */
  onSubmit() {
    if (this.facturaForm.valid) {


      const  { codControl, empresa, cuf, descripcion, fecha, monto, nit, nroAutorizacion, numFact, proveedor, tipoFact } = this.facturaForm.value;
      const  { codEmpresa , nitEmpresa } = empresa;

      const factura : RegistroFacturas  = {
        idTf: tipoFact,
        codEmpresa,
        fecha,
        numFact,
        proveedor,
        nit,
        monto,
        descripcion,
        cuf,
        nroAutorizacion,
        codControl,
        nitEmpresa,
        audUsuario: this.getUser(),

      };

      of(null).pipe(
        // Primero, registra el lote de producción
        concatMap(() => this.registroFacturaService.registrarRegistroFacturas(factura)),


        // Manejo de errores
        catchError((err) => {
          console.error(err);
          //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error durante el proceso de registro' });

          return throwError(() => new Error('Proceso de registro fallido'));
        })
      ).subscribe({
        complete: () => {
          //Mensaje de éxito después de que todos los procesos se han completado correctamente
          //this.messageService.add({ severity: 'success', summary: 'Completo', detail: 'Todos los registros se completaron con éxito' });
          //this.visible = false;
          this.inicializarFormulario();
          this.ngOnInit(); // Llamar a ngOnInit manualmente para reiniciar
        }
      });



    } else {
      // Marca todos los controles como tocados para mostrar errores
      this.facturaForm.markAllAsTouched();
    }
  }

  onTipoFacturaChange(tipoFact: number) {

    console.log(Number(tipoFact));

    if (Number(tipoFact) === 2) {
      this.mostrarCUF = false;
      this.mostrarAutorizacionControl = true;
      //this.facturaForm.get('cuf')?.disable();
      //this.facturaForm.get('nroAutorizacion')?.enable();
      //this.facturaForm.get('codControl')?.enable();
    } else if (Number(tipoFact) === 1) {
      this.mostrarCUF = true;
      this.mostrarAutorizacionControl = false;
      //this.facturaForm.get('cuf')?.enable();
      //this.facturaForm.get('nroAutorizacion')?.disable();
      //this.facturaForm.get('codControl')?.disable();
    }
  }


  /**
   * obtendra el codigo de usuario actual
   */
  getUser(): number {
    return this.loginService.codUsuario;
  }



}
