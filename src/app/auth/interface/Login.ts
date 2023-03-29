import { Empleado } from '../../protected/interfaces/Empleado';

export interface Login {
  codUsuario        ?: number;
  codEmpleado       ?: number;
  login             ?: string;
  password          ?: string;
  tipoUsuario       ?: string;
  esAutorizador     ?: string;
  estado            ?: string;
  audUsuarioI       ?: number;
  elTemaSelecionado ?: string;
  codSucursal       ?: number;
  nombreSucursal    ?: string;
  codCiudad         ?: number;
  nombreCiudad      ?: string;
  codEmpresa        ?: number;
  nombreEmpresa     ?: string;
  empleado          ?: Empleado;


  //atributos auxiliares
  nombreCompleto?: string;
  cargo?: string;
  token?: string;
  ok?: boolean;
  authoriy?: Authority[];
}


export interface Authority {
  authority?: string;
}


// Converts JSON strings to/from your types
export class Convert {
  public static toLogin(json: string): Login {
    return JSON.parse(json);
  }

  public static loginToJson(value: Login): string {
    return JSON.stringify(value);
  }
}
