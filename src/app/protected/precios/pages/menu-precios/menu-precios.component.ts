import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-menu-precios',
  templateUrl: './menu-precios.component.html',
  styleUrls: ['./menu-precios.component.css']
})
export class MenuPreciosComponent implements OnInit {

  constructor( private primengConfig: PrimeNGConfig ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

}
