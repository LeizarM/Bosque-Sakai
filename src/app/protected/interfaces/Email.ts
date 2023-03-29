export interface Email {
  codEmail?:   number;
  codPersona?: number;
  email?:      string;
  audUsuario?: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toEmail(json: string): Email {
      return JSON.parse(json);
  }

  public static emailToJson(value: Email): string {
      return JSON.stringify(value);
  }
}
