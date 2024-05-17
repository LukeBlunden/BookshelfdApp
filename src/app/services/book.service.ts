import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { book } from '../book/book';
import { environment } from 'src/environments/environment.development';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private ds: DataService) {}

  public getBooks(): Observable<book[]> {
    return this.http.get<book[]>(`${this.apiServerUrl}/book/all`);
  }

  public searchBooks(search: string): Observable<any> {
    return this.http.get(
      `https://www.googleapis.com/books/v1/volumes?q=${search}`
    );
  }

  public getBook(volumeId: string): Observable<any> {
    let result = this.http.get(
      `https://www.googleapis.com/books/v1/volumes/${volumeId}`
    );
    return result;
  }

  public addBook(readStatus: boolean, volumeId: string): Observable<any> {
    let body = {
      volumeId,
      readStatus,
    };
    if (localStorage.getItem('accessToken') != null) {
      let httpHeaders = {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      };

      let requestOptions = {
        headers: new HttpHeaders(httpHeaders),
      };

      return this.http.post<any>(
        `${this.apiServerUrl}/book/add`,
        body,
        requestOptions
      );
    } else {
      return throwError(() => new Error('Must be signed in to add books'));
    }
  }
}
