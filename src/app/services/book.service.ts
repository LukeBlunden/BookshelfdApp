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

  constructor(
    private http: HttpClient,
    private ds: DataService,
    private as: AuthService
  ) {}

  public getBooks(): Observable<book[]> {
    return this.http.get<book[]>(`${this.apiServerUrl}/book/all`);
  }

  public getUserBooks(): Observable<book[]> {
    // console.log('getUserBooks()');
    // if (localStorage.getItem('accessToken') != null) {
    //   let httpHeaders = {
    //     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    //   };

    //   let requestOptions = {
    //     headers: new HttpHeaders(httpHeaders),
    //   };

    //   return this.http.get<book[]>(
    //     `${this.apiServerUrl}/book/userBooks`,
    //     requestOptions
    //   );
    // } else {
    //   return throwError(() => new Error('Must be signed in to get books'));
    // }
    // https://stackoverflow.com/questions/58539587/how-to-loop-through-a-http-response-with-another-request-extending-the-initial
    return this.as.signedIn().pipe(
      filter((res) => {
        if (!res) {
          // this.initWithoutAuth();
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
      `https://www.googleapis.com/books/v1/volumes?q=${search}`
    );
  }

  public getBook(volumeId: string): Observable<any> {
    console.log('getBook()');
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
}
