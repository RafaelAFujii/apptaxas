import { describe, expect, it } from 'vitest';
import { createUser, isValidCpf } from '../index.js';

describe('user registration', () => {
  it('validates and normalizes CPF', () => {
    expect(isValidCpf('123.456.789-09')).toBe(true);
    expect(
      createUser({
        id: '1',
        cpf: '123.456.789-09',
        name: 'Ana',
        password: 'senha',
        passwordConfirmation: 'senha',
        role: 'freelancer',
      }).cpf,
    ).toBe('12345678909');
  });

  it('rejects mismatched password confirmation', () => {
    expect(() =>
      createUser({
        id: '1',
        cpf: '12345678909',
        name: 'Ana',
        password: 'senha',
        passwordConfirmation: 'outra',
        role: 'freelancer',
      }),
    ).toThrow('senhas não conferem');
  });
});
