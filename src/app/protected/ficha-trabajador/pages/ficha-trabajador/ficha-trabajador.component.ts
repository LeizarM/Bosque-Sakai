import { Component, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { environment } from 'src/environments/environment';
import { FichaTrabajadorService } from '../../services/ficha-trabajador.service';

@Component({
  selector: 'app-ficha-trabajador',
  templateUrl: './ficha-trabajador.component.html',
  styleUrls: ['./ficha-trabajador.component.css'],
  providers: [MessageService]
})
export class FichaTrabajadorComponent implements OnDestroy {

  codEmpleado: number = 0;
  fotoSeleccionada: File | null = null;
  baseUrl: string = environment.baseUrl;

  // Subscription
  fichaTrabajadorSuscription: Subscription | undefined;

  constructor(
    private messageService: MessageService,
    private loginService: LoginService,
    private fichaTrabajadorService: FichaTrabajadorService
  ) {
    this.codEmpleado = this.loginService.codEmpleado;
  }

  ngOnDestroy(): void {
    if (this.fichaTrabajadorSuscription) {
      this.fichaTrabajadorSuscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    // Initialization code if needed
  }

  /**
   * Method to select an image file
   * @param event
   */
  seleccionarFoto(event: any): void {
    this.fotoSeleccionada = event.target.files[0];
    if (this.fotoSeleccionada && this.fotoSeleccionada.type && this.fotoSeleccionada.type.indexOf('image') < 0) {
      // Validate that the selected file is an image
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'The selected file is not an image.' });
      this.fotoSeleccionada = null;
    }
  }

  /**
   * Method to upload the selected image
   */
  subirFoto(): void {
    if (!this.fotoSeleccionada) {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'No image selected.' });
    } else {
      this.fichaTrabajadorService.subirFoto(this.fotoSeleccionada, this.codEmpleado).subscribe({
        next: () => {
          location.reload();
        },
        error: (error) => {
          console.error('Error uploading photo:', error);
        }
      });
    }
  }

  /**
   * Procedure to download the worker's file
   */
  descargarFichaTrabajador(): void {
    this.fichaTrabajadorService.descargarFicha(this.codEmpleado).subscribe({
      next: (resp) => {
        const url = window.URL.createObjectURL(resp.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', resp.filename);
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading file:', error);
      }
    });
  }
}