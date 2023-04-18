import { Component } from '@angular/core';


import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoginService } from 'src/app/auth/services/login.service';
import { environment } from 'src/environments/environment';
import { FichaTrabajadorService } from '../../services/ficha-trabajador.service';

@Component({

  selector: 'app-ficha-trabajador',
  templateUrl: './ficha-trabajador.component.html',
  styleUrls:  ['./ficha-trabajador.component.css'],
  providers: [ MessageService ]

})
export class FichaTrabajadorComponent {

  codEmpleado: number = 0;
  fotoSeleccionada !: File;
  baseUrl: string = environment.baseUrl;

  //Suscriptions
  fichaTrabajadorSuscription : Subscription = new Subscription();

  constructor(
    private messageService: MessageService,
    private loginService: LoginService,
    private fichaTrabajadorService: FichaTrabajadorService) {

    this.codEmpleado = this.loginService.codEmpleado;
  }
  ngOnDestroy(): void {
    this.fichaTrabajadorSuscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  /**
   * Metodo para seleccionar una foto o archivo
   * @param event
   */
  seleccionarFoto(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {//validando que sea una imagen}

      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'El archivo seleccionado no es una imagen' });
      this.fotoSeleccionada = null!;
    }
  }

  /**
   * Metodo para subir una foto
   */
  subirFoto(): void {

    if (!this.fotoSeleccionada) {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'No se selecciono ninguna imagen' });
    } else {
      this.fichaTrabajadorService.subirFoto(this.fotoSeleccionada, this.codEmpleado).subscribe(() => {

        location.reload();

      });
    }

  }

  /**
   * Procedimiento para cargar y descargar la ficha del trabajador
   */
  descargarFichaTrabajador(): void {

    this.fichaTrabajadorSuscription = this.fichaTrabajadorService.descargarFicha(this.codEmpleado).subscribe((resp) => {
      const url = window.URL.createObjectURL(resp.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resp.filename);
      link.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.log(error);
    });

  }

}
