import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MaterialIngreso } from 'src/app/protected/interfaces/MaterialIngreso';
import * as uuid from 'uuid';
import { LoteProduccion } from '../../../interfaces/LoteProduccion';
import { MaterialSalida } from '../../../interfaces/MaterialSalida';
import { Merma } from '../../../interfaces/Merma';
import { LoteProduccionService } from '../../services/loteProduccion.service.ts.service';



@Component({
  selector: 'app-crear-lote-produccion',

  templateUrl: './crearLoteProduccion.component.html',

  styleUrls: ['./crearLoteProduccion.component.scss', './crearLoteProduccion.component.css'],

  providers: [MessageService],

})
export class CrearLoteProduccionComponent implements OnInit {


  cantHjsSalida: number = 0;
  visible: boolean = false;
  isTableDisabled : boolean = true;
  isTableDisabledSalida : boolean = true;

  articuloIngreso: LoteProduccion | undefined = {
    codArticulo: '',
    datoArt: '',
    articulo: ''
  }

  articuloSalida: LoteProduccion | undefined = {
    codArticulo: '',
    datoArt: '',
    articulo: ''
  }

  formLoteProduccion: FormGroup = this.fb.group({});


  registro: LoteProduccion = {

    numLote: 0,
    anio: 0,
    fecha: new Date(),
    hraInicioCorte: '',
    hraInicio: '',
    hraFin: '',
    cantBobinasIngresoTotal: 0,
    pesoKilosTotalIngreso: 0,
    pesoTotalSalida: 0,
    pesoPaletaSalida: 0,
    pesoMaterialSalida: 0,
    cantResmaSalida: 0,
    cantHojasSalida: 0,
    mermaTotal: 0,
    diferenciaProduccion: 0,
    obs: ''

  };

  registroIngreso: MaterialIngreso = {

    codArticulo: '',
    descripcion: '',
    pesoKilos: 0,
    balanza: 0,
    audUsuario: 0,
  }

