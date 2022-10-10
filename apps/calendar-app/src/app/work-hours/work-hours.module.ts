import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TimeRangePickerLibModule } from "@time-range-picker";
import { WorkHoursRoutingModule } from "./work-hours-routing.module";

import { WorkHoursComponent } from "./work-hours.component";

@NgModule({
  declarations: [WorkHoursComponent],
  imports: [CommonModule, WorkHoursRoutingModule, TimeRangePickerLibModule],
  providers: [],
  exports: [WorkHoursComponent],
})
export class WorkHoursModule {}
