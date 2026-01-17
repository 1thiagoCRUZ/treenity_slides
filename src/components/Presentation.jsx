import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Maximize2, Lock, ArrowRight, Mail, Check, X, Edit3, Calculator } from 'lucide-react';
import { slides } from '../data/slides';

// Componente Logo
const TreenityLogo = ({ className }) => (
  <svg className={className} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 10 H85 V50 H15 Z" fill="white" />
    <path d="M20 10 L40 50 L90 50 C90 10 60 10 20 10 Z" fill="#2a85ff" />
    <path d="M15 10 L35 50" stroke="currentColor" strokeWidth="4" />
    <path d="M40 50 C40 20 60 10 90 10" stroke="currentColor" strokeWidth="4" />
  </svg>
);

// Formatador de Moeda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const Presentation = () => {
  const [current, setCurrent] = useState(0);
  
  // --- ESTADOS DA CALCULADORA ---
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  
  // Valores Iniciais
  const [projectValue, setProjectValue] = useState(35000); 
  const [entryValue, setEntryValue] = useState(6000);
  
  // Estado para controlar o valor da Etapa 1 (A Etapa 2 será calculada com base nela)
  const [stage1Value, setStage1Value] = useState(14500); 

  // --- LÓGICA DE CÁLCULO ---
  const financedAmount = Math.max(0, projectValue - entryValue);

  // Efeito: Se mudar o Total ou Entrada, reseta a divisão para 50/50 por padrão
  useEffect(() => {
    setStage1Value(financedAmount / 2);
  }, [projectValue, entryValue]);

  // Cálculo da Etapa 2 (Sempre o que sobra)
  const stage2Value = financedAmount - stage1Value;

  // Opções de Parcelamento
  const installmentOptions = [2, 3, 4, 5, 6, 8, 10, 12];

  // Navegação Teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPriceModalOpen) {
          if (e.key === 'Escape') setIsPriceModalOpen(false);
          return;
      }
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, isPriceModalOpen]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  const slideData = slides[current];

  // --- ANIMAÇÕES ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50, damping: 15 } }
  };

  const titleVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="w-screen h-screen bg-slate-50 text-slate-800 flex items-center justify-center relative overflow-hidden font-body selection:bg-blue-100">

      {/* Fundo Premium */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white pointer-events-none" />

      {/* Header */}
      {current > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
          className="absolute top-8 left-10 flex items-center gap-4 z-20"
        >
          <TreenityLogo className="w-14 h-auto text-slate-900" />
          <span className="font-brand text-2xl font-bold text-slate-900">Treenity</span>
        </motion.div>
      )}

      {/* Conteúdo Principal */}
      <div className="w-full max-w-[95rem] px-8 md:px-16 h-full flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="w-full h-full flex flex-col justify-center will-change-transform"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >

            {/* 1. CAPA */}
            {slideData.layout === 'cover' && (
              <div className="flex flex-col items-center justify-center text-center h-full">
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                    <div className="w-60 h-60 md:w-80 md:h-80 flex items-center justify-center">
                        <TreenityLogo className="w-full h-auto text-slate-900" />
                    </div>
                    <h1 className="font-tech text-7xl md:text-[9rem] text-slate-900 tracking-tight leading-none font-light">
                      Treenity
                    </h1>
                </motion.div>
                <motion.p variants={itemVariants} className="text-2xl md:text-3xl text-slate-600 font-light max-w-5xl leading-relaxed">
                  {slideData.tagline}
                </motion.p>
              </div>
            )}

            {/* 2. EQUIPE */}
            {slideData.layout === 'grid' && (
              <div className="w-full max-w-6xl mx-auto">
                <motion.div variants={titleVariants} className="text-center mb-16">
                  <h2 className="font-tech text-5xl text-slate-900 mb-3 font-light">{slideData.title}</h2>
                  <p className="text-slate-500 text-xl">{slideData.subtitle}</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-8">
                  {slideData.items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                      className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-colors flex items-center gap-6 cursor-default"
                    >
                      <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 shadow-inner">
                        <item.icon size={32} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-1 text-slate-900">{item.title}</h3>
                        <p className="text-slate-500">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 3 & 4. CENÁRIOS */}
            {slideData.layout === 'roadmap_split' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center max-w-7xl mx-auto w-full">
                <div className="md:col-span-5">
                  <motion.div variants={titleVariants}>
                    <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6 uppercase shadow-sm
                        ${slideData.type === 'problem' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                      {slideData.type === 'problem' ? 'Diagnóstico' : 'Solução'}
                    </div>
                    <h2 className="font-tech text-6xl md:text-7xl text-slate-900 leading-[1.1] font-light uppercase mb-6">
                      {slideData.title.split(' ')[0]} <br />
                      <span className={slideData.type === 'problem' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                        {slideData.title.split(' ')[1]}
                      </span>
                    </h2>
                    <div className={`h-1.5 w-24 rounded-full mb-6 ${slideData.type === 'problem' ? 'bg-red-600' : 'bg-green-500'}`} />
                    <p className="text-lg text-slate-500 font-light max-w-sm leading-relaxed">
                      {slideData.subtitle}
                    </p>
                  </motion.div>
                </div>
                <div className="md:col-span-7 relative pl-8">
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                    className="absolute left-[45px] top-6 bottom-6 w-[3px] bg-slate-100 -z-10 origin-top"
                  />
                  <div className="space-y-8">
                    {slideData.steps.map((step, idx) => (
                      <motion.div key={idx} variants={itemVariants} className="flex items-center gap-6 group">
                        <div className={`w-[60px] h-[60px] flex-shrink-0 flex items-center justify-center rounded-full text-white shadow-lg z-10 relative transition-transform duration-300 group-hover:scale-110
                          ${slideData.type === 'problem' ? 'bg-red-600 shadow-red-200' : 'bg-green-500 shadow-green-200'}`}>
                           {step.icon ? <step.icon size={28} strokeWidth={2} /> : (slideData.type === 'problem' ? step.id : <Check size={24} strokeWidth={2.5} />)}
                        </div>
                        <motion.div whileHover={{ x: 10, backgroundColor: "#fff" }} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 flex-grow transition-all">
                          <h3 className="text-xl font-bold text-slate-800 mb-1">{step.text}</h3>
                          {step.sub && <p className="text-slate-500 text-sm">{step.sub}</p>}
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. DIFERENCIAL */}
            {slideData.layout === 'features_grid' && (
              <div className="max-w-6xl mx-auto w-full">
                <motion.div variants={titleVariants} className="text-center mb-12">
                  <h2 className="font-tech text-5xl text-slate-900 mb-4 font-light">{slideData.title}</h2>
                  <p className="text-slate-500 text-xl">{slideData.subtitle}</p>
                </motion.div>
                <div className="grid grid-cols-3 gap-6">
                  {slideData.features.map((item, idx) => (
                    <motion.div key={idx} variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center cursor-default">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <item.icon size={28} />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-3">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. CRONOGRAMA */}
            {slideData.layout === 'timeline_new' && (
              <div className="max-w-[90rem] mx-auto w-full">
                <motion.h2 variants={titleVariants} className="font-tech text-6xl text-center mb-20 text-slate-900 font-light">{slideData.title}</motion.h2>
                <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                  <div className="grid grid-cols-4 gap-8">
                    {slideData.phases.map((phase, idx) => (
                      <motion.div key={idx} variants={itemVariants} className="relative pt-12 group">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-md z-10 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full group-hover:border-blue-200 group-hover:shadow-md transition-all">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-4">Fase 0{idx + 1}</span>
                          <h3 className="text-lg font-bold text-slate-900 mb-4 h-12 flex items-center justify-center">{phase.title.replace(/Fase \d: /, '')}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed">{phase.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. CONTRATO */}
            {slideData.layout === 'contract_grid' && (
              <div className="max-w-5xl mx-auto w-full">
                <motion.div variants={titleVariants} className="text-center mb-16">
                  <h2 className="font-tech text-5xl text-slate-900 mb-4 font-light">{slideData.title}</h2>
                  <p className="text-slate-500 text-xl">{slideData.subtitle}</p>
                </motion.div>
                <div className="grid grid-cols-2 gap-8">
                  {slideData.items.map((item, idx) => (
                    <motion.div key={idx} variants={itemVariants} whileHover={{ scale: 1.02 }} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-8 cursor-default">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <item.icon size={32} />
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs uppercase tracking-wider font-bold block mb-2">{item.label}</span>
                        <span className="font-bold text-2xl text-slate-900">{item.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.div variants={itemVariants} className="mt-12 text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-full text-slate-600 text-sm border border-slate-100">
                    <Lock size={16} /> Contrato protegido por NDA
                  </div>
                </motion.div>
              </div>
            )}

            {/* --- 8. PRICE (ESTÁTICO NA CAPA / EDITÁVEL NO MODAL) --- */}
            {slideData.layout === 'price_hero' && (
              <div className="flex items-center justify-center w-full h-full relative">
                
                {/* Card Principal - APARÊNCIA ESTÁTICA (Como solicitado) */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ translateY: -5 }}
                  className="bg-white px-24 py-16 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-100 relative overflow-hidden text-center max-w-4xl w-full z-10"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0f172a] text-white text-[10px] font-bold px-6 py-2 rounded-b-xl tracking-[0.2em] uppercase shadow-md">
                    Proposta Final
                  </div>
                  
                  <h3 className="text-slate-400 font-bold uppercase tracking-[0.3em] mb-4 text-xs mt-4">
                    Investimento Total
                  </h3>

                  {/* Valor Estático - Apenas Texto */}
                  <div className="font-tech text-8xl text-blue-600 tracking-tighter mb-4 font-light flex justify-center items-baseline gap-2">
                    <span className="text-3xl text-slate-300 font-light translate-y-[-20px]">R$</span>
                    {formatCurrency(projectValue).replace('R$', '').trim()}
                  </div>

                  <div className="w-full h-px bg-slate-100 max-w-xs mx-auto mb-6"></div>
                  
                  <p className="text-slate-400 text-sm mb-10">
                    Entrada de {formatCurrency(entryValue)} + Parcelamento Flexível
                  </p>

                  <motion.button
                    onClick={() => setIsPriceModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center gap-2 mx-auto cursor-pointer hover:bg-blue-700"
                  >
                    Ver Parcelas <Calculator size={18} />
                  </motion.button>
                </motion.div>

                {/* --- MODAL CALCULADORA "STEALTH" --- */}
                {isPriceModalOpen && ReactDOM.createPortal(
                    <AnimatePresence>
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-body">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setIsPriceModalOpen(false)}
                                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                            />
                            
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl relative overflow-hidden flex flex-col max-h-[90vh] z-10"
                            >
                                {/* Header do Modal */}
                                <div className="bg-white p-6 pb-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                            <Calculator size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-tech text-2xl font-bold text-slate-900">Detalhamento Financeiro</h3>
                                            <p className="text-slate-500 text-sm">Planejamento de investimento.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsPriceModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-8 overflow-y-auto custom-scrollbar">
                                    
                                    {/* 1. INPUTS PRINCIPAIS (Stealth: Parecem texto, sem ícones, sem setas, R$ próximo) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                            <label className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-2">
                                                Valor Total
                                            </label>
                                            {/* MUDANÇA AQUI: gap-1 para aproximar */}
                                            <div className="flex items-center gap-1">
                                                <span className="text-slate-400 font-light text-2xl">R$</span>
                                                <input 
                                                    type="number" 
                                                    value={projectValue} 
                                                    onChange={(e) => setProjectValue(Number(e.target.value))}
                                                    // MUDANÇA AQUI: Adicionada a classe 'no-spin'
                                                    className="no-spin bg-transparent text-3xl font-bold text-slate-900 w-full outline-none border-none p-0 m-0 focus:ring-0"
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                            <label className="text-emerald-700 text-xs font-bold uppercase tracking-wider block mb-2">
                                                Entrada
                                            </label>
                                            {/* MUDANÇA AQUI: gap-1 para aproximar */}
                                            <div className="flex items-center gap-1">
                                                <span className="text-emerald-500 font-light text-2xl">R$</span>
                                                <input 
                                                    type="number" 
                                                    value={entryValue} 
                                                    onChange={(e) => setEntryValue(Number(e.target.value))}
                                                    // MUDANÇA AQUI: Adicionada a classe 'no-spin'
                                                    className="no-spin bg-transparent text-3xl font-bold text-emerald-800 w-full outline-none border-none p-0 m-0 focus:ring-0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. EDICAO DE ETAPAS (GANGORRA AUTOMÁTICA) */}
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-slate-700 text-lg">Distribuição do Saldo</h4>
                                            <span className="text-sm text-slate-500">Saldo a financiar: <strong>{formatCurrency(financedAmount)}</strong></span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Etapa 1 Editável (Stealth) */}
                                            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex items-center justify-between">
                                                <div>
                                                    <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider block">Etapa 1</span>
                                                    <span className="font-bold text-slate-900 text-lg">Desenvolvimento</span>
                                                </div>
                                                <div className="text-right flex items-baseline justify-end gap-1">
                                                     <span className="text-blue-700 font-bold text-xl">R$</span>
                                                     <input 
                                                        type="number"
                                                        value={Math.round(stage1Value)}
                                                        onChange={(e) => {
                                                            let val = Number(e.target.value);
                                                            if (val > financedAmount) val = financedAmount;
                                                            if (val < 0) val = 0;
                                                            setStage1Value(val);
                                                        }}
                                                        // Adicionado 'leading-none' para evitar espaçamento vertical extra
                                                        className="no-spin bg-transparent text-2xl font-bold text-blue-700 w-[80px] text-right outline-none border-none p-0 m-0 leading-none focus:ring-0"
                                                     />
                                                </div>
                                            </div>
                                            
                                            {/* Etapa 2 Editável (Stealth) */}
                                            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 flex items-center justify-between">
                                                <div>
                                                    <span className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider block">Etapa 2</span>
                                                    <span className="font-bold text-slate-900 text-lg">Entrega Final</span>
                                                </div>
                                                {/* Já estava gap-1, mantido */}
                                                <div className="text-right flex items-baseline justify-end gap-1">
                                                     <span className="text-indigo-700 font-bold text-xl">R$</span>
                                                     <input 
                                                        type="number"
                                                        value={Math.round(stage2Value)}
                                                        onChange={(e) => {
                                                            let val = Number(e.target.value);
                                                            if (val > financedAmount) val = financedAmount;
                                                            if (val < 0) val = 0;
                                                            setStage1Value(financedAmount - val);
                                                        }}
                                                        // MUDANÇA AQUI: Adicionada a classe 'no-spin'
                                                        className="no-spin bg-transparent text-2xl font-bold text-blue-700 w-[80px] text-right outline-none border-none p-0 m-0 leading-none focus:ring-0"
                                                     />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Tabelas de Parcelamento */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                            <div className="bg-slate-50 p-3 border-b border-slate-100 text-center font-bold text-slate-500 text-xs uppercase tracking-wide">
                                                Opções Etapa 1
                                            </div>
                                            <div className="divide-y divide-slate-50">
                                                {installmentOptions.map((opt) => (
                                                    <div key={opt} className="flex justify-between p-3 px-5 hover:bg-blue-50/50 transition-colors text-sm">
                                                        <span className="font-bold text-slate-700">{opt}x</span>
                                                        <span className="font-mono text-slate-600">{formatCurrency(stage1Value / opt)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                            <div className="bg-slate-50 p-3 border-b border-slate-100 text-center font-bold text-slate-500 text-xs uppercase tracking-wide">
                                                Opções Etapa 2
                                            </div>
                                            <div className="divide-y divide-slate-50">
                                                {installmentOptions.map((opt) => (
                                                    <div key={opt} className="flex justify-between p-3 px-5 hover:bg-indigo-50/50 transition-colors text-sm">
                                                        <span className="font-bold text-slate-700">{opt}x</span>
                                                        <span className="font-mono text-slate-600">{formatCurrency(stage2Value / opt)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center text-[11px] text-slate-400 shrink-0">
                                    * Valores sujeitos a análise.
                                </div>
                            </motion.div>
                        </div>
                    </AnimatePresence>,
                    document.body
                )}
              </div>
            )}

            {/* 9. THANKS */}
            {slideData.layout === 'thanks_hero' && (
              <div className="flex flex-col items-center justify-center text-center h-full">
                <motion.h2 variants={titleVariants} className="font-tech text-7xl md:text-8xl text-slate-900 mb-4 tracking-wide uppercase font-light">
                  {slideData.title}
                </motion.h2>
                <motion.p variants={itemVariants} className="text-2xl text-slate-400 font-light mb-12">
                  {slideData.subtitle}
                </motion.p>
                <motion.a
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                  href={`mailto:${slideData.contact}`}
                  className="flex items-center gap-3 px-8 py-4 bg-white text-slate-800 rounded-full font-bold text-lg border border-slate-200 shadow-md transition-all group"
                >
                  <span>{slideData.contact}</span>
                  <div className="bg-blue-50 text-blue-600 rounded-full p-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronRight size={16} />
                  </div>
                </motion.a>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles */}
      <div className="absolute bottom-10 right-12 flex gap-4 z-50">
        <button onClick={prevSlide} className="w-12 h-12 flex items-center justify-center bg-white text-slate-600 rounded-full hover:bg-slate-50 shadow-md border border-slate-200 transition-colors"><ChevronLeft size={24} /></button>
        <button onClick={nextSlide} className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-blue-600 shadow-xl transition-colors"><ChevronRight size={24} /></button>
      </div>

      <button onClick={toggleFullScreen} className="absolute bottom-10 left-12 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
        <Maximize2 size={16} />
      </button>

    </div>
  );
};

export default Presentation;