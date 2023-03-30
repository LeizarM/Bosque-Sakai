export class Utiles {


  /**
   * Convertira las fechas de TS para que se muestre en PrimeNG o la vista
   * @param dateTs
   * @returns
   */
  fechaTStoPrimeNG( dateTs : Date ):Date {

    dateTs = new Date(dateTs.toString());
    dateTs.setDate(dateTs.getDate() + 1);

    return dateTs;
  }

  /**
   * Convertira de fecha PrimeNG a fecha TS para el registro de informacion
   * @param datePrimeNG
   * @returns
   */
  fechaPrimeNGtoTS( datePrimeNG : Date ):Date{

    datePrimeNG = new Date(datePrimeNG.toString());
    datePrimeNG.setDate(datePrimeNG.getDate() - 1 );

    return datePrimeNG;

  }

}
