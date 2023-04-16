const handler = require('../handlers');

test('Testing handlers', () => {
  const req = {};
  const res = { render: jest.fn() };
  handler.home(req, res);
  expect(res.render.mock.calls.length).toBe(1);
  expect(res.render.mock.calls[0][0]).toBe('home');
});

test('Testing 404 not found', () => {
  const req = {};
  const res = {
    type: jest.fn(),
    send: jest.fn()
  };
  handler.notfound(req, res);
  expect(res.type.mock.calls.length).toBe(1);
  expect(res.send.mock.calls.length).toBe(1);
  expect(res.type.mock.calls[0][0]).toBe('text/plain');
  expect(res.send.mock.calls[0][0]).toBe('404 - Not Found');
});

test('Testing server error', () => {
  const err = new Error('test error message');
  const next = {};
  const req = {};
  const res = {
    type: jest.fn(),
    send: jest.fn()
  };
  handler.servererror(err, req, res, next);
  expect(res.type.mock.calls.length).toBe(1);
  expect(res.send.mock.calls.length).toBe(1);
  expect(res.type.mock.calls[0][0]).toBe('text/plain');
  expect(res.send.mock.calls[0][0]).toBe('500 - Internal Error');
});

test('About page is provided a fortune', () => {
  const req = {};
  const res = { render: jest.fn() };
  handler.about(req, res);
  expect(res.render.mock.calls.length).toBe(1);
  expect(res.render.mock.calls[0][0]).toBe('about');
  expect(res.render.mock.calls[0][1]).toEqual(expect.objectContaining({ fortune: expect.stringMatching(/\W/) }));
});
