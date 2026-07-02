import React, { useState } from 'react';
import { Mail, Phone, Clock, Send, CheckCircle, MapPin, MessageCircle } from 'lucide-react';

export default function ContactView() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [assunto, setAssunto] = useState('Dúvida sobre Medidas');
  const [mensagem, setMensagem] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!nome || !email || !telefone || !mensagem) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Header text */}
      <div className="text-center mb-16">
        <span className="text-xs font-black text-[#FF6A00] uppercase tracking-widest block mb-2">
          Suporte e Atendimento Direto
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#02407d] tracking-tight mb-4">
          FALE CONOSCO
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Nossa equipe de consultoras de moda está pronta para lhe atender. Tire dúvidas sobre tamanhos, andamento de pedidos ou parcerias comerciais.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        
        {/* Left side: Information and interactive map mock */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col gap-5">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#02407d] border-b border-gray-200 pb-3">
              Canais Oficiais
            </h3>

            <div className="flex items-start gap-3 text-xs text-gray-600 font-medium">
              <Phone className="text-[#FF6A00] shrink-0" size={16} />
              <div>
                <p className="font-bold text-gray-800">Telefone e WhatsApp:</p>
                <p className="text-[#02407d] font-black text-sm mt-0.5">Atendimento Direto via WhatsApp</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-gray-600 font-medium">
              <Mail className="text-[#FF6A00] shrink-0" size={16} />
              <div>
                <p className="font-bold text-gray-800">E-mail Comercial:</p>
                <p className="text-[#02407d] font-black text-sm mt-0.5">contato@frmoletom.com.br</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-gray-600 font-medium">
              <Clock className="text-[#FF6A00] shrink-0" size={16} />
              <div>
                <p className="font-bold text-gray-800">Horário de Funcionamento:</p>
                <p className="text-gray-700 font-semibold mt-0.5">Segunda a Sexta, das 08h às 18h</p>
              </div>
            </div>
          </div>

          {/* Map Mock representation with crisp vector drawing */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
            <div className="p-5 border-b border-gray-50">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#02407d] flex items-center gap-1.5">
                <MapPin size={15} className="text-[#FF6A00]" /> Nossa Unidade Central (Showroom)
              </h4>
              <p className="text-[10px] text-gray-500 font-bold mt-1">
                Av. Paulista, 1000 - Bela Vista, São Paulo - SP, CEP 01310-100
              </p>
            </div>
            
            {/* Visual vector styled map container */}
            <div className="bg-zinc-100 aspect-video relative flex items-center justify-center border-t border-zinc-200 overflow-hidden select-none">
              <svg className="absolute inset-0 w-full h-full stroke-zinc-300 opacity-60" viewBox="0 0 200 100">
                <path d="M 0,20 Q 50,40 100,20 T 200,20" fill="none" strokeWidth="3" />
                <path d="M 0,50 L 200,50" fill="none" strokeWidth="2" />
                <path d="M 50,0 L 50,100" fill="none" strokeWidth="1.5" />
                <path d="M 120,0 L 120,100" fill="none" strokeWidth="2" />
                <path d="M 0,80 Q 80,60 150,90 T 200,80" fill="none" strokeWidth="2.5" />
              </svg>
              {/* Geolocation Pin visual animation */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#02407d]/10 flex items-center justify-center animate-ping absolute" />
                <div className="w-8 h-8 rounded-full bg-[#02407d] border-2 border-white shadow-md flex items-center justify-center relative z-10">
                  <span className="text-white text-sm">🧥</span>
                </div>
                <div className="bg-slate-900 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg shadow-lg mt-2 tracking-wide uppercase">
                  SÃO PAULO - SP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: message form with states */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-8 text-center animate-fadeIn py-16">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-black text-emerald-800 mb-2 uppercase tracking-tight">
                Mensagem enviada com sucesso!
              </h3>
              <p className="text-sm font-semibold text-emerald-600 max-w-sm mx-auto mb-8 leading-relaxed">
                Agradecemos o contato, {nome}! Retornaremos em seu e-mail ({email}) ou telefone cadastrado em até 4 horas úteis.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setNome('');
                  setEmail('');
                  setTelefone('');
                  setMensagem('');
                }}
                className="bg-[#02407d] hover:bg-[#FF6A00] text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors shadow"
              >
                Enviar Outra Mensagem
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black text-[#02407d] uppercase tracking-wide mb-6">
                Envie-nos um e-mail direto
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-650 rounded-xl text-xs font-bold uppercase tracking-wide flex justify-between items-center">
                    <span>{errorMsg}</span>
                    <button type="button" onClick={() => setErrorMsg('')} className="text-black/60 hover:text-black font-black">✕</button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nome do cliente"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#02407d] font-semibold text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Seu E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="exemplo@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#02407d] font-semibold text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Número de WhatsApp / Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#02407d] font-semibold text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Assunto Principal
                    </label>
                    <select
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none text-gray-700"
                    >
                      <option value="Dúvida sobre Medidas">Dúvida sobre Medidas</option>
                      <option value="Trocas ou Devoluções">Trocas ou Devoluções</option>
                      <option value="Rastreamento de Pedido">Rastreamento de Pedido</option>
                      <option value="Parcerias / Influenciadores">Parcerias / Influenciadores</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Escreva sua Mensagem / Dúvida detalhada *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Olá! Gostaria de saber se o moletom tamanho 8 serve em uma criança com x cm de altura..."
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#02407d] font-medium text-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#02407d] hover:bg-[#FF6A00] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                >
                  <Send size={15} /> Enviar Mensagem Registrada
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
