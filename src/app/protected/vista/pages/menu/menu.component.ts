import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { LoginService } from 'src/app/auth/services/login.service';
import { VistaService } from '../../services/vista.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  items: MenuItem[] = [];
  hayError: boolean = false;
  constructor(
    private vistaService: VistaService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.obtenerMenuXUsuario(this.loginService.obtenerUsuario.codUsuario!);
  }
  /**
   * Procedimiento para obtener el menu dinamico por usuario
   * @param codUsuario
   */
  obtenerMenuXUsuario(codUsuario: number): void {
    this.hayError = false;
    this.vistaService.obtenerMenuDinamico(codUsuario).subscribe((items) => {
      this.items = items;

    }, (err) => {
      console.error(err);
      this.hayError = true;
      this.items = [];
    });
    //return this.items;
  }



}
