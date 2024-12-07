import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {User, UsersService} from "../users.service";
import * as ChartJs from 'chart.js/auto';
@Component({
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.css'],
  //3. OnPush Stratégie
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RhComponent implements OnInit {
  oddUsers: User[];
  evenUsers: User[];
  chart: any;
  constructor(private userService: UsersService) {
    this.oddUsers = this.userService.getOddOrEven(true);
    this.evenUsers = this.userService.getOddOrEven();
  }

  ngOnInit(): void {
        this.createChart();
    }
  addUser(list: User[], newUser: string) {
    this.userService.addUser(list, newUser);
  }
  
  //4. Recalculation of Referentially Transparent Expressions
  createChart(){
    const oddUsersLength = this.oddUsers.length;
    const evenUsersLength = this.evenUsers.length;
    const data = [
      { users: 'Workers', count: oddUsersLength },
      { users: 'Boss', count: evenUsersLength },
    ];
    this.chart = new ChartJs.Chart("MyChart",
    {
      type: 'bar',
        data: {
          labels: data.map(row => row.users),
        datasets: [
        {
          label: 'Entreprise stats',
          data: data.map(row => row.count)
        }
      ]
    }
    });
  }
}
