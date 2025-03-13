export interface BancoXCuenta {
    idBxC?:      number;
    codBanco?:   number;
    numCuenta?:  string;
    moneda?:     string;
    codEmpresa?: number;
    audUsuario?: number;

    // Optional fields
    nombreBanco?: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toBancoXCuenta(json: string): BancoXCuenta {
        return JSON.parse(json);
    }

    public static bancoXCuentaToJson(value: BancoXCuenta): string {
        return JSON.stringify(value);
    }
}