
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcStatsComponent } from './tc-stats.component';

describe('TcStatsComponent', () => {
  let component: TcStatsComponent;
  let fixture: ComponentFixture<TcStatsComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TcStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TcStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
