import { Injectable, NgZone } from '@angular/core';
import { faker } from '@faker-js/faker';
export interface User {
  name: string,
  age: number
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: User [] = [];
  constructor(private ngZone: NgZone) {
    for (let i = 0; i<50; i++)
      this.users.push({
        name: faker.name.fullName(),
        age: faker.datatype.number({min: 18, max: 30})
      });
  }
  getOddOrEven(isOdd = false): User[] {
    return this.users.filter((user) => !!(user.age % 2) == isOdd );
  }
  
  //1. Zone Pollution Pattern
  addUser(list: User[], name: string) {
    this.ngZone.runOutsideAngular(() => {
      list.unshift({
        name,
        age: faker.datatype.number({ min: 18, max: 30 }),
      });
      this.ngZone.run(() => {
        console.log('Utilisateur ajouté sans perturber Angular.');
      });
    });
  }
  
}
