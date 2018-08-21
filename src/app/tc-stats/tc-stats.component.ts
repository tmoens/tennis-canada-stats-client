import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AppStateService} from "../app-state.service";

@Component({
  selector: 'tc-stats',
  templateUrl: './tc-stats.component.html',
  styleUrls: ['./tc-stats.component.css']
})
export class TcStatsComponent {

  // originally isHandset$: Observable<BreakpointState> caused compiler errors - which
  // is strange, because that is exactly what this.breakpointObserver.observe() returns
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
              public appState: AppStateService)
  {}

  ngOnInit() {
  }
}
