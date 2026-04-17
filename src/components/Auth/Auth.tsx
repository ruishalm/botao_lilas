import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../../firebase';
import styles from './Auth.module.css';

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Erro de autenticação.');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar com Google.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.userInfo}>
          <p>Logado como: <strong>{user.email}</strong></p>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sair</button>
        </div>
        <p className={styles.cloudSync}>☁️ Seus dados estão sendo salvos na nuvem automaticamente.</p>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <h3 className={styles.title}>{isLogin ? 'Entrar' : 'Criar Conta'}</h3>
      <p className={styles.subtitle}>Crie uma conta para sincronizar seus dados na nuvem, ou continue usando apenas no seu celular.</p>
      
      {error && <p className={styles.error}>{error}</p>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="email" 
          placeholder="E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className={styles.input}
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          minLength={6}
          className={styles.input}
        />
        <button type="submit" className={styles.submitBtn}>
          {isLogin ? 'Entrar' : 'Registrar'}
        </button>
      </form>
      
      <div className={styles.divider}>ou</div>
      
      <button type="button" onClick={handleGoogleSignIn} className={styles.googleBtn}>
        Entrar com Google
      </button>

      <button 
        type="button" 
        className={styles.switchBtn} 
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem conta? Entre'}
      </button>
    </div>
  );
};

export default Auth;
