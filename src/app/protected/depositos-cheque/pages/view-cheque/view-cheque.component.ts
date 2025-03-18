import { Component, OnInit } from '@angular/core';
import { DepositoCheque } from 'src/app/protected/interfaces/DepositoCheque';
import { DepositoChequeService } from '../../services/deposito-cheque.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { ChBanco } from 'src/app/protected/interfaces/ChBanco';
import { SocioNegocio } from 'src/app/protected/interfaces/SocioNegocio';
import { Empresa } from 'src/app/protected/interfaces/Empresa';
import { BancoXCuenta } from 'src/app/protected/interfaces/BancoXCuenta';

@Component({
  selector: 'app-view-cheque',
  templateUrl: './view-cheque.component.html',
  styleUrls: ['./view-cheque.component.css'],
  providers: [MessageService]
})
export class ViewChequeComponent implements OnInit {

  depositos: DepositoCheque[] = [];
  loading: boolean = false;

  // New properties for search criteria
  empresas: Empresa[] = [];
  bancos: BancoXCuenta[] = [];
  sociosNegocio: SocioNegocio[] = [];
  
  selectedEmpresa: number = 1; // Default value
  selectedBanco: number | null = null;
  selectedCliente: string | null = null;
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  codEmpresa: number = 1; // Default company code

  constructor(
    private depositoChequeService: DepositoChequeService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.cargarEmpresas();
    
    // Set default dates (today for both)
    this.fechaInicio = new Date();
    this.fechaFin = new Date();
  }

  cargarEmpresas(): void {
    this.loading = true;
    this.depositoChequeService.obtenerEmpresas()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.empresas = response.data;
            if (this.empresas.length > 0) {
              this.selectedEmpresa = this.empresas[0].codEmpresaBosque || 1;
              this.codEmpresa = this.selectedEmpresa;
              this.cargarBancos();
              this.cargarSociosNegocio();
            }
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar empresas: ' + error.message
          });
        }
      });
  }

  onEmpresaChange(): void {
    this.codEmpresa = this.selectedEmpresa;
    console.log("la empresa es "+this.codEmpresa);
    this.cargarBancos();
    this.cargarSociosNegocio();
    this.selectedBanco = null;
    this.selectedCliente = null;
  }

  cargarBancos(): void {
    this.loading = true;
    this.depositoChequeService.obtenerBancos(this.selectedEmpresa)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.data) {
            // Add "Todos" option at the beginning of the array
            const todosOption: BancoXCuenta = {
              idBxC: 0,
              nombreBanco: 'Todos',
              codBanco: 0,
              codEmpresa: this.selectedEmpresa
            };
            
            this.bancos = [todosOption, ...response.data];
            
            // Select "Todos" as default
            this.selectedBanco = 0;
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar bancos: ' + error.message
          });
        }
      });
  }

  cargarSociosNegocio(): void {
    this.loading = true;
    this.depositoChequeService.obtenerSociosNegocio(this.selectedEmpresa)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.data) {
            // Add "Todos" option at the beginning of the array
            const todosOption: SocioNegocio = {
              codCliente: '',
              nombreCompleto: 'Todos',
            };
            
            this.sociosNegocio = [todosOption, ...response.data];
            // Select "Todos" as default
            this.selectedCliente = '';
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar socios de negocio: ' + error.message
          });
        }
      });
  }

  cargarDepositos(): void {
    this.loading = true;
    // Use selected criteria for search
    const idBxC = this.selectedBanco || 0;
    const clienteCod = this.selectedCliente || '';
    
    console.log(idBxC);


    this.depositoChequeService.obtenerDepositos(
      idBxC, 
      this.fechaInicio, 
      this.fechaFin, 
      clienteCod
    )
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.depositos = response.data;
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar depósitos: ' + error.message
          });
        }
      });
  }

  // Method to handle search when user clicks search button
  buscar(): void {
    this.cargarDepositos();
  }

  descargarImagen(deposito: DepositoCheque): void {

    console.log(deposito);

    if (!deposito.idDeposito) return;
    this.loading = true;
    this.depositoChequeService.descargarImagen(deposito.idDeposito)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `deposito_${deposito.idDeposito}${this.getFileExtension(deposito.fotoPath)}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al descargar imagen: ' + error.message
          });
        }
      });
  }


  descargarPdf(deposito: DepositoCheque): void {
    this.loading = true;
    this.depositoChequeService.descargarPdf(deposito)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `deposito_${deposito.idDeposito}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al descargar PDF: ' + error.message
                });
            }
        });
}


  private getFileExtension(fileName: string | undefined): string {
    if (!fileName) return '.jpg';
    return fileName.substring(fileName.lastIndexOf('.'));
  }
}
