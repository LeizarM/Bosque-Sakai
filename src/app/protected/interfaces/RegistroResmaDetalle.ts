export interface RegistroResmaDetalle {
  idRmd?:          string;
  idMer:          number;
  idTd:           number;
  codArticulo:    string;
  descripcion:    string;
  cantidad:       number;
  porcentaje :    number;
  precioUnitario: number;
  subtotalUsd:    number;
  placa:          string;
  chofer:         string;
  audUsuario:     number;
}
