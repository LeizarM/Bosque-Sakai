export interface DepositoCheque {
    idDeposito?: number;
    codCliente?: string;
    docNum?:     number;
    numFact?:    number;
    anioFact?:   number;
    codEmpresa?: number;
    codBanco?:   number;
    importe?:    number;
    moneda?:     string;
    estado?:     number;
    fotoPath?:   string;
    audUsuario?: number;

    nombreBanco?: string;
    nombreEmpresa?: string;
    fueReconciliado?: string;
    
}
// Converts JSON strings to/from your types
export class Convert {
    public static toDepositoCheque(json: string): DepositoCheque {
        return JSON.parse(json);
    }

    public static depositoChequeToJson(value: DepositoCheque): string {
        return JSON.stringify(value);
    }
}
