

export interface NotaRemision {
    idNR?:           number;
    idDeposito?:     number;
    docNum?:         number;
    fecha?:          Date;
    numFact?:        number;
    totalMonto?:     number;
    saldoPendiente?: number;
    audUsuario?:     number;
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
