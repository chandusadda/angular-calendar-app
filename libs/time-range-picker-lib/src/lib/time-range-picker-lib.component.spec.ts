import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  inject,
  TestBed,
} from "@angular/core/testing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarDateFormatter,
  CalendarEventTimesChangedEvent,
  CalendarEventTimesChangedEventType,
  CalendarEventTitleFormatter,
  CalendarModule,
  CalendarMomentDateFormatter,
  DateAdapter,
  MOMENT,
} from "angular-calendar";
import { CalendarEvent, WeekViewHourSegment } from "calendar-utils";
import { adapterFactory } from "calendar-utils/date-adapters/date-fns";
import { expect } from "chai";
import { addMinutes } from "date-fns";
import moment from "moment";
import * as sinon from "sinon";

import { TimeRangePickerLibComponent } from "./time-range-picker-lib.component";
import { TimeRangePickerLibModule } from "./time-range-picker-lib.module";

@Component({
  template: `
    <lib-TimeRangePickerLib
      [viewDate]="viewDate"
      [events]="events"
      (eventTimesChanged)="eventTimesChanged($event)"
    ></lib-TimeRangePickerLib>
  `,
})
class TestComponent {
  viewDate: Date;
  events: CalendarEvent[];
  eventTimesChanged: sinon.SinonSpy<any[], any> = sinon.spy();
}

