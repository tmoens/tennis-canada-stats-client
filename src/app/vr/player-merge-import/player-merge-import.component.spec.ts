import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerImportComponent } from './player-merge-import.component';

describe('PlayerImportComponent', () => {
  let component: PlayerImportComponent;
  let fixture: ComponentFixture<PlayerImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
