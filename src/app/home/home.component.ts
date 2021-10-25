import {Component, OnInit} from '@angular/core';
import {AppStateService} from '../app-state.service';
import {Router} from '@angular/router';
import {STATSTOOL} from '../../assets/stats-tools';
import {STATS_TOOL_GROUPS} from '../../assets/stats-tool-groups';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  statsToolGroups = STATS_TOOL_GROUPS;

  constructor(
    private router: Router,
    public authService: AuthService,
    public appState: AppStateService,
    ) {
  }

  ngOnInit() {
  }

  navigateToApp(tool: STATSTOOL) {
    this.router.navigateByUrl(tool.route);
  }
}
