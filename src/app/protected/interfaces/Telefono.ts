export interface Telefono {
  codTelefono?: number;
  codPersona?:  number;
  codTipoTel?:  number;
  telefono?:    number;
  audUsuario?:  number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toTelefono(json: string): Telefono {
      return JSON.parse(json);
  }

  public static telefonoToJson(value: Telefono): string {
      return JSON.stringify(value);
  }
}
