import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ArticuloPropuesto } from 'src/app/protected/interfaces/ArticuloPropuesto';
import { CostoIncre } from 'src/app/protected/interfaces/CostoIncre';
import { Producto } from 'src/app/protected/interfaces/Producto';
import { PreciosService } from '../../services/precios.service';


@Component({
  selector: 'app-propuesta',
  templateUrl: './propuesta.component.html',
})
export class PropuestaComponent implements OnInit, OnDestroy {

  receivedVisible : boolean = false;
  showModal : boolean = false;
  showModalArticulo : boolean = false;
  private subscription  !: Subscription;


  lstCostoIncre       : CostoIncre[] = [];
  lstProveedor        : Producto[] = [];
  lstFamilia          : Producto[] = [];
  lstFamiliaXGrupo    : Producto[] = [];
  lstProductSelected  : Producto[] = [];
  lstArticuloXFamilia : ArticuloPropuesto[] = [];

  formCostoIncre: FormGroup = this.fb.group({
    costoIncreArr: this.fb.array([])
  });



  constructor( private precioService : PreciosService,
               private fb            : FormBuilder, )
  {


  }

  ngOnInit(): void {

     this.subscription    = this.precioService.sharedVisible$.subscribe((value) => {
     this.receivedVisible = value;

     this.obtenerCostoFlete();
     this.cargarCostoIncre();

    });
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();

  }

  /**
   * Para cargar la lista de familias
   * @param event
   */
  onChangeFamilia( event: any) : void {
    this.obtenerFamilia(event.value);

  }

  /**
   * Procedimiento para obtener la lista de grupo de articulos
   * @param event
   */
  onChangeFamiliaXCodigo( event : any ){

    this.lstProductSelected = [];

    this.precioService.obtenerListFamiliaXGrupo( event.value ).subscribe({
      next: (resp) =>  this.lstFamiliaXGrupo =  resp,
      error: (err) => console.log(err),
      complete: () => {}
    });

  }

  /**
   * Procedimiento para listr el costo de flete por ciudad
   */
  obtenerCostoFlete():void {

    this.precioService.obtenerListCostoFlete().subscribe({
      next: (resp) => this.lstCostoIncre = resp,
      error: (err) => console.log(err),
      complete() {}
    });
  }

  /**
   * Obtendra la lista de de familias
   */
  obtenerFamilia( codFamilia : number ):void{
    this.precioService.obtenerListFamilia( codFamilia ).subscribe({
      next: (resp) =>
      {
        this.lstFamilia = resp;
        console.log(this.lstFamilia);
      },
      error: (err) => console.log(err),
      complete() {}
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
  cargarCostoIncre():void{

    this.formCostoIncre = this.fb.group({
      propuesta   : [ '',[ Validators.required, Validators.minLength(5) ] ],
      obs         : ['', [ Validators.required, Validators.minLength(5) ] ],
      costoIncreArr : this.fb.array(
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

        codSucursal    : new FormControl(cin.codSucursal, [Validators.required]),
        nombreSucursal : new FormControl(cin.nombreSucursal),
        valor          : new FormControl(cin.valor, [Validators.required]),

      });
    }
    /**
     *Cargara los datos de proveedor y codigo de familia
     */
    cargarPrePropuesta() : void {
        const { costoIncreArr } = this.formCostoIncre.value
        this.lstCostoIncre =  costoIncreArr;
        this.showModal =  true;

        this.precioService.obtenerListProveedor().subscribe(
          {
            next: (resp) =>  {
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
    onSelectedFamilyCode() : void {

      this.showModalArticulo = true;
      const codigosFamilia = this.lstProductSelected.map(item => item.codigoFamilia);

      // Convertir la lista en una cadena de texto separada por comas
      const cadena = `${codigosFamilia.join(",")},`;

      console.log(cadena);

      this.precioService.obtenerListArticulosXFamilia( cadena ).subscribe({
        next: (resp) => this.lstArticuloXFamilia = resp,
        error: (err) => console.log(err),
        complete() {}
      });

    }




  }
