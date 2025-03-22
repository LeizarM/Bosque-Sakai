
export interface DepositoCheque {
    idDeposito?:      number;
    codCliente?:      string;
    codEmpresa?:      number;
    idBxC?:           number;
    importe?:         number;
    moneda?:          string;
    estado?:          number;
    fotoPath?:        string;
    aCuenta?:         number;
    fechaI?:          Date;
    nroTransaccion?:  string;
    obs?:             string;
    audUsuario?:      number;
    

    codBanco?:        number;
    fechaInicio?:     Date;
    fechaFin?:        Date;
    


    nombreBanco?:     string;
    nombreEmpresa?:   string;
    esPendiente?: string;
    numeroDeDocumentos?: string;
    fechasDeDepositos?: string;
    numeroDeFacturas?: string;
    totalMontos?: string;

    estadoFiltro?: string;
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
