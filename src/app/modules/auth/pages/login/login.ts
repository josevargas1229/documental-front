import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // Inicialización del formulario reactivo
    this.loginForm = this.fb.group({
      // CAMBIO: Ahora solo usamos Validators.required (ya no es un email)
      username: ['', [Validators.required]], 
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Si ya está 'logueado', redirige inmediatamente (prevención de acceso al login)
    if (this.authService.isLoggedIn) {
        this.authService.login('admin', 'password').subscribe();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  /**
   * Maneja el envío del formulario simulado.
   */
  onSubmit(): void {
    this.errorMessage = null; 

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
      return;
    }

    this.isLoading = true;
    const { username, password } = this.loginForm.value;

    // Llamada al servicio de autenticación mock
    this.authService.login(username, password).subscribe({
      next: () => {
        // La redirección a /admin se maneja internamente en el AuthService
        console.log('Login simulado exitoso. Redireccionando a /admin...');
      },
      error: (err: Error) => {
        // Falla: Mostrar mensaje de error.
        this.isLoading = false;
        // El mensaje de error viene del throwError del servicio mock
        this.errorMessage = err.message || 'Error desconocido al iniciar sesión.';
      },
    });
  }
}