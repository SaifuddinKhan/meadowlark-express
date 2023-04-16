const fetch = require('node-fetch');

const baseUrl = 'http://localhost:3000';

async function _fetch (method, path, body) {
  body = typeof (body) === 'string' ? body : JSON.stringify(body);
  const headers = { 'Content-Type': 'application/json' };
  const res = await fetch(baseUrl + path, { method, body, headers });
  if (res.status < 200 || res.status > 299) throw new Error('fetch failed with response status:', res.status);
  return res.json();
}

describe('API tests', () => {
  test('Get Vacations API test', async () => {
    const vacations = await _fetch('get', '/api/vacations');
    expect(vacations.length).not.toBe(0);
    expect(vacations[0].name).toMatch(/\w/);
    expect(typeof (vacations[0].price)).toBe('number');
  });

  test('Get Vacations by SKU test', async () => {
    const vacations = await _fetch('get', '/api/vacations');
    expect(vacations.length).not.toBe(0);
    const sku = vacations[0].sku;
    const vacation = await _fetch('get', `/api/vacations/${sku}`);
    expect(vacations[0].name).toBe(vacation[0].name);
  });
});
