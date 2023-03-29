export interface Documento {
  idDocumento?: number;
  idTipoDoc?:   number;
  idGestion?:   number;
  codUsuario?:  number;
  codEmpleado?: number;
  empleadoDe?:  string;
  cargoDe?:     string;
  ciudad?:      string;
  area?:        string;
  nroCite?:     number;
  fechaDoc?:    Date;
  dirigo?:      string;
  cargoDirigo?: string;
  referencia?:  string;
  via?:         string;
  cargoVia?:    string;
  asunto?:      string;
  cuerpo?:      string;
  estado?:      string;
  audUsuario?:  number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toDocumento(json: string): Documento {
      return JSON.parse(json);
  }

  public static documentoToJson(value: Documento): string {
      return JSON.stringify(value);
  }
}
