export interface VistaBtn {
  codBtn?:      number;
  codVista?:    number;
  nombreBtn?:   string;
  detalle?:     string;
  audUsuarioI?: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toVistaBtn(json: string): VistaBtn {
      return JSON.parse(json);
  }

  public static vistaBtnToJson(value: VistaBtn): string {
      return JSON.stringify(value);
  }
}
