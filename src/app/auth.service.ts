import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSubject.asObservable();
  private userIdKey = 'userId'; // Key for localStorage

  setAuthenticated(isAuthenticated: boolean) {
    this.authenticatedSubject.next(isAuthenticated);
  }


   // Set the user ID in localStorage
   setUserId(userId: string): void {
    localStorage.setItem(this.userIdKey, userId);
   
  }

  // Get the user ID from localStorage
  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  // Remove the user ID from localStorage (optional)
  clearUserId(): void {
    localStorage.removeItem(this.userIdKey);
  }
  setPrivateKey(apiKey:string): void {
    localStorage.setItem('apikey',apiKey)
  }

  clearPrivateKey(): void {
    localStorage.removeItem('apikey')
  }
}
