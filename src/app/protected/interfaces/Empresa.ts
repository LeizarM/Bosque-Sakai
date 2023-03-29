import { Sucursal } from './Sucursal';
export interface Empresa {
  codEmpresa?:    number;
  nombre?: string;
  codPadre?:      number;
  sigla?:         string;
  audUsuario?:    number;

}

// Converts JSON strings to/from your types
export class Convert {
  public static toEmpresa(json: string): Empresa {
      return JSON.parse(json);
  }

  public static empresaToJson(value: Empresa): string {
      return JSON.stringify(value);
  }
}
