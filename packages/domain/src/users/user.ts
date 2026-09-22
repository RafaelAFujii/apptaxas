import { isValidCpf, normalizeCpf } from '../primitives/cpf.js';

export type UserRole = 'contractor' | 'freelancer';
export type User = {
  id: string;
  cpf: string;
  name: string;
  password: string;
  role: UserRole;
  status: 'active' | 'inactive';
};
export type RegisterUserInput = {
  id: string;
  cpf: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  role: UserRole;
};

export function createUser(input: RegisterUserInput): User {
  const cpf = normalizeCpf(input.cpf);
  if (!isValidCpf(cpf)) throw new Error('CPF inválido');
  if (!input.name.trim()) throw new Error('Nome é obrigatório');
  if (!input.password) throw new Error('Senha é obrigatória');
  if (input.password !== input.passwordConfirmation) throw new Error('As senhas não conferem');
  return {
    id: input.id,
    cpf,
    name: input.name.trim(),
    password: input.password,
    role: input.role,
    status: 'active',
  };
}
