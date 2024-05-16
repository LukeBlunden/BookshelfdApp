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

  books: book[] = [];

  constructor(
    private bs: BookService,
    private route: ActivatedRoute,
    private ss: SharingService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ book }) => {
      console.log(book['volumeInfo']);
      this.book = book['volumeInfo'];
      this.book.volumeId = book.id;
    });
    // this.ss.currentData.subscribe((data) => {
    //   this.books = data;
    // });
  }

  searchAuthor(author: string) {
    throw new Error('Method not implemented.');
  }
}
