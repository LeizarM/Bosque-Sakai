export interface Pais {
  codPais?:    number;
  pais?:       string;
  audUsuario?: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toPais(json: string): Pais {
      return JSON.parse(json);
  }

  public static paisToJson(value: Pais): string {
      return JSON.stringify(value);
  }
}
