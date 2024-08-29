import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { catchError, concatMap, of, Subscription, throwError } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { Empresa } from 'src/app/protected/interfaces/Empresa';
import { RegistroDanoBobina } from 'src/app/protected/interfaces/RegistroDanoBobina';
import { RegistroDanoBobinaDetalle } from 'src/app/protected/interfaces/RegistroDanoBobinaDetalle';
import { TipoDano } from 'src/app/protected/interfaces/TipoDano';
import { MaterialMalEstadoService } from '../../services/materialMalEstado.service';

@Component({
  selector: 'app-registro-bobina',
  templateUrl: './registro-bobina.component.html',
  styleUrls: ['./registro-bobina.component.css'],
  providers: [MessageService]
})
export class RegistroBobinaComponent implements OnInit, OnDestroy {
  formBobinaMalEstado: FormGroup;
  empresas: Empresa[] = [];
  empresaSeleccionada: number = 0;
  numeroSeleccionado: number = 0;
  registroDanoBobina: RegistroDanoBobina[] = [];
  tipoDano: TipoDano[] = [];
  articulos: RegistroDanoBobina[] = [];
  tempArticulo: any[] = [];

  totalKilosBobinas: number = 0;
  totalKilosDanados: number = 0;
  totalKilosDanadosReal: number = 0;
  totalUSD: number = 0;
  private subscriptions: Subscription[] = [];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private materialMalEstado: MaterialMalEstadoService,
    private loginService: LoginService,
    private messageService: MessageService
  ) {
    this.formBobinaMalEstado = this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private inicializarFormulario(): FormGroup {
    return this.fb.group({
      fecha: new FormControl(new Date(), [Validators.required]),
      codEmpleado: new FormControl(this.getCodEmpleado()),
      totalKilosBobinas: new FormControl(0, [Validators.required]),
      totalKilosDanados: new FormControl(0, [Validators.required]),
      totalKilosDanadosReal: new FormControl(0, [Validators.required]),
      totalUSD: new FormControl(0, [Validators.required]),
      obs: new FormControl(''),
      docNum: new FormControl(0, [Validators.required]),
      audUsuario: new FormControl(this.getUser()),
      detalles: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  get detalles(): FormArray {
    return this.formBobinaMalEstado.get('detalles') as FormArray;
  }

  private cargarDatosIniciales(): void {
    this.cargarEmpresas();
    this.cargarTipoDano();
  }

  private cargarEmpresas(): void {
    const sub = this.materialMalEstado.obtenerEmpresas().subscribe({
      next: (empresas) => this.empresas = empresas,
      error: (error) => this.manejarError('No se pudieron cargar las empresas.', error)
    });
    this.subscriptions.push(sub);
  }

  private cargarTipoDano(): void {
    const sub = this.materialMalEstado.obtenerTiposDeDano().subscribe({
      next: (tipoDano) => this.tipoDano = tipoDano,
      error: (error) => this.manejarError('No se pudieron cargar los tipos de daño.', error)
    });
    this.subscriptions.push(sub);
  }

  onEmpresaChange(event: any): void {
    this.empresaSeleccionada = event.value;
    this.limpiarDatosDocumentoYArticulos();

    const sub = this.materialMalEstado.obtenerDocNumXEmpresaBob(event.value).subscribe({
      next: (registroDBob) => this.registroDanoBobina = registroDBob,
      error: (error) => this.manejarError('No se pudieron cargar los documentos para esta empresa.', error)
    });
    this.subscriptions.push(sub);
  }

  onDocNumChange(event: any): void {
    this.numeroSeleccionado = event.value;
    this.tempArticulo = []; // Limpiar la lista de artículos

    const sub = this.materialMalEstado.obtenerArticulosXDocNumBob(this.empresaSeleccionada, event.value).subscribe({
      next: (articulos) => this.procesarArticulos(articulos),
      error: (error) => this.manejarError('No se pudieron cargar los artículos para el documento.', error)
    });
    this.subscriptions.push(sub);
  }

  private procesarArticulos(articulos: RegistroDanoBobina[]): void {
    this.articulos = articulos;
    this.tempArticulo = articulos.map(item => ({
      codArticulo: item.codArticulo,
      descripcion: item.descripcion,
      articulo: item.articulo
    }));
  }

  agregarFila(): void {
    const nuevaFila = this.fb.group({
      idTd: [0, Validators.required],
      articulo: ['', Validators.required],
      codArticulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      pesoBobina: [0, Validators.required],
      diametro: [0, Validators.required],
      cmDanado: [0, Validators.required],
      ancho: [0, Validators.required],
      cca: [0, Validators.required],
      ccb: [0, Validators.required],
      kilosDanadosReal: [0, Validators.required],
      ccc: [0, Validators.required],
      kilosDanados: [0, Validators.required],
      precioUnitario: [0, Validators.required],
      subTotalUsd: [0, Validators.required],
      numImportacion: [''],
      placa: ['', Validators.required],
      chofer: ['', Validators.required],
      audUsuario: this.getUser()
    });

    nuevaFila.get('articulo')?.valueChanges.subscribe(codArticulo => {
      const articuloSeleccionado = this.tempArticulo.find(art => art.codArticulo === codArticulo);
      if (articuloSeleccionado) {
          nuevaFila.patchValue({
              codArticulo: articuloSeleccionado.codArticulo,
              descripcion: articuloSeleccionado.descripcion
          });
      }
    });

    // Escuchar cambios en los inputs relacionados para recalcular valores
    this.escucharCambios(nuevaFila);
    this.detalles.push(nuevaFila);
  }

  private escucharCambios(fila: FormGroup): void {
    const camposAObservar = ['pesoBobina', 'diametro', 'cmDanado', 'ancho', 'precioUnitario'];

    camposAObservar.forEach(campo => {
      const sub = fila.get(campo)?.valueChanges.subscribe(() => {
        this.recalcularValores(fila);
        this.recalcularTotalesGenerales();
      });
      this.subscriptions.push(sub!);
    });
  }

  private recalcularValores(fila: FormGroup): void {
    const pesoBobina = fila.get('pesoBobina')?.value || 0;
    const diametro = fila.get('diametro')?.value || 0;
    const cmDanado = fila.get('cmDanado')?.value || 0;
    const ancho = fila.get('ancho')?.value || 0;
    const precioUnitario = fila.get('precioUnitario')?.value || 0;

    // Fórmulas de cálculo
    const cca = Math.round((Math.PI * Math.pow(diametro / 2, 2) * ancho) / 100 * 100) / 100;
    const ccb = Math.round((Math.PI * Math.pow((diametro - cmDanado) / 2, 2) * ancho) / 100 * 100) / 100;
    const kilosDanadosReal = Math.round((pesoBobina - (ccb * pesoBobina) / cca) * 100) / 100;

    fila.patchValue({ cca, ccb, kilosDanadosReal });

    // Calcular el total de kilos dañados reales en todas las filas
    const totalKilosDanadosReal = this.detalles.controls.reduce((total, grupo) => {
      const kilosDanadosReal = grupo.get('kilosDanadosReal')?.value || 0;
      return total + kilosDanadosReal;
    }, 0);

    // Cálculo del porcentaje y subTotal
    const ccc = Math.round((kilosDanadosReal * 100) / totalKilosDanadosReal * 100) / 100;
    const kilosDanados = Math.round((totalKilosDanadosReal * ccc) / 100 * 100) / 100;
    const subTotalUsd = Math.round(kilosDanados * precioUnitario * 100) / 100;

    fila.patchValue({ ccc, kilosDanados, subTotalUsd });
  }

  private recalcularTotalesGenerales(): void {
    this.totalKilosBobinas = this.detalles.controls.reduce((total, grupo) => total + (grupo.get('pesoBobina')?.value || 0), 0);
    this.totalKilosDanados = this.detalles.controls.reduce((total, grupo) => total + (grupo.get('kilosDanados')?.value || 0), 0);
    this.totalKilosDanadosReal = this.detalles.controls.reduce((total, grupo) => total + (grupo.get('kilosDanadosReal')?.value || 0), 0);
    this.totalUSD = this.detalles.controls.reduce((total, grupo) => total + (grupo.get('subTotalUsd')?.value || 0), 0);

    // Actualizar los valores en el formulario
    this.formBobinaMalEstado.patchValue({
      totalKilosBobinas: this.totalKilosBobinas,
      totalKilosDanados: this.totalKilosDanados,
      totalKilosDanadosReal: this.totalKilosDanadosReal,
      totalUSD: this.totalUSD
    });
  }

  eliminarFila(index: number): void {
    this.detalles.removeAt(index);
    this.recalcularTotalesGenerales();
  }

  private limpiarDatosDocumentoYArticulos(): void {
    this.registroDanoBobina = [];
    this.articulos = [];
    this.tempArticulo = [];
  }

  private manejarError(mensaje: string, error: any): void {
    console.error(mensaje, error);
    this.errorMessage = mensaje;
    // Aquí podrías también mostrar un mensaje de error al usuario con un componente de toast
  }

  guardarFormulario(): void {

    if (this.formBobinaMalEstado.invalid) {
      return; // No hacer nada si el formulario es inválido
    }

    const regDetalles : RegistroDanoBobinaDetalle[] = [];

    const { fecha,  docNum, obs } = this.formBobinaMalEstado.value;
    const detalles = this.detalles.value; // Obtener el array de detalles

    // Ahora puedes enviar estos valores a tu servicio para guardarlos
    const dataToSave : RegistroDanoBobina = {
      fecha,
      codEmpleado: this.getCodEmpleado(),
      totalKilosBobinas : this.totalKilosBobinas,
      totalKilosDanados : this.totalKilosDanados,
      totalKilosDanadosReal : this.totalKilosDanadosReal,
      totalUsd: this.totalUSD,
      docNum,
      obs,
      codEmpresa: this.empresaSeleccionada,
      audUsuario: this.getUser()
    };

    detalles.forEach((detalle : RegistroDanoBobinaDetalle) => {
      const regDetalle: RegistroDanoBobinaDetalle = {
        idTd: detalle.idTd,
        codArticulo: detalle.codArticulo,
        descripcion: detalle.descripcion,
        pesoBobina: detalle.pesoBobina,
        diametro: detalle.diametro,
        cmDanado: detalle.cmDanado,
        ancho: detalle.ancho,
        cca: detalle.cca,
        ccb: detalle.ccb,
        kilosDanadosReal: detalle.kilosDanadosReal,
        ccc: detalle.ccc,
        kilosDanados: detalle.kilosDanados,
        precioUnitario : detalle.precioUnitario,
        subTotalUsd: detalle.subTotalUsd,
        numImportacion: detalle.numImportacion,
        placa: detalle.placa,
        chofer: detalle.chofer,
        audUsuario: this.getUser()
      };
      regDetalles.push(regDetalle);
    });


    of(null).pipe(
      // Primero, registra el lote de producción
      concatMap(() => this.materialMalEstado.registrarBobinaMalEstado(dataToSave)),

      // Luego, registra todos los materiales de ingreso
      concatMap(() => this.materialMalEstado.registrarBobinaMalEstadoDet(regDetalles)),

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

        // Reiniciar el formulario y los detalles a su estado inicial
        this.inicializarFormulario();
        this.detalles.clear();
        this.tempArticulo = [];
        this.cargarDatosIniciales();
        this.recalcularTotalesGenerales();

        // Recargar datos iniciales
        this.cargarDatosIniciales();
      }
    });

    setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }

  private getUser(): number {
    return this.loginService.codUsuario;
  }

  private getCodEmpleado(): number {
    return this.loginService.codEmpleado;
  }
}
