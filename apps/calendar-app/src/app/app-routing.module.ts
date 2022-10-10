import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: "work-hours",
    loadChildren: () =>
      import("./work-hours/work-hours.module").then((m) => m.WorkHoursModule),
  },
  {
    path: "signup-sheet",
    loadChildren: () =>
      import("./signup-sheet/signup-sheet-module.module").then((m) => m.SignUpSheetModule),
  },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: "**",
    redirectTo: "main",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
