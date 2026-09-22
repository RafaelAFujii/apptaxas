import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Role = 'contractor' | 'freelancer';

type Session = { user: { name: string; role: Role }; accessToken: string };

const demoSession: Session = {
  user: { name: 'Demonstração', role: 'contractor' },
  accessToken: 'demo',
};

function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [registering, setRegistering] = React.useState(false);
  const [message, setMessage] = React.useState('');

  function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get('cpf') === '12345678900' && form.get('password') === 'admin') {
      setSession(demoSession);
      setMessage('Login realizado com sucesso.');
      return;
    }
    setMessage('CPF ou senha inválidos.');
  }

  function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get('password') !== form.get('passwordConfirmation')) {
      setMessage('As senhas não conferem.');
      return;
    }
    setMessage('Cadastro realizado. Faça login para continuar.');
    setRegistering(false);
  }

  if (!session) {
    return (
      <main>
        <p className="eyebrow">APPTAXAS / ACESSO</p>
        <h1>{registering ? 'Crie sua conta.' : 'Entre para começar.'}</h1>
        <p>
          {registering
            ? 'Escolha seu perfil e encontre seu próximo ritmo de trabalho.'
            : 'Sua operação de taxas começa aqui.'}
        </p>
        <form onSubmit={registering ? submitRegistration : submitLogin}>
          {registering && (
            <>
              <label>
                Nome
                <input required name="name" placeholder="Seu nome completo" />
              </label>
              <label>
                Perfil
                <select required name="role" defaultValue="contractor">
                  <option value="contractor">Contratante</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              </label>
            </>
          )}
          <label>
            CPF
            <input required name="cpf" inputMode="numeric" placeholder="000.000.000-00" />
          </label>
          <label>
            Senha
            <input required name="password" type="password" placeholder="Sua senha" />
          </label>
          {registering && (
            <label>
              Confirmar senha
              <input
                required
                name="passwordConfirmation"
                type="password"
                placeholder="Repita sua senha"
              />
            </label>
          )}
          <button type="submit">{registering ? 'Criar conta' : 'Entrar'}</button>
        </form>
        <button
          className="secondary"
          type="button"
          onClick={() => {
            setRegistering((value) => !value);
            setMessage('');
          }}
        >
          {registering ? 'Já tenho uma conta' : 'Ainda não tenho cadastro'}
        </button>
        {message && (
          <p className="success" role="status">
            {message}
          </p>
        )}
      </main>
    );
  }

  return (
    <main>
      <p className="eyebrow">APPTAXAS / CONTRATANTE</p>
      <h1>Publique a próxima taxa.</h1>
      <p>Olá, {session.user.name}. Crie trabalhos pontuais para sua equipe.</p>
      <button onClick={() => setSession(null)}>Sair</button>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
