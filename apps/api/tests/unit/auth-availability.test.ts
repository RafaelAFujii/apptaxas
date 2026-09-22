import { describe, expect, it } from 'vitest';
import { app } from '../../src/index.js';

describe('auth and availability routes', () => {
  it('authenticates a freelancer and rejects contractor access', async () => {
    const login = await app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: {
        cpf: '123.456.789-09',
        password: 'freelancer',
      },
    });
    expect(login.statusCode).toBe(200);
    const token = login.json().accessToken;
    const denied = await app.inject({
      method: 'GET',
      url: '/v1/demands',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(denied.statusCode).toBe(403);
  });
});
