import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';
import { RegistroFacturas } from 'src/app/protected/interfaces/RegistroFacturas';
import * as XLSX from 'xlsx';
import { FacturaSantaCruzService } from '../../services/factura-santa-cruz.service';


@Component({
  selector: 'app-revision-factura-santa-cruz',
  templateUrl: './revision-factura-santa-cruz.component.html',
  styleUrls: ['./revision-factura-santa-cruz.component.css']
})
export class RevisionFacturaSantaCruzComponent implements OnInit {

  lstFacturasRegistradas : RegistroFacturas[]= [];
  filterDate: Date | null = null;

  constructor(
    private registroFacturaService : FacturaSantaCruzService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.obtenerFacturas();
  }

  obtenerFacturas() {
    // Carga inicial de todas las facturas
    this.registroFacturaService.obtenerFacturasRegistradas(new Date()).subscribe({
      next: (res) => {
        this.lstFacturasRegistradas = res;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  onBuscar() {

    if (this.filterDate) {
      this.registroFacturaService.obtenerFacturasRegistradas(this.filterDate).subscribe({
        next: (res) => {
          this.lstFacturasRegistradas = res;
        },
        error: (e) => {
          console.log(e);
        }
      });
    }
  }


  exportarExcel() {
    if (this.lstFacturasRegistradas.length > 0) {
      // Mapea los datos que deseas exportar
      const datosAExportar = this.lstFacturasRegistradas.map(factura => ({
        Descripción: factura.descripcionTf,
        Nombre: factura.nombreEmpresa,
        Fecha: factura.fecha,
        'Número Factura': factura.numFact,
        Proveedor: factura.proveedor,
        NIT: factura.nit,
        Monto: factura.monto,
        Descripción2: factura.descripcion, // Para distinguir entre ambas descripciones
        CUF: factura.cuf,
        'Número de Autorización': factura.nroAutorizacion,
        'Código de Control': factura.codControl,
        'NIT Empresa': factura.nitEmpresa,
        Dirección: factura.direccion,
        'Cadena QR': factura.qrCadena
      }));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosAExportar);
      const workbook: XLSX.WorkBook = { Sheets: { 'Facturas': worksheet }, SheetNames: ['Facturas'] };
      XLSX.writeFile(workbook, 'FacturasRegistradas'+this.filterDate+'.xlsx');
    }
  }

}


