import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MenuComponent } from './menu/menu.component';
import { JobsComponent } from "./jobs/jobs.component";
import { ProjectsComponent } from "./projects/projects.component";
import { AssignmentsComponent } from "./assignments/assignments.component";
import { EmployeesComponent } from "./employees/employees.component";


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path: 'jobs',
    component: JobsComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'assignments',
    component: AssignmentsComponent
  },
  {
    path: 'employees',
    component: EmployeesComponent
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
