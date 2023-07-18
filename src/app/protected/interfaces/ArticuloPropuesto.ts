export interface ArticuloPropuesto {

  idArticulo?:    number;
  idPropuesta?:   number;
  codArticulo?:   string;
  codigoFamilia?: number;
  datoArticulo?:  string;
  stock?:         number;
  utm?:           number;
  audUsuario?:    number;

  fila?:          number;
  filaCod?:       number;
  codCad?:        string;

  titulo?:           string;
  obs?:              string;
  nombreSucursal?:   string;
  listNumPap?:       number;
  listNumIpx?:       number;
  vpp?:              number;
  precio?:           number;
  precioCalc?:       number;
  precioUnitUsdPap?: number;
  precioUnitBsPap?:  number;
  precioUnitUsdIpx?: number;
  precioUnitBsIpx?:  number;
  precioPropuesto?:  number;
  monedaUSD?:        string;
  monedaBS?:         string;
  familia?:          string;
  proveedor?:        string;
  costo?:            number;
}
