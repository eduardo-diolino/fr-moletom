import React from 'react';
import { Target, Eye, Flame, Shield, Award, Heart } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Hero Header with story */}
      <div className="text-center mb-16">
        <span className="text-xs font-black text-[#FF6A00] uppercase tracking-widest block mb-2">
          Nossa Origem • Estação Outono/Inverno
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#02407d] tracking-tight mb-6">
          SOBRE A FR MOLETOM
        </h1>
        <p className="text-sm sm:text-lg text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
          Fundada em 2018 com o propósito de suprir uma carência no mercado nacional: moletons e agasalhos masculinos infantis bonitos, funcionais e que duram mais de uma estação de brincadeiras intensas.
        </p>
      </div>

      {/* Main Story Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-2xl font-black text-[#02407d] uppercase tracking-tight mb-4">
            Nossa História e Essência
          </h2>
          <div className="flex flex-col gap-4 text-sm text-gray-600 font-medium leading-relaxed">
            <p>
              Tudo começou no polo têxtil de São Paulo, quando os fundadores da FR Moletom perceberam a dificuldade extrema de encontrar moletons infantis para meninos que fossem, ao mesmo tempo, estilosos, de algodão puro de alta gramatura e confortáveis. A maioria das roupas disponíveis desbotava na primeira lavagem ou encolhia tanto que impossibilitava o uso.
            </p>
            <p>
              A marca nasceu com o compromisso de focar exclusivamente na <strong>moda masculina infantil</strong> da faixa de <strong>2 a 16 anos</strong>. Essa especialização nos permitiu dominar a modelagem ideal para os meninos — que se exercitam muito, correm, sobem em árvores e precisam de costuras indestrutíveis com tecidos peluciados aconchegantes.
            </p>
            <p>
              Hoje, somos referência em conjuntos coordenados de moletom, vestindo de forma premium milhares de pequenos heróis em todo o território nacional. E nossa grande identidade visual é esse azul escuro elegante, recortado pelo laranja solar de destaque nos cadarços e bordas, representando audácia e conforto dinâmico.
            </p>
          </div>
        </div>

        {/* Decorative Grid of qualities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 flex flex-col gap-3">
            <Award className="text-[#FF6A00]" size={28} />
            <h4 className="font-bold text-gray-800 text-sm">Algodão Premium Egípcio</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Utilizamos fibras longas selecionadas que resistem ao calor, às quedas e a dezenas de lavagens em máquina.
            </p>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex flex-col gap-3">
            <Flame className="text-[#02407d]" size={28} />
            <h4 className="font-bold text-gray-800 text-sm">Modelagem Anatômica Especial</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Cós elástico inteligente e punhos nas pernas que acompanham o crescimento orgânico dos garotos.
            </p>
          </div>

          <div className="bg-zinc-50 p-6 rounded-3xl border border-gray-100 flex flex-col gap-3">
            <Shield className="text-emerald-600" size={28} />
            <h4 className="font-bold text-gray-800 text-sm">Costuras de Segurança Triplas</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Garantia de que as roupas não rasgam nos joelhos ou bolsos durante as atividades esportivas mais árduas.
            </p>
          </div>

          <div className="bg-orange-100/30 p-6 rounded-3xl border border-orange-200/50 flex flex-col gap-3">
            <Heart className="text-red-500" size={28} />
            <h4 className="font-bold text-gray-800 text-sm">Conforto Térmico Soft</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Peluciados internos exclusivos que mantém a temperatura regulada nos dias de inverno ou noites frias.
            </p>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-100 mb-12">
        <div className="p-6 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF6A00] flex items-center justify-center">
            <Target size={22} className="stroke-[2.5]" />
          </div>
          <h3 className="font-extrabold text-[#02407d] text-base uppercase tracking-wider">Missão</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Oferecer roupas infantis masculinas premium que unam design europeu contemporâneo e durabilidade extrema, gerando paz de espírito aos pais e conforto irrestrito aos meninos.
          </p>
        </div>

        <div className="p-6 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-[#02407d] flex items-center justify-center">
            <Eye size={22} className="stroke-[2.5]" />
          </div>
          <h3 className="font-extrabold text-[#02407d] text-base uppercase tracking-wider">Visão</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Consolidar-se como o maior e-commerce brasileiro especializado exclusivamente em moda de inverno para garotos (2 a 16 anos), focando na inovação de tecidos e sustentabilidade.
          </p>
        </div>

        <div className="p-6 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Shield size={22} className="stroke-[2.5]" />
          </div>
          <h3 className="font-extrabold text-[#02407d] text-base uppercase tracking-wider">Valores</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Qualidade inquestionável dos materiais, respeito e integridade à infância saudável, atendimento amigável focado nas necessidades dos pais, e transparência ecológica nos métodos têxteis.
          </p>
        </div>
      </div>

    </div>
  );
}
