import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [isLogin, setIsLogin] = useState(true); // filtra o formulário 
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // localStorage
  const [usersDb, setUsersDb] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // Usuário logado
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Função hash de password simples, se fosse database usava bcrypt
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Conversão para 32bit integer
    }
    return hash.toString();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = usersDb.find(
        u => u.email === loginData.email &&
        u.password === simpleHash(loginData.password)
      );

      if (!user) {
        throw new Error('Email ou senha incorretos');
      }

      setCurrentUser({ email: user.email });
      localStorage.setItem('currentUser', JSON.stringify({
        email: user.email
      }));

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!signupData.email || !signupData.password) {
        throw new Error('Preencha todos os campos');
      }

      if (usersDb.some(u => u.email === signupData.email)) {
        throw new Error('Email já cadastrado');
      }

      if (signupData.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      const newUser = {
        email: signupData.email,
        password: simpleHash(signupData.password)
      };

      const updatedUsers = [...usersDb, newUser];
      setUsersDb(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    navigate('/auth');
  };

  if (currentUser) {
    return (
      <div>
        <h2>Bem-vindo!</h2>
        <p>Email: {currentUser.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Registro'}</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {isLogin && (
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processando...' : 'Entrar'}
          </button>
        </form>
      )}
      
      {!isLogin && (
        <form onSubmit={handleSignup}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={(e) => setSignupData({...signupData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={(e) => setSignupData({...signupData, password: e.target.value})}
              required
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processando...' : 'Registrar'}
          </button>
        </form>
      )}
      
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        disabled={loading}
      >
        {isLogin ? 'Fazer Registro' : 'Fazer Login'}
      </button>
    </div>
  );
};

export default App;