import { TennisAssociation } from '../app/util/province';

// TODO - this data is redundant with the TennisAssociation table in the database
// it should be fetched rather than hard coded.

export const TENNIS_ASSOCIATIONS: TennisAssociation[] = [
  new TennisAssociation(
    'Alberta',
    'AB',
    'Tennis Alberta',
    'tennisAlberta.com',
    'tc.tournamentsoftware.com'
  ),
  new TennisAssociation(
    'British Columbia',
    'BC',
    'Tennis BC',
    'tennisBC.org',
    'tc.tournamentsoftware.com'
  ),
  new TennisAssociation(
    'Manitoba',
    'MB',
    'Tennis Manitoba',
    'tennisManitoba.com',
    'tc.tournamentsoftware.com'
  ),
  new TennisAssociation(
    'New Brunswick',
    'NB',
    'Tennis New Brunswick',
    'newBrunswick.tennisCanada.com',
    'tc.tournamentsoftware.com'
  ),
  new TennisAssociation(
    'Newfoundland and Labrador',
    'NL',
    'Tennis Newfoundland',
    'newfoundland.tennisCanada.com',
    'tc.tournamentsoftware.com'
  ),
  new TennisAssociation(
    'Nova Scotia',
    'NS',
    'Tennis Nova Scotia',
    'novaScotia.tennisCanada.com',
    'tc.tournamentsoftware.com'
  ),
  new TennisAssociation(
    'Ontario',
    'ON',
    'Ontario Tennis Association',
    'www.tennisOntario.com',
    'ota.tournamentsoftware.com'
  ),
  new TennisAssociation(
    'Prince Edward Island',
    'PE',
    'Tennis PEI',
    'pei.tennisCanada.com',
    'tc.tournamentsoftware.com'
  ),
  new TennisAssociation(
    'Québec',
    'QC',
    'Tennis Québec',
    'tennis.qc.ca.com',
    'tq.tournamentsoftware.com'
  ),
  new TennisAssociation(
    'Saskatchewan',
    'SK',
    'Tennis Saskatchewan',
    'tennisSask.com',
    'tc.tournamentsoftware.com'
  ),
  new TennisAssociation(
    'Canada',
    'TC',
    'Tennis Canada',
    'tennisCSanada.com',
    'tc.tournamentsoftware.com'
  ),
];
