import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/auth/interface/Login';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private style : string = 'sb-sidenav-toggled';

  constructor( private renderer: Renderer2,
               private loginService: LoginService,
               private router: Router) {
    this.renderer.addClass(document.body, this.style );
 }

  ngOnInit(): void {
  }

  /**
   * Procedimiento para comprimir o expandir el sidebar o menu lateral
   */
  mostrarOcultarNavBar(){
    if( this.style === 'sb-sidenav-toggled' ){
      this.renderer.removeClass(document.body, this.style);
      this.style = 'sb-nav-fixed';
    }else{
      this.renderer.removeClass(document.body, this.style);
      this.style = 'sb-sidenav-toggled';
    }
    this.renderer.addClass(document.body, this.style );
    this.renderer.addClass(document.body, 'sb-nav-fixed' );

  }
  /**
   * Procedimiento para obtener datos del usuario
   */
   get obtenerUsuario(): Login  {
    return this.loginService.obtenerUsuario;
  }

  /**
   * Procedimiento para cerrar sesion
   */
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

}
