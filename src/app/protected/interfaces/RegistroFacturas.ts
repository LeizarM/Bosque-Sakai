
export interface RegistroFacturas {
  idFac?:           number;
  idTf?:            number;
  codEmpresa?:      number;
  fecha?:           Date;
  numFact?:         number;
  proveedor?:       string;
  nit?:             string;
  monto?:           number;
  descripcion?:     string;
  cuf?:             string;
  nroAutorizacion?: string;
  codControl?:      string;
  nitEmpresa?:      string;
  fechaSistema?:    Date;
  audUsuario?:      number;

  nombreEmpresa?:   string;
}
