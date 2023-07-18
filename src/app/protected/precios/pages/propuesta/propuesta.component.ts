import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription, concatMap, from } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { ArticuloPropuesto } from 'src/app/protected/interfaces/ArticuloPropuesto';
import { CostoIncre } from 'src/app/protected/interfaces/CostoIncre';
import { Precio } from 'src/app/protected/interfaces/Precio';
import { PrecioPropuesta } from 'src/app/protected/interfaces/PrecioPropuesta';
import { Producto } from 'src/app/protected/interfaces/Producto';
import { Propuesta } from 'src/app/protected/interfaces/Propuesta';
import { CostoSug } from '../../../interfaces/CostoSug';
import { PreciosService } from '../../services/precios.service';


@Component({
  selector: 'app-propuesta',
  templateUrl: './propuesta.component.html',
  providers: [MessageService]
})
export class PropuestaComponent implements OnInit, OnDestroy {


  @ViewChild('costo') costo !: ElementRef;
  @ViewChild('dtArticulos') tableArticule !: Table;

  receivedVisible: boolean = false;
  idPropuesta: number = -1;
  showModal: boolean = false;
  showModalArticulo: boolean = false;
  showModalPreciosTon: boolean = false;
  producto: Producto = {};

  private subscription  !: Subscription;


  lstCostoIncre: CostoIncre[] = [];
  lstProveedor: Producto[] = [];
  lstFamilia: Producto[] = [];
  lstFamiliaXGrupo: Producto[] = [];
  lstProductSelected: Producto[] = [];
  lstArticuloXFamilia: ArticuloPropuesto[] = [];
  lstPrecioXTonActuales: Precio[] = [];
  messages: Message[] = [];


  formCostoIncre: FormGroup = this.fb.group({
    costoIncreArr: this.fb.array([])
  });



  constructor(private precioService: PreciosService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private loginService: LoginService) {


  }

  ngOnInit(): void {

    this.subscription = this.precioService.sharedVisible$.subscribe((value) => {
      this.receivedVisible = value;

      this.obtenerCostoFlete();
      this.cargarCostoIncre();

      this.messages = [{ severity: 'success', summary: 'Success', detail: 'Message Content' }];

    });
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();

  }


  /**
   * Para cargar la lista de familias
   * @param event
   */
  onChangeFamilia(event: any): void {
    this.obtenerFamilia(event.value);

  }

  /**
   * Procedimiento para obtener la lista de grupo de articulos
   * @param event
   */
  onChangeFamiliaXCodigo(event: any) {

    this.lstProductSelected = [];

    this.precioService.obtenerListFamiliaXGrupo(event.value).subscribe({
      next: (resp) => this.lstFamiliaXGrupo = resp,
      error: (err) => console.log(err),
      complete: () => { }
    });

  }

  /**
   * Procedimiento para listr el costo de flete por ciudad
   */
  obtenerCostoFlete(): void {

    this.precioService.obtenerListCostoFlete().subscribe({
      next: (resp) => this.lstCostoIncre = resp,
      error: (err) => console.log(err),
      complete() { }
    });
  }

  /**
   * Obtendra la lista de de familias
   */
  obtenerFamilia(codFamilia: number): void {
    this.precioService.obtenerListFamilia(codFamilia).subscribe({
      next: (resp) => {
        this.lstFamilia = resp;

      },
      error: (err) => console.log(err),
      complete() { }
    });
  }

  /**
   * Desplegara los datos del formulario
   * @returns
   */
  lstFormCostoIncre(): FormArray {
    return this.formCostoIncre.get('costoIncreArr') as FormArray;
  }

  /**
   *Cargara la lista de costo incremento en el formArray
   */
  cargarCostoIncre(): void {

    this.formCostoIncre = this.fb.group({
      propuesta: ['', [Validators.required, Validators.minLength(5)]],
      obs: ['', [Validators.required, Validators.minLength(5)]],
      costoIncreArr: this.fb.array(
        this.lstCostoIncre.map(e => this.preCargarFormulario(e))
      )
    });

  }
  /**
 * Llenar Formulario
 * @param cin
 * @returns
 */
  preCargarFormulario(cin: CostoIncre): FormGroup {
    return new FormGroup({

      codSucursal: new FormControl(cin.codSucursal, [Validators.required]),
      nombreSucursal: new FormControl(cin.nombreSucursal),
      valor: new FormControl(cin.valor, [Validators.required]),

    });
  }
  /**
   *Cargara los datos de proveedor y codigo de familia
   */
  cargarPrePropuesta(): void {
    const { costoIncreArr } = this.formCostoIncre.value
    this.lstCostoIncre = costoIncreArr;
    this.showModal = true;

    this.precioService.obtenerListProveedor().subscribe(
      {
        next: (resp) => {
          this.lstProveedor = resp;
          this.lstProveedor = [
            {
              codigoFamilia: -1,
              nombreProveedor: 'Todos',
            },
            ...this.lstProveedor
          ];

        },
        error: (err) => console.log(err),
        complete() {

        },
      }
    );
    this.obtenerFamilia(-1);


  }

  /**
   * Para obtener los articulos por familias
   */
  onSelectedFamilyCode(): void {
    this.tableArticule.first = 0;
    this.showModalArticulo = true;
    const codigosFamilia = this.lstProductSelected.map(item => item.codigoFamilia);

    // Convertir la lista en una cadena de texto separada por comas
    const cadena = `${codigosFamilia.join(",")},`;

    this.precioService.obtenerListArticulosXFamilia(cadena).subscribe({
      next: (resp) => this.lstArticuloXFamilia = resp,
      error: (err) => console.log(err),
      complete() { }
    });

  }

