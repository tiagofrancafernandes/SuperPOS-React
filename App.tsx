
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { INITIAL_PRODUCTS, MOCK_CLIENTS } from './constants';
import { Product, CartItem, SaleRecord, ViewMode, PaymentStep, CardType, CardMachine, Client, ContactType } from './types';
import { getSmartSuggestions } from './services/geminiService';

const CARD_MACHINES: CardMachine[] = [
  { id: 'm1', name: 'Terminal Stone S920 - Caixa 01', status: 'online' },
  { id: 'm2', name: 'Moderninha Pro 2 - Balcão', status: 'online' },
  { id: 'm3', name: 'Cielo LIO - Principal', status: 'online' },
  { id: 'm4', name: 'Rede iWl250 - Reserva', status: 'online' },
];

type LayoutMode = 'grid' | 'list';
type DensityMode = 'dense' | 'compact' | 'detailed';

const POSView: React.FC<{
  products: Product[];
  addToCart: (p: Product) => void;
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
  aiEnabled: boolean;
}> = ({ products, addToCart, cart, removeFromCart, updateQuantity, onCheckout, aiEnabled }) => {
  const [search, setSearch] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null);
  
  // View Settings
  const [layout, setLayout] = useState<LayoutMode>('grid');
  const [density, setDensity] = useState<DensityMode>('compact');

  const handleAiSearch = async () => {
    if (!search.trim() || !aiEnabled) {
      setFilteredIds(null);
      return;
    }
    setAiLoading(true);
    const ids = await getSmartSuggestions(search, products);
    setFilteredIds(ids);
    setAiLoading(false);
  };

  const displayedProducts = useMemo(() => {
    if (filteredIds) {
      return products.filter(p => filteredIds.includes(p.id));
    }
    const searchTerm = search.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.barcode.includes(search) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  }, [search, products, filteredIds]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 overflow-hidden animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* HEADER COM CONTROLES */}
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Pesquisar produto ou código de barras..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (filteredIds) setFilteredIds(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && aiEnabled && handleAiSearch()}
              />
              <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            {aiEnabled && (
              <button 
                onClick={handleAiSearch} 
                disabled={aiLoading || !search.trim()} 
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                {aiLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
                <span className="hidden sm:inline">IA Lookup</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setLayout('grid')} className={`p-1.5 rounded-lg transition-all cursor-pointer ${layout === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              </button>
              <button onClick={() => setLayout('list')} className={`p-1.5 rounded-lg transition-all cursor-pointer ${layout === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {(['dense', 'compact', 'detailed'] as DensityMode[]).map((d) => (
                <button 
                  key={d} 
                  onClick={() => setDensity(d)} 
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${density === d ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {d === 'dense' ? 'Denso' : d === 'compact' ? 'Comp' : 'Det'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LISTA DE PRODUTOS */}
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth no-scrollbar">
          {displayedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
              <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p className="text-sm">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className={
              layout === 'grid' 
                ? `grid gap-4 ${density === 'dense' ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' : density === 'compact' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`
                : `flex flex-col gap-2`
            }>
              {displayedProducts.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => addToCart(p)} 
                  className={`group text-left bg-white border border-gray-100 transition-all transform active:scale-[0.98] cursor-pointer hover:shadow-md hover:border-blue-200 flex ${
                    layout === 'grid' 
                      ? 'flex-col rounded-2xl overflow-hidden' 
                      : 'flex-row items-center p-2 rounded-xl'
                  }`}
                >
                  {/* IMAGEM (Opcional no modo Denso se for Lista) */}
                  {(density !== 'dense' || layout === 'grid') && (
                    <div className={`${
                      layout === 'grid' 
                        ? `aspect-square w-full ${density === 'dense' ? 'h-24' : ''}` 
                        : `shrink-0 rounded-lg overflow-hidden ${density === 'dense' ? 'w-10 h-10' : density === 'compact' ? 'w-16 h-16' : 'w-24 h-24'}`
                    } bg-gray-100 overflow-hidden`}>
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}

                  <div className={`flex-1 ${layout === 'grid' ? (density === 'dense' ? 'p-2' : 'p-3') : 'px-4'}`}>
                    {density === 'detailed' && (
                      <p className="text-[10px] text-blue-600 font-bold mb-1 uppercase tracking-widest">{p.category}</p>
                    )}
                    <h3 className={`${density === 'dense' ? 'text-[11px]' : 'text-sm'} font-bold text-gray-800 line-clamp-1`}>
                      {p.name}
                    </h3>
                    
                    <div className={`flex ${layout === 'grid' ? 'flex-col mt-2' : 'items-center justify-between gap-4'}`}>
                      <span className={`${density === 'detailed' ? 'text-lg' : density === 'dense' ? 'text-xs' : 'text-sm'} font-black text-blue-600`}>
                        R$ {p.price.toFixed(2)}
                      </span>
                      {density !== 'dense' && (
                        <span className="text-[10px] text-gray-400 font-medium">Estoque: {p.stock}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CARRINHO (Mantido o mesmo) */}
      <div className="w-full lg:w-[400px] flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden shrink-0">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            Carrinho
          </h2>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md uppercase">{cart.length} itens</span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <p className="text-sm font-medium">Carrinho vazio</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
                <img src={item.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-800 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">R$ {item.price.toFixed(2)} cada</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 px-2 hover:bg-gray-100 text-gray-500 cursor-pointer"> - </button>
                    <span className="px-2 text-xs font-bold text-gray-700">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 px-2 hover:bg-gray-100 text-gray-500 cursor-pointer"> + </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-1 text-red-400 hover:text-red-600 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 bg-gray-50 border-t border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Subtotal</span>
            <span className="text-xl font-black text-gray-800">R$ {total.toFixed(2)}</span>
          </div>
          <button disabled={cart.length === 0} onClick={onCheckout} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer disabled:cursor-not-allowed">
            Finalizar Compra
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const HistoryView: React.FC<{ sales: SaleRecord[] }> = ({ sales }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="bg-white h-full rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Histórico de Vendas</h2>
          <p className="text-sm text-gray-500">Listagem de todas as transações realizadas.</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Vendas</span>
          <p className="text-xl font-black text-blue-600">{sales.length}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {sales.length === 0 ? (
          <div className="py-20 text-center text-gray-400">Nenhuma venda registrada ainda.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-gray-100 z-10 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
              <tr>
                <th className="px-6 py-4">Data/Hora</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.map(sale => (
                <React.Fragment key={sale.id}>
                  <tr className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${expanded === sale.id ? 'bg-blue-50/50' : ''}`} onClick={() => setExpanded(expanded === sale.id ? null : sale.id)}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{new Date(sale.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900">R$ {sale.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {sale.payments.map((p, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-600 uppercase">{p.method}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
                        <svg className={`w-4 h-4 transition-transform ${expanded === sale.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const ReportsView: React.FC<{ sales: SaleRecord[] }> = ({ sales }) => {
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
    const avgTicket = sales.length ? totalRevenue / sales.length : 0;
    const categoryRevenue: Record<string, number> = {};
    sales.forEach(s => s.items.forEach(item => { categoryRevenue[item.category] = (categoryRevenue[item.category] || 0) + (item.price * item.quantity); }));
    return { totalRevenue, avgTicket, categoryRevenue };
  }, [sales]);
  const maxCategory = Math.max(...Object.values(stats.categoryRevenue), 1);
  return (
    <div className="space-y-6 h-full overflow-y-auto no-scrollbar pb-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-200">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Receita Total</p>
          <p className="text-3xl font-black">R$ {stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ticket Médio</p>
          <p className="text-3xl font-black text-gray-900">R$ {stats.avgTicket.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Volume</p>
          <p className="text-3xl font-black text-gray-900">{sales.length}</p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-6">Faturamento por Categoria</h3>
        <div className="space-y-4">
          {Object.entries(stats.categoryRevenue).sort((a,b) => b[1]-a[1]).map(([cat, rev]) => (
            <div key={cat}>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-500 uppercase">{cat}</span>
                <span className="text-gray-900">R$ {rev.toFixed(2)}</span>
              </div>
              <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${(rev / maxCategory) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewMode>(ViewMode.POS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  
  const [checkoutStep, setCheckoutStep] = useState<PaymentStep | null>(null);
  const [remainingBalance, setRemainingBalance] = useState<number>(0);
  const [paymentsDone, setPaymentsDone] = useState<Array<{ method: string; amount: number }>>([]);
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card' | 'pix' | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('0');
  const [cardType, setCardType] = useState<CardType | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<CardMachine | 'offline' | null>(null);
  const [processingStatus, setProcessingStatus] = useState<'loading' | 'success' | 'error' | 'cancelled' | null>(null);

  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [noteFinished, setNoteFinished] = useState(false);
  const [fiscalClient, setFiscalClient] = useState<Partial<Client>>({ document: '', name: '' });

  const [isConfirmingAbandon, setIsConfirmingAbandon] = useState(false);
  const [abandonPassword, setAbandonPassword] = useState('');
  const [abandonError, setAbandonError] = useState(false);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isKioskMode, setIsKioskMode] = useState(false);
  
  const [isAiAvailable, setIsAiAvailable] = useState(false);
  const [isAiEnabled, setIsAiEnabled] = useState(true);

  const [countdown, setCountdown] = useState<number>(30);
  const [timerPaused, setTimerPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    setIsAiAvailable(!!apiKey);
    if (!apiKey) setIsAiEnabled(false);

    const params = new URLSearchParams(window.location.search);
    if (params.get('kiosk') === 'true') setIsKioskMode(true);

    const handleHashChange = () => {
      try {
        const hash = window.location.hash.replace('#', '');
        if (Object.values(ViewMode).includes(hash as ViewMode)) setView(hash as ViewMode);
      } catch (e) {}
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeRoute = (newView: ViewMode) => {
    setView(newView);
    try { window.location.hash = newView; } catch (e) {}
  };

  useEffect(() => {
    if ((checkoutStep === 'SALE_COMPLETE' || checkoutStep === 'SALE_CANCELLED') && countdown > 0 && !timerPaused) {
      timerRef.current = window.setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      resetSystem();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [checkoutStep, countdown, timerPaused]);

  const addToCart = useCallback((p: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) return prev.map(item => item.id === p.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...p, quantity: 1 }];
    });
  }, []);

  const initiateCheckout = () => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setRemainingBalance(total);
    setPaymentsDone([]);
    setCheckoutStep('SELECT_METHOD');
  };

  const selectMethod = (method: 'cash' | 'card' | 'pix') => {
    setSelectedMethod(method);
    setPaymentAmount(remainingBalance.toFixed(2));
    setCheckoutStep('SET_AMOUNT');
  };

  const confirmAmount = () => {
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0 || amt > remainingBalance + 0.01) { alert('Valor inválido.'); return; }
    if (selectedMethod === 'pix') startPixFlow(amt);
    else if (selectedMethod === 'card') setCheckoutStep('CARD_TYPE');
    else if (selectedMethod === 'cash') recordPartialPayment('Dinheiro', amt);
  };

  const recordPartialPayment = (methodLabel: string, amt: number) => {
    const newPayments = [...paymentsDone, { method: methodLabel, amount: amt }];
    setPaymentsDone(newPayments);
    const newRemaining = Math.max(0, remainingBalance - amt);
    setRemainingBalance(newRemaining);

    if (newRemaining < 0.01) {
      const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const newSale: SaleRecord = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        items: [...cart],
        total,
        payments: newPayments,
        paymentMethod: methodLabel, 
      };
      setSales(prev => [newSale, ...prev]);
      setProducts(prev => prev.map(p => {
        const sold = cart.find(item => item.id === p.id);
        return sold ? { ...p, stock: Math.max(0, p.stock - sold.quantity) } : p;
      }));
      setCheckoutStep('SALE_COMPLETE');
      setCountdown(30);
      setTimerPaused(false);
    } else {
      setCheckoutStep('SELECT_METHOD');
      resetLocalCheckout();
    }
  };

  const resetLocalCheckout = () => {
    setSelectedMethod(null);
    setCardType(null);
    setSelectedMachine(null);
    setProcessingStatus(null);
    setPaymentAmount('0');
  };

  const resetSystem = () => {
    setCart([]);
    setCheckoutStep(null);
    resetLocalCheckout();
    setPaymentsDone([]);
    setIsConfirmingAbandon(false);
    setAbandonPassword('');
    setAbandonError(false);
    setNoteFinished(false);
    setIsGeneratingNote(false);
    setFiscalClient({ document: '', name: '' });
  };

  const handleAbandonRequest = () => {
    if (abandonPassword === '1234') {
      setCheckoutStep('SALE_CANCELLED');
      setCountdown(30);
      setTimerPaused(false);
    } else {
      setAbandonError(true);
      setTimeout(() => setAbandonError(false), 2000);
    }
  };

  const startPixFlow = (amt: number) => {
    setCheckoutStep('PIX_QR');
    setProcessingStatus('loading');
    setTimeout(() => {
      setProcessingStatus('success');
      setTimeout(() => recordPartialPayment('Pix', amt), 2000);
    }, 4000);
  };

  const handleFiscalNote = () => {
    if (!fiscalClient.document || !fiscalClient.name) { alert("Dados incompletos."); return; }
    setIsGeneratingNote(true);
    setTimerPaused(true);
    setTimeout(() => { setIsGeneratingNote(false); setNoteFinished(true); }, 2500);
  };

  const toggleKioskMode = () => {
    const newVal = !isKioskMode;
    setIsKioskMode(newVal);
    if (newVal) document.documentElement.requestFullscreen().catch(() => {});
    else if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setIsUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col max-h-screen overflow-hidden bg-gray-50">
      
      {isKioskMode && (
        <button onClick={() => setIsKioskMode(false)} className="fixed top-4 left-4 z-[100] p-3 bg-white/90 backdrop-blur shadow-lg rounded-xl hover:bg-white text-gray-800 transition-all border border-gray-100 cursor-pointer"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg></button>
      )}

      {!isKioskMode && (
        <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-20 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg></div>
            <h1 className="text-xl font-black text-gray-900 hidden sm:block tracking-tight">SuperPOS <span className="text-blue-600">Pro</span></h1>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-[50%] md:max-w-none">
            {[ViewMode.POS, ViewMode.INVENTORY, ViewMode.HISTORY, ViewMode.REPORTS].map(v => (
              <button key={v} onClick={() => changeRoute(v)} className={`px-4 py-2 rounded-lg text-[10px] sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${view === v ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {v.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white overflow-hidden shadow-sm ring-blue-500/20 ring-0 hover:ring-4 transition-all cursor-pointer">
              <img src="https://picsum.photos/seed/user/100/100" alt="User" />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-4 top-16 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-black text-gray-900">João Silva</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Operador de Caixa</p>
                </div>
                <div className="p-2 space-y-1">
                  <button onClick={() => { setIsSettingsOpen(true); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl flex items-center gap-3 cursor-pointer"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>Configurações</button>
                  <button onClick={toggleKioskMode} className="w-full text-left px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors cursor-pointer"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>Ocultar Topo (Kiosk)</button>
                </div>
                <div className="px-2 pt-1 border-t border-gray-100 mt-1">
                  <button onClick={() => window.location.reload()} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 cursor-pointer"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>Sair</button>
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      <main className={`flex-1 overflow-hidden relative transition-all duration-300 ${isKioskMode ? 'p-0' : 'p-4'}`}>
        {view === ViewMode.POS && <POSView products={products} addToCart={addToCart} cart={cart} removeFromCart={(id) => setCart(c => c.filter(i => i.id !== id))} updateQuantity={(id, delta) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i))} onCheckout={initiateCheckout} aiEnabled={isAiEnabled} />}
        {view === ViewMode.INVENTORY && (
          <div className="bg-white h-full rounded-2xl p-6 border border-gray-100 shadow-sm overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-black mb-6">Gestão de Estoque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => (
                <div key={p.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex gap-4 hover:bg-white hover:shadow-md transition-all">
                  <img src={p.image} className="w-16 h-16 rounded-xl object-cover" alt={p.name} />
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{p.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Estoque: {p.stock} UN</p>
                    <p className="text-blue-600 font-black mt-2">R$ {p.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {view === ViewMode.HISTORY && <HistoryView sales={sales} />}
        {view === ViewMode.REPORTS && <ReportsView sales={sales} />}
      </main>

      {checkoutStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-md transition-all">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            {checkoutStep === 'SELECT_METHOD' && (
              <div className="p-8">
                <div className="mb-8 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 leading-none">Pagamento</h3>
                    <div className="flex justify-between items-end mt-5 p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                      <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Saldo</p>
                        <p className="text-3xl font-black text-blue-700">R$ {remainingBalance.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setCheckoutStep(null)} className="p-2.5 text-gray-400 bg-gray-50 rounded-full cursor-pointer"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                
                {isConfirmingAbandon ? (
                  <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <p className="text-xs font-black text-red-500 uppercase tracking-widest text-center">Autorização Gerencial</p>
                    <input autoFocus type="password" placeholder="SENHA DO GERENTE (1234)" value={abandonPassword} onChange={(e) => setAbandonPassword(e.target.value)}
                      className={`w-full p-6 bg-gray-50 rounded-3xl text-center text-2xl tracking-widest font-black border-2 transition-all ${abandonError ? 'border-red-500 animate-shake' : 'border-transparent focus:border-blue-500'}`} />
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setIsConfirmingAbandon(false)} className="py-5 font-bold text-gray-500 bg-gray-100 rounded-3xl cursor-pointer">Voltar</button>
                      <button onClick={handleAbandonRequest} className="py-5 font-black text-white bg-red-600 rounded-3xl shadow-lg shadow-red-200 cursor-pointer">Confirmar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      {['pix', 'card', 'cash'].map((m) => (
                        <button key={m} onClick={() => selectMethod(m as any)} className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50/50 border-2 border-transparent hover:border-blue-500 hover:bg-white transition-all group active:scale-[0.98] cursor-pointer">
                          <div className="flex items-center gap-5 text-left">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                              {m === 'pix' && <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m-3 3h2m3-3h2m-5 3v2m4-2v2m-4 7h2m3-3h2m-5 3v2m4-2v2M6 10V8a2 2 0 012-2h2m4 0h2a2 2 0 012 2v2m0 4v2a2 2 0 01-2 2h-2m-4 0H8a2 2 0 01-2-2v-2M9 11.5v1m3-1v1m3-1v1"/></svg>}
                              {m === 'card' && <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>}
                              {m === 'cash' && <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>}
                            </div>
                            <div>
                              <p className="text-lg font-black text-gray-900 capitalize">{m === 'pix' ? 'Pix' : m === 'card' ? 'Cartão' : 'Dinheiro'}</p>
                            </div>
                          </div>
                          <svg className="w-6 h-6 text-gray-300 group-hover:text-blue-500 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => { setIsConfirmingAbandon(true); setAbandonPassword(''); }} className="mt-8 w-full text-center text-[10px] font-black text-gray-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em] cursor-pointer">Cancelar Venda</button>
                  </>
                )}
              </div>
            )}

            {checkoutStep === 'SET_AMOUNT' && (
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setCheckoutStep('SELECT_METHOD')} className="p-2.5 text-gray-400 bg-gray-50 rounded-xl cursor-pointer"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg></button>
                  <h3 className="text-2xl font-black text-gray-900">Lançar Valor</h3>
                </div>
                <div className="space-y-8">
                  <div className="relative">
                    <span className="absolute left-7 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-300">R$</span>
                    <input autoFocus type="number" step="0.01" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full pl-20 pr-8 py-10 bg-gray-50 rounded-[2.5rem] text-5xl font-black text-blue-600 focus:ring-4 focus:ring-blue-100 transition-all border-none" />
                  </div>
                  <button onClick={confirmAmount} className="w-full py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl shadow-xl shadow-blue-200 active:scale-[0.98] transition-all cursor-pointer">Confirmar Pagamento</button>
                </div>
              </div>
            )}

            {checkoutStep === 'SALE_COMPLETE' && (
              <div className="p-10 text-center relative">
                <div className="absolute top-8 right-8 w-14 h-14 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl font-black text-xl border-2 border-blue-100 shadow-sm animate-pulse">{countdown}</div>
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100"><svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg></div>
                <h3 className="text-4xl font-black text-gray-900 mb-2">Concluído!</h3>
                <p className="text-gray-500 mb-10 text-lg">Transação autorizada com sucesso.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => setCheckoutStep('FISCAL_NOTE')} className="p-5 bg-gray-50 rounded-3xl hover:bg-blue-50 transition-all font-black flex items-center gap-3 justify-center cursor-pointer">Emitir Nota</button>
                  <button onClick={resetSystem} className="sm:col-span-2 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest cursor-pointer">Novo Pedido</button>
                </div>
              </div>
            )}
            
            {checkoutStep === 'FISCAL_NOTE' && (
              <div className="p-8 space-y-6">
                 <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-gray-900">Emissão de Nota</h3>
                  <button onClick={() => setCheckoutStep('SALE_COMPLETE')} className="p-2 bg-gray-100 rounded-full cursor-pointer"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                {isGeneratingNote ? (
                  <div className="py-16 flex flex-col items-center gap-8"><div className="w-20 h-20 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div><p className="font-black text-xl">Transmitindo para SEFAZ...</p></div>
                ) : noteFinished ? (
                  <div className="py-10 flex flex-col items-center gap-8 text-center animate-in zoom-in">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-lg"><svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg></div>
                    <h4 className="text-3xl font-black">Nota Autorizada!</h4>
                    <button onClick={resetSystem} className="w-full py-5 bg-gray-900 text-white font-black rounded-3xl cursor-pointer">Fechar e Novo Pedido</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CPF/CNPJ Destinatário</p>
                      <input placeholder="000.000.000-00" value={fiscalClient.document} onChange={e => setFiscalClient({...fiscalClient, document: e.target.value})} className="w-full bg-transparent font-black outline-none" />
                    </div>
                    <button onClick={handleFiscalNote} className="w-full py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl shadow-xl cursor-pointer">TRANSMITIR NF-e</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-3xl font-black text-gray-900">Ajustes do Sistema</h3>
               <button onClick={() => setIsSettingsOpen(false)} className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
             </div>
             
             <div className="space-y-6">
               <div className="space-y-4">
                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Inteligência Artificial (Opcional)</p>
                 <div className={`flex items-center justify-between p-6 rounded-3xl transition-all ${isAiAvailable ? 'bg-gray-50' : 'bg-gray-50 opacity-50 grayscale'}`}>
                   <div>
                     <span className="font-bold text-gray-800 block">IA Lookup (Busca Semântica)</span>
                     {!isAiAvailable && <span className="text-[10px] font-bold text-red-500 uppercase">Indisponível (Falta API Key)</span>}
                     {isAiAvailable && <span className="text-[10px] text-gray-500">Permite buscar por intenção (ex: "fazer churrasco")</span>}
                   </div>
                   <button 
                    disabled={!isAiAvailable}
                    onClick={() => setIsAiEnabled(!isAiEnabled)} 
                    className={`w-14 h-8 rounded-full relative p-1 transition-all cursor-pointer disabled:cursor-not-allowed ${isAiEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                   >
                     <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${isAiEnabled ? 'right-1' : 'left-1'}`}></div>
                   </button>
                 </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-gray-100">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Configurações de Caixa</p>
                 <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                    <span className="font-bold text-gray-800">Modo Autoatendimento (Kiosk)</span>
                    <button onClick={toggleKioskMode} className={`w-14 h-8 rounded-full relative p-1 transition-all cursor-pointer ${isKioskMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${isKioskMode ? 'right-1' : 'left-1'}`}></div>
                    </button>
                 </div>
               </div>
             </div>

             <div className="flex gap-4 mt-10">
                <button onClick={() => setIsSettingsOpen(false)} className="flex-1 py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-200 cursor-pointer">Salvar Alterações</button>
             </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
