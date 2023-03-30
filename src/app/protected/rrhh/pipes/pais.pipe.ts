import { Pipe, PipeTransform } from '@angular/core';
import { PaisService } from '../../pais/services/pais.service';
import { Pais } from '../../interfaces/Pais';

@Pipe({
  name: 'pais',
  pure: false

})
export class PaisPipe implements PipeTransform {

  lstPaises : Pais[] = [];

  constructor( private paisService : PaisService ){
    this.obtenerPaises();
  }

  transform(valor: number = 1): string {
    if(!valor) return "-No se encontro valor-";
    if( this.lstPaises.length === 0 ) return "-No existen paises registrados-";
    return  this.lstPaises.filter(pais => pais.codPais === valor)[0].pais!;
  }

  /**
   * Procedimiento para obtener Paises
   */
   obtenerPaises(): void {
    this.paisService.obtenerPaises().subscribe((resp) => {
      if (resp) {
        this.lstPaises = resp;
      }
    }, (err) => {
      this.lstPaises = [];
      console.log(err);
    });
  }

}
