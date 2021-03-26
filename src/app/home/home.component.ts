import {Component, OnInit} from '@angular/core';
import {AppStateService} from '../app-state.service';
import {Router} from '@angular/router';
import {StatsApp} from '../../assets/stats-app';
import {STATS_APPS} from '../../assets/stats-apps';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  public statsApps = STATS_APPS;
  constructor(
    private router: Router,
    public appState: AppStateService,
    ) {
  }

  ngOnInit() {
    this.appState.setActiveTool('Home');
  }

  navigateToApp(app: StatsApp) {
    this.router.navigateByUrl(app.route);
  }
}
