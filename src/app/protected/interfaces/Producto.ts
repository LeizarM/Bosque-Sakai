export interface Producto {
  codigoFamilia?:       number;
  idGrpFamiliaSap?:     number;
  idProveedorSap?:      number;
  idPresentacion?:      number;
  idTipo?:              number;
  idRangoGram?:         number;
  formato?:             string;
  gramaje?:             string;
  idColor?:             string;
  estado?:              number;
  costoTM?:             number;
  idPropuestaAprobada?: number;
  audUsuario?:          number;
}
