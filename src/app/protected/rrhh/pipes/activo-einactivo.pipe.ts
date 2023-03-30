import { Pipe, PipeTransform } from '@angular/core';
import { lstEstadoActivoInactivo } from '../../interfaces/Tipos';

@Pipe({
  name: 'activoEInactivo'
})
export class ActivoEInactivoPipe implements PipeTransform {

  transform( valor : number = 1 ): string {
    /* if( valor != 0 && valor != 1   ) {
      return "-Estado Desconocido-";
    } */
    return lstEstadoActivoInactivo().filter(exp => Number(exp.codTipos) === valor)[0].nombre;
  }

}
