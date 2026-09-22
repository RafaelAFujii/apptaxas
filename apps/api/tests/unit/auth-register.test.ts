import { describe, expect, it } from 'vitest';
import { app } from '../../src/index.js';

describe('auth registration and CPF login', () => {
  it('logs in with the development demo credential', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: { cpf: '123.456.789-00', password: 'admin' },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().user.role).toBe('contractor');
  });

  it('rejects mismatched registration passwords', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/auth/register',
      payload: {
        cpf: '11144477735',
        name: 'Ana',
        password: 'a',
        passwordConfirmation: 'b',
        role: 'freelancer',
      },
    });
    expect(response.statusCode).toBe(422);
  });
});
