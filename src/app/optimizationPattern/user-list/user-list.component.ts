import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { User } from "../users.service";

export const fibonnaci = (n: number): number => {
  if (n == 1 || n == 0) {
    return 1;
  }
  return fibonnaci(n - 1) + fibonnaci(n - 2);
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  //3. OnPush Stratégie
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  @Input() usersCluster: string = '';
  @Input() users: User[] = [];
  @Output() add = new EventEmitter<string>();
  userFullName: string = '';
  fiboCache = new Map<number, number>();


  addUser() {
    this.add.emit(this.userFullName);
    this.userFullName = '';
  }

  //2. Out of Bound Change Detection
  fibo(n: number): number {
    if (this.fiboCache.has(n)) {
      return this.fiboCache.get(n)!;
    }
    const fib = fibonnaci(n);
    this.fiboCache.set(n, fib);
    console.log({ n, fib });
    return fib;
  }


}
