import { Propuesta } from "./Propuesta";

export interface Autorizacion {
  idAutorizacion?: number;
  idPropuesta?:    number;
  esAprobada?:     number;
  audUsuario?:     number;
  audFecha?:       Date;
  datoUsuarioAP?:  string;
  datoUsuarioGP?:  string;
  datoUsuarioP?:   string;
  correo?:         string;
  regProp?:        Propuesta;
  estadoCad?:      string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toAutorizacion(json: string): Autorizacion {
      return JSON.parse(json);
  }

  public static autorizacionToJson(value: Autorizacion): string {
      return JSON.stringify(value);
  }
}
