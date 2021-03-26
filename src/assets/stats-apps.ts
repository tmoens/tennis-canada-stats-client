import {RIGHTS, StatsApp} from './stats-app';


export const STATS_APPS: StatsApp[] = [
  new StatsApp(
    'License Manager',
    '/vr_license_manager',
    'Add a PTA for any licenses that do not have one'
  ),
  new StatsApp(
    'License Reporter Manager',
    '/vr_license_reporter',
    'Learn about VR Tournament Planner license usage',
    '',
    [RIGHTS.BC_MEMBERSHIP, RIGHTS.ADMIN],
  ),
  new StatsApp(
    'Player Importer',
    '/player_import',
    'Load the most recent player data into the system.',
    'This should be done monthly'
  ),
  new StatsApp(
    'Player Merge Importer',
    '/player_merge_import',
    'Tell the system about player Id merges in VR.',
  ),
  new StatsApp(
    'Tournament Strength Reporter',
    '/tournament_strength',
    'Rate a set of tournaments based on their strength.',
  ),
  new StatsApp(
    'UTR Reporter',
    '/utr_report',
    'Send recent match data to UTR.',
  ),
  new StatsApp(
    'External Data Admin',
    '/external_data_admin',
    'Manage competitive data from non Tennis Canada tournaments.',
  ),
  new StatsApp(
    'ITF Data Exporter',
    '/itf_exports',
    'Create excel files to export to the ITF',
  ),
  new StatsApp(
    'WTN Uploader',
    '/wtn_uploader',
    'Load known WTN IDs into VR player records',
  ),
  new StatsApp(
    'WTN Synch Audit Reporter',
    '/wtn_sync_report',
    'Report on the synch between WTN players and Tennis Canada VR Players',
  ),
  new StatsApp(
    'BC Membership List Checker',
    '/player_check',
    'Given a a workbook with membership lists of partial player information,' +
    'or confirm the identity of players on the lists.',
    '',
    [RIGHTS.BC_MEMBERSHIP],
  ),
];
