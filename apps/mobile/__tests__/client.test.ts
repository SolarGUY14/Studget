import { getHealth } from '../src/api/client';

const fetchMock = jest.fn();
const originalFetch = global.fetch;
beforeEach(() => {
  global.fetch = fetchMock;
  fetchMock.mockReset();
});
afterEach(() => {
  global.fetch = originalFetch;
  jest.useRealTimers();
});

test('calls the health route and validates a healthy response', async () => {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({ status: 'healthy' }),
  });
  await expect(getHealth('http://example.test/')).resolves.toEqual({
    status: 'healthy',
  });
  expect(fetchMock).toHaveBeenCalledWith(
    'http://example.test/health',
    expect.objectContaining({ signal: expect.anything() }),
  );
});

test('rejects an HTTP failure', async () => {
  fetchMock.mockResolvedValue({ ok: false });
  await expect(getHealth()).rejects.toThrow('unavailable');
});

test.each([null, {}, { status: 'unhealthy' }])(
  'rejects invalid payload %p',
  async (payload) => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => payload });
    await expect(getHealth()).rejects.toThrow('unexpected response');
  },
);

test('propagates network failures', async () => {
  fetchMock.mockRejectedValue(new Error('Network failed'));
  await expect(getHealth()).rejects.toThrow('Network failed');
});

test('aborts a request after the timeout', async () => {
  jest.useFakeTimers();
  fetchMock.mockImplementation(
    (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new Error('Aborted')));
      }),
  );
  const result = expect(getHealth('http://example.test', 100)).rejects.toThrow(
    'Aborted',
  );
  jest.advanceTimersByTime(100);
  await result;
});
