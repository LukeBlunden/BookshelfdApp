import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, forkJoin, map, switchMap, throwError } from 'rxjs';
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
    private as: AuthService,
    private ds: DataService
  ) {}

  // Gets all books from database (not currently in user)
  public getBooks(): Observable<book[]> {
    return this.http.get<book[]>(`${this.apiServerUrl}/book/all`);
  }

  // Gets all the books of a specific user
  public getUserBooks(): Observable<book[]> {
    // https://stackoverflow.com/questions/58539587/how-to-loop-through-a-http-response-with-another-request-extending-the-initial
    return this.as.signedIn().pipe(
      // Checks user is signed in
      filter((res) => {
        if (!res) {
          return false;
        } else return res;
      }),
      // If signed in, attempt to get user books from database
      switchMap((res) => {
        if (this.ds.getData('accessToken') != null) {
          return this.http.get<book[]>(
            `${this.apiServerUrl}/book/userBooks`,
            this.headers()
          );
        } else {
          return throwError(() => new Error('Must be signed in to get books'));
        }
      }),
      // For each book in database, get book info from API and return as array
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

  // Search books with general term
  public searchBooks(search: string): Observable<any> {
    return this.http.get(
      `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=24&key=${this.apiKey}`
    );
  }

  // Search books by author
  public searchAuthor(author: string): Observable<any> {
    author = author.replace(' ', '+');
    return this.http.get(
      `https://www.googleapis.com/books/v1/volumes?q=inauthor:"${author}"&maxResults=24&key=${this.apiKey}`
    );
  }

  // Gets specific book
  public getBook(volumeId: string): Observable<any> {
    let result = this.http.get(
      `https://www.googleapis.com/books/v1/volumes/${volumeId}?key=${this.apiKey}`
    );
    return result;
  }

  // Logs record of read status of a book for a user to database
  public addBook(readStatus: boolean, volumeId: string): Observable<any> {
    let body = {
      volumeId,
      readStatus,
    };
    if (this.ds.getData('accessToken') != null) {
      return this.http.post<any>(
        `${this.apiServerUrl}/book/add`,
        body,
        this.headers()
      );
    } else {
      return throwError(() => new Error('Must be signed in to add books'));
    }
  }

  // Gets read status of book for a user
  public getReadStatus(volumeId: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiServerUrl}/book/readStatus/${volumeId}`,
      this.headers()
    );
  }

  // Removes book for user from database
  public deleteBook(volumeId: string): void {
    this.http
      .delete<book>(
        `${this.apiServerUrl}/book/delete/${volumeId}`,
        this.headers()
      )
      .subscribe();
  }

  // Helper class
  private headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.ds.getData('accessToken')}`,
      }),
    };
  }
}
