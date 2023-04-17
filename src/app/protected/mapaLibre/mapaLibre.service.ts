import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapaLibreService {

  private DIRECCION_STYLE : string = 'https://api.maptiler.com/maps/openstreetmap/style.json?key=';
  private TOKEN           : string = 'C4ecPhJcO5UXHU2sCQwc';

  constructor() { }



  /**
   * retornara el estilo del mapa para todos los componentes
   * @returns
   */
  obtenerZonaxCiudad(): string {

    return this.DIRECCION_STYLE+this.TOKEN;
  }
}
