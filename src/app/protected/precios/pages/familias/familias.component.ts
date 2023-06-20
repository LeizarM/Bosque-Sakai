import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PreciosService } from '../../services/precios.service';
@Component({
  selector: 'app-familias',
  templateUrl: './familias.component.html',
  styleUrls: ['./familias.component.css']
})
export class FamiliasComponent implements OnInit {

  constructor(private location: Location,
              private preciosService: PreciosService) { }

  ngOnInit(): void {
  }

  /**
   * metodo para volver una pagina hacia atras
   */
  volver() {
    this.location.back();
    this.preciosService.updateSharedVisible(false);
  }

}
