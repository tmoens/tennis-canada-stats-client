import {STATSTOOL} from './stats-tools';
import {StatsToolGroup} from './stats-tool-group';

export const STATS_TOOL_GROUPS: StatsToolGroup[] = [
  new StatsToolGroup(
    'License Tools',
    'Manage and report on VR licenses',
    [STATSTOOL.LICENSE_REPORTER, STATSTOOL.LICENSE_MANAGER]
  ),

  new StatsToolGroup(
    'Data Reporting',
    'Get play statistics reports',
    [STATSTOOL.TOURNAMENT_STRENGTH_REPORTER, STATSTOOL.PLAY_REPORTER, STATSTOOL.UTR_REPORTER]
  ),

  new StatsToolGroup(
    'Player Data Management',
    'Load data about players, manually adjust IFT player data',
    [STATSTOOL.PLAYER_IMPORTER, STATSTOOL.PLAYER_MERGE_IMPORTER]
  ),

  new StatsToolGroup(
    'ITF Data Manager',
    'Review and manually update data imported from the ITF',
    [ STATSTOOL.ITF_ID_MATCHING, STATSTOOL.ITF_RESULTS_UPDATE ]
  ),

  new StatsToolGroup(
    'BC Membership Checker',
    'Validate membership lists for update',
    [STATSTOOL.PLAYER_CHECK],
  ),

  new StatsToolGroup(
    'User Management',
    'Add, change, activate, users.',
    [STATSTOOL.USER_MANAGER],
  ),
];

