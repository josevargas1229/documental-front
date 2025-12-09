import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone:false,
  templateUrl: './header.html',
})
export class Header {
  // ⬅️ NUEVA PROPIEDAD: Controla el estado del dropdown del perfil
  isProfileMenuOpen = false; 

  constructor(private authService: AuthService) { }

  onSearch = (event: Event) => {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'k') {
      console.log('Ctrl + K');
    }
  }
  
  onLogout(): void {
    this.authService.logout(); // Llama al método de cierre de sesión
    // Opcional: Cerrar el menú después de la acción
    this.isProfileMenuOpen = false;
  }

  // ⬅️ NUEVO MÉTODO: Alternar el estado del menú
  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
}