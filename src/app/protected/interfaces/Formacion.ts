export interface Formacion {
  codFormacion?:   number;
  codEmpleado?:    number;
  descripcion?:    string;
  duracion?:       number;
  tipoDuracion?:   string;
  tipoFormacion?:  string;
  fechaFormacion?: Date;
  audUsuario?:     number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toFormacion(json: string): Formacion {
      return JSON.parse(json);
  }

  public static formacionToJson(value: Formacion): string {
      return JSON.stringify(value);
  }
}
