import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharingService {
  signedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}
}
