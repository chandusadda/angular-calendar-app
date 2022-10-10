import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from 'chai';

import { WorkHoursComponent } from './work-hours.component';

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
  isExpandable: boolean=true
  duration: number=30
}

describe('WorkHoursComponent', () => {
  let component: WorkHoursComponent;
  let fixture: ComponentFixture<WorkHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create WorkHoursComponent instance', () => {
    expect(component).to.be.ok;
  });

  it(`By default duration should have value 30`, () => {
    expect(component.duration).to.equal(30);
  });

  it(`By default isExpandable should have true value`, () => {
    expect(component.isExpandable).to.equal(true);
  });

  it(`Should update default duration value to 60`, () => {
    component.duration = 60;
    expect(component.duration).to.equal(60);
  });

  it(`Should update default isExpandable value to false`, () => {
    component.isExpandable = false;
    expect(component.isExpandable).to.equal(false);
  });
});
