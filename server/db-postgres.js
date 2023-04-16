/* eslint-disable no-useless-escape */
const { postgres } = require('./.credentials.development.json');
const { Pool } = require('pg');
const _ = require('lodash');

const connectionString = postgres.connectionString;
const pool = new Pool({ connectionString });
console.log('Connected to elephantsql');

module.exports = {
  getVacations: async () => {
    const { rows } = await pool.query('SELECT * FROM vacations');
    return rows.map((row) => {
      const vacation = _.mapKeys(row, (v, k) => _.camelCase(k));
      vacation.price = parseFloat(vacation.price.replace('/^\$/', ''));
      vacation.location = {
        search: vacation.locationSearch,
        coordinates: {
          lat: vacation.locationLat,
          lng: vacation.locationLng
        }
      };
      return vacation;
    });
  },
  addVacationInSeasonListener: async (email, sku) => {
    await pool.query('INSERT INTO vacation_in_season_listener (email,sku) VALUES ($1, $2) ON CONFLICT DO NOTHING', [email, sku]);
  }
};