  lstArticuloIngreso: LoteProduccion[] = [];
  lstArticuloSalida: LoteProduccion[] = [];
  lstArticuloMerma: LoteProduccion[] = [];
  lstArticuloMermaFilter: LoteProduccion[] = [];
  lstIngreso: MaterialIngreso[] = [];
  lstSalida: MaterialSalida[] = [];
  lstMerma: Merma[] = [];



  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private loteProduccionService: LoteProduccionService,

  ) {

    this.inicializarFormulario();

  }
  ngOnInit(): void {

    this.obtenerLoteProduccionNew();
    this.obtenerArticulos();

    //llenara la lista de ingreso de material por default
    this.llenarListaIngreso();
    //llenara la lista de salidas de material por default
    this.llenarListaSalida();
    //llenara la lista de merma por default
    this.llenarMerma();


  }


  /**
   * Para extraer el numero de hojas de un articulo usando regexp
   * @param cadena
   * @returns
   */
  extraerNumero(cadena: string): number {
    // Esta regex busca uno o más dígitos (\d+) seguidos por "HJS"
    const regex = /(\d+)\s*HJS/;
    const coincidencia = cadena.match(regex);

    // Si se encuentra una coincidencia y tiene un grupo de captura, parsear el primer grupo como un número
    return coincidencia ? parseInt(coincidencia[1], 10) : 0;
  }

  inicializarFormulario(): void {

    this.formLoteProduccion = new FormGroup({

      // Definir los FormControl para los campos del formulario
      numLote: new FormControl('', [Validators.required, Validators.minLength(3)]),
      fecha: new FormControl(new Date(), [Validators.required]),
      hraInicio: new FormControl('', [Validators.required, Validators.minLength(4)]),
      hraInicioCorte: new FormControl('', [Validators.required, Validators.minLength(4)]),
      hraFin: new FormControl('', [Validators.required, Validators.minLength(4)]),
      obs: new FormControl(''),

    });

  }

  /**
   * Para previsualizar el lote de produccion
   */
  previewLoteProduccion(): void {

    this.visible = true;
    const { numLote, anio, fecha, hraInicio, hraInicioCorte, hraFin, obs } = this.formLoteProduccion.value;

    this.registro = {
      numLote,
      anio,
      fecha,
      hraInicio,
      hraInicioCorte,
      hraFin,
      obs
    };


  }



  /**
   * Obtendra los datos limpios para un nuevo lote de Produccion
   */
  obtenerLoteProduccionNew(): void {

    this.loteProduccionService.obtenerLoteProduccionNew().subscribe({
      next: (resp) => {
        this.registro = resp[0];
        //this.formLoteProduccion.setValue(this.registro);--para setear todos los valores en el formulario con un objeto
        this.formLoteProduccion.setControl('numLote', new FormControl(this.registro.numLote));
        this.formLoteProduccion.setControl('anio', new FormControl(this.registro.anio));
      },
      error: (err) => {
        console.error('Error al obtener datos', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el lote de producción' });
      },
      complete() { }
    });
  }


  /**
   * Obtendra los articulos para cargar los
   */
  obtenerArticulos(): void {

    this.loteProduccionService.obtenerArticulos().subscribe({
      next: (resp) => {

        this.lstArticuloIngreso = [...resp];
        this.lstArticuloSalida = [...resp];

        this.lstArticuloMerma = [...resp];

      },
      error: (err) => {
        console.error('Error al obtener datos', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los articulos' });
      },
      //complete() { }
    });
  }

  /**
   * metodo para filtrar articulos
   * @param event
   */
  filtroMerma(event: any): void {

    console.log(this.lstArticuloMerma);

    let query = event.query;
    this.lstArticuloMermaFilter = this.lstArticuloMerma.filter(item => {
      const nombre = item.datoArt?.toLowerCase();
      return nombre?.includes(query);
    });


    console.log(this.lstArticuloMermaFilter);

  }


  onSelectMerma(product: any): void {


    this.lstMerma = this.lstMerma.map(item => {
      if (item.uuid === product.uuid) {
        return {
          ...item,
          codArticulo: product.datoArt.codArticulo,
          descripcion: product.datoArt.datoArt
        };
      }
      return item;
    });



  }

  /**
   * llegar tabla de ingreso por default 5 registros
   */
  llenarListaIngreso(): void {

    for (let i = 0; i < 5; i++) {
      this.lstIngreso.push(
        {

          uuid: uuid.v4(),
          codArticulo: '',
          descripcion: '',
          pesoKilos: 0,
          balanza: 0,
          audUsuario: 0,

        });
    }

  }

  /**
   * Eliminara un registro de la tabla ingreso
   */
  eliminarRegistroIngreso(uuid: string): void {

    const index = this.lstIngreso.findIndex(item => item.uuid === uuid);
    if (index >= 0) {
      this.lstIngreso.splice(index, 1);
    }


  }


  /**
   * Agregara un registro de la tabla de ingreso
   */
  agregarRegistroIngreso(): void {


    this.lstIngreso.unshift(
      {
        uuid: uuid.v4(),
        codArticulo: '',
        descripcion: '',
        pesoKilos: 0,
        balanza: 0,
        audUsuario: 0,

      });

  }

  /**
   * Obtendra y calculara el total de peso en kilos de la lista de ingresos
   */
  get totalIngresosKilos() {
    return this.lstIngreso.reduce((acc, item) => acc + Number(item.pesoKilos), 0);
  }



  /**
   * Para seleccionar un articulo de ingreso
   * @param event
   */
  seleccionarArticuloIngreso(event: string): void {

    this.articuloIngreso = this.lstArticuloIngreso.find(item => item.codArticulo === event);

    if( this.articuloIngreso?.codArticulo?.length! > 2){
      this.isTableDisabled = false;
    }

  }


  seleccionarArticuloSalida(event: string): void {

    this.articuloSalida = this.lstArticuloSalida.find(item => item.codArticulo === event);
    this.cantHjsSalida = this.extraerNumero(this.articuloSalida?.datoArt!);


    if( this.articuloSalida?.codArticulo?.length! > 2){
      this.isTableDisabledSalida = false;
    }

  }

  /**
   * Llenara la lista de material de salida por defaul
   */
  llenarListaSalida(): void {

    for (let i = 0; i < 5; i++) {
      this.lstSalida.push(
        {
          uuid: uuid.v4(),
          codArticulo: '',
          descripcion: '',
          nroPaleta: 0,
          pesoResma: 0,
          pesoPaleta: 0,
          pesoMaterial: 0,
          cantidadResma: 0,
          cantidadHojas: 0,
          audUsuario: 0
        }
      );
    }
  }

  /**
   * Llenara la lista de merma de salida por default
   */
  llenarMerma(): void {

    for (let i = 0; i < 4; i++) {
      this.lstMerma.push(
        {
          uuid: uuid.v4(),
          codArticulo: '',
          descripcion: '',
          peso: 0,
          audUsuario: 0,


        }
      );
    }

  }

  /**
   * Para agregar una lista de mermas mas articulos
   */
  agregarRegistroMerma(): void {


    this.lstMerma.unshift(
      {
        uuid: uuid.v4(),
        codArticulo: '',
        descripcion: '',
        peso: 0,
        audUsuario: 0,
      }
    );
  }

  /**
   * Eliminara un registro de la tabla merma
   */
  eliminarRegistroMerma(uuid: string): void {

    const index = this.lstMerma.findIndex(item => item.uuid === uuid);
    if (index >= 0) {
      this.lstMerma.splice(index, 1);
    }

  }

  /**
   * Para agregar una nueva fila o registro a la tabla de material de salida
   */
  agregarRegistroSalida(): void {


    this.lstSalida.unshift(
      {
        uuid: uuid.v4(),
        codArticulo: '',
        descripcion: '',
        nroPaleta: 0,
        pesoResma: 0,
        pesoPaleta: 0,
        pesoMaterial: 0,
        cantidadResma: 0,
        cantidadHojas: 0,
        audUsuario: 0
      });

  }

  /**
   * Para eliminar un registro de la lista de salida
   * @param uuid
   */
  eliminarRegistroSalida(uuid: string): void {

    const index = this.lstSalida.findIndex(item => item.uuid === uuid);
    if (index >= 0) {
      this.lstSalida.splice(index, 1);
    }

  }


  /**
   * para calcular el total de resma en la tabla
   */
  get totalPesoResma() {
    return this.lstSalida.reduce((acc, item) => acc + Number(item.pesoResma), 0);
  }

  /**
   * para calcular el total de peso de paletas en la tabla
   */
  get totalPesoPaleta() {
    return this.lstSalida.reduce((acc, item) => acc + Number(item.pesoPaleta), 0);
  }

  /**
   * para calcular el  total del material en la tabla
   */
  get totalPesoMaterial() {
    return this.lstSalida.reduce((acc, item) => acc + Number(item.pesoResma! - item.pesoPaleta!), 0);
  }

  /**
   * para calcular la cantidad total de resma en la tabla
   */
  get totalCantidadResma() {
    return this.lstSalida.reduce((acc, item) => acc + Number(item.cantidadResma), 0);
  }

  /**
   * Calculara el total de hojas en la tabla
   */
  get totalCantidadHojas() {
    return this.lstSalida.reduce((acc, item) => acc + Number(item.cantidadHojas), 0) / this.cantHjsSalida;
  }

  /**
   * Total de la diferencia entre total cantidad de resma menos el total de cantidad de hojas
   */
  get totalDifCantResmaCantHojas() {
    return this.totalCantidadResma + this.totalCantidadHojas;
  }
  /**
   * Total del peso de las mermas
   */
  get totalMerma() {
    return this.lstMerma.reduce((acc, item) => acc + Number(item.peso), 0)
  }
  /**
   * Devolera true or false en caso de que la lista sea invalida  -
   */
  get validarListMerma(): boolean {
    return this.lstMerma.length > 0;
  }

  /**
   * Calculara la diferencia de produccion total
   */
  get calcularDifProduccion(): number {
    return this.totalIngresosKilos - (this.totalPesoMaterial + this.totalMerma);
  }

  getTableStyle() {
    return this.isTableDisabled ? { 'pointer-events': 'none', 'opacity': '0.5' } : {};
  }

  getTableStyleSalida() {
    return this.isTableDisabledSalida ? { 'pointer-events': 'none', 'opacity': '0.5' } : {};
  }

}
