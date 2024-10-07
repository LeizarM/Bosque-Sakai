export interface EntregaChofer {
  idEntrega:         number;
  docEntry:          number;
  docNum:            number;
  factura:           number;
  docDate:           string;
  docTime:           string;
  cardCode:          string;
  cardName:          string;
  addressEntregaFac: string;
  addressEntregaMat: string;
  vendedor:          string;
  uChofer:           number;
  itemCode:          string;
  dscription:        string;
  whsCode:           string;
  quantity:          number;
  openQty:           number;
  db:                string;
  valido:            string;
  fueEntregado:      number;
  fechaEntrega:      string;
  latitud:           number;
  longitud:          number;
  direccionEntrega:  string;
  obs:               string;
  audUsuario:        number;

  fechaNota:         string;
  nombreCompleto:    string;
  diferenciaMinutos: number;
  codEmpleado:       number;
  cargo:             string;
}
