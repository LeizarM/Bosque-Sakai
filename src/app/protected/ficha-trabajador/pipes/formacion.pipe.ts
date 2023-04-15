import { Pipe, PipeTransform } from '@angular/core';
import { lstTipoFormacion } from '../../interfaces/Tipos';

@Pipe({
  name: 'formacion'
})
export class FormacionPipe implements PipeTransform {

  transform(valor: string = "" ): string {
    if(!valor) return "-No se encontro valor-"
    return lstTipoFormacion().filter(exp => exp.codTipos === valor)[0].nombre;
  }

}
