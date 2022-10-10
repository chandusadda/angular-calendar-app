import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

export interface DurationOptions {
  value: number,
  name: string
}

@Component({
  selector: 'signup-sheet',
  templateUrl: './signup-sheet.component.html',
  styleUrls: ['./signup-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupSheetComponent {
  showCalendar: boolean = false;
  durationValue: number = 15;
  isExpandable: boolean = false;

  //durationOptions will hold event duration values
  durationOptions: DurationOptions[] = [
    { value: 15, name: 'Option 1' },
    { value: 30, name: 'Option 2' },
    { value: 60, name: 'Option 3' },
  ];

  /**
   * getSelectedDuration will show calendar on click of view button
   */
  getSelectedDuration(): void {
    this.showCalendar = true;
  }

  /**
   * hideCalendar will hide calendar on click of back button
   */
  hideCalendar(): void {
    this.durationValue = 15;
    this.showCalendar = false;
  }
}
