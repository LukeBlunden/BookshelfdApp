import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { book } from '../book/book';
import { SharingService } from '../services/sharing.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { User } from '../user/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  results: book[] = [];
  username?: string;

  constructor(
    private bs: BookService,
    private ss: SharingService,
    private as: AuthService,
    private ds: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieves user info from database
    this.as.getUsername().subscribe({
      next: (user: { username: string }) => {
        // If successful sets the user as signed in and get username for dropdown
        this.ss.signedIn.next(true);
        this.username = user.username;
      },
      error: () => {
        // If unsuccessful, sets user as not signed in and clears any previous sign in data
        this.ss.signedIn.next(false);
        this.username = '';
        this.ds.clearData();
      },
    });
  }

  // Gets search results from search bar
  public search(search: string) {
    let result = this.bs.searchBooks(search);
    result.subscribe({
      next: (res) => {
        // Resets the results when search terms change
        this.results.length = 0;
        res.items.forEach((result: { id: string; volumeInfo: book }) => {
          // Gets volumeId and info for each search result and pushes to results
          result.volumeInfo.volumeId = result.id;
          this.results.push(result.volumeInfo);
        });
      },
    });
  }

  // navigates to more detailed search page on submitting search bar input
  public searchTerm(search: NgForm) {
    const term = search.value.key;
    // Resets form and search results
    search.resetForm();
    this.results = [];
    // Navigates to search page with searched term
    this.router.navigateByUrl(`/search/all/${term}`);
  }

  // Submits new user to database
  public onSignUp(user: NgForm) {
    this.as.addUser(user.value).subscribe({
      next: () => {
        // Resets inputs and closes modal
        user.reset();
        document.getElementById('sign-up-form')?.click();
        // Redirects to sign in with new credentials, gets accessToken
        this.onOpenModal('signIn');
      },
      error: (err) => console.error('Error: Username already exists'),
    });
  }

  // Signs existing user in
  public onSignIn(user: NgForm) {
    this.as.signIn(user.value).subscribe({
      next: (res) => {
        // Saves accessToken to local storage
        this.ds.saveData('accessToken', res.accessToken);
        this.username = user.value.username;
        // Sets user as signed in
        this.ss.signedIn.next(true);
        // Resets inputs and closes modal
        user.reset();
        document.getElementById('sign-in-form')?.click();
      },
      error: (err) => console.error(err),
    });
  }

  // signs user out, clears user data
  public onSignOut() {
    this.username = '';
    this.ds.clearData();
    this.ss.signedIn.next(false);
  }

  // Controls opening of modals on clicking links
  public onOpenModal(mode: string) {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    switch (mode) {
      case 'signUp':
        button.setAttribute('data-bs-target', '#signUpModal');
        break;
      case 'signIn':
        button.setAttribute('data-bs-target', '#signInModal');
        break;
    }

    container?.appendChild(button);
    button.click();
  }
}
