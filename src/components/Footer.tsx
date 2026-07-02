import React from 'react';
import { Mail, Phone, Clock, MessageCircle, Heart, ShieldCheck, FileText, HelpCircle } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (page: string, categorySlug?: string | null) => void;
  onOpenAuth: () => void;
}

export default function Footer({ onNavigate, onOpenAuth }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Brand details & contacts */}
        <div className="flex flex-col gap-5">
          <Logo light className="h-10 text-white" />
          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            A FR MOLETOM é uma marca consolidada, especializada exclusivamente em moda masculina infantil premium. Desenvolvemos moletons, camisetas e calças que combinam sofisticação, conforto supremo e alta resistência para as aventuras cotidianas de meninos de 2 a 16 anos.
          </p>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/frmoletom?igsh=M2V2a3ZpMGU1NWp6" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-none bg-gray-800 hover:bg-[#FF7A00] flex items-center justify-center text-white transition-colors" title="Instagram">
              <span className="font-bold text-sm">IG</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-none bg-gray-800 hover:bg-[#FF7A00] flex items-center justify-center text-white transition-colors" title="Facebook">
              <span className="font-bold text-sm">FB</span>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-none bg-gray-800 hover:bg-[#FF7A00] flex items-center justify-center text-white transition-colors" title="TikTok">
              <span className="font-bold text-sm">TK</span>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-none bg-gray-800 hover:bg-[#FF7A00] flex items-center justify-center text-white transition-colors" title="YouTube">
              <span className="font-bold text-sm">YT</span>
            </a>
          </div>
        </div>

        {/* Column 2: Legal - Institucional */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest border-l-4 border-[#FF7A00] pl-3">
            Institucional
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs font-semibold text-gray-400">
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                Quem Somos
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                Nossa Missão & Valores
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <FileText size={12} /> Termos de Uso
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <Heart size={12} /> Trocas e Devoluções
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <HelpCircle size={12} /> Perguntas Frequentes (FAQ)
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Service - Atendimento */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest border-l-4 border-[#FF7A00] pl-3">
            Atendimento
          </h4>
          <ul className="flex flex-col gap-3 text-xs text-gray-400 font-medium">
            <li className="flex items-center gap-2.5 hover:text-white transition-colors">
              <Phone size={14} className="text-[#FF7A00]" />
              <span>Suporte via WhatsApp</span>
            </li>
            <li className="flex items-center gap-2.5 hover:text-white transition-colors">
              <Mail size={14} className="text-[#FF7A00]" />
              <span>contato@frmoletom.com.br</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={14} className="text-[#FF7A00] mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-gray-300">Segunda a Sexta-feira</p>
                <p className="text-[10px] text-gray-400">Das 08:00h às 18:00h</p>
              </div>
            </li>
            <li>
              <a
                href="https://api.whatsapp.com/send?phone=5511949697239&text=Olá!%20Peguei%20seu%20numero%20no%20rodapé%20da%20FR%20Moletom."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-none transition-all cursor-pointer"
              >
                <MessageCircle size={14} /> Chamar no WhatsApp
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: My account - Minha conta */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest border-l-4 border-[#FF7A00] pl-3">
            Minha Conta
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs font-semibold text-gray-400">
            <li>
              <button onClick={onOpenAuth} className="hover:text-white transition-colors">
                Entrar / Cadastrar
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('favorites')} className="hover:text-white transition-colors">
                Lista de Favoritos
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                Todos os Produtos
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                Nossa Loja Física
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors text-orange-400/90 hover:text-orange-400">
                ⚙️ Painel Administrativo
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Payment and safety bars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-between">
        
        {/* Payment Methods display */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Formas de pagamento aceitas:
          </span>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center text-xs text-gray-300">
            <span className="bg-gray-800 px-3 py-1 rounded-none font-bold uppercase tracking-widest text-[#32beaf]" title="PIX">Pix</span>
            <span className="bg-gray-800 px-3 py-1 rounded-none font-bold uppercase tracking-widest text-[#FF7A00]">Visa</span>
            <span className="bg-gray-800 px-3 py-1 rounded-none font-bold uppercase tracking-widest">Mastercard</span>
            <span className="bg-gray-800 px-3 py-1 rounded-none font-bold uppercase tracking-widest text-emerald-500">Elo</span>
            <span className="bg-gray-800 px-3 py-1 rounded-none font-bold uppercase tracking-widest">Boleto</span>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Selos de Segurança:
          </span>
          <div className="flex gap-3 justify-center md:justify-start">
            <div className="bg-gray-800 px-3 py-1.5 rounded-none flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
              <ShieldCheck size={14} /> Compra Segura SSL
            </div>
            <div className="bg-gray-800 px-3 py-1.5 rounded-none flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
              <span>LGPD Protegido</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center lg:text-right flex flex-col gap-1 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} FR MOLETOM LTDA.</p>
          <p>CNPJ: 00.342.112/0001-99 • São Paulo - SP</p>
          <p className="text-gray-600 font-extrabold text-[9px] mt-1 tracking-widest">MASCULINO INFANTIL PREMIUM</p>
        </div>
      </div>
    </footer>
  );
}
