import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/auth/services/login.service';
import { UsuarioService } from '../services/usuario.service';
import { Login } from '../../../auth/interface/Login';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [MessageService]
})
export class UsuarioComponent implements OnInit {

  lstUsuario: Login[] = [];
  filteredUsuarios: Login[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  resetDialogVisible: boolean = false;
  selectedUser: Login | null = null;
  
  constructor(
    private usuarioService: UsuarioService, 
    private messageService: MessageService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.obtenerUsuario();
  }

  private obtenerUsuario(): void {
    this.loading = true;
    this.usuarioService.obtenerUsuarios()
      .subscribe({
        next: (res) => {
          this.lstUsuario = res;
          this.filteredUsuarios = res;
        },
        error: (error) => {
          console.error('Error fetching usuarios:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar la lista de usuarios'
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  onSearch(event: any): void {
    const term = event.target.value.toLowerCase();
    this.filteredUsuarios = this.lstUsuario.filter(usuario => 
      usuario.login?.toLowerCase().includes(term) || 
      usuario.nombreCompleto?.toLowerCase().includes(term)
    );
  }

  clearSearch(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.filteredUsuarios = [...this.lstUsuario];
  }

  refreshList(): void {
    this.obtenerUsuario();
  }

  resetPassword(user: Login): void {
    this.selectedUser = user;
    this.resetDialogVisible = true;
  }

  cancelResetPassword(): void {
    this.resetDialogVisible = false;
    this.selectedUser = null;
  }

  confirmResetPassword(): void {
    if (!this.selectedUser) return;

    // Aquí iría la llamada al servicio para restablecer la contraseña
    // Simulando con un timeout
    setTimeout(() => {
      this.resetDialogVisible = false;
      this.messageService.add({
        key: 'resetPassword',
        severity: 'success',
        summary: 'Contraseña restablecida',
        detail: `Se ha enviado una nueva contraseña al correo del usuario ${this.selectedUser!.login}`
      });
      this.selectedUser = null;
    }, 1000);
  }

  getTipoUsuarioLabel(tipoUsuario: string | undefined): string {
    if (!tipoUsuario) return 'Desconocido';
    
    const tipos: {[key: string]: string} = {
      'adm': 'Administrador',
      'lim': 'Limitado'
    };
    
    return tipos[tipoUsuario] || tipoUsuario.toUpperCase();
  }
}
