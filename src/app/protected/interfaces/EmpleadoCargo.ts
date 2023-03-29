import { CargoSucursal } from "./CargoSucursal";

export interface EmpleadoCargo {
  codEmpleado         ?: number;
  codCargoSucursal    ?: number;
  codCargoSucPlanilla ?: number;
  fechaInicio         ?: Date;
  audUsuario          ?: number;
  cargoSucursal       ?: CargoSucursal;


  /**
   * Variables de apoyo
   */
  cargoPlanilla       ?: string;
  existe              ?: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toEmpleadoCargo(json: string): EmpleadoCargo {
      return JSON.parse(json);
  }

  public static empleadoCargoToJson(value: EmpleadoCargo): string {
      return JSON.stringify(value);
  }
}
