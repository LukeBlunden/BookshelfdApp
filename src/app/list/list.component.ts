import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { book } from '../book/book';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  routeName!: string;
  bookList!: book[];

  constructor(private route: ActivatedRoute) {
    this.routeName = this.route.snapshot.params['name'];
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ bookList }) => {
      switch (this.routeName) {
        case 'readBooks':
          this.bookList = bookList.filter((book: book) => book.readStatus);
          break;
        case 'unreadBooks':
          this.bookList = bookList.filter((book: book) => !book.readStatus);
      }
    });
  }
}
