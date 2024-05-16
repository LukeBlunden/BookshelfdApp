import { Injectable } from '@angular/core';
import { User } from '../user/user';
import { Observable, catchError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiServerUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // This doesn't return a user, fix
  public addUser(user: User): Observable<User> {
    user.role = 'USER';
    return this.http.post<User>(`${this.apiServerUrl}/auth/signup`, user);
  }

  public signIn(user: User): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.apiServerUrl}/auth/signin`,
      user
    );
  }
}
