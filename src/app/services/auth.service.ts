import { Injectable } from '@angular/core';
import { User } from '../user/user';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiServerUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Adds new user to database
  public addUser(user: User): Observable<User> {
    user.role = 'USER';
    return this.http.post<User>(`${this.apiServerUrl}/auth/signup`, user);
  }

  // Signs user into database
  public signIn(user: User): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.apiServerUrl}/auth/signin`,
      user
    );
  }

  // Gets username from database
  public getUsername(): Observable<{ username: string }> {
    // Checks user has an accessToken before attempting
    if (localStorage.getItem('accessToken') != null) {
      return this.http.get<{ username: string }>(
        `${this.apiServerUrl}/user/signedIn`,
        this.headers()
      );
    } else {
      return throwError(() => new Error('User not signed in'));
    }
  }

  // Checks user is signed in
  public signedIn(): Observable<boolean> {
    // Checks user has an accessToken before attempting
    if (localStorage.getItem('accessToken') != null) {
      const headers = this.headers();
      return this.http.get<boolean>(`${this.apiServerUrl}/user/auth`, headers);
    } else {
      return throwError(() => new Error('User not signed in'));
    }
  }

  // Helper class
  private headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      }),
    };
  }
}
