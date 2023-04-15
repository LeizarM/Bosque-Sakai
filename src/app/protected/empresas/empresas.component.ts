import { Component, OnInit } from '@angular/core';
import { EmpresaService } from './services/empresa.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  constructor( private empresaService : EmpresaService) { }

  ngOnInit(): void {
  }

  /**
   * ====================================================
   * =================== PROCEDIMIENTO ==================
   * ====================================================
  */

  /**
   * Procedimiento para obtener las empresas registradas
   */



}
