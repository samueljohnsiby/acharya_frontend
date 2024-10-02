import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';  // Import Router
import { inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';  // Import lastValueFrom
import { AuthService } from '../auth.service';  // Import the AuthService
import { UserCreationResponse } from '../userresponse.model';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private auth: Auth = inject(Auth);
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);  // Inject Router
  apiUrl = environment.apiUrl; // FastAPI backend URL
  private authService: AuthService = inject(AuthService);  // Inject AuthService

  constructor() {
    this.checkPersistedAuth();  // Check if user is already authenticated
  }

  async login(email: string, password: string) {
    try {
      // Sign in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (user) {
        // Get the Firebase ID token
        const idToken = await user.getIdToken();
        this.authService.setPrivateKey(idToken)

        // Send the token to FastAPI backend for verification
        const headers = new HttpHeaders().set('Authorization', `Bearer ${idToken}`);
        const response = await lastValueFrom(this.http.post<UserCreationResponse>(`${this.apiUrl}login`, {}, { headers }));

        // Check the response to confirm successful login
        if (response) {
          // Store user ID and authentication state in local storage
          localStorage.setItem('userId', response.uid);
          this.authService.setAuthenticated(true);
          this.authService.setUserId(response.uid);

          // Redirect to chat page upon successful backend verification
          this.router.navigate(['/chat']);
        } else {
          console.error('Login failed on backend:', response);
          alert('Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please check your email and password.');
    }
  }

 // Check if the user is already authenticated
 private async checkPersistedAuth() {
  const userKey = localStorage.getItem('apikey');
  const userId = localStorage.getItem('userId'); // Retrieve user ID if exists
  if (userKey && userId) {
    try {
      // Re-verify the token with the backend
      const headers = new HttpHeaders().set('Authorization', `Bearer ${userKey}`);
      const response = await lastValueFrom(this.http.post<UserCreationResponse>(`${this.apiUrl}login`, {}, { headers }));

      if (response) {
        // Token is valid, update authentication state
        this.authService.setAuthenticated(true);
        this.authService.setUserId(response.uid);
        this.router.navigate(['/chat']);  // Redirect to chat page
      } else {
        console.error('Token verification failed:', response);

      }
    } catch (error) {
      console.error('Error verifying token:', error);
      
    }
  }
}

redirectToSignup() {
  this.router.navigate(['/signup']); 
}
}
