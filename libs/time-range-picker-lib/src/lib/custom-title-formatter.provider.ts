import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent, DateFormatterParams } from 'angular-calendar';
import { formatDate } from '@angular/common';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {

  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  /**
   * weekViewColumnHeader will convert current week view header names to custom format
   * @param DateFormatterParams will provide current week date's
   */
   weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'EEE', locale);
  }

  /**
   * week will convert current event start & end times to custom format
   * @param event will provide current event values
   */
  week(event: CalendarEvent): string {
    return `<b>${formatDate(event.start, 'h:mm a', this.locale)} - ${formatDate(event.end, 'h:mm a', this.locale)}</b>`;
  }

  /**
   * weekTooltip will convert current event start & end times to custom format
   * @param event will provide current event values
   */
  weekTooltip(event: CalendarEvent): string {
    return `<b>${formatDate(event.start, 'h:mm a', this.locale)} - ${formatDate(event.end, 'h:mm a', this.locale)}</b>`;
  }
}
