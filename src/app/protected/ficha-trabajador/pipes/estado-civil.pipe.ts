import { Pipe, PipeTransform } from '@angular/core';
import { lstEstadoCivil } from '../../interfaces/Tipos';

@Pipe({
  name: 'estadoCivil'
})
export class EstadoCivilPipe implements PipeTransform {

  transform(valor: string = "" ): string {
    if(!valor) return "-No se encontro valor-"
    return lstEstadoCivil().filter(exp => exp.codTipos === valor)[0].nombre;
  }

}
