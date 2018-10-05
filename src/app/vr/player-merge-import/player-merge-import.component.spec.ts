import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerMergeImportComponent } from './player-merge-import.component';

describe('PlayerImportComponent', () => {
  let component: PlayerMergeImportComponent;
  let fixture: ComponentFixture<PlayerMergeImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerMergeImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerMergeImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
