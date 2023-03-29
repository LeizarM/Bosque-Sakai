export interface ExperienciaLaboral {
  codExperienciaLaboral?: number;
  codEmpleado?:           number;
  nombreEmpresa?:         string;
  cargo?:                 string;
  descripcion?:           string;
  fechaInicio?:           Date;
  fechaFin?:              Date;
  nroReferencia?:         string;
  audUsuario?:            number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toExperienciaLaboral(json: string): ExperienciaLaboral {
      return JSON.parse(json);
  }

  public static experienciaLaboralToJson(value: ExperienciaLaboral): string {
      return JSON.stringify(value);
  }
}
