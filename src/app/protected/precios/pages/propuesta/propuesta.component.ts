import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CostoIncre } from 'src/app/protected/interfaces/CostoIncre';
import { PreciosService } from '../../services/precios.service';


@Component({
  selector: 'app-propuesta',
  templateUrl: './propuesta.component.html',
})
export class PropuestaComponent implements OnInit, OnDestroy {

  receivedVisible : boolean = true;
  showModal : boolean = false;
  private subscription  !: Subscription;

  lstCostoIncre : CostoIncre[] = [];

  formCostoIncre: FormGroup = this.fb.group({
    costoIncreArr: this.fb.array([])
  });

  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

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
   * Procedimiento para listr el costo de flete por ciudad
   */
  obtenerCostoFlete():void {

    this.precioService.obtenerListCostoFlete().subscribe((resp) => {

      if (resp.length > 0) {

        this.lstCostoIncre = resp;


      }
    }, (err) => {
      console.log(err);

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

    cargarPrePropuesta() : void{
        const { costoIncreArr } = this.formCostoIncre.value
        this.lstCostoIncre =  costoIncreArr;
        console.log( this.lstCostoIncre );
        this.showModal =  true;
    }
}
