import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'work-hours',
  templateUrl: './work-hours.component.html',
  styleUrls: ['./work-hours.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkHoursComponent implements OnInit {
  isExpandable: boolean = true;
  duration: number = 30;
  constructor() { }

  ngOnInit(): void {
  }

}
