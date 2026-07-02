import React, { useState } from 'react';
import { ArrowLeft, CreditCard, ShieldCheck, Truck, Clipboard, CheckCircle, MessageSquare } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onBackToCart: () => void;
  onClearCart: () => void;
  onPlaceOrder?: (order: any) => void;
}

type PaymentMethod = 'pix' | 'card' | 'boleto';

export default function CheckoutPage({
  cartItems,
  onBackToCart,
  onClearCart,
  onPlaceOrder
}: CheckoutPageProps) {
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState('');
  
  // Form states
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.promoPrice || item.product.originalPrice;
    return acc + price * item.quantity;
  }, 0);

  // Free shipping above 199
  const shippingCost = subtotal >= 199 ? 0 : 15.90;
  let totalPayable = subtotal + shippingCost;
  
  // Extra 5% discount on Pix
  if (method === 'pix') {
    totalPayable = totalPayable * 0.95;
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020101021226830014br.gov.bcb.pix2561api.mercadopago.com.br/v1/payments/FR-MOLETOM-PIX-KEY');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');
    if (!email || !nome || !cpf || !telefone || !cep || !rua || !numero || !bairro || !cidade) {
      setCheckoutError('Por favor, preencha todos os dados de faturamento e entrega.');
      return;
    }
    if (method === 'card' && (!cardHolder || !cardNumber || !cardExp || !cardCvv)) {
      setCheckoutError('Por favor, insira todos os dados do seu cartão de crédito.');
      return;
    }

    const orderId = `${Math.floor(Math.random() * 889000) + 111000}`;
    setGeneratedOrderId(orderId);

    if (onPlaceOrder) {
      const newOrder = {
        id: `FR-${orderId}`,
        date: new Date().toISOString(),
        items: cartItems.map(it => ({
          productId: it.product.id,
          name: it.product.name,
          image: it.product.images[0],
          size: it.selectedSize,
          colorName: it.selectedColor.name,
          price: it.product.promoPrice || it.product.originalPrice,
          quantity: it.quantity
        })),
        total: totalPayable,
        status: 'pending' as const,
        customerName: nome,
        customerEmail: email,
        method: method
      };
      onPlaceOrder(newOrder);
    }

    setIsFinalized(true);
  };

  const handleFinishAndNotify = () => {
    // Generate order and notify on WhatsApp
    const orderNum = generatedOrderId || `${Math.floor(Math.random() * 900000) + 100000}`;
    const itemsList = cartItems.map(it => `- ${it.quantity}x ${it.product.name} (Tam ${it.selectedSize})`).join('\n');
    const msg = `Olá FR Moletom! Acabei de simular o pedido #FR-${orderNum} no site.\n\n*Produtos:*\n${itemsList}\n*Total:* R$ ${totalPayable.toFixed(2)}\n*Cliente:* ${nome}\n*WhatsApp Telefone:* ${telefone}\n*Método de Pagamento:* ${method.toUpperCase()}`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=5511949697239&text=${encoded}`, '_blank');
    onClearCart();
    window.location.reload(); // back home
  };

  if (isFinalized) {
    const orderId = generatedOrderId || 'XXXXXX';
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center bg-white rounded-none border border-gray-150 shadow-sm animate-fadeIn">
        <div className="w-16 h-16 rounded-none bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={36} className="stroke-[2.5]" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002855] tracking-tight mb-2">
          ¡PEDIDO RECEBIDO COM SUCESSO!
        </h2>
        <p className="text-sm font-bold text-gray-500 mb-6">
          Código do Pedido: <span className="text-gray-800 font-extrabold font-mono text-base">#FR-{orderId}</span>
        </p>

        <div className="bg-gray-50 p-6 rounded-none border border-gray-150 text-left max-w-md mx-auto mb-8 text-xs sm:text-sm font-medium text-gray-600 flex flex-col gap-3">
          <p className="font-bold text-[#002855] uppercase tracking-wider border-b border-gray-200 pb-2 mb-1">
            Resumo do Envio
          </p>
          <p>👦 *Destinatário:* {nome}</p>
          <p>📍 *Endereço:* {rua}, {numero} - {bairro}</p>
          <p>🌆 *Cidade:* {cidade} / CEP {cep}</p>
          <p>💰 *Total Pago:* <span className="font-bold text-[#FF7A00]">R$ {totalPayable.toFixed(2)}</span></p>
          <p>🏷️ *Método Escolhido:* {method.toUpperCase()}</p>
        </div>

        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
          Obrigado por comprar na **FR MOLETOM**! Enviamos um e-mail de confirmação para <span className="text-gray-800 font-bold">{email}</span>. Para agilizar o envio, você pode nos notificar direto no nosso WhatsApp de suporte!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://api.whatsapp.com/send?phone=5511949697239&text=${encodeURIComponent(
              `Olá FR Moletom! Acabei de simular o pedido #FR-${generatedOrderId || 'XXXXXX'} no site.\n\n*Produtos:*\n${cartItems.map(it => `- ${it.quantity}x ${it.product.name} (Tam ${it.selectedSize})`).join('\n')}\n*Total:* R$ ${totalPayable.toFixed(2)}\n*Cliente:* ${nome}\n*WhatsApp Telefone:* ${telefone}\n*Método de Pagamento:* ${method.toUpperCase()}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              onClearCart();
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-none text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <MessageSquare size={16} /> Notificar por WhatsApp
          </a>
          <button
            onClick={() => {
              onClearCart();
              window.location.reload();
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 px-6 rounded-none text-xs uppercase tracking-widest cursor-pointer"
          >
            Voltar para a Loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-none border border-gray-150 p-4 sm:p-8 shadow-sm">
      
      {/* Back CTA */}
      <button
        onClick={onBackToCart}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#002855] mb-8 uppercase tracking-widest transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Voltar ao Carrinho
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Billing details form */}
        <div className="lg:col-span-7">
          <h2 className="text-xl font-bold text-[#002855] uppercase tracking-wider mb-6">
            1. Seus Dados de Envio e Identificação
          </h2>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            {checkoutError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 font-bold uppercase text-[10px] tracking-wider flex justify-between items-center">
                <span>{checkoutError}</span>
                <button type="button" onClick={() => setCheckoutError('')} className="text-black/60 hover:text-black font-black">✕</button>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  E-mail de Contato *
                </label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-[#002855] font-semibold text-gray-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Nome Completo do Responsável *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome do comprador"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-[#002855] font-semibold text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  CPF (Para nota fiscal) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={14}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value.replace(/[^\d.-]/g, ''))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-[#002855] font-semibold text-gray-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-[#002855] font-semibold text-gray-800"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#002855] uppercase tracking-wider mt-6 mb-2">
              2. Endereço de Entrega
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  CEP *
                </label>
                <input
                  type="text"
                  required
                  maxLength={8}
                  placeholder="01001000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-[#002855] font-semibold text-gray-800"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Logradouro (Rua / Av) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rua das Garças"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-[#002855] font-semibold text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Número *
                </label>
                <input
                  type="text"
                  required
                  placeholder="123"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-[#002855] font-semibold text-gray-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Bairro *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Centro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-[#002855] font-semibold text-gray-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="São Paulo"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-[#002855] font-semibold text-gray-800"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#002855] uppercase tracking-wider mt-6 mb-2">
              3. Forma de Pagamento
            </h2>

            {/* Methods selector */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setMethod('pix')}
                className={`py-3.5 px-2 rounded-none border-2 font-bold text-xs uppercase tracking-wide flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  method === 'pix'
                    ? 'border-[#002855] bg-[#002855]/5 text-[#002855]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">⚡</span>
                <span>Pix (-5%)</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`py-3.5 px-2 rounded-none border-2 font-bold text-xs uppercase tracking-wide flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  method === 'card'
                    ? 'border-[#002855] bg-[#002855]/5 text-[#002855]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <CreditCard size={18} />
                <span>Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('boleto')}
                className={`py-3.5 px-2 rounded-none border-2 font-bold text-xs uppercase tracking-wide flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  method === 'boleto'
                    ? 'border-[#002855] bg-[#002855]/5 text-[#002855]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">📄</span>
                <span>Boleto</span>
              </button>
            </div>

            {/* Pix payment layout */}
            {method === 'pix' && (
              <div className="bg-gray-50 border border-gray-150 rounded-none p-5 text-center animate-fadeIn">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">
                  🔥 Pagamento instantâneo com 5% de desconto extra!
                </p>
                <div className="bg-white p-3 inline-block rounded-none border border-gray-150 mb-4 shadow-sm mx-auto">
                  {/* Mock beautiful QR representation */}
                  <div className="w-40 h-40 bg-zinc-100 flex items-center justify-center relative rounded-none border border-zinc-200 overflow-hidden">
                    <div className="absolute inset-2 border-2 border-dashed border-gray-300 rounded-none flex flex-col items-center justify-center">
                      <span className="text-4xl">📱</span>
                      <span className="text-[10px] font-bold text-[#002855] uppercase mt-2">Pix QR Code</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-semibold mb-4 max-w-sm mx-auto">
                  Escaneie o código QR acima no aplicativo do seu banco ou utilize a chave copia e cola abaixo para efetivar a transação.
                </p>

                <div className="flex gap-2 max-w-sm mx-auto">
                  <input
                    type="text"
                    readOnly
                    value="00020101021226830014br.gov.bcb.pix..."
                    className="bg-white border border-gray-200 rounded-none px-3 py-2 text-[11px] text-gray-400 font-mono select-all flex-1 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="bg-[#002855] hover:bg-[#FF7A00] text-white px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedPix ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}

            {/* Credit Card inputs */}
            {method === 'card' && (
              <div className="bg-gray-50 border border-gray-150 rounded-none p-5 flex flex-col gap-4 animate-fadeIn">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Nome impresso no Cartão *
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="JOAO S NUNES"
                    className="w-full bg-white border border-gray-200 rounded-none px-4 py-2 text-sm focus:outline-none focus:border-[#002855]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Número do Cartão *
                  </label>
                  <input
                    type="text"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, ''))}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-white border border-gray-200 rounded-none px-4 py-2 text-sm focus:outline-none focus:border-[#002855]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Validade (MM/AA) *
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-white border border-gray-200 rounded-none px-4 py-2 text-sm focus:outline-none focus:border-[#002855]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Código de Segurança (CVV) *
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full bg-white border border-gray-200 rounded-none px-4 py-2 text-sm focus:outline-none focus:border-[#002855]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Parcelamento do pedido *
                  </label>
                  <select className="w-full bg-white border border-gray-200 rounded-none px-3 py-2.5 text-xs font-bold focus:outline-none text-gray-700">
                    <option>1x de R$ {totalPayable.toFixed(2)} sem juros</option>
                    <option>2x de R$ {(totalPayable / 2).toFixed(2)} sem juros</option>
                    <option>3x de R$ {(totalPayable / 3).toFixed(2)} sem juros</option>
                    <option>4x de R$ {(totalPayable / 4).toFixed(2)} sem juros</option>
                    <option>5x de R$ {(totalPayable / 5).toFixed(2)} sem juros</option>
                    <option>6x de R$ {(totalPayable * 1.05 / 6).toFixed(2)}</option>
                    <option>12x de R$ {(totalPayable * 1.15 / 12).toFixed(2)}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Boleto specifications */}
            {method === 'boleto' && (
              <div className="bg-gray-50 border border-gray-150 rounded-none p-5 text-center animate-fadeIn">
                <span className="text-3xl mb-1 block">📄</span>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">
                  Boleto Bancário de Compensação
                </p>
                <p className="text-xs text-gray-500 font-semibold max-w-sm mx-auto mb-4">
                  O boleto possui vencimento em 48 horas úteis após a sua emissão. O tempo médio de compensação bancária varia de 1 a 2 dias úteis. Comumente ideal para pagamento de presentes corporativos ou familiares.
                </p>
              </div>
            )}

            {/* Submission CTA */}
            <button
              type="submit"
              className="mt-6 w-full bg-[#002855] hover:bg-[#FF7A00] text-white py-4 rounded-none font-bold text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
            >
              Confirmar e Gerar Pedido
            </button>
          </form>
        </div>

        {/* Purchase Basket summary sidebar column */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-none border border-gray-150 p-6 flex flex-col gap-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#002855] border-b border-gray-250 pb-3 mb-1">
              Resumo da Compra ({cartItems.length} itens)
            </h3>

            {/* Items scroll */}
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 justify-between items-center text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-12 object-cover bg-gray-100 rounded-none shrink-0 border border-gray-200"
                    />
                    <div>
                      <p className="font-bold text-gray-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-gray-400">
                        {item.quantity}x • Tam {item.selectedSize} • {item.selectedColor.name}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#002855] shrink-0">
                    R$ {((item.product.promoPrice || item.product.originalPrice) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals math lines */}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 text-xs font-semibold text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal dos produtos</span>
                <span className="font-bold text-gray-800">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete expresso</span>
                {shippingCost === 0 ? (
                  <span className="text-emerald-600 font-bold">Grátis</span>
                ) : (
                  <span className="font-bold text-gray-800">R$ {shippingCost.toFixed(2)}</span>
                )}
              </div>

              {method === 'pix' && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Desconto Pix (5%)</span>
                  <span>- R$ {((subtotal + shippingCost) * 0.05).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline text-gray-900 border-t border-dashed border-gray-250 pt-3 mt-1">
                <span className="text-sm font-bold uppercase text-[#002855]">Total a Pagar</span>
                <span className="text-xl font-bold text-[#FF7A00]">
                  R$ {totalPayable.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Security stamps */}
            <div className="bg-white rounded-none border border-gray-150 p-4 mt-4 flex flex-col gap-2.5 text-[10px] text-gray-500 font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                <span>Ambiente de pagamento 100% criptografado SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-[#FF7A00] shrink-0" />
                <span>Rastreamento monitorado etapa por etapa</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
