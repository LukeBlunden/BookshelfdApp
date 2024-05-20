import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { book } from '../book/book';
import { SharingService } from '../services/sharing.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { User } from '../user/user';

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
    private ds: DataService
  ) {}

  ngOnInit(): void {
    this.as.getUsername().subscribe({
      next: (user: User) => (this.username = user.username),
      error: () => {
        this.username = '';
        this.ds.clearData();
      },
    });
  }

  public async search(search: string): Promise<void> {
    this.books = [];
    let result = await this.bs.searchBooks(search);
    result.subscribe({
      next: (res) => {
        this.books.length = 0;
        res.items.forEach((result: { id: string; volumeInfo: book }) => {
          console.log(result.id);
          result.volumeInfo.volumeId = result.id;
          this.books.push(result.volumeInfo);
        });
      },
    });
  }

  public onSignUp(user: NgForm) {
    this.as.addUser(user.value).subscribe({
      next: () => {
        this.onOpenModal('signIn');
        user.reset();
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
      },
      error: (err) => console.log(err),
    });
  }

  public onSignOut() {
    this.username = '';
    this.ds.clearData();
  }

  public onOpenModal(mode: string) {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    switch (mode) {
      case 'signUp':
        button.setAttribute('data-target', '#signUpModal');
        break;
      case 'signIn':
        button.setAttribute('data-target', '#signInModal');
        break;
    }

    container?.appendChild(button);
    button.click();
  }
}
