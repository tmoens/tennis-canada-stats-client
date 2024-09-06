import {ADMIN_ROLE, USER_ROLE} from '../app/auth/app-roles';

export class STATSTOOL {
  static readonly HOME = new STATSTOOL(
    'Home',
    'home',
    'TC Stats Tools Home'
  );
  static readonly LICENSE_MANAGER = new STATSTOOL(
    'License Manager',
    'vr_license_manager',
    'Add a PTA for any licenses that do not have one'
  );
  static readonly LICENSE_REPORTER = new STATSTOOL(
    'License Reporter Manager',
    'vr_license_reporter',
    'Learn about VR Tournament Planner license usage',
  );
  static readonly PLAYER_IMPORTER = new STATSTOOL(
    'Player Importer',
    'player_import',
    'Load the most recent player data into the system.',
    'This should be done monthly'
  );
  static readonly PLAYER_MERGE_IMPORTER = new STATSTOOL(
    'Player Merge Importer',
    'player_merge_import',
    'Tell the system about player Id merges in VR.'
  );
  static readonly TOURNAMENT_STRENGTH_REPORTER = new STATSTOOL(
    'Tournament Strength Reporter',
    'tournament_strength',
    'Rate a set of tournaments based on their strength.'
  );
  static readonly MATCH_COMPETITIVENESS_REPORTER = new STATSTOOL(
    'Match Competitiveness Reporter',
    'match_competitiveness',
    'Report competitive of all matches since 2022-01-01'
  );
  static readonly PLAY_REPORTER = new STATSTOOL(
    'Play Reporter',
    'play_reporter',
    'For every event in a given time period, list every player who played.',
    'Generates an excel report with one line for each player who entered an event.  ' +
    'By putting the data in a pivot table Tennis Canada can develop a clear ' +
    'understanding of how the game is growing in various areas' +
    'and in various play categories.'
  );
  static readonly UTR_REPORTER = new STATSTOOL(
    'UTR Reporter',
    'utr_report',
    'Send recent match data to UTR.',
    ''
  );
  static readonly EXTERNAL_DATA_ADMIN = new STATSTOOL(
    'External Data Admin',
    'external_data_admin',
    'Manage competitive data from non Tennis Canada tournaments.',
    ''
  );
  static readonly ITF_ID_MATCHING = new STATSTOOL(
    'ITF Player ID Matching',
    'external_data_admin/idmapping',
    'Computer assisted mapping of ITF player numbers to VR IDs.',
    ''
  );
  static readonly ITF_RESULTS_UPDATE = new STATSTOOL(
    'ITF Results Update',
    'external_data_admin/resultsBrowser',
    'Browse and update results imported from the ITF.',
    ''
  );
  static readonly GRADER = new STATSTOOL(
    'Grade Checker',
    'grader',
    'Check and approve the grade of leagues and tournaments as assigned by the TD.',
    ''
  );
  static readonly USER_MANAGER = new STATSTOOL(
    'User Manager',
    'user_admin',
    'Administer users',
    '',
    ADMIN_ROLE
  );

  // private to disallow creating other instances than the static ones above.
  private constructor(
    public readonly displayName: string,
    public readonly route: string,
    public readonly description: string,
    public readonly details: any = null,
    public readonly requiredRole: string = USER_ROLE
  ) {
  }

  // If you talk about a particular tool without specifying an attribute, you get its route.
  toString() {
    return this.route;
  }
}

