import { Component, ElementRef, OnInit } from '@angular/core';
import { Login } from '../../../auth/interface/Login';
import { LoginService } from '../../../auth/services/login.service';
import { LayoutService } from '../../layout/service/app.layout.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {



  constructor( private loginService: LoginService, public layoutService: LayoutService, public el: ElementRef ) {

  }

  ngOnInit(): void {
  }

  /**
   * Obteniendo el usuario
   */
  get obtenerUsuario(): Login  {
    return this.loginService.obtenerUsuario;
  }
}
