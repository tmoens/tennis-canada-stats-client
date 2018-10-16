import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentStrengthComponent } from './tournament-strength.component';

describe('TournamentStrengthComponent', () => {
  let component: TournamentStrengthComponent;
  let fixture: ComponentFixture<TournamentStrengthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentStrengthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentStrengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
