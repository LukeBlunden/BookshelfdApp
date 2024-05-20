import { Injectable } from '@angular/core';
import { User } from '../user/user';
import { Observable, Subscriber, catchError, of, throwError } from 'rxjs';
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

  public getUsername(): Observable<User> {
    if (localStorage.getItem('accessToken') != null) {
      let httpHeaders = {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      };

      let requestOptions = {
        headers: new HttpHeaders(httpHeaders),
      };

      return this.http.get<User>(
        `${this.apiServerUrl}/auth/signedIn`,
        requestOptions
      );
    } else {
      return throwError(() => new Error('User not signed in'));
    }
  }

  public signedIn(): Observable<boolean> {
    console.log('SignedIn()');
    if (localStorage.getItem('accessToken') != null) {
      let httpHeaders = {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      };

      let requestOptions = {
        headers: new HttpHeaders(httpHeaders),
      };

      return this.http.get<boolean>(
        `${this.apiServerUrl}/user/auth`,
        requestOptions
      );
    } else {
      return of(false);
    }
  }
}
