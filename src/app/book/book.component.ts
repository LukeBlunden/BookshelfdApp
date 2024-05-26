import { Component, OnInit } from '@angular/core';
import { book } from './book';
import { BookService } from '../services/book.service';
import { ActivatedRoute } from '@angular/router';
import { SharingService } from '../services/sharing.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  volumeId!: string;
  book!: book;
  image!: string;
  signedIn!: boolean;

  constructor(
    private bs: BookService,
    private route: ActivatedRoute,
    private ss: SharingService
  ) {}

  ngOnInit() {
    // Data retrieved from book resolver
    this.route.data.subscribe(({ book }) => {
      this.book = book.volumeInfo;
      // Volume id set separately as it's not located within volumeInfo
      this.book.volumeId = book.id;
    });
    // If user is signed in retirves read status of book
    this.ss.signedIn.subscribe({
      next: (auth) => {
        this.signedIn = auth;
        // To do: remove nested subscribe
        if (auth) {
          this.bs.getReadStatus(this.book.volumeId).subscribe({
            next: (data) => {
              this.book.readStatus = data;
            },
            error: (err) => {
              console.error(err);
            },
          });
        }
      },
    });
  }

  // Adds book to database
  public addBook(readStatus: boolean) {
    switch (readStatus) {
      case true:
        this.bs.addBook(true, this.book.volumeId).subscribe({
          error: (err: Error) => console.error('Error: ' + err.message),
        });
        break;
      case false:
        this.bs.addBook(false, this.book.volumeId).subscribe({
          error: (err: Error) => console.error('Error: ' + err.message),
        });
        break;
    }
    // Set the read status of the local book to match
    this.book.readStatus = readStatus;
  }

  // Removes book from database
  public deleteBook() {
    this.bs.deleteBook(this.book.volumeId);
    // Resets the read status
    this.book.readStatus = null;
  }
}
