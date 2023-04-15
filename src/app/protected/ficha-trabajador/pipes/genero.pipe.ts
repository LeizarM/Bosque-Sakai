import { Pipe, PipeTransform } from '@angular/core';
import { lstSexo } from '../../interfaces/Tipos';


@Pipe({
  name: 'genero'
})
export class GeneroPipe implements PipeTransform {

  transform(valor: string = "" ): string {

    if(!valor) return "-No se encontro valor-";
    return lstSexo().filter(genero => genero.codTipos === valor)[0].nombre;

  }

}
