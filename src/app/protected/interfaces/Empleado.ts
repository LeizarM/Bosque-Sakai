import { Persona } from './Persona';
import { RelEmplEmpr } from './RelEmpEmpr';
import { EmpleadoCargo } from './EmpleadoCargo';

export interface Empleado {
  codEmpleado?:        number;
  codPersona?:         number;
  numCuenta?:          string;
  codRelBeneficios?:   number;
  codRelPlanilla?:     number;
  audUsuarioI?:        number;
  persona?:            Persona;
  empleadoCargo?:      EmpleadoCargo;
  relEmpEmpr?:         RelEmplEmpr;


}

// Converts JSON strings to/from your types
export class Convert {
  public static toEmpleado(json: string): Empleado {
      return JSON.parse(json);
  }

  public static empleadoToJson(value: Empleado): string {
      return JSON.stringify(value);
  }
}
