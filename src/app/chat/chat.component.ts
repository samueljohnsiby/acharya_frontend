import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '@angular/fire/auth';  // Import Auth for Firebase authentication
import { Router } from '@angular/router';    // Import Router for navigation
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';  // Import the AuthService
import { environment } from '../environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @ViewChild('chatHistoryDiv') chatHistoryDiv!: ElementRef;
  userMessage: string = '';
  chatHistory: { user: string; bot: string }[] = [];
  sessionId: string | null = null;

  private authService: AuthService = inject(AuthService);  // Inject AuthService
  private router: Router = inject(Router);  // Inject Router
  private API_KEY: string | null = null;

  constructor(private http: HttpClient) {
    this.initializeSession();
    this.API_KEY = this.authService.getPrivateKey();  // Initialize API key in the constructor
  }

  initializeSession() {
    const storedSessionId = localStorage.getItem('session_id');
    if (storedSessionId) {
      this.sessionId = storedSessionId;
    } else {
      this.sessionId = uuidv4();
      localStorage.setItem('session_id', this.sessionId);
    }
  }

  sendMessage(event?: KeyboardEvent) {
    if (!event || event.key === "Enter") {
      if (event) event.preventDefault();
      if (this.userMessage.trim()) {
        const message = this.userMessage.trim();
        const botPlaceholder = '...'; // Placeholder for bot response
        this.chatHistory.push({ user: message, bot: botPlaceholder });
        this.userMessage = '';

        const payload = {
          prompt: message,
          session_id: this.sessionId,
          user_id: this.authService.getUserId() // Ensure getUserId exists in AuthService
        };

        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': this.API_KEY ?? '' // Provide a fallback for API_KEY
        };
        console.log(payload);

        this.http.post<{ response: string, session_id: string }>(
          `${environment.apiUrl}chat`,
          payload,
          { headers }
        )
        .subscribe({
          next: (data) => {
            const botResponse = data.response;
            this.sessionId = data.session_id;
            this.chatHistory[this.chatHistory.length - 1].bot = botResponse;
            this.scrollToBottom();
          },
          error: (error) => {
            console.error('Error:', error);
            this.chatHistory[this.chatHistory.length - 1].bot = 'Error: Could not get response.';
            this.scrollToBottom();
          }
        });
      }
    }
  }

  storeRating(rating: 'up' | 'down', botMessage: string) {
    const ratingData = {
      message: botMessage,
      rating: rating,
      timestamp: new Date(),
      session_id: this.sessionId // Reference session
    };
    // Store rating in Firestore or any other storage method.
    // Ensure the service/method exists to handle this part
  }

  scrollToBottom() {
    try {
      this.chatHistoryDiv.nativeElement.scrollTop = this.chatHistoryDiv.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll Error:', err);
    }
  }

  resetSession() {
    localStorage.removeItem('session_id');
    this.initializeSession();
    this.chatHistory = [];
    this.userMessage = '';
  }

  copyToClipboard(botMessage: string) {
    navigator.clipboard.writeText(botMessage)
      .then(() => console.log('Message copied to clipboard!'))
      .catch((error) => console.error('Error copying message:', error));
  }

  logout() {
    try {
      this.authService.setAuthenticated(false); // Ensure setAuthenticated is in AuthService
      this.authService.clearPrivateKey(); // Clear the API key
      this.resetSession(); // Clear session data
      this.router.navigate(['/login']); // Navigate to login page
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
