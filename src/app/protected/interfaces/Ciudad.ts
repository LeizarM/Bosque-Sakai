export interface Ciudad {
  codCiudad?:  number;
  codPais?:    number;
  ciudad?:     string;
  audUsuario?: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toCiudad(json: string): Ciudad {
      return JSON.parse(json);
  }

  public static ciudadToJson(value: Ciudad): string {
      return JSON.stringify(value);
  }
}
