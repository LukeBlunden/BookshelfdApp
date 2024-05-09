import { Component, OnInit } from '@angular/core';
import { book } from './book';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  books: book[] = [];

  constructor(private bs: BookService) {}

  ngOnInit(): void {
    this.bs.getBooks().subscribe({
      next: (res: book[]) => {
        this.books = res;
        console.log('got the ' + res);
      },
      complete: () => {
        console.log('done');
      },
    });
  }
}
