import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { expect } from 'chai';
describe('AppComponent', () => {
  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it(`should have as title 'CalendarApp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).to.equal("CalendarApp");
  });

  it(`should have as title '' if updated`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.title = "";
    fixture.detectChanges();
    expect(app.title).to.equal("");
  });
});
