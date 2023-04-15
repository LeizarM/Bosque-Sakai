import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LoginService } from 'src/app/auth/services/login.service';
import { LayoutService } from '../../layout/service/app.layout.service';


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;  el: any;

    constructor(
      public layoutService: LayoutService,
      private loginService: LoginService,
      private router: Router) { }

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
