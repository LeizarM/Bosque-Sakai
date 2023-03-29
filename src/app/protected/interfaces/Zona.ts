export interface Zona {
  codZona?:    number;
  codCiudad?:  number;
  zona?:       string;
  audUsuario?: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toZona(json: string): Zona {
      return JSON.parse(json);
  }

  public static zonaToJson(value: Zona): string {
      return JSON.stringify(value);
  }
}
