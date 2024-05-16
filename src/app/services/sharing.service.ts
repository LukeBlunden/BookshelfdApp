import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharingService {
  private data = new BehaviorSubject([]);
  public currentData = this.data.asObservable();

  public setData(data: any) {
    this.data.next(data);
  }
}
