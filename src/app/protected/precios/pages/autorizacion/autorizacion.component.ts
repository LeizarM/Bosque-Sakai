import { Component, OnInit } from '@angular/core';
import { Autorizacion } from 'src/app/protected/interfaces/Autorizacion';
import { TiposMod, lstEstadosPropuesta } from '../../../interfaces/Tipos';
import { PreciosService } from '../../services/precios.service';





@Component({
  selector: 'app-autorizacion',
  templateUrl: './autorizacion.component.html',
  styleUrls: ['./autorizacion.component.css']
})
export class AutorizacionComponent implements OnInit {

  autorizaciones: Autorizacion[] = [];
  estadosPropuesta: TiposMod[] = [];


  constructor( private autorizacion: PreciosService )
  {
    this.obtenerListaPropuesta();
  }

  ngOnInit(): void {

  }


  /**
   * Obtentra la lista de las propuestas
   */
  obtenerListaPropuesta():void {

    this.autorizacion.obtenerListAutorizacion().subscribe((resp) => {

      if (resp.length > 0) {

        this.autorizaciones = resp;
        this.obtenerEstadosPropuesta();

      }
    }, (err) => {
      console.log(err);

    });
  }
  /**
   * Obtendra los estados de las propuestas
   */
  obtenerEstadosPropuesta(): void {

    this.estadosPropuesta = lstEstadosPropuesta().filter( x =>{
      let res = this.autorizaciones.find( ( y )=>{
      return y.estadoCad == x.nombre;
      });
    return res != undefined;
    });

  }

}
