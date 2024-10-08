export interface LoteProduccion {


  idLp?:                    number;
  idMa?:                    number;
  numLote?:                 number;
  anio?:                    number;
  fecha?:                   Date;
  hraInicioCorte?:          string;
  hraInicio?:               string;
  hraFin?:                  string;
  cantBobinasIngresoTotal?: number;
  pesoKilosTotalIngreso?:   number;
  pesoTotalSalida?:         number;
  pesoPaletaSalida?:        number;
  pesoMaterialSalida?:      number;
  cantResmaSalida?:         number;
  cantHojasSalida?:         number;
  mermaTotal?:              number;
  diferenciaProduccion?:    number;
  diferenciaProdResma?:     number;
  cantEstimadaResma?:       number;
  pesoBalanzaTotal?:        number;
  estado?:                  number;
  obs?:                     string;
  numCorte?:                number;
  anioCorte?:               number;
  audUsuario?:              number;

  codArticulo?:             string;
  datoArt?:                 string;
  articulo?:                string;
  utm?:                     number;

}
