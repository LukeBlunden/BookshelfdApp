import { Component, OnInit } from '@angular/core';
import { book } from './book';
import { BookService } from '../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  books: book[] = [];

  constructor(
    private bs: BookService,
    private route: ActivatedRoute,
    private ss: SharingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ book }) => {
      this.book = book.volumeInfo;
      this.book.volumeId = book.id;
    });
    if (localStorage.getItem('accessToken') != null) {
      this.bs.getReadStatus(this.book.volumeId).subscribe({
        next: (data) => {
          this.book.readStatus = data;
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  public addBook(readStatus: boolean) {
    switch (readStatus) {
      case true:
        this.bs.addBook(true, this.book.volumeId).subscribe({
          error: (err: Error) => console.log('Error: ' + err.message),
        });
        break;
      case false:
        this.bs.addBook(false, this.book.volumeId).subscribe({
          error: (err: Error) => console.log('Error: ' + err.message),
        });
        break;
    }
    this.book.readStatus = readStatus;
  }

  public deleteBook() {
    this.bs.deleteBook(this.book.volumeId);
    this.book.readStatus = null;
  }
}
