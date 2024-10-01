import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';  // Import the AuthService
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.authenticated$.pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;  // User is authenticated, allow access
        } else {
          this.router.navigate(['/login']);  // Redirect to login
          return false;  // User is not authenticated, deny access
        }
      })
    );
  }
}
