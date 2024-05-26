import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { book } from '../book/book';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  routeName: string;
  results: book[] = [];

  constructor(private route: ActivatedRoute) {
    // Gets search term from search resolver
    this.routeName = this.route.snapshot.params['term'];
  }

  ngOnInit(): void {
    // Gets retrieved data from search resolver
    this.route.data.subscribe({
      next: (data) => {
        // Resets search results on consecutive searches
        this.results = [];
        // Sets the results
        data['results']['items'].forEach((item: any) => {
          const newBook: book = item['volumeInfo'];
          newBook.volumeId = item['id'];
          this.results.push(newBook);
        });
      },
      error: (err) => console.error(err),
    });
  }
}
