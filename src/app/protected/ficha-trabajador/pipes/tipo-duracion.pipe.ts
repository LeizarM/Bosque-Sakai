import { Pipe, PipeTransform } from '@angular/core';
import { lstTipoMedicion } from '../../interfaces/Tipos';

@Pipe({
  name: 'tipoDuracion'
})
export class TipoDuracionPipe implements PipeTransform {

  transform(valor: string = "hrs"): string {
    if(!valor) return "-No se encontro valor-";
    return lstTipoMedicion().filter(f => f.codTipos === valor)[0].nombre;
  }

}
