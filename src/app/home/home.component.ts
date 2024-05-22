import { Component, OnInit } from '@angular/core';
import { book } from '../book/book';
import { BookService } from '../services/book.service';
import { AuthService } from '../services/auth.service';
import { filter, forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  username!: string;
  readBooks!: book[];
  unreadBooks!: book[];

  constructor(private bs: BookService, private as: AuthService) {}

  ngOnInit(): void {
    this.getUserBooks();
  }

  public getUserBooks() {
    // https://stackoverflow.com/questions/58539587/how-to-loop-through-a-http-response-with-another-request-extending-the-initial
    // this.as
    //   .signedIn()
    //   .pipe(
    //     filter((res) => {
    //       if (!res) {
    //         this.initWithoutAuth();
    //         return false;
    //       } else return res;
    //     }),
    //     switchMap((res) => {
    //       return this.bs.getUserBooks();
    //     }),
    //     switchMap((res) => {
    //       const books = res.map((dbBook) => {
    //         return this.bs.getBook(dbBook.volumeId).pipe(
    //           map((gBook) => {
    //             const newBook = gBook.volumeInfo;
    //             newBook.readStatus = dbBook.readStatus;
    //             newBook.volumeId = dbBook.volumeId;
    //             return newBook;
    //           })
    //         );
    //       });
    //       return forkJoin(books);
    //     }),
    //     map((res) => {
    //       this.readBooks = res.filter((book) => book.readStatus);
    //       this.unreadBooks = res.filter((book) => !book.readStatus);
    //     })
    //   )
    //   .subscribe();
    this.bs.getUserBooks().subscribe({
      next: (data) => {
        this.readBooks = data.filter((book) => book.readStatus);
        this.unreadBooks = data.filter((book) => !book.readStatus);
      },
    });
  }

  public initWithoutAuth() {
    console.log('No auth');
  }
}
