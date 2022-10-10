import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SignupSheetComponent } from "./signup-sheet.component";

const routes: Routes = [
  {
    path: "",
    component: SignupSheetComponent,
    children: [{ path: "signup-sheet", component: SignupSheetComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpSheetRoutingModule {}
