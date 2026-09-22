import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [online, setOnline] = useState(false);
  const [offerVisible, setOfferVisible] = useState(false);

  function login() {
    if (cpf.replace(/\D/g, '') === '12345678900' && password === 'admin') {
      setAuthenticated(true);
      setMessage('Login realizado com sucesso.');
    } else {
      setMessage('CPF ou senha inválidos.');
    }
  }

  if (!authenticated) {
    return (
      <SafeAreaView style={styles.authScreen}>
        <Text style={styles.eyebrow}>APPTAXAS / ACESSO</Text>
        <Text style={styles.authTitle}>
          {registering ? 'Crie sua conta.' : 'Entre para começar.'}
        </Text>
        <Text style={styles.copy}>
          {registering
            ? 'Escolha seu perfil e encontre seu próximo trabalho.'
            : 'Sua operação de taxas começa aqui.'}
        </Text>
        {registering && (
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#718096"
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#718096"
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#718096"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {registering && (
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#718096"
            secureTextEntry
          />
        )}
        <Pressable
          style={styles.primary}
          onPress={
            registering
              ? () => {
                  setRegistering(false);
                  setMessage('Cadastro realizado. Faça login para continuar.');
                }
              : login
          }
        >
          <Text style={styles.primaryText}>{registering ? 'Criar conta' : 'Entrar'}</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setRegistering((value) => !value);
            setMessage('');
          }}
        >
          <Text style={styles.link}>
            {registering ? 'Já tenho uma conta' : 'Ainda não tenho cadastro'}
          </Text>
        </Pressable>
        {!!message && <Text style={styles.message}>{message}</Text>}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.eyebrow}>APPTAXAS / FREELANCER</Text>
      <Text style={styles.title}>Trabalhos próximos, no seu ritmo.</Text>
      <View style={styles.map}>
        <Text style={styles.mapLabel}>{online ? 'MAPA AO VIVO' : 'MAPA OFFLINE'}</Text>
        {online && (
          <Pressable
            accessibilityLabel="Abrir taxa próxima"
            style={styles.pin}
            onPress={() => setOfferVisible(true)}
          >
            <Text style={styles.pinText}>R$ 180</Text>
          </Pressable>
        )}
      </View>
      <Pressable
        style={[styles.toggle, online && styles.toggleOnline]}
        onPress={() => setOnline((value) => !value)}
      >
        <Text style={styles.primaryText}>{online ? 'Ficar offline' : 'Ficar online'}</Text>
      </Pressable>
      {offerVisible && (
        <View style={styles.sheet}>
          <Text style={styles.sheetEyebrow}>NOVA TAXA</Text>
          <Text style={styles.sheetTitle}>Auxiliar de cozinha</Text>
          <Text style={styles.sheetDetails}>Rua Central · Hoje às 18h · R$ 180 · 1,2 km</Text>
          <View style={styles.actions}>
            <Pressable onPress={() => setOfferVisible(false)}>
              <Text style={styles.decline}>Recusar</Text>
            </Pressable>
            <Pressable style={styles.accept} onPress={() => setOfferVisible(false)}>
              <Text style={styles.primaryText}>Aceitar taxa</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authScreen: { flex: 1, backgroundColor: '#F7F4EE', padding: 24, justifyContent: 'center' },
  screen: { flex: 1, backgroundColor: '#F7F4EE', padding: 24 },
  eyebrow: { color: '#E85D04', fontWeight: '700', letterSpacing: 2 },
  authTitle: { color: '#17202A', fontSize: 40, fontWeight: '800', marginVertical: 18 },
  title: { color: '#17202A', fontSize: 34, fontWeight: '800', marginVertical: 18 },
  copy: { color: '#17202A', fontSize: 16, lineHeight: 24, marginBottom: 18 },
  input: {
    borderWidth: 1,
    borderColor: '#C7C0B4',
    padding: 14,
    marginBottom: 12,
    color: '#17202A',
    backgroundColor: '#FFF',
  },
  primary: { backgroundColor: '#17202A', padding: 18, alignItems: 'center', marginTop: 8 },
  primaryText: { color: '#FFF', fontWeight: '800' },
  link: { color: '#E85D04', textAlign: 'center', fontWeight: '700', marginTop: 20 },
  message: { color: '#2A9D8F', textAlign: 'center', marginTop: 18 },
  map: {
    flex: 1,
    minHeight: 360,
    backgroundColor: '#DDE8E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLabel: { color: '#527064', fontWeight: '700', letterSpacing: 2 },
  pin: { backgroundColor: '#E85D04', padding: 14, position: 'absolute', top: '42%', left: '54%' },
  pinText: { color: '#FFF', fontWeight: '800' },
  toggle: { backgroundColor: '#17202A', padding: 18, alignItems: 'center', marginTop: 18 },
  toggleOnline: { backgroundColor: '#2A9D8F' },
  sheet: {
    backgroundColor: '#FFF',
    padding: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetEyebrow: { color: '#E85D04', fontWeight: '800', letterSpacing: 2 },
  sheetTitle: { color: '#17202A', fontSize: 30, fontWeight: '800', marginVertical: 10 },
  sheetDetails: { color: '#17202A', fontSize: 16, lineHeight: 24 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  decline: { color: '#17202A', fontWeight: '700' },
  accept: { backgroundColor: '#E85D04', padding: 16 },
});
