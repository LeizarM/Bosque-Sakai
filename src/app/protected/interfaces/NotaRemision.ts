import { _DeepPartialArray } from "chart.js/dist/types/utils";

export interface NotaRemision {
    idNR?:           number;
    idDeposito?:     number;
    docNum?:         number;
    fecha?:          Date;
    numFact?:        number;
    totalMonto?:     number;
    saldoPendiente?: number;
    audUsuario?:     number;

    // Atributos adicionales
    codCliente?:     string;
    nombreCliente?:  string;
    db?:             string;
    codEmpresaBosque?: number;
    
    // Campo adicional para manejar el monto a cuenta en la UI
    aCuenta?: number;
    selected?: boolean;
    saldoPendienteOriginal?: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toNotaRemision(json: string): NotaRemision {
        return JSON.parse(json);
    }

    public static notaRemisionToJson(value: NotaRemision): string {
        return JSON.stringify(value);
    }
}
