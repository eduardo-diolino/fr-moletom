import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { LogOut, ShieldCheck, Mail, ArrowRight, Sparkles } from 'lucide-react';

// ==========================================
// 1. CONFIGURAÇÃO DO FIREBASE (Vercel / Prod)
// ==========================================
// Substitua as strings vazias com as credenciais do console do seu Firebase:
// Console Firebase > Configurações do Projeto > Seus Aplicativos > Aplicativo Web
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Inicialização segura para evitar re-inicialização em ambientes de Hot Reload / Server-Side Rendering
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export default function FirebaseGoogleAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ==========================================
  // 2. GESTÃO DE ESTADO (Observer de Autenticação)
  // ==========================================
  useEffect(() => {
    // O observador escuta as mudanças de estado de login em tempo real
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error("Erro no observador de autenticação:", error);
      setErrorMsg("Ocorreu um erro ao carregar sua sessão.");
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup da inscrição ao desmontar o componente
  }, []);

  // ==========================================
  // 3. ENTRAR COM O GOOGLE (Popup Sign-In)
  // ==========================================
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const provider = new GoogleAuthProvider();
      
      // Opcional: Adicionar escopos adicionais se necessário
      provider.addScope('profile');
      provider.addScope('email');
      
      // Abre o pop-up de login do Google de forma limpa e otimizada
      const result = await signInWithPopup(auth, provider);
      
      // Login bem sucedido! O observador onAuthStateChanged atualizará o estado automaticamente
      console.log("Usuário logado com sucesso via Google:", result.user.displayName);
    } catch (error: any) {
      console.error("Erro no login com Google:", error);
      
      // Mensagens amigáveis para erros comuns do Firebase Auth
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorMsg("O login foi cancelado porque o pop-up foi fechado.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        setErrorMsg("Processo cancelado. Uma nova tentativa de login foi iniciada.");
      } else if (error.code === 'auth/operation-not-allowed') {
        setErrorMsg("O login com Google não está habilitado no console do Firebase.");
      } else {
        setErrorMsg(`Falha ao conectar com o Google: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 4. SAIR DA CONTA (Logout Action)
  // ==========================================
  const handleSignOut = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signOut(auth);
      console.log("Usuário deslogado com sucesso.");
    } catch (error: any) {
      console.error("Erro ao deslogar:", error);
      setErrorMsg("Erro ao tentar desconectar sua conta.");
    } finally {
      setLoading(false);
    }
  };

  // Renderização do Estado de Carregamento Inicial
  if (loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-150 shadow-md max-w-md mx-auto my-12 min-h-[300px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-6">
          Sincronizando com o Firebase...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white border border-gray-150 shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
      
      {/* Detalhe estético no topo - Cor da marca */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002855] via-[#FF7A00] to-[#002855]"></div>

      {/* Alerta de Erros Amigável */}
      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-500 font-bold">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-xs text-red-700 font-bold leading-normal">
                {errorMsg}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          A. INTERFACE DO CLIENTE LOGADO
         ========================================== */}
      {user ? (
        <div className="flex flex-col items-center text-center py-4 animate-scaleUp">
          {/* Avatar com a foto do Google ou Iniciais */}
          <div className="relative mb-5 group">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || "Cliente"} 
                className="w-20 h-20 rounded-full border-2 border-[#FF7A00] object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-[#FF7A00] text-2xl font-black border-2 border-[#FF7A00] shadow-md uppercase">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            )}
            
            {/* Tag de Provedor Google no Avatar */}
            <span className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md border border-gray-100 flex items-center justify-center w-6 h-6" title="Conectado com o Google">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.35,11.1H12v2.7h5.38C16.88,16.27,14.67,18,12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.55,0,2.95,0.59,4.01,1.55l2.01-2.01C16.32,3.87,14.3,3,12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9c4.71,0,8.75-3.41,9.35-8.1H21.35z" fill="#4285F4" />
              </svg>
            </span>
          </div>

          <span className="text-[10px] font-black tracking-widest bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-150 mb-3 uppercase flex items-center gap-1.5">
            <ShieldCheck size={12} className="stroke-[2.5]" /> Conexão Segura Ativa
          </span>

          <h3 className="text-xl font-black text-[#002855] uppercase tracking-wide leading-tight mb-1">
            Olá, {user.displayName || "Cliente"}!
          </h3>
          
          <p className="text-xs text-gray-500 font-semibold mb-6 flex items-center gap-1">
            <Mail size={12} /> {user.email}
          </p>

          <div className="w-full bg-gray-50 border border-gray-100 p-4 mb-6 text-left">
            <h4 className="text-[10px] font-black text-[#002855] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles size={11} className="text-[#FF7A00]" /> Vantagens de Cliente VIP
            </h4>
            <ul className="text-[11px] text-gray-500 font-bold space-y-1.5 leading-normal">
              <li>✓ Histórico e rastreamento de compras automatizados.</li>
              <li>✓ Salvar roupas prediletas em pastas personalizadas.</li>
              <li>✓ Cupons especiais e lançamentos em primeira mão.</li>
            </ul>
          </div>

          {/* Botão de Sair */}
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 py-3.5 px-6 rounded-none font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <LogOut size={14} className="text-red-500" />
            {loading ? 'Saindo...' : 'Sair da Minha Conta'}
          </button>
        </div>
      ) : (
        // ==========================================
        // B. INTERFACE DO CLIENTE DESLOGADO
        // ==========================================
        <div className="flex flex-col items-center py-4 animate-fadeIn text-center">
          
          {/* Logo do Google gigante e minimalista */}
          <div className="w-16 h-16 bg-gray-50 border border-gray-150 rounded-full flex items-center justify-center shadow-inner mb-6">
            <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.35,11.1H12v2.7h5.38C16.88,16.27,14.67,18,12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.55,0,2.95,0.59,4.01,1.55l2.01-2.01C16.32,3.87,14.3,3,12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9c4.71,0,8.75-3.41,9.35-8.1H21.35z" fill="#4285F4" />
            </svg>
          </div>

          <h3 className="text-2xl font-black text-[#002855] uppercase tracking-tight mb-2 leading-tight">
            Identifique-se
          </h3>
          <p className="text-xs text-gray-400 font-semibold mb-8 max-w-xs leading-relaxed">
            Faça login de forma rápida e segura com a sua conta do Google para acessar a loja com total comodidade.
          </p>

          {/* Botão de Login Exclusivo Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-[#002855] hover:bg-[#FF7A00] text-white py-4 px-6 rounded-none font-black text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg className="w-4 h-4 bg-white rounded-full p-0.5 shadow-sm" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.35,11.1H12v2.7h5.38C16.88,16.27,14.67,18,12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.55,0,2.95,0.59,4.01,1.55l2.01-2.01C16.32,3.87,14.3,3,12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9c4.71,0,8.75-3.41,9.35-8.1H21.35z" fill="#4285F4" />
              </svg>
            )}
            {loading ? 'Acessando...' : 'Entrar com o Google'}
          </button>

          {/* Rodapé institucional */}
          <div className="mt-8 pt-5 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-emerald-500 stroke-[2.5]" />
            Garantia de Privacidade Google SSL
          </div>
        </div>
      )}

    </div>
  );
}
