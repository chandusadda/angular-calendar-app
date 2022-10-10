import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  ViewEncapsulation,
  Input,
  OnChanges,
} from "@angular/core";
import {
  startOfDay,
  addHours,
  differenceInMinutes,
  startOfHour,
  addMinutes,
} from "date-fns";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarView,
} from "angular-calendar";
import { WeekViewHourSegment } from "calendar-utils";
import { CustomEventTitleFormatter } from "./custom-title-formatter.provider";

@Component({
  selector: "lib-TimeRangePickerLib",
  templateUrl: "./time-range-picker-lib.component.html",
  styleUrls: ["./time-range-picker-lib.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})

export class TimeRangePickerLibComponent implements OnInit, AfterViewInit {

  /**
   * ngOnInit will be used to initialige ChangeDetectorRef & scrollToCurrentView while first initialization of the component
   */
  ngOnInit(): void {
    this.cdr.detectChanges();
    this.scrollToCurrentView();
  }

  /**
   * scrollContainer will be used to get controll of scrollContainer element & can be used to render to current time
   */
  @ViewChild("scrollContainer") scrollContainer: ElementRef<HTMLElement>;

  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;
  showToast: boolean = false;

  /**
   * isExpandable will be used to create events with expanding event feature, if no value passed will initialize with false
   */
  @Input()
  isExpandable: boolean = false;

  /**
   * duration will be used to create events with max time limit, if no value passed will initialize with 15 minutes
   */
  @Input()
  duration: number = 15;

  /**
   * hourSegments will get hours partition in grid, if no value passed will initialize with 4
   */
  @Input()
  hourSegments: number = 4;

  /**
   * constructor will initialize component with ChangeDetectorRef
   */
  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * ngAfterViewInit will detect initial view initialization & call crollToCurrentView method
   */
  ngAfterViewInit(): void {
    this.scrollToCurrentView();
  }

  /**
   * viewChanged will detect every view changed & call crollToCurrentView method
   */
  viewChanged(): void {
    this.cdr.detectChanges();
    this.scrollToCurrentView();
  }

  /**
   * scrollToCurrentView will check current window height, calulates & scrolls to current time
   * this is just small implimentation from Angular-Calendar demos example will required more changes to align with all grid duration changes
   */
  private scrollToCurrentView(): void {
    if (this.view === CalendarView.Week) {
      // each hour is 60px high, so to get the pixels to scroll it's just the amount of minutes since midnight
      const minutesSinceStartOfDay: number = differenceInMinutes(
        startOfHour(new Date()),
        startOfDay(new Date())
      );
      this.scrollContainer.nativeElement.scrollTop =
        minutesSinceStartOfDay + 400;
    }
  }

  // actions will have actions configuration that can be used while new event creation
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa-solid fa-circle-xmark close-icon"></i> ',
      a11yLabel: "Delete",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
      },
    },
  ];

  // events will hold all work schedules list
  events: CalendarEvent[] = [];

  /**
   * validateSameDay will validate current start time with new start time with current day & provide false if invalid.
   * @param currentStartDate will provide current event start time
   * @param newStartDate will provide new event start time
   */
  validateSameDay(currentStartDate: Date, newStartDate: Date): boolean {
    const dateCurrentStartOfDay: Date = startOfDay(currentStartDate);
    const dateNewStartOfDay: Date = startOfDay(newStartDate);
    return dateCurrentStartOfDay.getTime() === dateNewStartOfDay.getTime();
  }

  /**
   * validateSameTimeRange will validate current times with new times & provide false if invalid.
   * @param newStartTime will provide new event start time
   * @param newStartTime will provide new event end time
   * @param currentStartTime will provide current event start time
   * @param currentEndTime will provide current event end time
   */
  validateSameTimeRange(
    newStartTime: Date,
    newEndTime: Date,
    currentStartTime: Date,
    currentEndTime: Date
  ): boolean {
    const currentTimeMilli: number = currentStartTime.getTime();
    const currentEndTimeMilli: number = currentEndTime.getTime();
    const newStartTimeMilli: number = newStartTime.getTime();
    const newEndTimeMilli: number = newEndTime.getTime();
    if (
      (newStartTimeMilli < currentTimeMilli &&
        newEndTimeMilli <= currentTimeMilli) ||
      (newStartTimeMilli >= currentEndTimeMilli &&
        newEndTimeMilli > currentEndTimeMilli)
    ) {
      return false;
    }
    return true;
  }

  /**
   * validateEventTimesChanged will validate new events values & false if its invalid.
   * @param CalendarEventTimesChangedEvent will provide updated event values
   * @param addCssClass will check & add invalid-position class if it invalid event
   */
  validateEventTimesChanged = (
    { event, newStart, newEnd }: CalendarEventTimesChangedEvent,
    addCssClass = true
  ): boolean => {
    if (event.allDay) {
      return true;
    }

    delete event.cssClass;
    // don't allow dragging or resizing events to different days
    const sameDay = this.validateSameDay(event.start, newStart);

    if (!sameDay) {
      if (addCssClass) {
        event.cssClass = "invalid-position";
      } else {
        return false;
      }
    }

    // don't allow dragging events to the same times as other events
    const overlappingEvent = this.events.find((otherEvent) => {
      return (
        otherEvent !== event &&
        !otherEvent.allDay &&
        ((otherEvent.start < newStart && newStart < otherEvent.end) ||
          (otherEvent.start < newEnd && newStart < otherEvent.end))
      );
    });

    if (overlappingEvent) {
      if (addCssClass) {
        event.cssClass = "invalid-position";
      } else {
        return false;
      }
    }

    return true;
  };

  /**
   * eventTimesChanged will validate new events values & trigger Toast message if its invalid.
   * @param eventTimesChangedEvent will provide updated event values
   */
  eventTimesChanged(
    eventTimesChangedEvent: CalendarEventTimesChangedEvent
  ): void {
    const { event, newStart, newEnd } = eventTimesChangedEvent;
    delete event.cssClass;
    const isValidEvent = this.validateEventTimesChanged(
      eventTimesChangedEvent,
      false
    );
    this.events = this.events.map((iEvent) => {
      if (
        iEvent &&
        event &&
        JSON.stringify(iEvent) === JSON.stringify(event) &&
        isValidEvent
      ) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.refresh();
    this.handleEvent(!isValidEvent);
  }

  /**
   * handleEvent will validate & trigger Toast message if its invalid.
   * @param isValidEvent will provide is current event is valid or not to display Toast message
   */
  handleEvent(isValidEvent: boolean): void {
    if (isValidEvent) {
      this.showToast = true;
    }
  }

  /**
   * startDragToCreate will validate & crete new event with provied values while click on a cell.
   * @param segment will provide the current cell values, this can be used to calulate & create new event
   */
  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent?: MouseEvent,
    segmentElement?: HTMLElement
  ): void {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: "New event" + this.events.length,
      start: segment.date,
      end: addMinutes(segment.date, this.duration),
      meta: {
        tmpEvent: true,
      },
      actions: this.actions,
      resizable: {
        beforeStart: this.isExpandable,
        afterEnd: this.isExpandable,
      },
      draggable: true,
    };
    let sameTime: boolean = false;
    if (this.events && this.events.length > 0) {
      this.events.forEach((event: CalendarEvent): void => {
        if (
          event.start &&
          event.end &&
          this.validateSameTimeRange(
            segment.date,
            addMinutes(segment.date, this.duration),
            event.start,
            event.end
          )
        ) {
          sameTime = true;
        }
      });
    }

    if (!sameTime) {
      this.events = [...this.events, dragToSelectEvent];
      this.dragToCreateActive = true;
    } else {
      this.handleEvent(sameTime);
    }
  }

  /**
   * refresh will the refresh events list to the DOM with cdr ChangeDetectorRef.
   */
  refresh(): void {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}