  /**
   * Cargara los datos de una familia seleccionada
   * @param codFamilia
   */
  loadFamilyData(codFamilia: number) {

    this.showModalPreciosTon = true;

    this.precioService.obtenerDatoFamilia(codFamilia).subscribe(
      {
        next: (resp) => this.producto = resp,
        error: (err) => console.log(err),
        complete() { }
      }
    );

    this.loadPriceXTon(codFamilia);

  }

  /**
   * Cargara la lista de precios por toneladas
   */
  loadPriceXTon(codFamilia: number): void {

    if (this.idPropuesta === -1) {
      this.precioService.obtenerPreciosXToneladaXFamilia(codFamilia).subscribe({
        next: (resp) => this.lstPrecioXTonActuales = resp,
        error: (err) => console.log(err),
        complete() { }
      });
    }

  }

  /**
   * Calcular los costos en toneladas por lista de precios y sucursal
   * @returns
   */
  calculateNewPricesTon(): void {

    const costo = parseFloat(this.costo.nativeElement.value);

    if (Number.isNaN(costo)) {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Costo Ingresado Invalido', detail: "El Costo ingresado no es un número." });
      return;
    }

    // Convert `incre` values to numbers ahead of time
    this.lstCostoIncre = this.lstCostoIncre.map(costoIncre => ({ ...costoIncre, valor: Number(costoIncre.valor) }));

    this.lstPrecioXTonActuales = this.lstPrecioXTonActuales.map((precio) => {
      const roundedPrecio = Number((precio.precio!).toFixed(2));
      let incre = this.lstCostoIncre.find(costoIncre => costoIncre.codSucursal === precio.idSucursal)?.valor || 0;

      let monto = costo;
      monto += monto * precio.porcentaje! / 100;
      monto += monto * ((precio.iva! + precio.it!) / 100);
      monto += incre;
      // convert to number and round to 2 decimal places
      monto = Number(monto.toFixed(2));

      return { ...precio, precio: roundedPrecio, precioNew: monto };
    });

    this.messageService.add({
      key: 'bc',
      severity: 'info',
      summary: 'Calculo Realizado',
      detail: "Por favor Verifique que el calculo se haya realizado correctamente"
    });


  }

  /**
   * Validara si cada lista de precio es de forma ascendente
   * @returns
   */
  validatePrice(list: Precio[]): number {

    const priceError = list.some((item, index, array) => {
      if (index === 0) {
        return false;
      }
      return item.precioNew! < array[index - 1].precioNew!;
    });

    if (priceError) {
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'Error en el precio',
        detail: "Un precio es menor a su anterior"
      });
      return 1;
    }

    return 0;

  }

  /**
   * Metodo para guardar la propuesta
   */
  saveProposal(): void {

    const { propuesta, obs, costoIncreArr } = this.formCostoIncre.value;
    const newCostoIncreArr : Precio[] = costoIncreArr.map((item: Precio) => item as Precio); // convertimos el array de tipo any a Precio[]
    const audUsuario = this.getUser();

    const dataProposal: Propuesta = {
      titulo: propuesta,
      obs: obs,
      tipo: 1,
      audUsuario: audUsuario
    }

    if (this.validatePrice(this.lstPrecioXTonActuales) === 0) {
      return;
    }

    //se registra la propuesta
    this.precioService.registrarPropuesta(dataProposal).pipe(
      concatMap((resp) => {
        if (resp.ok === 'ok') {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Propuesta Actualizada',
            detail: resp.msg,
          });
        }
        return from( newCostoIncreArr  );
      }),
      concatMap((value: CostoIncre) => {
        const dataCost: CostoIncre = {
          codSucursal: value.codSucursal,
          valor: value.valor,
          audUsuario: audUsuario
        }
        console.log(dataCost)
        return this.precioService.registrarCostoIncre(dataCost);
      }),
      concatMap((resp) => {
        if (resp.ok === 'ok') {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Costo Actualizado',
            detail: resp.msg,
          });
        }
        return from(this.lstPrecioXTonActuales);
      }),
      concatMap((value: Precio) => {
        const { idPrecio, codigoFamilia, precio, precioNew, porcentaje, idSucursal, listNum, nombrePrecio, vpp } = value;
        const dataPrecio: PrecioPropuesta = {
          idPrecio: idPrecio,
          codigoFamilia: codigoFamilia,
          precioActual: precio,
          precioPropuesto: precioNew,
          porcentaje: porcentaje,
          codSucursal: idSucursal,
          listNum: listNum,
          nombrePrecio: nombrePrecio,
          vpp: vpp,
          audUsuario: audUsuario
        }
        return this.precioService.registrarPrecioPropuesta(dataPrecio);
      }),
      concatMap((resp) => {
        if (resp.ok === 'ok') {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Precio Actualizado',
            detail: resp.msg,
          });
        }
        const dataCostSuges: CostoSug = {
          codigoFamilia: this.producto.codigoFamilia,
          idPropuesta: this.idPropuesta,
          costoSug: parseFloat(this.costo.nativeElement.value),
          audUsuario: audUsuario
        }
        return this.precioService.registrarCostoSugerido(dataCostSuges);
      })
    ).subscribe(
      {
        next: (resp) => {
          if (resp.ok === 'ok') {
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Costo Actualizado',
              detail: resp.msg,
            });
          }
        },
        error: (err) => console.log(err),
        complete() { }
      }
    );



  }


  /**
   * obtendra el codigo de usuario actual
   */
  getUser(): number {
    return this.loginService.codUsuario;
  }



}



