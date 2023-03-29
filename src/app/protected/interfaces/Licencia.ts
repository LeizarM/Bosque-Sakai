export interface Licencia {
  codLicencia?:    number;
  codPersona?:     number;
  categoria?:      string;
  fechaCaducidad?: Date;
  audUsuario?:     number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toLicencia(json: string): Licencia {
      return JSON.parse(json);
  }

  public static licenciaToJson(value: Licencia): string {
      return JSON.stringify(value);
  }
}
