import { Component, OnInit } from '@angular/core';
import { book } from '../book/book';
import { BookService } from '../services/book.service';
import { AuthService } from '../services/auth.service';
import { SharingService } from '../services/sharing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  username!: string;
  readBooks!: book[];
  unreadBooks!: book[];
  signedIn!: boolean;

  constructor(private bs: BookService, private ss: SharingService) {}

  ngOnInit(): void {
    this.getUserBooks();
    this.ss.signedIn.subscribe({
      next: (data) => {
        this.signedIn = data;
        this.getUserBooks();
      },
    });
  }

  public getUserBooks() {
    // https://stackoverflow.com/questions/58539587/how-to-loop-through-a-http-response-with-another-request-extending-the-initial
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
