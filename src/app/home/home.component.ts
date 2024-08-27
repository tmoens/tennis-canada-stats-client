import { Component } from '@angular/core';
import { AppStateService } from '../app-state.service';
import { STATS_TOOL_GROUPS } from '../../assets/stats-tool-groups';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  statsToolGroups = STATS_TOOL_GROUPS;

  constructor(
    public authService: AuthService,
    public appState: AppStateService
  ) {}
}
