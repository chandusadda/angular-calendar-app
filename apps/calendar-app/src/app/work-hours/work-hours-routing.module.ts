import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WorkHoursComponent } from "./work-hours.component";

const routes: Routes = [
  {
    path: "",
    component: WorkHoursComponent,
    children: [{ path: "work-hours", component: WorkHoursComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkHoursRoutingModule {}
