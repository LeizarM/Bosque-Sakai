import { Pipe, PipeTransform } from '@angular/core';
import { lstTipoRelEmp } from '../../interfaces/Tipos';

@Pipe({
  name: 'relacionEmpresa'
})
export class RelacionEmpresaPipe implements PipeTransform {

  transform(valor: string = "inde"): string {
    if(!valor) return "-No se encontro valor-";
    return lstTipoRelEmp().filter(genero => genero.codTipos === valor)[0].nombre;
  }

}
