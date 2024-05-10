import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { book } from '../book/book';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  public getBooks(): Observable<book[]> {
    return this.http.get<book[]>(`${this.apiServerUrl}/book/all`);
  }

  public getBook(vid: string): Observable<any> {
    let result = this.http.get(
      `https://www.googleapis.com/books/v1/volumes/${vid}`
    );
    return result;
  }
}
