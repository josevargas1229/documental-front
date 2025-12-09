import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar', // O el selector que uses para <app-header>
  standalone: false,
  templateUrl: './navbar.html', // O el nombre de tu archivo html
})
export class NavbarComponent { // O el nombre de tu componente de Header

  constructor(private router: Router) {}

  goToLogin(): void {
    // Redirige al módulo de autenticación
    this.router.navigate(['/auth/login']);
  }
}