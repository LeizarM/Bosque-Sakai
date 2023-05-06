import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { PreciosService } from '../../services/precios.service';

@Component({

  selector: 'app-menu-precios',
  templateUrl: './menu-precios.component.html',
  styleUrls: ['./menu-precios.component.css']
})
export class MenuPreciosComponent implements OnInit {

  visible: boolean = false;

  constructor( private primengConfig  : PrimeNGConfig,
               private preciosService : PreciosService ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

  }


  showNewPropuse():void{
    this.visible = true;
console.log("entro en showNewPropuse");
    this.preciosService.updateSharedVisible(this.visible);
  }

}
