import { Component, OnInit } from '@angular/core';
import { ArticuloPropuesto } from 'src/app/protected/interfaces/ArticuloPropuesto';
import { Autorizacion } from 'src/app/protected/interfaces/Autorizacion';
import { TiposMod, lstEstadosPropuesta } from '../../../interfaces/Tipos';
import { PreciosService } from '../../services/precios.service';





@Component({
  selector: 'app-autorizacion',
  templateUrl: './autorizacion.component.html',
  styleUrls: ['./autorizacion.component.css']
})
export class AutorizacionComponent implements OnInit {

  lstAutorizaciones: Autorizacion[] = [];
  lstEstadoPropuesta: TiposMod[] = [];
  lstArticulosXPropuesta : ArticuloPropuesto[] = [];


  showArticulosProp : boolean = false;
  showArticulosEdit : boolean = false;


  constructor( private precioService: PreciosService )
  {
    this.obtenerListaPropuesta();
  }

  ngOnInit(): void {

  }


  /**
   * Obtentra la lista de las propuestas
   */
  obtenerListaPropuesta():void {

    this.precioService.obtenerListAutorizacion().subscribe({
      next: (res) => {
        this.lstAutorizaciones = res;
        this.obtenerEstadosPropuesta();
      },
      error: (e) => {
        console.log(e);
      }
    });
  }
  /**
   * Obtendra los estados de las propuestas
   */
  obtenerEstadosPropuesta(): void {

    this.lstEstadoPropuesta = lstEstadosPropuesta().filter( x =>{
      let res = this.lstAutorizaciones.find( ( y )=>{
      return y.estadoCad === x.nombre;
      });
    return res !== undefined;
    });

  }

  /**
   * Para cargar la lista de de articulos afectados
   * @param idPropuesta
   */
  cargarPropuestaArticulo( idPropuesta : number ){

    this.precioService.obtenerListaDeArticulosPorPropuesta( idPropuesta ).subscribe({
      next: (res) => {
        this.lstArticulosXPropuesta = res;
        console.log(this.lstArticulosXPropuesta);
        this.showArticulosProp = true;
      },
      error: (e) => {
        console.log(e);
      }

    });
  }

}
