import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, concatMap, of, throwError } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { DetalleResmado } from 'src/app/protected/interfaces/DetalleResmado';
import { GrupoProduccion } from 'src/app/protected/interfaces/GrupoProduccion';
import { LoteProduccion } from 'src/app/protected/interfaces/LoteProduccion';
import { Resmado } from 'src/app/protected/interfaces/Resmado';
import { LoteProduccionService } from '../../services/loteProduccion.service.ts.service';


@Component({
  selector: 'app-resmado',
  templateUrl: './resmado.component.html',
  styleUrls: ['./resmado.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class ResmadoComponent implements OnInit {

  visible: boolean = false;

  messages: Message[] = [];

  @ViewChild('dt2') dt2!: Table;

  formResmado: FormGroup = this.fb.group({ });

  lstArticulo: LoteProduccion[] = [];
  lstArticuloFilter : LoteProduccion [] = [];
  lstGrupoProd : GrupoProduccion[] = [];
  lstDetResmado : DetalleResmado[] = [];

  selectedProducts: LoteProduccion[] = [];

  constructor(

    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loteProduccionService : LoteProduccionService,
    private loginService: LoginService,

  ) {

    this.inicializarFormulario();
  }

  ngOnInit() {

    this.obtenerArticulos();
    this.obtenerGrupoProduccion();

  }

  /**
   * Para obtener los articulos en gral.
   */
  obtenerArticulos(): void {

    this.loteProduccionService.obtenerArticulos().subscribe({
      next: (resp) => {

        this.lstArticulo = [...resp];

      },
      error: (err) => {
        console.error('Error al obtener datos', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los articulos' });
      },
      //complete() { }
    });
  }

  /**
   * Para ontener los grupos de produccion
   */
  obtenerGrupoProduccion():void {

    this.loteProduccionService.obtenerGrupoProduccion().subscribe({

      next: (resp) => {
        this.lstGrupoProd = [...resp];
      },
      error:( err ) =>{

        console.error('Error al obtener datos de grupo', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los Grupos de Produccion' });

      }

    });

  }


  inicializarFormulario(): void {

    this.formResmado = new FormGroup({

      // Definir los FormControl para los campos del formulario
      idGrupo: new FormControl(1, [ Validators.required ]),
      fecha: new FormControl(new Date(), [Validators.required]),
      codEmpleado: new FormControl(this.getCodEmpleado, [Validators.required]),
      total: new FormControl(1, [Validators.required, Validators.min(1)]),
      hraInicio: new FormControl('',[Validators.required, Validators.minLength(1)]),
      hraFin: new FormControl('',[Validators.required, Validators.minLength(1)]),
      detalles: this.fb.array([],[Validators.required, Validators.minLength(1)])
    });

  }


  get detalles(): FormArray {

    return this.formResmado.get('detalles') as FormArray;
  }

  lstFormDetResmado(): FormArray {
    this.formResmado.setControl('total', new FormControl( this.getTotal() ));
    return this.formResmado.get('detalles') as FormArray;
  }


  /**
   * Elimina un item de la tabla
   * @param index
   */
  eliminarFila(index: number): void {
    this.detalles.removeAt(index);

  }

  /**
   * Para flitrar contenido, en este caso los articulos
   * @param $event
   */
  filtarArticulos($event: InputEvent, stringVal: string) {
    this.dt2!.filterGlobal(
      ($event.target as HTMLInputElement).value, stringVal
    );
  }

  /**
   * Para mostrar el dialog
   */
  showDialog() {
    this.visible = true;
  }

  /**
   * para seleccionar articulos de la tabla
   */
  seleccionarArticulos() : void {
    //agregar al formArray

    this.selectedProducts.forEach( (objeto: LoteProduccion) => {
      const existeArticulo = this.detalles.controls.some( control => control && control.get('codArticulo')?.value === objeto.codArticulo );
      if (existeArticulo) {

        this.messages = [
          { severity: 'error', summary: 'Error', detail: 'El Articulo ' + objeto.articulo +' ya se encuentra agregado en la tabla o formulario'}
        ];

        setTimeout(() => {
          this.messages = [];
        }, 5000);

      } else {
        this.detalles.push(this.fb.group({
          codArticulo: [objeto.codArticulo, Validators.required],
          descripcion: [objeto.datoArt, Validators.required],
          cantResma: [1, [Validators.required, Validators.min(1)]],
          audUsuario: [this.getUser(), Validators.required]
        }));


      }
    });

    this.visible = false;
    this.dt2.reset();
    this.selectedProducts = [];
  }


  /**
   * Para confirmar el envio del lote de produccion
   */
  confirmarLoteProduccion(): void {

    this.confirmationService.confirm({
      message: 'Esta seguro de Enviar el Resmado?',
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:'Si',
      rejectLabel:'No',
      accept: () => {
          this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Usted confirmo el envio' });
          this.enviarFormulario();
      },
      reject: (type: any) => {
          switch (type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Usted No confirmo el envio' });
                  break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Usted a cancelado el envio' });
                  break;
          }
      }
    });

  }

  /**
   * Para enviar el formulario
   */
  enviarFormulario():void{

    if (!this.formResmado.valid) {
       return;
    }

    const  {  idGrupo, fecha, total, hraInicio, hraFin ,detalles  } = this.formResmado.value;

    const regResmado : Resmado = {

      idGrupo,
      fecha,
      codEmpleado : this.getCodEmpleado(),
      total,
      hraInicio,
      hraFin,
      audUsuario : this.getUser()

    };

    const lstDetalles : DetalleResmado[] = detalles;

    of(null).pipe(
      // Primero, registra el lote de producción
      concatMap(() => this.loteProduccionService.registrarResmado( regResmado )),

      // Luego, registra todos los materiales de ingreso
      concatMap(() => this.loteProduccionService.registroDetalleResmado( lstDetalles )),

      // Manejo de errores
      catchError((err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error durante el proceso de registro' });
        return throwError(() => new Error('Proceso de registro fallido'));
      })
    ).subscribe({
      complete: () => {
        // Mensaje de éxito después de que todos los procesos se han completado correctamente
        this.messageService.add({ severity: 'success', summary: 'Completo', detail: 'Todos los registros se completaron con éxito' });
        this.formResmado.setControl('total', new FormControl( this.getTotal() ));
        this.inicializarFormulario();
        this.ngOnInit(); // Llamar a ngOnInit manualmente para reiniciar
      }
    });




  }


  /**
   * Regresara el total de resmas agregados
   * @returns
   */
  getTotal() : number {

    if (!this.detalles) {
      return 0; // or some other default value
    }
    return this.detalles.controls.reduce((acc, control) => {
      const cantResmaControl = control.get('cantResma');
      return acc + (cantResmaControl ? cantResmaControl.value : 0);
    }, 0);


  }


  /**
   * obtendra el codigo de usuario actual
   */
  getUser(): number {
    return this.loginService.codUsuario;
  }


  /**
   * obtendra el codigo de empleado actual
   */
  getCodEmpleado(): number {
    return this.loginService.codEmpleado;
  }

}
