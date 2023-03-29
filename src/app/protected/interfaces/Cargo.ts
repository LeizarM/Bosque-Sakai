export interface Cargo {
  codCargo              ?: number;
  codCargoPadre         ?: number;
  descripcion           ?: string;
  codEmpresa            ?: number;
  codNivel              ?: number;
  posicion              ?: number;
  audUsuario            ?: number;
  sucursal              ?: string;
  sucursalPlanilla      ?: string;
  nombreEmpresa         ?: string;
  nombreEmpresaPlanilla ?: string;
  codEmpresaPlanilla    ?: number;
  codCargoPlanilla      ?: number;
  descripcionPlanilla   ?: string;

}

// Converts JSON strings to/from your types
export class Convert {
  public static toCargo(json: string): Cargo {
      return JSON.parse(json);
  }

  public static cargoToJson(value: Cargo): string {
      return JSON.stringify(value);
  }
}
