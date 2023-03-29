
export interface Articulo {
  codArticulo?:   string;
  codigoFamilia?: number;
  datoArt?:       string;
  datoArtEXT?:    string;
  stock?:         number;
  utm?:           number;
  unidadMedida?:  string;
  gramajeSap?:    string;
  audUsuario?:    number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toArticulo(json: string): Articulo {
      return JSON.parse(json);
  }

  public static articuloToJson(value: Articulo): string {
      return JSON.stringify(value);
  }
}
