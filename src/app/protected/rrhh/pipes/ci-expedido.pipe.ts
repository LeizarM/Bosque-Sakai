import { Pipe, PipeTransform } from '@angular/core';
import { lstDocumentoExpedido } from '../../interfaces/Tipos';

@Pipe({
  name: 'ciExpedido'
})
export class CiExpedidoPipe implements PipeTransform {

  transform(valor: string = "" ): string {
    if(!valor) return "-No se encontro valor-"
    return lstDocumentoExpedido().filter(exp => exp.codTipos === valor)[0].nombre;
  }

}
