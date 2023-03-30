import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],

})
export class MenuComponent implements OnInit {
  public menuOptions: any[] = [
    { url: 'assets/img/jobs.jpg', text: 'Jobs' },
    { url: 'assets/img/employees.jpg', text: 'Employees' },
    { url: 'assets/img/projects.jpg', text: 'Projects' },
    { url: 'assets/img/assignments.jpg', text: 'Assignments' },
  ];

  public currentOption = 0;

  constructor() { }

  ngOnInit(): void {
  }

  fade(calculatedOption: number) {
    let nav = document.getElementById('fade');
    nav!.classList.add('opacity-0')

    setTimeout(() => {
      this.currentOption = calculatedOption;

      nav!.classList.remove('opacity-0')
    }, 500);
  }

  nextOption() {
    let calculatedOption = this.currentOption;
    calculatedOption = (this.currentOption == this.menuOptions.length - 1) ? 0 : ++calculatedOption;

    this.fade(calculatedOption);
  }

  previousOption() {
    let calculatedOption = this.currentOption;
    calculatedOption = (this.currentOption == 0) ? 3 : --calculatedOption;

    this.fade(calculatedOption);
  }
}
