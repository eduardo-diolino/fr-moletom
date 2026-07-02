import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, UserPlus, Key } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  GoogleAuthProvider, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string) => void;
}

type TabType = 'login' | 'register' | 'recover';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);
    try {
      if (activeTab === 'login') {
        if (!email || !password) {
          setFeedback({ text: 'Por favor, preencha todos os campos!', type: 'error' });
          setIsLoading(false);
          return;
        }
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário';
        onLoginSuccess(displayName, firebaseUser.email || '');
        setFeedback({ text: `Bem-vindo, ${displayName}! Login realizado com sucesso.`, type: 'success' });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else if (activeTab === 'register') {
        if (!email || !name || !password || !confirmPassword) {
          setFeedback({ text: 'Por favor, preencha todos os campos!', type: 'error' });
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setFeedback({ text: 'As senhas não coincidem!', type: 'error' });
          setIsLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        await updateProfile(firebaseUser, { displayName: name });
        onLoginSuccess(name, email);
        setFeedback({ text: `Conta criada com sucesso! Bem-vindo(a) ${name}!`, type: 'success' });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        if (!email) {
          setFeedback({ text: 'Por favor, digite seu e-mail!', type: 'error' });
          setIsLoading(false);
          return;
        }
        await sendPasswordResetEmail(auth, email);
        setFeedback({ text: `Um link de recuperação foi enviado para: ${email}`, type: 'success' });
        setTimeout(() => {
          setActiveTab('login');
          setFeedback(null);
        }, 3000);
      }
    } catch (error: any) {
      let friendlyError = error.message;
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        friendlyError = 'E-mail ou senha inválidos.';
      } else if (error.code === 'auth/email-already-in-use') {
        friendlyError = 'Este e-mail já está sendo utilizado.';
      } else if (error.code === 'auth/weak-password') {
        friendlyError = 'A senha deve possuir pelo menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-email') {
        friendlyError = 'E-mail inválido.';
      }
      setFeedback({ text: `Erro: ${friendlyError}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      const displayName = firebaseUser.displayName || 'Usuário';
      onLoginSuccess(displayName, firebaseUser.email || '');
      setFeedback({ text: `Bem-vindo, ${displayName}! Login com Google realizado com sucesso.`, type: 'success' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      setFeedback({ text: `Erro no login com Google: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background cover */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Main card box */}
      <div className="relative bg-white rounded-none p-6 sm:p-8 max-w-md w-full shadow-2xl overflow-hidden z-10 animate-slideIn border border-gray-150">
        
        {/* Header Close absolute */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-[#FF7A00] rounded-none hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X size={20} />
        </button>

        {/* Tab switch tags */}
        <div className="flex border-b border-gray-100 mb-6 mt-2 text-xs sm:text-sm font-bold uppercase transition-all">
          <button
            onClick={() => handleTabChange('login')}
            disabled={isLoading}
            className={`flex-1 text-center pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'border-[#002855] text-[#002855]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => handleTabChange('register')}
            disabled={isLoading}
            className={`flex-1 text-center pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'border-[#002855] text-[#002855]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Dynamic Titles */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold font-display text-[#002855] uppercase tracking-wide">
            {activeTab === 'login' && 'Bem-vindo de Volta!'}
            {activeTab === 'register' && 'Criar Nova Conta'}
            {activeTab === 'recover' && 'Recuperar Senha'}
          </h3>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            {activeTab === 'login' && 'Acesse seus pedidos favoritos e configure seu carrinho'}
            {activeTab === 'register' && 'Cadastre-se na FR Moletom para vantagens exclusivas'}
            {activeTab === 'recover' && 'Insira seu email para simular o reset de senha'}
          </p>
        </div>

        {/* Inline Feedback Banner */}
        {feedback && (
          <div className={`mb-5 p-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between border ${
            feedback.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-emerald-50 border-emerald-250 text-emerald-750'
          }`}>
            <span className="flex-1 pr-2">{feedback.text}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-[10px] font-black opacity-60 hover:opacity-100 cursor-pointer self-start h-4 w-4 flex items-center justify-center rounded-full hover:bg-black/5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form panel */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {activeTab === 'register' && (
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                required
                disabled={isLoading}
                placeholder="Seu Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-none py-3.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#002855] disabled:opacity-60"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              required
              disabled={isLoading}
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-none py-3.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#002855] disabled:opacity-60"
            />
          </div>

          {activeTab !== 'recover' && (
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                required
                disabled={isLoading}
                placeholder="Sua senha de acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-none py-3.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#002855] disabled:opacity-60"
              />
            </div>
          )}

          {activeTab === 'register' && (
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                required
                disabled={isLoading}
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-none py-3.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#002855] disabled:opacity-60"
              />
            </div>
          )}

          {activeTab === 'login' && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setActiveTab('recover')}
              className="text-right text-[10px] font-bold text-gray-400 hover:text-[#FF7A00] self-end -mt-1 transition-colors cursor-pointer disabled:opacity-50"
            >
              Esqueceu sua senha?
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#002855] hover:bg-[#FF7A00] text-white py-4 rounded-none font-bold text-xs uppercase tracking-widest transition-colors mt-2 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Aguarde...' : (
              <>
                {activeTab === 'login' && 'Entrar na Conta'}
                {activeTab === 'register' && 'Cadastrar Grátis'}
                {activeTab === 'recover' && 'Enviar Recuperação'}
              </>
            )}
          </button>
        </form>

        {activeTab !== 'recover' && (
          <div className="mt-4 flex flex-col gap-3">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-150"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase">Ou continue com</span>
              <div className="flex-grow border-t border-gray-150"></div>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleLogin}
              className="w-full border border-gray-250 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-none font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38C16.88,16.27,14.67,18,12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.55,0,2.95,0.59,4.01,1.55l2.01-2.01C16.32,3.87,14.3,3,12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9c4.71,0,8.75-3.41,9.35-8.1H21.35z" fill="#34A853" />
                  <path d="M21.35,11.1H12v2.7h5.38C16.88,16.27,14.67,18,12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.55,0,2.95,0.59,4.01,1.55l2.01-2.01C16.32,3.87,14.3,3,12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9c4.71,0,8.75-3.41,9.35-8.1H21.35z" fill="#4285F4" />
                  <path d="M21.35,11.1H12v2.7h5.38C16.88,16.27,14.67,18,12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.55,0,2.95,0.59,4.01,1.55l2.01-2.01C16.32,3.87,14.3,3,12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9c4.71,0,8.75-3.41,9.35-8.1H21.35z" fill="#FBBC05" />
                  <path d="M21.35,11.1H12v2.7h5.38C16.88,16.27,14.67,18,12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.55,0,2.95,0.59,4.01,1.55l2.01-2.01C16.32,3.87,14.3,3,12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9c4.71,0,8.75-3.41,9.35-8.1H21.35z" fill="#EA4335" />
                </g>
              </svg>
              Google Account
            </button>
          </div>
        )}

        {activeTab === 'recover' && (
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleTabChange('login')}
            className="w-full text-center text-xs font-bold text-gray-500 hover:text-[#002855] mt-6 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Key size={14} /> Voltar para o Login
          </button>
        )}

        <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          <ShieldCheck size={14} className="text-emerald-500" />
          Acesso Seguro Integrado SSL
        </div>

      </div>
    </div>
  );
}

