import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router
import { environment } from '../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private readonly API_URL = environment.apiUrl; 

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post<{ message: string }>(this.API_URL, payload)
      .subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.email = '';
          this.password = '';

          // Navigate to login page on successful signup
          this.router.navigate(['/login']); // Update with your login route
        },
        error: (error) => {
          this.errorMessage = error.error.detail || 'An error occurred. Please try again.';
        }
      });
  }
}
