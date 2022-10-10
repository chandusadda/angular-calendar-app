import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { expect } from 'chai';

import { SignupSheetComponent, DurationOptions } from './signup-sheet.component';

@Component({
  template: `
      <lib-TimeRangePickerLib
        [isExpandable]="isExpandable"
        [duration]="durationValue"
        [hourSegments]="durationValue === 60 ? 1 : durationValue === 30 ? 2 : 4"
      ></lib-TimeRangePickerLib>
  `,
})

class TestComponent {
  isExpandable: boolean=false
  durationValue: number=15
}

describe('SignupSheetComponent', () => {
  let component: SignupSheetComponent;
  let fixture: ComponentFixture<SignupSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [ TestComponent, SignupSheetComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create SignupSheetComponent instance', () => {
    expect(component).to.be.ok;
  });

  it(`By default duration should have value 15`, () => {
    expect(component.durationValue).to.equal(15);
  });

  it(`By default isExpandable should have false value`, () => {
    expect(component.isExpandable).to.equal(false);
  });

  it(`Should update default duration value to 60`, () => {
    component.durationValue = 60;
    expect(component.durationValue).to.equal(60);
  });

  it(`Should update default isExpandable value to true`, () => {
    component.isExpandable = true;
    expect(component.isExpandable).to.equal(true);
  });

  it(`By default showCalendar should have false value`, () => {
    expect(component.showCalendar).to.equal(false);
  });

  it(`Should display view button by default`, () => {
    const fixture: ComponentFixture<SignupSheetComponent> =
    TestBed.createComponent(SignupSheetComponent);
    fixture.componentInstance.showCalendar = false;
    fixture.detectChanges();
    const event: HTMLCollection =  fixture.nativeElement.querySelectorAll(
      '.view-btn'
    );
    expect(event.length).to.equal(1);
  });

  it(`Should hide view button if showCalendar is true`, () => {
    const fixture: ComponentFixture<SignupSheetComponent> =
    TestBed.createComponent(SignupSheetComponent);
    fixture.componentInstance.showCalendar = true;
    fixture.detectChanges();
    const event: HTMLCollection =  fixture.nativeElement.querySelectorAll(
      '.view-btn'
    );
    expect(event.length).to.equal(0);
  });

  it(`Should hide view button, showCalendar is true & show calender view if view button is clicked`, () => {
    const fixture: ComponentFixture<SignupSheetComponent> =
    TestBed.createComponent(SignupSheetComponent);
    fixture.componentInstance.showCalendar = false;
    fixture.detectChanges();
    fixture.nativeElement.querySelector(
      '.view-btn'
    ).click()
    fixture.detectChanges();
    const event: HTMLCollection =  fixture.nativeElement.querySelectorAll(
      '.view-btn'
    );
    const calendarDiv: HTMLCollection =  fixture.nativeElement.querySelectorAll(
      '.time-picker-div'
    );
    expect(event.length).to.equal(0);
    expect(calendarDiv.length).to.equal(1);
    expect(fixture.componentInstance.showCalendar).to.equal(true);
  });

  it(`Should hide back button by default`, () => {
    const fixture: ComponentFixture<SignupSheetComponent> =
    TestBed.createComponent(SignupSheetComponent);
    fixture.componentInstance.showCalendar = false;
    fixture.detectChanges();
    const event: HTMLCollection =  fixture.nativeElement.querySelectorAll(
      '.back-btn'
    );
    expect(event.length).to.equal(0);
  });

  it(`Should show back button if showCalendar is true`, () => {
    const fixture: ComponentFixture<SignupSheetComponent> =
    TestBed.createComponent(SignupSheetComponent);
    fixture.componentInstance.showCalendar = true;
    fixture.detectChanges();
    const event: HTMLCollection =  fixture.nativeElement.querySelectorAll(
      '.back-btn'
    );
    expect(event.length).to.equal(1);
  });

  it(`Should hide back button, showCalendar is false & hide calender view if back button is clicked`, () => {
    const fixture: ComponentFixture<SignupSheetComponent> =
    TestBed.createComponent(SignupSheetComponent);
    fixture.componentInstance.showCalendar = true;
    fixture.detectChanges();
    fixture.nativeElement.querySelector(
      '.back-btn'
    ).click()
    fixture.detectChanges();
    const event: HTMLCollection =  fixture.nativeElement.querySelectorAll(
      '.back-btn'
    );
    const calendarDiv: HTMLCollection =  fixture.nativeElement.querySelectorAll(
      '.time-picker-div'
    );
    expect(event.length).to.equal(0);
    expect(calendarDiv.length).to.equal(0);
    expect(fixture.componentInstance.showCalendar).to.equal(false);
  });

  it(`Should have all durationOptions in dropdown while load`, () => {
    const fixture: ComponentFixture<SignupSheetComponent> =
    TestBed.createComponent(SignupSheetComponent);
    const durationOptions: DurationOptions[] = [
      { value: 15, name: 'Option 1' },
      { value: 30, name: 'Option 2' },
      { value: 60, name: 'Option 3' },
    ];
    fixture.componentInstance.durationOptions = durationOptions;
    fixture.detectChanges();
    const event: HTMLOptionsCollection =  fixture.nativeElement.querySelectorAll(
      'option'
    );
    expect(event.length).to.equal(4);
  });

  it(`Dropdown should have new durationOptions value, when new value is selected`, () => {
    const fixture: ComponentFixture<SignupSheetComponent> =
    TestBed.createComponent(SignupSheetComponent);
    const durationOptions: DurationOptions[] = [
      { value: 15, name: 'Option 1' },
      { value: 30, name: 'Option 2' },
      { value: 60, name: 'Option 3' },
    ];
    fixture.componentInstance.durationOptions = durationOptions;
    fixture.detectChanges();
    let newValue: number = fixture.componentInstance.durationValue;
    expect(newValue).to.equal(15);
    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '.form-select'
    );
    select.selectedIndex = 3;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    newValue = fixture.componentInstance.durationValue;
    expect(newValue).to.equal(60);
  });

});
