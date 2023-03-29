export interface Propuesta {
  idPropuesta?:    number;
  codEmpresa?:     number;
  tipo?:           number;
  titulo?:         string;
  obs?:            string;
  estado?:         number;
  audUsGenerado?:  number;
  audFecGenerado?: Date;
  audFecha?:       number;

}

// Converts JSON strings to/from your types
export class Convert {
  public static toPropuesta(json: string): Propuesta {
      return JSON.parse(json);
  }

  public static propuestaToJson(value: Propuesta): string {
      return JSON.stringify(value);
  }
}
