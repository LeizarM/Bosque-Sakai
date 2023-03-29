export interface Vista {
  codVista?:      number;
  codVistaPadre?: number;
  direccion?:     string;
  titulo?:        string;
  descripcion?:   string;
  imagen?:        string;
  esRaiz?:        number;
  autorizar?:     number;
  audUsuarioI?:   number;
  fila?:          number;
  items?:         Vista[];
  label?:         string;
  tieneHijo?:     number;
  routerLink?:    string;
  icon?:          string;
  path?:          string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toVista(json: string): Vista {
      return JSON.parse(json);
  }

  public static vistaToJson(value: Vista): string {
      return JSON.stringify(value);
  }
}

