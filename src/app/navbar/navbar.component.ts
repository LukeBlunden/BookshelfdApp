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
  books: book[] = [];
  username?: string;

  constructor(
    private bs: BookService,
    private ss: SharingService,
    private as: AuthService,
    private ds: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.as.getUsername().subscribe({
      next: (user: User) => {
        this.ss.signedIn.next(true);
        this.username = user.username;
      },
      error: () => {
        this.username = '';
        this.ds.clearData();
      },
    });
  }

  public search(search: string) {
    this.books = [];
    let result = this.bs.searchBooks(search);
    result.subscribe({
      next: (res) => {
        this.books.length = 0;
        res.items.forEach((result: { id: string; volumeInfo: book }) => {
          result.volumeInfo.volumeId = result.id;
          this.books.push(result.volumeInfo);
        });
      },
    });
  }

  public searchTerm(search: NgForm) {
    const term = search.value.key;
    search.resetForm();
    this.books = [];
    this.router.navigateByUrl(`/search/all/${term}`);
  }

  public onSignUp(user: NgForm) {
    this.as.addUser(user.value).subscribe({
      next: () => {
        user.reset();
        this.onOpenModal('signIn');
        document.getElementById('sign-up-form')?.click();
      },
      error: (err) => console.log('Error: Username already exists'),
    });
  }

  public onSignIn(user: NgForm) {
    this.as.signIn(user.value).subscribe({
      next: (res) => {
        this.ds.saveData('accessToken', res.accessToken);
        this.username = user.value.username;
        // this.ds.saveData('username', user.value.username);
        user.reset();
        document.getElementById('sign-in-form')?.click();
        this.ss.signedIn.next(true);
      },
      error: (err) => console.log(err),
    });
  }

  public onSignOut() {
    this.username = '';
    this.ds.clearData();
    this.ss.signedIn.next(false);
  }

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
