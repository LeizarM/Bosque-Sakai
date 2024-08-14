import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/auth/services/login.service';
import { Empresa } from 'src/app/protected/interfaces/Empresa';
import { RegistroResma } from 'src/app/protected/interfaces/RegistroResma';
import { TipoDano } from 'src/app/protected/interfaces/TipoDano';
import { MaterialMalEstadoService } from '../../services/materialMalEstado.service';

interface tempArticulo  {

  codArticulo: string;
  descripcion: string;
  articulo: string

}


@Component({
  selector: 'app-resmas-mal-estado',
  templateUrl: './registro-resma.component.html',
  styleUrls: ['./registro-resma.component.css']
})
export class RegistroResmaComponent implements OnInit {


  tipoDano: TipoDano[] = [];
  empresas: Empresa[] = [];
  registroResma : RegistroResma[] = [];
  articulos : RegistroResma[] = [];
  tempArticulo : tempArticulo[] = [];
  errorMessage: string = '';
  empresaSeleccionada: number = 0;
  numeroSeleccionado: number = 0;

  formResmaMalEstado: FormGroup = this.fb.group({ });

  constructor (
    private fb: FormBuilder,
    private materialMalEstado : MaterialMalEstadoService,
    private loginService: LoginService,
  ){
    this.inicializarFormulario();
  }

  ngOnInit() {
    this.cargarEmpresas();
    this.cargarTipoDano();
  }


  inicializarFormulario(): void {

    this.formResmaMalEstado = new FormGroup({

      // Definir los FormControl para los campos del formulario
      fecha: new FormControl(new Date(), [Validators.required]),
      totalPeso: new FormControl(0, [Validators.required, Validators.min(1)]),
      totalUSD: new FormControl(0, [Validators.required, Validators.min(1)]),
      obs: new FormControl(''),
      codEmpleado: new FormControl(this.getCodEmpleado, [Validators.required]),
      docNum: new FormControl(0,[Validators.required, Validators.minLength(1)]),
      audUsuario: this.fb.array([],[Validators.required, Validators.minLength(1)]),
      detalles: this.fb.array([],[Validators.required, Validators.minLength(1)])

    });

  }


  get detalles(): FormArray {

    return this.formResmaMalEstado.get('detalles') as FormArray;
  }


  lstFormDetMalEstadoRes(): FormArray {

    return this.formResmaMalEstado.get('detalles') as FormArray;
  }


  agregarFila(): void {
    const nuevaFila = this.fb.group({
      idTd: [0, Validators.required],
      articulo: ['', Validators.required],
      codArticulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      porcentajeDanado: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]],
      subTotalUSD: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      placa: ['', Validators.required],
      chofer: ['', Validators.required],
    });

    // Escuchar cambios en el dropdown de articulo
    nuevaFila.get('articulo')?.valueChanges.subscribe(codArticulo => {
      const articuloSeleccionado = this.tempArticulo.find(art => art.codArticulo === codArticulo);
      if (articuloSeleccionado) {
          nuevaFila.patchValue({
              codArticulo: articuloSeleccionado.codArticulo,
              descripcion: articuloSeleccionado.descripcion
          });
      }
    });

    console.log(this.formResmaMalEstado.value);

    this.detalles.push(nuevaFila);
  }

  /**
   * Cargara las empresas registradas
   */
  cargarEmpresas() {
    this.materialMalEstado.obtenerEmpresas().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error al cargar empresas:', error);
        this.errorMessage = 'No se pudieron cargar las empresas. Por favor, intente de nuevo más tarde.';
        // Aquí podrías también mostrar un mensaje de error al usuario, por ejemplo con un componente de toast
      }
    });
  }


  cargarTipoDano(){

    this.materialMalEstado.obtenerTiposDeDano().subscribe({
      next: (tipoDano) => {
        this.tipoDano = tipoDano;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error al cargar tipo de daño:', error);
        this.errorMessage = 'No se pudieron cargar los tipos de daño. Por favor, intente de nuevo más tarde.';
      }
    });

  }

  onEmpresaChange(event: any) {

    this.empresaSeleccionada = event.value;
    this.registroResma = [];
    this.articulos = [];
    this.materialMalEstado.obtenerDocNumXEmpresa( event.value ).subscribe({
      next: (registroResma) => {
        this.registroResma = registroResma;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error al Cargar los DocNums:', error);
        this.errorMessage = 'No se pudieron cargar los DocNums. Por favor, intente de nuevo más tarde.';
        // Aquí podrías también mostrar un mensaje de error al usuario, por ejemplo con un componente de toast
      }
    });
  }

  onDocNumChange(event: any) {
    this.numeroSeleccionado = event.value;
    this.tempArticulo = []; // Limpiar la lista antes de llenarla

    this.materialMalEstado.obtenerArticulosXDocNum(this.empresaSeleccionada, event.value).subscribe({
      next: (articulo) => {
        this.articulos = articulo;

        articulo.forEach(item => {
          this.tempArticulo.push({
            codArticulo: item.codArticulo,
            descripcion: item.descripcion,
            articulo: item.articulo
          });
        });

        console.log("el array: ", this.tempArticulo);
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error al Cargar los Articulo:', error);
        this.errorMessage = 'No se pudieron cargar los DocNums. Por favor, intente de nuevo más tarde.';
      }
    });
  }



  calcularSubTotal(index: number): void {
    const fila = this.detalles.at(index) as FormGroup;
    const porcentajeDanado = fila.get('porcentajeDanado')?.value || 0;
    const precioUnitario = fila.get('precioUnitario')?.value || 0;
    const cantidad = fila.get('cantidad')?.value || 0;
    const subTotal = (porcentajeDanado / 100) * precioUnitario * cantidad;

    fila.get('subTotalUSD')?.setValue(subTotal.toFixed(2));
  }


  /**
   * Elimina un item de la tabla
   * @param index
   */
  eliminarFila(index: number): void {
    this.detalles.removeAt(index);

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
