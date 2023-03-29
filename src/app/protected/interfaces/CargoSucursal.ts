import { Sucursal } from './Sucursal';
import { Cargo } from './Cargo';
export interface CargoSucursal {
  codCargoSucursal?: number;
  codSucursal     ?: number;
  codCargo        ?: number;
  audUsuario      ?: number;
  datoCargo       ?: string;
  sucursal        ?: Sucursal;
  cargo           ?: Cargo;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toCargoSucursal(json: string): CargoSucursal {
      return JSON.parse(json);
  }

  public static cargoSucursalToJson(value: CargoSucursal): string {
      return JSON.stringify(value);
  }
}
