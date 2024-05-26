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
    // Checks user is signed in
    this.ss.signedIn.subscribe({
      next: (auth) => {
        this.signedIn = auth;
        if (auth) this.getUserBooks();
      },
    });
  }

  // Gets all books of a signed in user
  public getUserBooks() {
    // https://stackoverflow.com/questions/58539587/how-to-loop-through-a-http-response-with-another-request-extending-the-initial
    this.bs.getUserBooks().subscribe({
      next: (data) => {
        // Filters user books into lists of read/ unread
        this.readBooks = data.filter((book) => book.readStatus);
        this.unreadBooks = data.filter((book) => !book.readStatus);
      },
    });
  }
}
