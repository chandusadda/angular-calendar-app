import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignupSheetComponent } from "./signup-sheet.component";
import { SignUpSheetRoutingModule } from "./signup-routing.module";
import { TimeRangePickerLibModule } from "@time-range-picker";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [SignupSheetComponent],
  imports: [
    CommonModule,
    SignUpSheetRoutingModule,
    TimeRangePickerLibModule,
    NgbModule,
    FormsModule,
  ],
  exports: [SignupSheetComponent],
})
export class SignUpSheetModule {}
