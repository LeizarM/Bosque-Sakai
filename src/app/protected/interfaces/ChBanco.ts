export interface ChBanco {
    codBanco?:   number;
    nombre?:     string;
    audUsuario?: number;
    fila?:       number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toChBanco(json: string): ChBanco {
        return JSON.parse(json);
    }

    public static chBancoToJson(value: ChBanco): string {
        return JSON.stringify(value);
    }
}
