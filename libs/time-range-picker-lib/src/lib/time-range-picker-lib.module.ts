import { ModuleWithProviders, NgModule, Provider } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  CalendarA11y,
  CalendarDateFormatter,
  CalendarEventTitleFormatter,
  CalendarModule,
  CalendarModuleConfig,
  CalendarUtils,
  DateAdapter,
} from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TimeRangePickerLibComponent } from "./time-range-picker-lib.component";

@NgModule({
  declarations: [TimeRangePickerLibComponent],
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModule,
  ],
  exports: [TimeRangePickerLibComponent],
})
export class TimeRangePickerLibModule {
  static forRoot(
    dateAdapter: Provider,
    config: CalendarModuleConfig = {}
  ): ModuleWithProviders<TimeRangePickerLibModule> {
    return {
      ngModule: TimeRangePickerLibModule,
      providers: [
        dateAdapter,
        config.eventTitleFormatter || CalendarEventTitleFormatter,
        config.dateFormatter || CalendarDateFormatter,
        config.utils || CalendarUtils,
        config.a11y || CalendarA11y,
      ],
    };
  }
}
