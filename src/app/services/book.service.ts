import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  filter,
  forkJoin,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { book } from '../book/book';
import { environment } from 'src/environments/environment.development';
import { DataService } from './data.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiServerUrl = environment.apiBaseUrl;
  private apiKey = environment.apiKey;

  constructor(
    private http: HttpClient,
    private ds: DataService,
    private as: AuthService
  ) {}

  public getBooks(): Observable<book[]> {
    return this.http.get<book[]>(`${this.apiServerUrl}/book/all`);
  }

  public getUserBooks(): Observable<book[]> {
    // https://stackoverflow.com/questions/58539587/how-to-loop-through-a-http-response-with-another-request-extending-the-initial
    return this.as.signedIn().pipe(
      filter((res) => {
        if (!res) {
          return false;
        } else return res;
      }),
      switchMap((res) => {
        if (localStorage.getItem('accessToken') != null) {
          let httpHeaders = {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          };

          let requestOptions = {
            headers: new HttpHeaders(httpHeaders),
          };

          return this.http.get<book[]>(
            `${this.apiServerUrl}/book/userBooks`,
            requestOptions
          );
        } else {
          return throwError(() => new Error('Must be signed in to get books'));
        }
      }),
      switchMap((res) => {
        const books = res.map((dbBook) => {
          return this.getBook(dbBook.volumeId).pipe(
            map((gBook) => {
              const newBook = gBook.volumeInfo;
              newBook.readStatus = dbBook.readStatus;
              newBook.volumeId = dbBook.volumeId;
              return newBook;
            })
          );
        });
        return forkJoin(books);
      })
    );
  }

  public searchBooks(search: string): Observable<any> {
    return this.http.get(
      `https://www.googleapis.com/books/v1/volumes?q=${search}&key=${this.apiKey}`
    );
  }

  public searchAuthor(author: string): Observable<any> {
    author = author.replace(' ', '+');
    return this.http.get(
      `https://www.googleapis.com/books/v1/volumes?q=inauthor:"${author}"&maxResults=24&key=${this.apiKey}`
    );
  }

  public getBook(volumeId: string): Observable<any> {
    let result = this.http.get(
      `https://www.googleapis.com/books/v1/volumes/${volumeId}?key=${this.apiKey}`
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

  public getReadStatus(volumeId: string): Observable<boolean> {
    let httpHeaders = {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    };

    let requestOptions = {
      headers: new HttpHeaders(httpHeaders),
    };

    return this.http.get<boolean>(
      `${this.apiServerUrl}/book/readStatus/${volumeId}`,
      requestOptions
    );
  }

  public deleteBook(volumeId: string): void {
    let httpHeaders = {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    };

    let requestOptions = {
      headers: new HttpHeaders(httpHeaders),
    };

    this.http
      .delete<book>(
        `${this.apiServerUrl}/book/delete/${volumeId}`,
        requestOptions
      )
      .subscribe();
  }
}
