import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Simulación de token/sesión. En el mockup, solo nos interesa si 'está logueado'.
  private _isLoggedIn = false;

  constructor(private router: Router) {}

  /**
   * Simula el intento de inicio de sesión.
   * Redirecciona a /admin en caso de éxito simulado, o lanza un error.
   *
   * @param username Simulación de nombre de usuario.
   * @param password Simulación de contraseña.
   * @returns Observable que simula la respuesta del backend.
   */
  login(username: string, password: string): Observable<boolean> {
    // 1. Simula una latencia de red de 1 segundo.
    // 2. Simula una validación simple (cualquier valor que no sea vacío es 'válido').
    //    Para hacerla más 'real' podemos usar un 'usuario y contraseña' predefinidos.
    const SUCCESS_USER = 'admin';
    const SUCCESS_PASS = 'password';

    if (username === SUCCESS_USER && password === SUCCESS_PASS) {
      // Simulación de login exitoso
      return of(true).pipe(
        delay(1000), // Simula latencia
        tap(() => {
          this._isLoggedIn = true;
          // Redirige al módulo de administración
          this.router.navigate(['/admin']);
        })
      );
    } else {
      // Simulación de error de credenciales
      this._isLoggedIn = false;
      return throwError(() => new Error('Credenciales incorrectas.'));
    }
  }

  logout(): void {
    console.log('Cierre de sesión simulado ejecutado.');
    this._isLoggedIn = false; // 1. Limpia el estado
    this.router.navigate(['/public/home']); // 2. Redirige al inicio público
  }

  /**
   * Indica si el usuario está 'logueado' (mock).
   */
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
}