describe("TimeRangePickerLib Component", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbModule,
        TimeRangePickerLibModule,
        CalendarModule.forRoot(
          {
            provide: DateAdapter,
            useFactory: adapterFactory,
          },
          {
            dateFormatter: {
              provide: CalendarDateFormatter,
              useClass: CalendarMomentDateFormatter,
            },
          }
        ),
      ],
      declarations: [
        TestComponent,
        TimeRangePickerLibComponent,
      ],
      providers: [{ provide: MOMENT, useValue: moment }],
    });
  });

  let eventTitle: CalendarEventTitleFormatter;
  beforeEach(inject([CalendarEventTitleFormatter], (_eventTitle_) => {
    eventTitle = _eventTitle_;
  }));

  it(`By default showToast should have false value`, () => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent>= TestBed.createComponent(TimeRangePickerLibComponent);
    const app: TimeRangePickerLibComponent = fixture.componentInstance;
    expect(app.showToast).to.equal(false);
  });

  it(`By default isExpandable should have false value`, () => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent> = TestBed.createComponent(TimeRangePickerLibComponent);
    const app: TimeRangePickerLibComponent = fixture.componentInstance;
    expect(app.isExpandable).to.equal(false);
  });
  it(`By default hourSegments should have value=4`, () => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent> = TestBed.createComponent(TimeRangePickerLibComponent);
    const app: TimeRangePickerLibComponent = fixture.componentInstance;
    expect(app.hourSegments).to.equal(4);
  });

  it(`Should update hourSegments value if passed`, () => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent> = TestBed.createComponent(TimeRangePickerLibComponent);
    const app : TimeRangePickerLibComponent= fixture.componentInstance;
    app.hourSegments = 2;
    fixture.detectChanges();
    expect(app.hourSegments).to.equal(2);
  });

  it(`By default duration should have value 15`, () => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent> = TestBed.createComponent(TimeRangePickerLibComponent);
    const app: TimeRangePickerLibComponent = fixture.componentInstance;
    expect(app.duration).to.equal(15);
  });

  it(`should refresh the duration value, if value passed to it`, () => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent> = TestBed.createComponent(TimeRangePickerLibComponent);
    const app: TimeRangePickerLibComponent = fixture.componentInstance;
    app.duration = 30;
    fixture.detectChanges();
    expect(app.duration).to.equal(30);
  });

  it(`should refresh the duration value, if value passed to it`, () => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent> = TestBed.createComponent(TimeRangePickerLibComponent);
    const app: TimeRangePickerLibComponent = fixture.componentInstance;
    const event: CalendarEvent = {
      start: addMinutes(new Date("2022-08-30"), 15),
      end: addMinutes(new Date("2022-08-30"), 60),
      title: "test",
      draggable: true,
    };
    const newStartTime: Date = addMinutes(new Date("2022-08-30"), 30);
    const newEndTime: Date = addMinutes(new Date("2022-08-30"), 30);
    const newType: CalendarEventTimesChangedEventType =
      CalendarEventTimesChangedEventType.Drag;
    const newCalEvent: CalendarEventTimesChangedEvent = {
      type: newType,
      event: event,
      newStart: newStartTime,
      newEnd: newEndTime,
    };
    const value: boolean = app.validateEventTimesChanged(newCalEvent);
    fixture.detectChanges();
    expect(value).to.equal(true);
  });

  it("should refresh the view with new event when new event is emitted", () => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent> =
      TestBed.createComponent(TimeRangePickerLibComponent);
    fixture.componentInstance.ngOnInit();
    fixture.componentInstance.viewDate = new Date("2022-08-30");
    const event: CalendarEvent = {
      start: new Date("2016-06-01"),
      end: new Date("2016-06-02"),
      title: "test",
      draggable: true,
    };
    fixture.componentInstance.events.push(event);
    fixture.detectChanges();
    fixture.componentInstance.refresh();
    expect(fixture.componentInstance.events[0]).to.deep.equal(event);
    fixture.destroy();
  });

  it(`should refresh the duration values of an event, if dragged to valid times & showToast will have false value`, () => {
    const fixture = TestBed.createComponent(TimeRangePickerLibComponent);
    const app = fixture.componentInstance;
    const events: CalendarEvent[] = [
      {
        start: addMinutes(new Date("2022-08-30"), 55),
        end: addMinutes(new Date("2022-08-30"), 60),
        title: "test",
        draggable: true,
      },
    ];
    const event: CalendarEvent = {
      start: addMinutes(new Date("2022-08-30"), 55),
      end: addMinutes(new Date("2022-08-30"), 60),
      title: "test",
      draggable: true,
    };
    const newStartTime: Date = addMinutes(new Date("2022-08-30"), 60);
    const newEndTime: Date = addMinutes(new Date("2022-08-30"), 120);
    const newType: CalendarEventTimesChangedEventType =
      CalendarEventTimesChangedEventType.Drag;
    const newCalEvent: CalendarEventTimesChangedEvent = {
      type: newType,
      event: event,
      newStart: newStartTime,
      newEnd: newEndTime,
    };
    app.events = events;
    fixture.detectChanges();
    app.eventTimesChanged(newCalEvent);
    fixture.detectChanges();
    fixture.componentInstance.refresh();
    expect(app.events[0].start).to.deep.equal(newStartTime);
    expect(app.events[0].end).to.deep.equal(newEndTime);
    expect(app.showToast).to.equal(false);
  });

  it(`should not refresh the duration values of an event, if dragged to any of current values & will showToast will have true`, () => {
    const fixture = TestBed.createComponent(TimeRangePickerLibComponent);
    const app = fixture.componentInstance;
    const events: CalendarEvent[] = [
      {
        start: addMinutes(new Date("2022-08-30"), 55),
        end: addMinutes(new Date("2022-08-30"), 60),
        title: "test",
        draggable: true,
      },
      {
        start: addMinutes(new Date("2022-08-30"), 60),
        end: addMinutes(new Date("2022-08-30"), 75),
        title: "test",
        draggable: true,
      },
    ];
    const event: CalendarEvent = {
      start: addMinutes(new Date("2022-08-30"), 55),
      end: addMinutes(new Date("2022-08-30"), 60),
      title: "test",
      draggable: true,
    };
    const newStartTime: Date = addMinutes(new Date("2022-08-30"), 55);
    const newEndTime: Date = addMinutes(new Date("2022-08-30"), 70);
    const newType: CalendarEventTimesChangedEventType =
      CalendarEventTimesChangedEventType.Drag;
    const newCalEvent: CalendarEventTimesChangedEvent = {
      type: newType,
      event: event,
      newStart: newStartTime,
      newEnd: newEndTime,
    };
    app.events = events;
    fixture.detectChanges();
    app.eventTimesChanged(newCalEvent);
    fixture.detectChanges();
    fixture.componentInstance.refresh();
    expect(app.events[0]).to.deep.equal(events[0]);
    expect(app.showToast).to.equal(true);
  });

  it(`should not refresh the duration values of an event, if dragged to other day & will showToast will have true`, () => {
    const fixture = TestBed.createComponent(TimeRangePickerLibComponent);
    const app = fixture.componentInstance;
    const events: CalendarEvent[] = [
      {
        start: addMinutes(new Date("2022-08-30"), 55),
        end: addMinutes(new Date("2022-08-30"), 60),
        title: "test",
        draggable: true,
      },
      {
        start: addMinutes(new Date("2022-08-30"), 60),
        end: addMinutes(new Date("2022-08-30"), 75),
        title: "test",
        draggable: true,
      },
    ];
    const event: CalendarEvent = {
      start: addMinutes(new Date("2022-08-30"), 55),
      end: addMinutes(new Date("2022-08-30"), 60),
      title: "test",
      draggable: true,
    };
    const newStartTime: Date = addMinutes(new Date("2022-08-31"), 55);
    const newEndTime: Date = addMinutes(new Date("2022-08-31"), 70);
    const newType: CalendarEventTimesChangedEventType =
      CalendarEventTimesChangedEventType.Drag;
    const newCalEvent: CalendarEventTimesChangedEvent = {
      type: newType,
      event: event,
      newStart: newStartTime,
      newEnd: newEndTime,
    };
    app.events = events;
    fixture.detectChanges();
    app.eventTimesChanged(newCalEvent);
    fixture.detectChanges();
    fixture.componentInstance.refresh();
    expect(app.events[0]).to.deep.equal(events[0]);
    expect(app.showToast).to.equal(true);
  });

  it(`should refresh events with new event, if new event is created through cell click with different time & will showToast will have false value`, () => {
    const fixture = TestBed.createComponent(TimeRangePickerLibComponent);
    const app = fixture.componentInstance;
    const events: CalendarEvent[] = [
      {
        start: addMinutes(new Date("2022-08-30"), 55),
        end: addMinutes(new Date("2022-08-30"), 60),
        title: "test",
        draggable: true,
      },
      {
        start: addMinutes(new Date("2022-08-30"), 60),
        end: addMinutes(new Date("2022-08-30"), 75),
        title: "test",
        draggable: true,
      },
    ];
    const newStartTime: Date = addMinutes(new Date("2022-08-30"), 20);
    const segment: WeekViewHourSegment = {
      isStart: true,
      date: newStartTime,
      displayDate: newStartTime,
    };
    app.events = events;
    fixture.detectChanges();
    app.startDragToCreate(segment);
    fixture.detectChanges();
    fixture.componentInstance.refresh();
    expect(app.events.length).to.equal(3);
    expect(app.showToast).to.equal(false);
  });

  it(`should not refresh events with new event, if new event is created through cell click at same event time & will showToast will have true value`, () => {
    const fixture = TestBed.createComponent(TimeRangePickerLibComponent);
    const app = fixture.componentInstance;
    const events: CalendarEvent[] = [
      {
        start: addMinutes(new Date("2022-08-30"), 55),
        end: addMinutes(new Date("2022-08-30"), 60),
        title: "test",
        draggable: true,
      },
      {
        start: addMinutes(new Date("2022-08-30"), 60),
        end: addMinutes(new Date("2022-08-30"), 75),
        title: "test",
        draggable: true,
      },
    ];
    const newStartTime: Date = addMinutes(new Date("2022-08-30"), 60);
    const segment: WeekViewHourSegment = {
      isStart: true,
      date: newStartTime,
      displayDate: newStartTime,
    };
    app.events = events;
    fixture.detectChanges();
    app.startDragToCreate(segment);
    fixture.detectChanges();
    fixture.componentInstance.refresh();
    expect(app.events.length).to.equal(2);
    expect(app.showToast).to.equal(true);
  });

  it(`should new refresh events with new event, if new event is created through cell click in between current times & will showToast will have true value`, () => {
    const fixture = TestBed.createComponent(TimeRangePickerLibComponent);
    const app = fixture.componentInstance;
    const events: CalendarEvent[] = [
      {
        start: addMinutes(new Date("2022-08-30"), 55),
        end: addMinutes(new Date("2022-08-30"), 60),
        title: "test",
        draggable: true,
      },
      {
        start: addMinutes(new Date("2022-08-30"), 60),
        end: addMinutes(new Date("2022-08-30"), 75),
        title: "test",
        draggable: true,
      },
    ];
    const newStartTime: Date = addMinutes(new Date("2022-08-30"), 65);
    const segment: WeekViewHourSegment = {
      isStart: true,
      date: newStartTime,
      displayDate: newStartTime,
    };
    app.events = events;
    fixture.detectChanges();
    app.startDragToCreate(segment);
    fixture.detectChanges();
    fixture.componentInstance.refresh();
    expect(app.events.length).to.equal(2);
    expect(app.showToast).to.equal(true);
  });

  it("should have delete close icon for an event that newly created event", fakeAsync(() => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent> =
      TestBed.createComponent(TimeRangePickerLibComponent);
    const app: TimeRangePickerLibComponent = fixture.componentInstance;
    fixture.componentInstance.ngOnInit();
    const events: CalendarEvent[] = [
      {
        start: addMinutes(new Date("2022-08-30"), 55),
        end: addMinutes(new Date("2022-08-30"), 60),
        title: "test",
        draggable: true,
      },
      {
        start: addMinutes(new Date("2022-08-30"), 60),
        end: addMinutes(new Date("2022-08-30"), 75),
        title: "test",
        draggable: true,
      },
    ];
    const newStartTime: Date = addMinutes(new Date("2022-08-30"), 20);
    const segment: WeekViewHourSegment = {
      isStart: true,
      date: newStartTime,
      displayDate: newStartTime,
    };
    app.events = events;
    fixture.detectChanges();
    app.startDragToCreate(segment);
    fixture.detectChanges();
    fixture.componentInstance.refresh();
    const event: HTMLCollection =
      fixture.nativeElement.querySelectorAll(".close-icon");
    expect(event.length).to.equal(1);
    discardPeriodicTasks();
    fixture.destroy();
  }));

  it("should able to show custom date in an event cell", fakeAsync(() => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent> = TestBed.createComponent(TimeRangePickerLibComponent);
    const app: TimeRangePickerLibComponent = fixture.componentInstance;
    fixture.componentInstance.ngOnInit();
    const newStartTime: Date = addMinutes(new Date("2022-08-30"), 20);
    const segment: WeekViewHourSegment = {
      isStart: true,
      date: newStartTime,
      displayDate: newStartTime,
    };
    fixture.detectChanges();
    app.startDragToCreate(segment);
    fixture.detectChanges();
    fixture.componentInstance.refresh();
    const event = fixture.nativeElement.querySelectorAll(".cal-event-title");
    expect(event.length).to.equal(1);
    expect(event[0].innerText).to.equal("5:50 AM - 6:05 AM");
    discardPeriodicTasks();
    fixture.destroy();
  }));

  it("should able to delete events if close icon of an event is clicked", fakeAsync(() => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent> = TestBed.createComponent(TimeRangePickerLibComponent);
    const app: TimeRangePickerLibComponent = fixture.componentInstance;
    fixture.componentInstance.ngOnInit();
    const events: CalendarEvent[] = [
      {
        start: addMinutes(new Date("2022-08-30"), 55),
        end: addMinutes(new Date("2022-08-30"), 60),
        title: "test",
        draggable: true,
      },
      {
        start: addMinutes(new Date("2022-08-30"), 60),
        end: addMinutes(new Date("2022-08-30"), 75),
        title: "test",
        draggable: true,
      },
    ];
    const newStartTime: Date = addMinutes(new Date("2022-08-30"), 20);
    const segment: WeekViewHourSegment = {
      isStart: true,
      date: newStartTime,
      displayDate: newStartTime,
    };
    app.events = events;
    fixture.detectChanges();
    app.startDragToCreate(segment);
    fixture.detectChanges();
    fixture.componentInstance.refresh();
    const event = fixture.nativeElement.querySelectorAll(".close-icon");
    expect(event.length).to.equal(1);
    expect(app.events.length).to.equal(3);
    event[0].click();
    fixture.detectChanges();
    expect(app.events.length).to.equal(2);
    discardPeriodicTasks();
    fixture.destroy();
  }));

  it("should show toastr message if showTastr is true", fakeAsync(() => {
    const fixture: ComponentFixture<TimeRangePickerLibComponent> =
      TestBed.createComponent(TimeRangePickerLibComponent);
    fixture.componentInstance.viewDate = new Date("2016-06-01");
    fixture.componentInstance.events = [
      {
        start: new Date("2016-05-30"),
        end: new Date("2016-06-02"),
        cssClass: "foo",
        title: "foo",
        color: {
          primary: "blue",
          secondary: "",
        },
      },
    ];
    fixture.componentInstance.showToast = true;
    fixture.detectChanges();
    const event: HTMLCollection =
      fixture.nativeElement.querySelectorAll(".toast-div");
    discardPeriodicTasks();
    expect(event.length).to.equal(1);
    flush();
    discardPeriodicTasks();
  }));
});
