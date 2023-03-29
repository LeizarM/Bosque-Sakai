export interface RelEmplEmpr {
  codRelEmplEmpr?:     number;
  codEmpleado?:        number;
  esActivo?:           number;
  tipoRel?:            string;
  nombreFileContrato?: string;
  fechaIni?:           Date | null;
  fechaFin?:           Date | null;
  motivoFin?:          string;
  audUsuario?:         number;

  fechaInicioBeneficio?: Date;
  fechaInicioPlanilla?:  Date;
  datoFechasBeneficio?: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toRelEmplEmpr(json: string): RelEmplEmpr {
      return JSON.parse(json);
  }

  public static relEmplEmprToJson(value: RelEmplEmpr): string {
      return JSON.stringify(value);
  }
}

