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
    // Retrives paramter for listname
    this.routeName = this.route.snapshot.params['name'];
  }

  ngOnInit(): void {
    // Retrives data from list resolver
    this.route.data.subscribe(({ bookList }) => {
      // Filters books based on read status
      switch (this.routeName) {
        case 'readBooks':
          this.bookList = bookList.filter((book: book) => book.readStatus);
          break;
        case 'unreadBooks':
          this.bookList = bookList.filter((book: book) => !book.readStatus);
          break;
      }
    });
  }
}
