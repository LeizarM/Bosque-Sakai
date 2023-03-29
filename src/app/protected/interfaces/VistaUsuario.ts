export interface VistaUsuario {
  codUsuario?:  number;
  codVista?:    number;
  nivelAcceso?: number;
  autorizador?: number;
  audUsuarioI?: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toVistaUsuario(json: string): VistaUsuario {
      return JSON.parse(json);
  }

  public static vistaUsuarioToJson(value: VistaUsuario): string {
      return JSON.stringify(value);
  }
}
