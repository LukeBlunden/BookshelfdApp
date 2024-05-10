import { Component, OnInit } from '@angular/core';
import { book } from './book';
import { BookService } from '../services/book.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  vid!: string;
  book!: book;

  books: book[] = [];

  constructor(private bs: BookService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ book }) => {
      console.log(book['volumeInfo']);
      this.book = book['volumeInfo'];
    });
  }
}
