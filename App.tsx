
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Smartphone, Sparkles, CreditCard, User, Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Camera, ShieldCheck, Bot, Lock, Zap, BarChart3, X, Send, Plus, ChevronRight, Calendar, PiggyBank, RefreshCcw, KeyRound, Building2, FileText, Leaf, Gauge, RotateCw, LogIn, Eye, EyeOff, LockKeyhole, Unlock, Tag, Gift, LogOut, Heart, MessageCircle, Users, Mail, MapPin, Settings, FileText as DocumentIcon, LifeBuoy, Bell, Moon, Globe, Shield, ChevronDown, History, Target, Share2, AlertCircle, Ghost, Flame, Split, Divide, Receipt } from 'lucide-react';
import { OnboardingStep, UserState, Persona, AISettings, ChatMessage, Account, SmartPocket, Contact, Perk, SocialPost, Transaction, SocialGroupData, GhostCard, SharedTab } from './types';
import { INTERESTS, CARD_DESIGNS, MOCK_TRANSACTIONS, AI_MODES, FINANCIAL_GOALS, MOCK_ACCOUNTS, MOCK_CONTACTS, POCKET_COLORS, DEFAULT_USER, POCKET_TEMPLATES, MOCK_PERKS, MOCK_SOCIAL_POSTS, MOCK_GHOST_CARDS, MOCK_SHARED_TABS } from './constants';
import { generateFinancialPersona, generateAIPersonalityWelcome, createNovaChat } from './services/geminiService';
import { Button, Input, FadeIn, LoadingSpinner, ProgressBar } from './components/Components';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { Chat, GenerateContentResponse } from "@google/genai";

// --- New Power User Modals ---

const SalarySorterModal: React.FC<{ 
  transaction: Transaction | null; 
  isOpen: boolean; 
  onClose: () => void;
  onConfirm: () => void;
}> = ({ transaction, isOpen, onClose, onConfirm }) => {
  const [needs, setNeeds] = useState(50);
  const [goals, setGoals] = useState(30);
  const wants = 100 - needs - goals;
  const amount = transaction?.amount || 0;

  if (!isOpen || !transaction) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-50 backdrop-blur-sm" />
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed bottom-0 inset-x-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-zinc-900 rounded-t-3xl md:rounded-3xl z-50 p-6 border border-zinc-800 shadow-2xl">
            <div className="flex justify-center mb-6 md:hidden"><div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div></div>
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-primary"/> Financial Autopilot</h3>
                  <p className="text-zinc-400 text-sm">Income Detected: <span className="text-white font-mono">${amount.toLocaleString()}</span></p>
               </div>
               <button onClick={onClose}><X size={20} className="text-zinc-500"/></button>
            </div>

            <div className="space-y-6 mb-8">
               {/* Needs */}
               <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                     <span className="text-pink-400">Needs (Bills)</span>
                     <span>{needs}% <span className="text-zinc-500">(${Math.round(amount * (needs/100))})</span></span>
                  </div>
                  <input type="range" min="0" max="100" value={needs} onChange={(e) => {
                     const val = Number(e.target.value);
                     if (val + goals <= 100) setNeeds(val);
                  }} className="w-full h-2 bg-zinc-800 rounded-full accent-pink-500 appearance-none" />
               </div>

               {/* Goals */}
               <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                     <span className="text-emerald-400">Goals (Savings)</span>
                     <span>{goals}% <span className="text-zinc-500">(${Math.round(amount * (goals/100))})</span></span>
                  </div>
                  <input type="range" min="0" max="100" value={goals} onChange={(e) => {
                     const val = Number(e.target.value);
                     if (val + needs <= 100) setGoals(val);
                  }} className="w-full h-2 bg-zinc-800 rounded-full accent-emerald-500 appearance-none" />
               </div>

               {/* Wants (Calculated) */}
               <div className="space-y-2 opacity-80">
                  <div className="flex justify-between text-sm font-medium">
                     <span className="text-blue-400">Wants (Play)</span>
                     <span>{wants}% <span className="text-zinc-500">(${Math.round(amount * (wants/100))})</span></span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500" style={{ width: `${wants}%` }}></div>
                  </div>
               </div>
            </div>

            <Button onClick={onConfirm} className="w-full py-4 text-lg bg-gradient-to-r from-pink-500 via-primary to-emerald-500 border-0">
               Execute Split ⚡
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const GhostCardsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [cards, setCards] = useState<GhostCard[]>(MOCK_GHOST_CARDS);

  const burnCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const createCard = () => {
    const newCard: GhostCard = {
       id: Date.now().toString(),
       name: 'New Ghost Card',
       number: `${Math.floor(1000 + Math.random() * 9000)} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
       cvc: '•••',
       expiry: '12/25',
       status: 'ACTIVE',
       maxSpend: 100
    };
    setCards([...cards, newCard]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-50 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
         <div className="bg-zinc-950 w-full max-w-md rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
               <div className="flex items-center gap-2">
                  <Ghost className="text-fuchsia-400" />
                  <h3 className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Ghost Cards</h3>
               </div>
               <button onClick={onClose}><X size={20} className="text-zinc-500"/></button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
               <AnimatePresence>
                  {cards.map(card => (
                     <motion.div 
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, filter: 'brightness(2)' }}
                        className="bg-black border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group"
                     >
                        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/20 via-transparent to-cyan-900/20 opacity-50"></div>
                        <div className="relative z-10">
                           <div className="flex justify-between items-start mb-4">
                              <span className="text-xs font-bold text-fuchsia-400 border border-fuchsia-500/30 px-2 py-1 rounded bg-fuchsia-500/10">ONE-TIME USE</span>
                              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 opacity-70 invert" alt="MC"/>
                           </div>
                           <p className="font-mono text-xl text-zinc-300 tracking-widest mb-2 text-shadow-glow">{card.number}</p>
                           <div className="flex justify-between items-end">
                              <div>
                                 <p className="text-[10px] text-zinc-500 uppercase">Expires</p>
                                 <p className="font-mono text-sm text-zinc-300">{card.expiry}</p>
                              </div>
                              <button onClick={() => burnCard(card.id)} className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors">
                                 <Flame size={12} /> BURN CARD
                              </button>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
               <Button onClick={createCard} variant="secondary" className="w-full border-dashed border-zinc-700 hover:border-fuchsia-500 hover:text-fuchsia-400">
                  <Plus size={18} /> Generate New Ghost
               </Button>
            </div>
         </div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Detail Modals ---

const TransactionDetailModal: React.FC<{ 
  transaction: Transaction | null; 
  isOpen: boolean; 
  onClose: () => void; 
}> = ({ transaction, isOpen, onClose }) => {
  if (!transaction || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-50 backdrop-blur-sm" />
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed bottom-0 inset-x-0 bg-zinc-900 rounded-t-3xl z-50 p-6 max-w-lg mx-auto border-t border-zinc-800 shadow-2xl">
            <div className="flex justify-center mb-6"><div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div></div>
            
            <div className="flex flex-col items-center mb-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-xl ${transaction.amount > 0 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-800 text-white border border-zinc-700'}`}>
                {transaction.amount > 0 ? <ArrowDownLeft size={40} /> : <ArrowUpRight size={40} />}
              </div>
              <h2 className="text-3xl font-bold font-mono mb-1">
                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
              </h2>
              <p className="text-zinc-400">{transaction.merchant}</p>
            </div>

            <div className="space-y-4 bg-black/20 rounded-2xl p-4 border border-zinc-800/50">
              <div className="flex justify-between py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500">Status</span>
                <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium"><Check size={14} /> {transaction.status}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500">Date</span>
                <span className="text-white">{transaction.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500">Category</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-xs">{transaction.category}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-500">Location</span>
                <span className="text-white flex items-center gap-1"><MapPin size={12} /> {transaction.location || 'Online'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button variant="secondary" className="text-xs h-10">Report Issue</Button>
              <Button variant="secondary" className="text-xs h-10">Split Bill</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const AccountDetailModal: React.FC<{
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ account, isOpen, onClose }) => {
  if (!account || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-50 backdrop-blur-sm" />
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
             <div className="bg-zinc-950 w-full max-w-md rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]">
               <div className={`p-6 ${account.type === 'CREDIT' ? 'bg-gradient-to-br from-purple-900 to-black' : 'bg-gradient-to-br from-blue-900 to-black'}`}>
                 <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{account.name}</h3>
                      <p className="text-white/60 font-mono text-sm">{account.accountNumber}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-black/20 rounded-full text-white/70 hover:text-white"><X size={20}/></button>
                 </div>
                 <h2 className="text-4xl font-bold text-white font-mono mb-2">
                    {account.balance < 0 ? '-' : ''}${Math.abs(account.balance).toLocaleString()}
                 </h2>
                 <div className="flex gap-4 text-xs text-white/70">
                    <span>Type: {account.type}</span>
                    {account.limit && <span>Limit: ${account.limit.toLocaleString()}</span>}
                 </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <h4 className="font-bold text-zinc-400 text-sm uppercase tracking-wider px-2">Recent Activity</h4>
                  {MOCK_TRANSACTIONS.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-zinc-900 rounded-xl transition-colors">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-white'}`}>
                            {tx.amount > 0 ? <ArrowDownLeft size={14}/> : <ArrowUpRight size={14}/>}
                          </div>
                          <div>
                             <p className="text-sm font-medium">{tx.merchant}</p>
                             <p className="text-xs text-zinc-500">{tx.date}</p>
                          </div>
                       </div>
                       <span className={`text-sm font-mono font-medium ${tx.amount > 0 ? 'text-emerald-400' : 'text-zinc-200'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                       </span>
                    </div>
                  ))}
               </div>

               <div className="p-4 border-t border-zinc-800 grid grid-cols-3 gap-2 bg-zinc-900">
                  <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-zinc-800 transition-colors">
                     <FileText size={20} className="text-zinc-400" />
                     <span className="text-[10px] text-zinc-500">Statements</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-zinc-800 transition-colors">
                     <Settings size={20} className="text-zinc-400" />
                     <span className="text-[10px] text-zinc-500">Settings</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-zinc-800 transition-colors">
                     <Lock size={20} className="text-zinc-400" />
                     <span className="text-[10px] text-zinc-500">{account.isLocked ? 'Unlock' : 'Lock'}</span>
                  </button>
               </div>
             </div>
           </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SquadGoalModal: React.FC<{
  groupData: SocialGroupData | undefined;
  isOpen: boolean;
  onClose: () => void;
}> = ({ groupData, isOpen, onClose }) => {
  if (!groupData || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-50 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 z-50 shadow-2xl">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Squad Goal</p>
                 <h3 className="text-xl font-bold">{groupData.goalName}</h3>
               </div>
               <button onClick={onClose}><X size={20} className="text-zinc-500" /></button>
             </div>

             <div className="space-y-6">
                {groupData.members.map((member, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                           <div className={`w-6 h-6 rounded-full ${member.avatarColor} flex items-center justify-center text-[10px] font-bold`}>{member.name.charAt(0)}</div>
                           <span className="font-medium">{member.name}</span>
                        </div>
                        <span className="text-zinc-400">{member.progress}%</span>
                     </div>
                     <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${member.progress}%` }} 
                          transition={{ delay: 0.2 + (i * 0.1) }}
                          className={`h-full rounded-full ${member.name === 'You' ? 'bg-blue-500' : 'bg-zinc-600'}`} 
                        />
                     </div>
                     <p className="text-[10px] text-right text-zinc-500">{member.status}</p>
                  </div>
                ))}
             </div>

             <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white">Nudge Squad 🔔</Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const PocketDetailModal: React.FC<{
  pocket: SmartPocket | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ pocket, isOpen, onClose }) => {
  if (!pocket || !isOpen) return null;

  // Mock history data generation based on current balance
  const historyData = [
    { date: 'Wk 1', balance: pocket.balance * 0.6 },
    { date: 'Wk 2', balance: pocket.balance * 0.75 },
    { date: 'Wk 3', balance: pocket.balance * 0.85 },
    { date: 'Wk 4', balance: pocket.balance },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-50 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden z-50 shadow-2xl">
             <div className={`p-6 bg-gradient-to-br ${pocket.color}`}>
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 bg-black/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                      {pocket.emoji}
                   </div>
                   <button onClick={onClose} className="p-2 bg-black/20 rounded-full text-white/70 hover:text-white"><X size={20}/></button>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{pocket.name}</h3>
                <p className="text-white/80 text-sm font-medium flex items-center gap-1">
                   {pocket.autoSave ? <RotateCw size={12} /> : null} {pocket.autoSave ? 'Auto-Save On' : 'Manual Funding'}
                </p>
             </div>

             <div className="p-6 space-y-6">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Current Balance</p>
                      <h2 className="text-3xl font-bold font-mono">${pocket.balance.toLocaleString()}</h2>
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Goal</p>
                      <p className="text-lg font-bold text-zinc-400">${pocket.goal.toLocaleString()}</p>
                   </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                   <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(pocket.balance / pocket.goal) * 100}%` }} className={`h-full bg-gradient-to-r ${pocket.color}`} />
                   </div>
                   <p className="text-xs text-zinc-500 text-right">{Math.round((pocket.balance / pocket.goal) * 100)}% Complete</p>
                </div>

                {/* Chart */}
                <div className="h-32 w-full bg-zinc-900/50 rounded-xl p-2 border border-zinc-800">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyData}>
                         <defs>
                            <linearGradient id="pocketChart" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2}/>
                               <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <Tooltip cursor={false} contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                         <Area type="monotone" dataKey="balance" stroke="#ffffff" strokeWidth={2} fill="url(#pocketChart)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>

                <div className="flex gap-3">
                   <Button className="flex-1 text-sm" icon={Plus}>Add Funds</Button>
                   <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white">
                      <Settings size={20} />
                   </button>
                </div>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CreateGoalModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (name: string, emoji: string) => void }> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💰');
  const emojis = ['💰', '🏠', '🚗', '💍', '👶', '🎓', '🖥️', '🏝️', '🎨', '🎸'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-50 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 p-6 rounded-3xl border border-zinc-700 w-80 z-50 shadow-2xl">
         <h3 className="text-lg font-bold mb-4 text-center">Create Custom Goal</h3>
         <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center text-4xl border border-zinc-600">
               {selectedEmoji}
            </div>
         </div>
         
         <div className="grid grid-cols-5 gap-2 mb-6">
            {emojis.map(e => (
               <button key={e} onClick={() => setSelectedEmoji(e)} className={`p-2 rounded-lg hover:bg-zinc-700 ${selectedEmoji === e ? 'bg-primary/20 border border-primary' : ''}`}>{e}</button>
            ))}
         </div>

         <Input placeholder="Goal Name (e.g. New Bike)" value={name} onChange={(e) => setName(e.target.value)} className="mb-6" autoFocus />
         
         <Button className="w-full" disabled={!name} onClick={() => { onSave(name, selectedEmoji); onClose(); setName(''); }}>Create Goal</Button>
      </motion.div>
    </AnimatePresence>
  )
}

// --- Utility Components (Enhanced) ---

const NotificationToast: React.FC<{ message: string; visible: boolean; onClose: () => void }> = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-8 left-1/2 z-50 bg-zinc-900 border border-zinc-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
        >
          <div className="bg-emerald-500/20 p-1 rounded-full">
             <Check size={14} className="text-emerald-500" />
          </div>
          <span className="font-medium text-sm">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ZelleModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  type: 'send' | 'request';
  onSuccess: (amount: string, recipient: string) => void;
}> = ({ isOpen, onClose, type, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    if (selectedContact && amount) {
      onSuccess(amount, selectedContact.name);
      setStep(1);
      setAmount('');
      setSelectedContact(null);
    }
  };

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setAmount('');
        setSelectedContact(null);
      }, 300);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-[#1e1e24] border border-[#6d28d9]/30 rounded-3xl overflow-hidden shadow-2xl shadow-[#6d28d9]/20">
              {/* Zelle Header */}
              <div className="bg-[#6d28d9] p-6 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
                 <h3 className="text-2xl font-bold text-white italic relative z-10">Zelle®</h3>
                 <p className="text-white/80 text-sm relative z-10">{type === 'send' ? 'Send Money' : 'Request Money'}</p>
                 <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-1">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-6 min-h-[400px] flex flex-col">
                {step === 1 ? (
                  <div className="space-y-4 flex-1">
                    <Input placeholder="Enter name, email, or mobile" className="bg-zinc-900/50 border-zinc-700" autoFocus />
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Recent</p>
                      <div className="space-y-2">
                        {MOCK_CONTACTS.filter(c => c.recent).map(contact => (
                          <button
                            key={contact.id}
                            onClick={() => { setSelectedContact(contact); setStep(2); }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                          >
                            <div className={`w-10 h-10 rounded-full ${contact.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                              {contact.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-zinc-200 group-hover:text-[#6d28d9] transition-colors">{contact.name}</p>
                              <p className="text-xs text-zinc-500">{contact.handle}</p>
                            </div>
                            <ChevronRight size={16} className="text-zinc-600" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 flex-1 flex flex-col">
                    <div className="text-center space-y-1">
                      <div className={`w-16 h-16 mx-auto rounded-full ${selectedContact?.avatarColor} flex items-center justify-center text-white font-bold text-2xl mb-2`}>
                         {selectedContact?.name.charAt(0)}
                      </div>
                      <p className="text-zinc-400 text-sm">{type === 'send' ? 'Sending to' : 'Requesting from'}</p>
                      <h4 className="text-xl font-bold">{selectedContact?.name}</h4>
                      <p className="text-xs text-zinc-500">{selectedContact?.handle}</p>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                       <div className="relative">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl text-zinc-500">$</span>
                          <input 
                             type="number" 
                             value={amount}
                             onChange={(e) => setAmount(e.target.value)}
                             placeholder="0.00"
                             className="bg-transparent text-5xl font-bold text-center w-full focus:outline-none text-white placeholder-zinc-700"
                             autoFocus
                          />
                       </div>
                    </div>

                    <Button 
                      onClick={handleSubmit} 
                      disabled={!amount}
                      className="bg-[#6d28d9] hover:bg-[#5b21b6] text-white w-full shadow-lg shadow-[#6d28d9]/25"
                    >
                      {type === 'send' ? 'Send Now' : 'Request Now'}
                    </Button>
                    <button onClick={() => setStep(1)} className="w-full text-center text-sm text-zinc-500 hover:text-zinc-300">
                      Back to contacts
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SocialFeedModal: React.FC<{ isOpen: boolean; onClose: () => void; onOpenSquadGoal: (data: SocialGroupData) => void }> = ({ isOpen, onClose, onOpenSquadGoal }) => {
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_SOCIAL_POSTS);
  const [newComment, setNewComment] = useState('');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [view, setView] = useState<'FEED' | 'WALLET'>('FEED');

  const handleLike = (postId: string) => {
    setPosts(current => current.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: string) => {
    if (!newComment.trim()) return;
    setPosts(current => current.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { id: Date.now().toString(), user: 'You', text: newComment, time: 'Just now' }]
        };
      }
      return post;
    }));
    setNewComment('');
    setActivePostId(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={onClose}
        className="fixed inset-0 bg-black z-50"
      />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col shadow-2xl"
      >
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/95 backdrop-blur sticky top-0 z-10">
           <div className="flex items-center gap-2">
              <Users className="text-primary" />
              <h3 className="font-bold text-lg">Nova Circle</h3>
           </div>
           <button onClick={onClose}><X size={20} className="text-zinc-500" /></button>
        </div>

        {/* Feed Toggle */}
        <div className="px-4 pt-4">
           <div className="flex p-1 bg-zinc-900 rounded-xl">
              <button onClick={() => setView('FEED')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'FEED' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Activity Feed</button>
              <button onClick={() => setView('WALLET')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'WALLET' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Shared Tabs</button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
           {view === 'FEED' ? (
             posts.map(post => (
                <div key={post.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 space-y-3">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${post.avatarColor} flex items-center justify-center font-bold text-white`}>
                         {post.user.charAt(0)}
                      </div>
                      <div>
                         <p className="font-bold text-sm">{post.user}</p>
                         <p className="text-xs text-zinc-500">{post.time}</p>
                      </div>
                      {post.type === 'GOAL' && <span className="ml-auto text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">GOAL</span>}
                      {post.type === 'SAVING' && <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">SAVING</span>}
                      {post.type === 'MILESTONE' && <span className="ml-auto text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">MILESTONE</span>}
                   </div>

                   <div className="pl-13 cursor-pointer" onClick={() => post.groupData && onOpenSquadGoal(post.groupData)}>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                         <span className="text-primary font-medium">Nova detected</span> {post.content}
                      </p>
                      {post.metric && (
                         <div className="mt-3 bg-zinc-900 rounded-xl p-3 flex items-center gap-3 border border-zinc-800 hover:border-zinc-600 transition-colors">
                            <div className="p-2 bg-zinc-800 rounded-lg">
                               <TrendingUp size={16} className="text-primary" />
                            </div>
                            <span className="font-bold text-lg">{post.metric}</span>
                         </div>
                      )}
                   </div>

                   <div className="pt-2 flex items-center gap-4 border-t border-zinc-800/50">
                      <button 
                         onClick={() => handleLike(post.id)}
                         className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${post.hasLiked ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                         <Heart size={16} className={post.hasLiked ? 'fill-pink-500' : ''} /> {post.likes}
                      </button>
                      <button 
                         onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                         className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                         <MessageCircle size={16} /> {post.comments.length}
                      </button>
                   </div>

                   {/* Comments Section */}
                   <AnimatePresence>
                      {activePostId === post.id && (
                         <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="space-y-3 pt-3">
                               {post.comments.map(comment => (
                                  <div key={comment.id} className="flex gap-2 text-xs">
                                     <span className="font-bold text-zinc-300">{comment.user}</span>
                                     <span className="text-zinc-400">{comment.text}</span>
                                  </div>
                               ))}
                               <div className="flex gap-2 mt-2">
                                  <input 
                                     type="text" 
                                     placeholder="Add a comment..." 
                                     value={newComment}
                                     onChange={(e) => setNewComment(e.target.value)}
                                     className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs focus:border-primary outline-none"
                                  />
                                  <button onClick={() => handleComment(post.id)} className="text-xs font-bold text-primary">Post</button>
                               </div>
                            </div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             ))
           ) : (
             <div className="space-y-4">
                {MOCK_SHARED_TABS.map(tab => (
                   <div key={tab.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-xl shadow-inner">{tab.emoji}</div>
                            <div>
                               <h4 className="font-bold text-white">{tab.name}</h4>
                               <p className="text-xs text-zinc-500">Total Spend: <span className="text-zinc-300">${tab.totalSpend}</span></p>
                            </div>
                         </div>
                         <div className={`text-right text-sm font-bold px-2 py-1 rounded-lg ${tab.myBalance < 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {tab.myBalance < 0 ? 'You Owe' : 'Owed'} ${Math.abs(tab.myBalance)}
                         </div>
                      </div>
                      
                      {/* Who Owes Who */}
                      <div className="bg-black/20 rounded-xl p-3 space-y-2">
                         <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Balances</p>
                         {tab.members.map((m, i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                               <div className="flex items-center gap-2">
                                  <div className={`w-5 h-5 rounded-full ${m.avatarColor} text-[10px] flex items-center justify-center font-bold`}>{m.name.charAt(0)}</div>
                                  <span className="text-zinc-300">{m.name}</span>
                               </div>
                               <span className={m.balance < 0 ? 'text-red-400' : 'text-emerald-400'}>
                                  {m.balance < 0 ? '-' : '+'}${Math.abs(m.balance)}
                               </span>
                            </div>
                         ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                         <Button variant="secondary" className="text-xs h-8">Add Expense</Button>
                         <Button variant="secondary" className="text-xs h-8">Settle Up</Button>
                      </div>
                   </div>
                ))}
                <Button variant="outline" className="w-full border-dashed border-zinc-700 text-zinc-500 hover:text-white">
                   <Plus size={16} /> Create Shared Tab
                </Button>
             </div>
           )}
        </div>
      </motion.div>
    </>
  );
};

const AnalyticsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const SPENDING_DATA = [
    { name: 'Food', value: 400, color: '#f472b6' },
    { name: 'Transport', value: 300, color: '#60a5fa' },
    { name: 'Shopping', value: 300, color: '#fbbf24' },
    { name: 'Bills', value: 200, color: '#34d399' },
  ];

  // Realistic dates for the bar chart
  const MONTHLY_DATA = [
    { name: 'Oct', income: 4000, expense: 2400 },
    { name: 'Nov', income: 3000, expense: 1398 },
    { name: 'Dec', income: 5000, expense: 3800 },
    { name: 'Jan', income: 2780, expense: 1908 },
  ];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 sticky top-0 z-10">
             <h3 className="text-xl font-bold flex items-center gap-2"><BarChart3 className="text-primary"/> Analytics</h3>
             <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors"><X size={20} className="text-zinc-500" /></button>
          </div>
          
          <div className="p-6 space-y-8 overflow-y-auto">
             {/* Pie Chart Section (Refined Layout) */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col">
                   <h4 className="text-sm font-bold text-zinc-300 mb-4">Spending Breakdown</h4>
                   <div className="flex items-center justify-between flex-1">
                      <div className="h-40 w-40 relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie
                                  data={SPENDING_DATA}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={40}
                                  outerRadius={70}
                                  paddingAngle={5}
                                  dataKey="value"
                                  stroke="none"
                               >
                                  {SPENDING_DATA.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                               </Pie>
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                      {/* Side Legend to prevent overlap */}
                      <div className="space-y-3 ml-4">
                         {SPENDING_DATA.map(d => (
                            <div key={d.name} className="flex items-center gap-2 text-sm">
                               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                               <div className="flex flex-col">
                                  <span className="text-zinc-400 text-xs">{d.name}</span>
                                  <span className="font-bold font-mono text-white">${d.value}</span>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Top Merchants */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                   <h4 className="text-sm font-bold text-zinc-300 mb-4">Top Merchants</h4>
                   <div className="space-y-3">
                      {[
                         { name: 'Starbucks', amount: 124.50, icon: '☕' },
                         { name: 'Uber', amount: 98.20, icon: '🚗' },
                         { name: 'Whole Foods', amount: 245.00, icon: '🥦' },
                      ].map((m, i) => (
                         <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-sm">{m.icon}</div>
                               <span className="text-sm font-medium">{m.name}</span>
                            </div>
                            <span className="text-sm font-mono">${m.amount}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Bar Chart Section (Realistic Dates) */}
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-zinc-300 mb-4">Income vs Expense (Last 4 Months)</h4>
                <div className="h-64 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                         <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} 
                            cursor={{ fill: '#27272a', opacity: 0.4 }}
                         />
                         <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                         <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                         <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const SettingRow = ({ icon: Icon, label, value, type = 'toggle' }: any) => (
     <div className="flex items-center justify-between p-4 hover:bg-zinc-900/50 rounded-xl transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
              <Icon size={18} />
           </div>
           <span className="font-medium text-sm">{label}</span>
        </div>
        {type === 'toggle' ? (
           <div className={`w-10 h-6 rounded-full relative transition-colors ${value ? 'bg-primary' : 'bg-zinc-700'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-4' : ''}`}></div>
           </div>
        ) : (
           <ChevronRight size={16} className="text-zinc-600" />
        )}
     </div>
  );

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 sticky top-0 z-10">
             <h3 className="text-xl font-bold flex items-center gap-2"><Settings className="text-primary"/> Settings</h3>
             <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors"><X size={20} className="text-zinc-500" /></button>
          </div>
          
          <div className="p-4 space-y-6 overflow-y-auto">
             <div>
                <p className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Preferences</p>
                <SettingRow icon={Bell} label="Push Notifications" value={true} />
                <SettingRow icon={Mail} label="Email Alerts" value={false} />
                <SettingRow icon={Moon} label="Dark Mode" value={true} />
             </div>

             <div>
                <p className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Security</p>
                <SettingRow icon={Smartphone} label="Face ID Login" value={true} />
                <SettingRow icon={Lock} label="Change PIN" type="arrow" />
                <SettingRow icon={Shield} label="Privacy Center" type="arrow" />
             </div>

             <div>
                <p className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Account</p>
                <SettingRow icon={CreditCard} label="Card Limits" type="arrow" />
                <SettingRow icon={Globe} label="Linked Accounts" type="arrow" />
                <SettingRow icon={LifeBuoy} label="Support" type="arrow" />
             </div>
             
             <div className="px-4 pt-4 text-center">
                <p className="text-xs text-zinc-600">Nova App v2.4.0 (Build 892)</p>
             </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const ProfileModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  user: UserState;
  avatarUrl: string;
}> = ({ isOpen, onClose, user, avatarUrl: initialAvatarUrl }) => {
  const [displayMode, setDisplayMode] = useState(user.aiSettings?.modeId || 'strategist');
  const [currentAvatar, setCurrentAvatar] = useState(initialAvatarUrl);
  // Use a local seed to allow "Regenerate" to create variants
  const [avatarSeed, setAvatarSeed] = useState(user.name);

  useEffect(() => {
    setCurrentAvatar(initialAvatarUrl);
    setAvatarSeed(user.name);
    setDisplayMode(user.aiSettings?.modeId || 'strategist');
  }, [initialAvatarUrl, user.aiSettings?.modeId, user.name]);

  const regenerateAvatar = () => {
    // Create a new seed variant
    const newSeed = `${user.name}-${Math.random().toString(36).substring(7)}`;
    setAvatarSeed(newSeed);
    updateAvatar(displayMode, newSeed);
  };

  const updateAvatar = (mode: string, seed: string) => {
    let newUrl = '';
    switch (mode) {
      case 'strategist': 
        newUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=c0aede,b6e3f4`;
        break;
      case 'hype-man': 
        newUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=ffdfbf,ffd5dc`;
        break;
      case 'zen-guide': 
        newUrl = `https://api.dicebear.com/9.x/micah/svg?seed=${seed}&backgroundColor=d1d4f9,c0aede`;
        break;
      default: 
        newUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
    }
    setCurrentAvatar(newUrl);
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">
          {/* Header / Banner */}
          <div className="h-32 bg-gradient-to-r from-primary to-secondary relative">
             <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur">
                <X size={18} />
             </button>
          </div>

          <div className="px-6 pb-8 relative">
             {/* Avatar Row */}
             <div className="relative -mt-16 mb-6 flex justify-center">
                <div className="relative group">
                   <div className="w-32 h-32 rounded-full bg-zinc-900 p-1 border-4 border-zinc-950 shadow-xl relative overflow-hidden">
                      <img src={currentAvatar} alt="Profile" className="w-full h-full rounded-full bg-zinc-800 object-cover transition-all duration-300" />
                   </div>
                   <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-2 border-zinc-900 rounded-full z-10" title="Verified Identity"></div>
                   
                   {/* Regenerate Button */}
                   <button 
                     onClick={regenerateAvatar}
                     className="absolute top-0 right-0 bg-zinc-800 hover:bg-zinc-700 text-white p-1.5 rounded-full border-2 border-zinc-950 shadow-lg transition-transform active:rotate-180 group-hover:scale-110"
                     title="Regenerate AI Look"
                   >
                     <RefreshCcw size={14} />
                   </button>
                </div>
             </div>

             {/* Core Info */}
             <div className="space-y-2 mb-8 text-center">
                <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 justify-center">
                    <p className="text-zinc-400 text-sm font-medium">@{user.email.split('@')[0]}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 px-3 py-1 rounded-full shadow-sm border border-yellow-300/50 tracking-wider uppercase mt-1 inline-flex items-center gap-1">
                     <Sparkles size={10} fill="currentColor" /> Member Since 2024
                  </span>
                </div>
             </div>

             {/* Persona Card */}
             <div className="mb-6">
               <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-2xl border border-zinc-700 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                     <Bot size={24} />
                  </div>
                  <div>
                     <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-0.5">Financial Identity</p>
                     <p className="font-bold text-white text-lg">{user.persona?.personaName || 'New Member'}</p>
                     <p className="text-xs text-zinc-400 line-clamp-1">{user.persona?.description}</p>
                  </div>
               </div>
             </div>
             
             {/* Action Grid */}
             <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="flex flex-col items-center justify-center p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800 hover:border-zinc-600 transition-all group">
                   <Settings className="mb-3 text-zinc-500 group-hover:text-white transition-colors" size={24} />
                   <span className="text-xs font-medium text-zinc-300">Settings</span>
                </button>
                <button className="flex flex-col items-center justify-center p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800 hover:border-zinc-600 transition-all group">
                   <ShieldCheck className="mb-3 text-zinc-500 group-hover:text-emerald-400 transition-colors" size={24} />
                   <span className="text-xs font-medium text-zinc-300">Security</span>
                </button>
                <button className="flex flex-col items-center justify-center p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800 hover:border-zinc-600 transition-all group">
                   <DocumentIcon className="mb-3 text-zinc-500 group-hover:text-blue-400 transition-colors" size={24} />
                   <span className="text-xs font-medium text-zinc-300">Documents</span>
                </button>
                <button className="flex flex-col items-center justify-center p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800 hover:border-zinc-600 transition-all group">
                   <LifeBuoy className="mb-3 text-zinc-500 group-hover:text-primary transition-colors" size={24} />
                   <span className="text-xs font-medium text-zinc-300">Help</span>
                </button>
             </div>
             
             <div className="text-center">
               <button className="text-xs text-zinc-600 hover:text-red-400 transition-colors">Delete Account</button>
             </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const CreditSimulatorModal: React.FC<{ isOpen: boolean; onClose: () => void; currentScore: number }> = ({ isOpen, onClose, currentScore }) => {
  const [payoffAmount, setPayoffAmount] = useState(0);
  const maxPayoff = 2000;
  
  // Simple simulation logic: $100 paid = +3 points
  const projectedIncrease = Math.floor(payoffAmount / 100) * 3;
  const projectedScore = Math.min(850, currentScore + projectedIncrease);

  if (!isOpen) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }} onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface border border-zinc-800 rounded-3xl p-6 z-50 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><Gauge className="text-primary"/> Credit Simulator</h3>
          <button onClick={onClose}><X size={20} className="text-zinc-500" /></button>
        </div>

        <div className="space-y-8">
           {/* Score Visualization */}
           <div className="flex items-center justify-center gap-8">
              <div className="text-center opacity-60">
                 <p className="text-sm text-zinc-400">Current</p>
                 <p className="text-2xl font-bold text-zinc-300">{currentScore}</p>
              </div>
              <ArrowRight className="text-primary" />
              <div className="text-center scale-110">
                 <p className="text-sm text-primary font-medium">Projected</p>
                 <p className="text-4xl font-bold text-white">{projectedScore}</p>
                 <p className="text-xs text-emerald-400 font-bold">+{projectedIncrease} pts</p>
              </div>
           </div>

           {/* Interactive Slider */}
           <div className="space-y-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <div className="flex justify-between text-sm">
                 <span className="text-zinc-400">Pay down debt</span>
                 <span className="text-white font-mono">${payoffAmount}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={maxPayoff} 
                step="100"
                value={payoffAmount}
                onChange={(e) => setPayoffAmount(Number(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                 <span>$0</span>
                 <span>${maxPayoff}</span>
              </div>
           </div>

           <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
              <p className="text-sm text-emerald-300 leading-relaxed">
                 <Sparkles size={14} className="inline mr-1" />
                 Paying <strong>${payoffAmount}</strong> towards your balance could decrease your credit utilization ratio to <strong>12%</strong>.
              </p>
           </div>

           <Button onClick={onClose} className="w-full">Apply to Plan</Button>
        </div>
      </motion.div>
    </>
  );
};

// --- Chat Component ---

const ChatInterface: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  user: UserState; 
  initialMessage?: string; // New prop for auto-message
}> = ({ isOpen, onClose, user, initialMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: user.aiSettings?.welcomeMessage || "Hello! How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiMode = AI_MODES.find(m => m.id === user.aiSettings?.modeId) || AI_MODES[0];

  useEffect(() => {
    if (isOpen && !chatSessionRef.current && user.persona && user.aiSettings) {
      chatSessionRef.current = createNovaChat(user.name, user.persona, user.aiSettings);
    }
    
    if (isOpen && initialMessage) {
       setInputValue(initialMessage);
       // Optional: Auto-send
       // handleSendMessage(initialMessage);
    }

    scrollToBottom();
  }, [isOpen, user, initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullResponse = "";
      const aiMsgId = (Date.now() + 1).toString();
      
      // Add placeholder for streaming
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', text: '', isTyping: true }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || "";
        fullResponse += text;
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMsgId ? { ...msg, text: fullResponse, isTyping: false } : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-surface border-l border-zinc-800 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-surface/95 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-xl">{aiMode.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Nova {aiMode.label}</h3>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <X size={20} className="text-zinc-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-sm' 
                        : 'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-zinc-700'
                    }`}
                  >
                    {msg.text}
                    {msg.isTyping && <span className="inline-block w-1 h-4 ml-1 align-middle bg-current animate-pulse"/>}
                  </div>
                </motion.div>
              ))}
              {isTyping && messages[messages.length-1]?.role === 'user' && (
                 <div className="flex justify-start">
                   <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-sm border border-zinc-700 flex gap-1">
                     <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                     <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                     <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-800 bg-surface">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Nova anything..."
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-zinc-600"
                  autoFocus
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Steps Components ---

const WelcomeStep: React.FC<{ onNext: () => void; onLogin: () => void }> = ({ onNext, onLogin }) => (
  <FadeIn>
    <div className="flex flex-col items-center text-center space-y-8 max-w-md mx-auto pt-10">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center text-5xl font-bold mb-4 relative z-10 shadow-2xl shadow-primary/30">
          N
        </div>
      </div>
      <div>
        <h1 className="text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">NOVA</h1>
        <p className="text-xl text-zinc-400 leading-relaxed">
          The first AI-native banking experience.<br/>
          <span className="text-primary font-semibold">Stop managing money. Start growing wealth.</span>
        </p>
      </div>
      <div className="w-full space-y-4 pt-8">
        <Button onClick={onNext} className="w-full text-lg py-4 shadow-lg shadow-primary/20 group">
          Get Started <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
        <button onClick={onLogin} className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
          Already have an account? Log In
        </button>
      </div>
    </div>
  </FadeIn>
);

const PhoneVerificationStep: React.FC<{ onNext: (phone: string) => void }> = ({ onNext }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <FadeIn>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <Smartphone size={48} className="mx-auto text-primary mb-4" />
          <h2 className="text-3xl font-bold">Secure Login</h2>
          <p className="text-zinc-400">Enter your mobile number to verify your identity.</p>
        </div>

        {!sent ? (
          <div className="space-y-4">
             <Input 
               label="Mobile Number" 
               placeholder="(555) 000-0000" 
               value={phone} 
               onChange={e => setPhone(e.target.value)} 
               autoFocus
             />
             <Button className="w-full" onClick={() => setSent(true)} disabled={phone.length < 10}>
               Send Code
             </Button>
          </div>
        ) : (
          <div className="space-y-4">
             <Input 
               label="Verification Code" 
               placeholder="000000" 
               value={code} 
               onChange={e => setCode(e.target.value)} 
               autoFocus
               className="text-center tracking-[1em] font-mono text-lg"
             />
             <Button className="w-full" onClick={() => onNext(phone)} disabled={code.length < 4}>
               Verify & Continue
             </Button>
             <button onClick={() => setSent(false)} className="w-full text-center text-sm text-zinc-500 hover:text-zinc-300">
               Change Number
             </button>
          </div>
        )}
      </div>
    </FadeIn>
  );
};

const KYCStep: React.FC<{ onNext: (data: any) => void }> = ({ onNext }) => {
  const [formData, setFormData] = useState({ address: '', dob: '', ssn: '' });

  return (
    <FadeIn>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <ShieldCheck size={48} className="mx-auto text-emerald-500 mb-4" />
          <h2 className="text-3xl font-bold">Identity Check</h2>
          <p className="text-zinc-400">Federal regulations require us to collect this info. Your data is encrypted.</p>
        </div>

        <div className="space-y-4">
          <Input 
            label="Home Address" 
            placeholder="123 Innovation Dr, Tech City" 
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Date of Birth" 
              placeholder="MM/DD/YYYY" 
              value={formData.dob}
              onChange={e => setFormData({...formData, dob: e.target.value})}
            />
            <Input 
              label="SSN (Last 4)" 
              placeholder="••••" 
              type="password"
              maxLength={4}
              value={formData.ssn}
              onChange={e => setFormData({...formData, ssn: e.target.value})}
            />
          </div>
          <Button 
            className="w-full mt-4" 
            onClick={() => onNext(formData)}
            disabled={!formData.address || !formData.dob || formData.ssn.length < 4}
          >
            Confirm Identity
          </Button>
        </div>
      </div>
    </FadeIn>
  );
};

const IdentityStep: React.FC<{ onNext: (name: string) => void }> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [scanningState, setScanningState] = useState<'IDLE' | 'SCANNING' | 'ANALYZING' | 'GENERATING' | 'COMPLETE'>('IDLE');
  const [showCamera, setShowCamera] = useState(false);

  const startScan = () => {
    setShowCamera(true);
    setScanningState('SCANNING');
    setTimeout(() => setScanningState('ANALYZING'), 1500);
    setTimeout(() => setScanningState('GENERATING'), 3000);
    setTimeout(() => setScanningState('COMPLETE'), 4500);
  };

  return (
    <FadeIn>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <User size={48} className="mx-auto text-secondary mb-4" />
          <h2 className="text-3xl font-bold">Who are you?</h2>
          <p className="text-zinc-400">We'll generate an AI Avatar based on your vibe.</p>
        </div>

        {scanningState === 'IDLE' ? (
           <div className="space-y-6">
              <Input 
                placeholder="First Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="text-center text-2xl font-bold h-16"
                autoFocus
              />
              <Button className="w-full" onClick={startScan} disabled={!name}>
                <Camera size={18} /> Take AI Selfie
              </Button>
           </div>
        ) : (
           <div className="relative h-80 bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700">
              {/* Simulated Camera Feed */}
              <div className="absolute inset-0 bg-zinc-800">
                 <div className="absolute inset-0 flex items-center justify-center">
                    {scanningState === 'COMPLETE' ? (
                       <img 
                         src={`https://api.dicebear.com/9.x/notionists/svg?seed=${name}&backgroundColor=c0aede,b6e3f4`} 
                         alt="AI Avatar" 
                         className="w-48 h-48 rounded-full shadow-2xl border-4 border-white"
                       />
                    ) : (
                       <User size={120} className="text-zinc-700" />
                    )}
                 </div>
                 
                 {/* Scanning Overlay */}
                 {scanningState === 'SCANNING' && (
                    <div className="absolute inset-0 bg-primary/10">
                       <motion.div 
                          initial={{ top: 0 }} 
                          animate={{ top: '100%' }} 
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(99,102,241,1)]"
                       />
                       <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-px opacity-20">
                          {[...Array(36)].map((_, i) => <div key={i} className="border border-primary"></div>)}
                       </div>
                    </div>
                 )}
              </div>

              {/* Status Text */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black to-transparent">
                 <h3 className="text-xl font-bold text-center animate-pulse">
                    {scanningState === 'SCANNING' && 'Scanning Facial Structure...'}
                    {scanningState === 'ANALYZING' && 'Analyzing Biometrics...'}
                    {scanningState === 'GENERATING' && 'Applying Neural Filters...'}
                    {scanningState === 'COMPLETE' && 'Identity Verified'}
                 </h3>
              </div>
           </div>
        )}

        {scanningState === 'COMPLETE' && (
           <Button className="w-full" onClick={() => onNext(name)}>
             Confirm Profile <ArrowRight size={18} />
           </Button>
        )}
      </div>
    </FadeIn>
  );
};

const InterestsStep: React.FC<{ selected: string[]; toggleInterest: (id: string) => void; onNext: (selected: string[]) => void }> = ({ selected, toggleInterest, onNext }) => (
  <FadeIn>
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-2">What defines you?</h2>
      <p className="text-zinc-400 mb-8">Nova builds a financial persona based on your lifestyle.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {INTERESTS.map((interest) => (
          <motion.button
            key={interest.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleInterest(interest.id)}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
              selected.includes(interest.id)
                ? 'border-primary bg-primary/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800'
            }`}
          >
            <span className="text-4xl">{interest.emoji}</span>
            <span className="font-medium">{interest.label}</span>
          </motion.button>
        ))}
      </div>

      <Button className="w-full max-w-md mx-auto" onClick={() => onNext(selected)} disabled={selected.length < 3}>
        {selected.length < 3 ? `Select ${3 - selected.length} more` : 'Analyze Profile'}
      </Button>
    </div>
  </FadeIn>
);

const AnalysisStep: React.FC<{ name: string; interests: string[]; onComplete: (persona: Persona) => void }> = ({ name, interests, onComplete }) => {
  useEffect(() => {
    const analyze = async () => {
      const persona = await generateFinancialPersona(interests, name);
      setTimeout(() => onComplete(persona), 2000); // Ensure animation plays
    };
    analyze();
  }, [interests, name, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <Bot size={48} className="absolute inset-0 m-auto text-white animate-pulse" />
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-2 animate-pulse">Nova AI is Thinking...</h2>
        <p className="text-zinc-400">Analyzing {interests.length} data points to build your financial DNA.</p>
      </div>
    </div>
  );
};

const AISetupStep: React.FC<{ persona: Persona; userName: string; onNext: (settings: AISettings) => void }> = ({ persona, userName, onNext }) => {
  const [selectedMode, setSelectedMode] = useState(AI_MODES[0].id);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [linkAccounts, setLinkAccounts] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) setSelectedGoals(prev => prev.filter(g => g !== goal));
    else setSelectedGoals(prev => [...prev, goal]);
  };

  const handleComplete = async () => {
    setIsGenerating(true);
    const modeLabel = AI_MODES.find(m => m.id === selectedMode)?.label || "Strategist";
    const welcomeMessage = await generateAIPersonalityWelcome(userName, modeLabel, persona.personaName);
    
    onNext({
      modeId: selectedMode,
      goals: selectedGoals,
      accountsLinked: linkAccounts,
      welcomeMessage
    });
  };

  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
           <div className="mb-8">
             <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">Your Financial Persona</span>
             <h2 className="text-4xl font-display font-bold mb-2">{persona.personaName}</h2>
             <p className="text-zinc-400 text-lg">{persona.description}</p>
           </div>

           <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-white mb-3 block">Select Nova's Personality</label>
                <div className="space-y-3">
                  {AI_MODES.map(mode => (
                    <div 
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                        selectedMode === mode.id 
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' 
                          : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'
                      }`}
                    >
                      <div className="text-2xl">{mode.icon}</div>
                      <div>
                        <div className="font-bold text-white">{mode.label}</div>
                        <div className="text-xs text-zinc-400">{mode.description}</div>
                      </div>
                      {selectedMode === mode.id && <Check size={18} className="ml-auto text-primary" />}
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-8 md:pt-8">
           <div>
              <label className="text-sm font-bold text-white mb-3 block">Primary Goals</label>
              <div className="flex flex-wrap gap-2">
                {FINANCIAL_GOALS.map(goal => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedGoals.includes(goal)
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
           </div>

           <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-lg text-zinc-400">
                 <Globe size={24} />
              </div>
              <div className="flex-1">
                 <h4 className="font-bold text-sm">Link External Accounts</h4>
                 <p className="text-xs text-zinc-500">Allow Nova to analyze your full financial picture.</p>
              </div>
              <div 
                className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${linkAccounts ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                onClick={() => setLinkAccounts(!linkAccounts)}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${linkAccounts ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
           </div>

           <Button 
             className="w-full py-4 text-lg" 
             onClick={handleComplete} 
             disabled={selectedGoals.length === 0 || isGenerating}
           >
             {isGenerating ? <LoadingSpinner /> : 'Activate Nova'}
           </Button>
        </div>
      </div>
    </FadeIn>
  );
};

const CardSelectionStep: React.FC<{ persona: Persona; onSelect: (id: string) => void }> = ({ persona, onSelect }) => {
  const [selected, setSelected] = useState(CARD_DESIGNS[0].id);

  return (
    <FadeIn>
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Choose Your Aesthetics</h2>
        <p className="text-zinc-400 mb-12">Your physical card matches your digital vibe.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CARD_DESIGNS.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ y: -10 }}
              onClick={() => setSelected(card.id)}
              className={`cursor-pointer relative group perspective-1000`}
            >
              <div className={`relative h-48 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
                selected === card.id ? 'ring-4 ring-primary ring-offset-4 ring-offset-black scale-105 z-10' : 'opacity-70 hover:opacity-100'
              }`}>
                <div className={`absolute inset-0 ${card.gradient}`}></div>
                
                {/* Card Details Simulation */}
                <div className={`absolute inset-0 p-5 flex flex-col justify-between ${card.textColor}`}>
                   <div className="flex justify-between items-start">
                      <div className="font-display font-bold tracking-widest">NOVA</div>
                      <WifiIcon />
                   </div>
                   <div>
                      <div className="flex gap-2 mb-2">
                         <div className="w-8 h-5 bg-yellow-500/20 rounded flex overflow-hidden">
                            <div className="w-1/2 h-full bg-yellow-400/50"></div>
                            <div className="w-1/2 h-full bg-yellow-600/50"></div>
                         </div>
                      </div>
                      <div className="font-mono text-sm opacity-80 tracking-widest">•••• 4291</div>
                   </div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${selected === card.id ? 'text-white' : 'text-zinc-500'}`}>{card.name}</p>
            </motion.div>
          ))}
        </div>

        <Button className="w-full max-w-xs mx-auto" onClick={() => onSelect(selected)}>
          Issue My Card <CreditCard size={18} />
        </Button>
      </div>
    </FadeIn>
  );
};

const WifiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);

// --- Dashboard Component ---

const Dashboard: React.FC<{ user: UserState, onOpenChat: (initialMsg?: string) => void, onSignOut: () => void }> = ({ user, onOpenChat, onSignOut }) => {
  // Local state for interactions
  const [notification, setNotification] = useState({ visible: false, message: '' });
  const [zelleOpen, setZelleOpen] = useState(false);
  const [zelleType, setZelleType] = useState<'send' | 'request'>('send');
  const [showRecurring, setShowRecurring] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [socialFeedOpen, setSocialFeedOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [transactOpen, setTransactOpen] = useState(false);
  const [ghostCardsOpen, setGhostCardsOpen] = useState(false);
  
  // Deep Dive Modals State
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [salarySorterTransaction, setSalarySorterTransaction] = useState<Transaction | null>(null);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [activePocket, setActivePocket] = useState<SmartPocket | null>(null);
  const [activeSquadData, setActiveSquadData] = useState<SocialGroupData | undefined>(undefined);
  const [createGoalOpen, setCreateGoalOpen] = useState(false);

  // Chart State
  const [chartTimeframe, setChartTimeframe] = useState<'6M' | '1Y' | '2Y' | '5Y'>('1Y');
  const [chartView, setChartView] = useState<'Net Worth' | 'Cash' | 'Investments'>('Net Worth');
  
  // Initializing Accounts
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  
  // Initializing Pockets based on Persona
  const [pockets, setPockets] = useState<SmartPocket[]>([]);
  const [perks, setPerks] = useState<Perk[]>(MOCK_PERKS);
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});

  // Avatar
  const getAvatarUrl = (modeId?: string, seed?: string) => {
    const s = seed || 'User';
    switch (modeId) {
      case 'strategist': return `https://api.dicebear.com/9.x/notionists/svg?seed=${s}&backgroundColor=c0aede,b6e3f4`;
      case 'hype-man': return `https://api.dicebear.com/9.x/adventurer/svg?seed=${s}&backgroundColor=ffdfbf,ffd5dc`;
      case 'zen-guide': return `https://api.dicebear.com/9.x/micah/svg?seed=${s}&backgroundColor=d1d4f9,c0aede`;
      default: return `https://api.dicebear.com/9.x/avataaars/svg?seed=${s}`;
    }
  };

  const avatarUrl = getAvatarUrl(user.aiSettings?.modeId, user.name);

  useEffect(() => {
    if (user.persona && pockets.length === 0) {
      const initialPockets = user.persona.suggestedPockets.map((pName, i) => ({
        id: `pocket-${i}`,
        name: pName.replace(/^[^\s]+\s/, ''), 
        emoji: pName.match(/^[^\s]+/)?.[0] || '💰',
        balance: 150 * (i + 1),
        goal: 1000 * (i + 1),
        color: POCKET_COLORS[i % POCKET_COLORS.length],
        autoSave: i === 0 
      }));
      setPockets(initialPockets);
    }
  }, [user.persona]);

  const showNotification = (msg: string) => {
    setNotification({ visible: true, message: msg });
  };

  const handleZelleSuccess = (amount: string, recipient: string) => {
    setZelleOpen(false);
    showNotification(`${zelleType === 'send' ? 'Sent' : 'Requested'} $${amount} ${zelleType === 'send' ? 'to' : 'from'} ${recipient}`);
    if (zelleType === 'send') {
      setAccounts(prev => prev.map(acc => acc.type === 'CHECKING' ? { ...acc, balance: acc.balance - parseFloat(amount) } : acc));
    }
  };

  const quickAddPocketFund = (id: string) => {
     setPockets(prev => prev.map(p => p.id === id ? { ...p, balance: p.balance + 50 } : p));
     showNotification("Transferred $50 to pocket");
  };

  const toggleCardLock = (accountId: string) => {
     setAccounts(prev => prev.map(acc => {
        if (acc.id === accountId) {
           const newState = !acc.isLocked;
           showNotification(newState ? `${acc.name} is now locked` : `${acc.name} is unlocked`);
           return { ...acc, isLocked: newState };
        }
        return acc;
     }));
  };

  const toggleShowNumber = (accountId: string) => {
     setShowNumbers(prev => ({ ...prev, [accountId]: !prev[accountId] }));
  };

  const activatePerk = (perkId: string) => {
     setPerks(prev => prev.map(p => p.id === perkId ? { ...p, activated: true } : p));
     showNotification("Offer activated!");
  };

  const addPocketFromTemplate = (template: { name: string, emoji: string, color: string }) => {
    const newPocket: SmartPocket = {
      id: `pocket-${Date.now()}`,
      name: template.name,
      emoji: template.emoji,
      color: template.color,
      balance: 0,
      goal: 2000,
      autoSave: false
    };
    setPockets([...pockets, newPocket]);
    showNotification(`Started new ${template.name} pocket`);
  };

  const addCustomGoal = (name: string, emoji: string) => {
    const newPocket: SmartPocket = {
       id: `pocket-${Date.now()}`,
       name: name,
       emoji: emoji,
       color: POCKET_COLORS[Math.floor(Math.random() * POCKET_COLORS.length)],
       balance: 0,
       goal: 1000,
       autoSave: false
    };
    setPockets([...pockets, newPocket]);
    showNotification(`Created custom goal: ${name}`);
  };

  const handleTransactionClick = (tx: Transaction) => {
     if (tx.category === 'Income' && tx.amount > 1000) {
        setSalarySorterTransaction(tx);
     } else {
        setActiveTransaction(tx);
     }
  };

  // Generate dynamic chart data based on selection
  const getChartData = () => {
    const baseValue = 12000;
    const points = chartTimeframe === '6M' ? 6 : chartTimeframe === '1Y' ? 12 : chartTimeframe === '2Y' ? 24 : 60;
    const data = [];
    let currentValue = baseValue;

    for (let i = 0; i < points; i++) {
      const growthFactor = chartView === 'Investments' ? 1.05 : chartView === 'Cash' ? 1.01 : 1.03;
      // Add some randomness
      const change = (Math.random() * 0.1 - 0.02) + (growthFactor - 1);
      currentValue = currentValue * (1 + change);
      
      // Generate label
      const date = new Date();
      date.setMonth(date.getMonth() - (points - i));
      const label = points > 24 ? date.getFullYear().toString() : date.toLocaleString('default', { month: 'short' });
      
      data.push({ name: label, value: Math.round(currentValue) });
    }
    return data;
  };

  const chartData = getChartData();

  const filteredTransactions = showRecurring 
    ? MOCK_TRANSACTIONS.filter(t => t.recurring) 
    : MOCK_TRANSACTIONS;

  const mode = AI_MODES.find(m => m.id === user.aiSettings?.modeId) || AI_MODES[0];
  const netWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0) + pockets.reduce((acc, curr) => acc + curr.balance, 0);

  const dailySnapshotText = `You spent $42.50 today. That is 15% lower than your average Tuesday. Keep it up!`;

  return (
    <FadeIn>
      <NotificationToast 
        message={notification.message} 
        visible={notification.visible} 
        onClose={() => setNotification({ ...notification, visible: false })} 
      />

      <ZelleModal 
        isOpen={zelleOpen} 
        onClose={() => setZelleOpen(false)} 
        type={zelleType} 
        onSuccess={handleZelleSuccess} 
      />

      <CreditSimulatorModal 
        isOpen={creditModalOpen} 
        onClose={() => setCreditModalOpen(false)} 
        currentScore={742} 
      />
      
      <SocialFeedModal
        isOpen={socialFeedOpen}
        onClose={() => setSocialFeedOpen(false)}
        onOpenSquadGoal={(data) => setActiveSquadData(data)}
      />

      <AnalyticsModal
        isOpen={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <ProfileModal 
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        avatarUrl={avatarUrl}
      />

      <SalarySorterModal
         transaction={salarySorterTransaction}
         isOpen={!!salarySorterTransaction}
         onClose={() => setSalarySorterTransaction(null)}
         onConfirm={() => {
            setSalarySorterTransaction(null);
            showNotification("Salary allocated successfully!");
         }}
      />

      <GhostCardsModal
         isOpen={ghostCardsOpen}
         onClose={() => setGhostCardsOpen(false)}
      />
      
      {/* Deep Dive Modals */}
      <TransactionDetailModal 
         transaction={activeTransaction} 
         isOpen={!!activeTransaction} 
         onClose={() => setActiveTransaction(null)} 
      />
      <AccountDetailModal 
         account={activeAccount} 
         isOpen={!!activeAccount} 
         onClose={() => setActiveAccount(null)} 
      />
      <PocketDetailModal 
         pocket={activePocket} 
         isOpen={!!activePocket} 
         onClose={() => setActivePocket(null)} 
      />
      <SquadGoalModal
         groupData={activeSquadData}
         isOpen={!!activeSquadData}
         onClose={() => setActiveSquadData(undefined)}
      />
      <CreateGoalModal
         isOpen={createGoalOpen}
         onClose={() => setCreateGoalOpen(false)}
         onSave={addCustomGoal}
      />


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        {/* Top Header */}
        <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-end gap-4 mb-4 border-b border-zinc-800 pb-6">
           <div>
             <p className="text-zinc-400 mb-1 flex items-center gap-2">Total Net Worth <TrendingUp size={14} className="text-emerald-400"/></p>
             <div className="flex items-baseline gap-2">
               <h1 className="text-5xl font-display font-bold">
                 ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </h1>
             </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right hidden md:block cursor-pointer" onClick={() => setProfileOpen(true)}>
                 <p className="font-bold text-lg">{user.name}</p>
                 <div className="flex gap-2 justify-end">
                   <p className="text-xs text-primary uppercase tracking-wider border border-primary/30 rounded-full px-2 py-0.5 inline-block bg-primary/10">
                     {user.persona?.personaName}
                   </p>
                 </div>
              </div>
              <div 
                 className="relative cursor-pointer group"
                 onClick={() => setProfileOpen(true)}
              >
                 <div className="w-12 h-12 rounded-full bg-zinc-800 p-0.5 border-2 border-primary shadow-[0_0_15px_rgba(99,102,241,0.4)] overflow-hidden group-hover:scale-105 transition-transform">
                   <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full bg-zinc-700" />
                 </div>
                 <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full"></div>
              </div>
              <button onClick={onSignOut} className="p-2 ml-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors" title="Sign Out">
                <LogOut size={20} />
              </button>
           </div>
        </div>

        {/* AI Widget with Daily Snapshot */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          onClick={() => onOpenChat(`Analyze my daily snapshot: "${dailySnapshotText}"`)}
          className="lg:col-span-12 bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-2xl p-4 flex items-start md:items-center gap-4 relative overflow-hidden cursor-pointer group mb-4"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors"></div>
          <div className="bg-zinc-800 p-3 rounded-xl z-10 group-hover:scale-110 transition-transform duration-300">
             <Bot className="text-primary" size={24} />
          </div>
          <div className="flex-1 z-10">
             <div className="flex items-center gap-2 mb-1">
               <h4 className="font-bold text-white group-hover:text-primary transition-colors">Today's Snapshot</h4>
               <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-400 uppercase tracking-wide">{mode.label} Mode</span>
             </div>
             <p className="text-zinc-300 text-sm">"{dailySnapshotText}"</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="lg:col-span-12 grid grid-cols-4 md:grid-cols-8 gap-4 mb-4">
           {/* Transact Menu */}
           <div className="col-span-1 relative">
              <button 
                 onClick={() => setTransactOpen(!transactOpen)} 
                 className="w-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#6d28d9] text-white hover:bg-[#5b21b6] transition-all active:scale-95"
              >
                <ArrowUpRight size={24} /> <span className="text-xs font-medium">Transact</span>
              </button>
              <AnimatePresence>
                 {transactOpen && (
                    <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-20 overflow-hidden"
                    >
                       <button onClick={() => { setZelleType('send'); setZelleOpen(true); setTransactOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-zinc-800 text-sm font-medium flex items-center gap-2">
                          <Send size={16} className="text-emerald-400" /> Send Money
                       </button>
                       <button onClick={() => { setZelleType('request'); setZelleOpen(true); setTransactOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-zinc-800 text-sm font-medium flex items-center gap-2 border-t border-zinc-800">
                          <ArrowDownLeft size={16} className="text-blue-400" /> Request
                       </button>
                       <button onClick={() => setTransactOpen(false)} className="w-full text-left px-4 py-3 hover:bg-zinc-800 text-sm font-medium flex items-center gap-2 border-t border-zinc-800">
                          <Plus size={16} className="text-zinc-400" /> Top Up
                       </button>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           <button onClick={() => setProfileOpen(true)} className="col-span-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-all active:scale-95">
             <User size={24} /> <span className="text-xs font-medium">Profile</span>
           </button>
           <button onClick={() => setAnalyticsOpen(true)} className="col-span-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-all active:scale-95">
             <BarChart3 size={24} /> <span className="text-xs font-medium">Analytics</span>
           </button>
           <button onClick={() => setSettingsOpen(true)} className="col-span-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-all active:scale-95">
             <SettingsButtonIcon /> <span className="text-xs font-medium">Settings</span>
           </button>
        </div>

        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
           {/* Accounts Section */}
           <div>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-300">
                  <Wallet size={18} /> My Accounts
                </h3>
                <button 
                  onClick={() => setGhostCardsOpen(true)} 
                  className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-black border border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-900/20 transition-colors"
                >
                   <Ghost size={12} /> <span className="font-mono tracking-wider">GHOST_CARDS</span>
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {accounts.map((acc) => (
                 <div 
                    key={acc.id} 
                    onClick={() => setActiveAccount(acc)}
                    className={`bg-surface border ${acc.isLocked ? 'border-red-900/50 bg-red-900/5' : 'border-zinc-800'} p-6 rounded-2xl hover:border-zinc-700 transition-colors relative overflow-hidden group cursor-pointer`}
                 >
                    {/* Card Controls (Stop propagation) */}
                    {['CHECKING', 'CREDIT'].includes(acc.type) && (
                      <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                         <button 
                           onClick={() => toggleShowNumber(acc.id)} 
                           className="p-2 bg-black/20 rounded-full hover:bg-black/40 text-white/70 hover:text-white backdrop-blur-sm"
                           title="View Card Number"
                         >
                           {showNumbers[acc.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                         </button>
                         <button 
                           onClick={() => toggleCardLock(acc.id)} 
                           className={`p-2 rounded-full backdrop-blur-sm transition-colors ${acc.isLocked ? 'bg-red-500 text-white' : 'bg-black/20 hover:bg-black/40 text-white/70 hover:text-white'}`}
                           title={acc.isLocked ? "Unlock Card" : "Lock Card"}
                         >
                           {acc.isLocked ? <LockKeyhole size={14} /> : <Unlock size={14} />}
                         </button>
                      </div>
                    )}

                    {/* Locked Overlay */}
                    {acc.isLocked && (
                       <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                          <div className="flex flex-col items-center text-red-400 animate-pulse">
                             <LockKeyhole size={32} />
                             <span className="text-xs font-bold mt-2 tracking-widest uppercase">Card Locked</span>
                          </div>
                       </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-zinc-400 text-sm font-medium">{acc.name}</p>
                        <p className="text-xs text-zinc-600 font-mono">
                           {showNumbers[acc.id] ? '4291 5502 3991 8832' : acc.accountNumber}
                        </p>
                      </div>
                    </div>
                    <div className="mb-2">
                       <h4 className="text-2xl font-bold font-mono text-white">
                         {acc.balance < 0 ? '-' : ''}${Math.abs(acc.balance).toLocaleString()}
                       </h4>
                    </div>
                    {acc.limit && (
                      <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full" style={{ width: `${(Math.abs(acc.balance) / acc.limit) * 100}%` }}></div>
                      </div>
                    )}
                 </div>
               ))}
               
               {/* Credit Score Widget */}
               <div 
                  onClick={() => setCreditModalOpen(true)}
                  className="bg-surface border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-zinc-600 transition-colors group"
               >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
                       <Gauge size={18} /> Credit Score
                    </div>
                    <span className="text-xs text-emerald-500 font-bold">+12 pts</span>
                  </div>
                  <div className="relative h-20 flex items-center justify-center mt-2">
                     <div className="text-4xl font-bold text-white z-10">742</div>
                  </div>
                  <Button variant="outline" className="w-full text-xs py-1.5 h-auto mt-2 border-zinc-700 hover:bg-zinc-800">
                    Launch Simulator
                  </Button>
               </div>
             </div>
           </div>

           {/* Smart Pockets Section */}
           <div>
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-300">
               <Sparkles size={18} /> Smart Pockets
             </h3>
             
             <div className="bg-surface border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/50">
               {pockets.map((pocket) => (
                 <div 
                    key={pocket.id} 
                    onClick={() => setActivePocket(pocket)}
                    className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group cursor-pointer"
                 >
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 flex items-center justify-center text-xl">
                       {pocket.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-sm truncate">{pocket.name}</h4>
                          <span className="font-mono text-sm font-medium">${pocket.balance.toLocaleString()}</span>
                       </div>
                       <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${pocket.color}`} style={{ width: `${(pocket.balance / pocket.goal) * 100}%` }}></div>
                       </div>
                    </div>
                    <button 
                       onClick={(e) => { e.stopPropagation(); quickAddPocketFund(pocket.id); }} 
                       className="p-2 rounded-lg transition-colors text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/10"
                       title="Quick Add $50"
                    >
                       <Plus size={16} />
                    </button>
                 </div>
               ))}
               
               {/* Start New Pocket Area */}
               <div className="p-4 bg-zinc-900/30">
                  <div className="flex justify-between items-center mb-3">
                     <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Start a new goal</p>
                     <span className="text-[10px] text-primary flex items-center gap-1"><Bot size={10}/> AI Suggestions</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700">
                     <button onClick={() => setCreateGoalOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-zinc-600 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all shrink-0">
                         <Plus size={14} /> <span className="text-sm">Create Custom</span>
                     </button>
                     {POCKET_TEMPLATES.map(template => (
                        <button 
                          key={template.name}
                          onClick={() => addPocketFromTemplate(template)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-500 transition-all shrink-0"
                        >
                           <span>{template.emoji}</span>
                           <span className="text-sm font-medium whitespace-nowrap">{template.name}</span>
                        </button>
                     ))}
                  </div>
               </div>
             </div>
           </div>

           {/* Nova Perks Section */}
           <div>
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-300">
               <Tag size={18} /> Nova Perks
             </h3>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 snap-x snap-mandatory">
                {perks.map((perk) => (
                   <div key={perk.id} className="min-w-[240px] bg-surface border border-zinc-800 rounded-2xl p-4 relative flex flex-col justify-between group hover:border-zinc-600 transition-colors snap-center">
                      {perk.aiReason && (
                         <div className="absolute -top-2 right-2 bg-gradient-to-r from-primary to-secondary text-[10px] font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                            <Sparkles size={8} /> {perk.aiReason}
                         </div>
                      )}
                      <div className="flex items-start justify-between mb-4 mt-1">
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${perk.logoBg}`}>
                            {perk.merchant.charAt(0)}
                         </div>
                         <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full">{perk.category}</span>
                      </div>
                      <div>
                         <h4 className="font-bold text-lg mb-1">{perk.offer}</h4>
                         <p className="text-sm text-zinc-400 mb-3">{perk.merchant}</p>
                         
                         {perk.activated ? (
                            <div className="w-full py-2 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold text-center border border-emerald-500/20 flex items-center justify-center gap-1">
                               <Check size={12} /> Activated
                            </div>
                         ) : (
                            <button 
                              onClick={() => activatePerk(perk.id)}
                              className="w-full py-2 bg-zinc-100 text-black rounded-lg text-xs font-bold hover:bg-white transition-colors flex items-center justify-center gap-1"
                            >
                               <Plus size={12} /> Add Offer
                            </button>
                         )}
                      </div>
                   </div>
                ))}
             </div>
           </div>
           
           {/* Projection Chart (Enhanced) */}
           <div className="bg-surface border border-zinc-800 rounded-3xl p-6">
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
               <h3 className="font-bold text-lg flex items-center gap-2 text-zinc-300"><BarChart3 size={18}/> Projection</h3>
               <div className="flex gap-2">
                  <select 
                     value={chartView} 
                     onChange={(e) => setChartView(e.target.value as any)} 
                     className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1 text-xs text-zinc-400 focus:outline-none"
                  >
                    <option>Net Worth</option>
                    <option>Cash</option>
                    <option>Investments</option>
                  </select>
                  <select 
                     value={chartTimeframe} 
                     onChange={(e) => setChartTimeframe(e.target.value as any)} 
                     className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1 text-xs text-zinc-400 focus:outline-none"
                  >
                    <option value="6M">6 Months</option>
                    <option value="1Y">1 Year</option>
                    <option value="2Y">2 Years</option>
                    <option value="5Y">5 Years</option>
                  </select>
               </div>
             </div>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                   <defs>
                     <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} minTickGap={20} />
                   <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                   <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                   <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" animationDuration={1000} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Nova Circle Social Widget */}
          <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden group cursor-pointer" onClick={() => setSocialFeedOpen(true)}>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/20 transition-colors"></div>
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-blue-400">
                   <Users size={20} />
                   <h3 className="font-bold">Nova Circle</h3>
                </div>
                <span className="text-xs bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full font-bold border border-blue-500/20">3 New</span>
             </div>
             
             {/* Preview Post */}
             <div className="bg-black/20 rounded-xl p-3 mb-3 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-[10px] font-bold">S</div>
                   <p className="text-xs text-zinc-300 font-medium">Sarah Jones</p>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2">
                   <span className="text-primary">Nova detected</span> is 60% of the way to her "Japan 2025" trip goal. The squad is getting ready! 🇯🇵
                </p>
             </div>
             <div className="flex items-center justify-between text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                <p>View Friend Activity</p>
                <ArrowRight size={14} />
             </div>
          </div>

          {/* Carbon Footprint */}
          <div className="bg-gradient-to-br from-emerald-900/20 to-black border border-emerald-500/20 rounded-3xl p-6">
             <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <Leaf size={20} />
                <h3 className="font-bold">Eco Impact</h3>
             </div>
             <p className="text-sm text-zinc-400 mb-4">Your spending carbon footprint is <span className="text-white font-bold">12% lower</span> than average.</p>
             <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[60%] rounded-full"></div>
             </div>
          </div>

          {/* Transactions */}
          <div className="bg-surface border border-zinc-800 rounded-3xl p-6 sticky top-4">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-zinc-300">Activity</h3>
                <button 
                  onClick={() => setShowRecurring(!showRecurring)}
                  className={`text-xs px-2 py-1 rounded-md border transition-colors ${showRecurring ? 'bg-primary/20 border-primary text-primary' : 'border-zinc-700 text-zinc-500 hover:text-white'}`}
                >
                  Recurring
                </button>
             </div>
             <div className="space-y-1">
               {filteredTransactions.length === 0 ? (
                 <p className="text-center text-zinc-500 py-8 text-sm">No recurring payments found.</p>
               ) : (
                 filteredTransactions.map((tx) => (
                   <div 
                      key={tx.id} 
                      onClick={() => handleTransactionClick(tx)}
                      className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-colors"
                   >
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-white'}`}>
                           {tx.amount > 0 ? <ArrowDownLeft size={18}/> : <ArrowUpRight size={18}/>}
                         </div>
                         <div>
                            <p className="font-medium text-sm group-hover:text-primary transition-colors">{tx.merchant}</p>
                            <div className="flex items-center gap-2">
                               <p className="text-xs text-zinc-500">{tx.category}</p>
                               {tx.recurring && <RotateCw size={10} className="text-zinc-600" />}
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`font-medium text-sm ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                           {tx.amount > 0 ? '+' : ''}{Math.abs(tx.amount).toFixed(2)}
                         </p>
                         <p className="text-xs text-zinc-500">{tx.date}</p>
                      </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

const SettingsButtonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
// ... rest of App component (Main App Component) remains unchanged
export default function App() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.WELCOME);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatMsg, setInitialChatMsg] = useState<string | undefined>(undefined);
  const [userState, setUserState] = useState<UserState>({
    name: '',
    email: '',
    interests: [],
    persona: null,
    aiSettings: null,
    selectedCardId: ''
  });

  // --- Navigation Handlers ---
  
  const goToStep = (step: OnboardingStep) => setCurrentStep(step);

  const handleLogin = () => {
    setUserState(DEFAULT_USER);
    goToStep(OnboardingStep.DASHBOARD);
  };

  const handleSignOut = () => {
    setUserState({
      name: '',
      email: '',
      interests: [],
      persona: null,
      aiSettings: null,
      selectedCardId: ''
    });
    goToStep(OnboardingStep.WELCOME);
  };

  const handleOpenChat = (msg?: string) => {
     setInitialChatMsg(msg);
     setIsChatOpen(true);
  };

  const handlePhoneSubmit = (phone: string) => {
     setUserState(prev => ({ ...prev, phoneNumber: phone }));
     goToStep(OnboardingStep.KYC);
  };

  const handleKYCSubmit = (data: any) => {
     setUserState(prev => ({ 
        ...prev, 
        dob: data.dob,
        address: data.address,
        ssnLast4: data.ssn
     }));
     goToStep(OnboardingStep.IDENTITY);
  };

  const handleIdentitySubmit = (name: string) => {
    setUserState(prev => ({ ...prev, name }));
    goToStep(OnboardingStep.INTERESTS);
  };

  const handleInterestsSubmit = (interests: string[]) => {
    setUserState(prev => ({ ...prev, interests }));
    goToStep(OnboardingStep.ANALYSIS);
  };

  const handleAnalysisComplete = (persona: Persona) => {
    setUserState(prev => ({ ...prev, persona }));
    goToStep(OnboardingStep.AI_SETUP);
  };

  const handleAISetupComplete = (aiSettings: AISettings) => {
    setUserState(prev => ({ ...prev, aiSettings }));
    goToStep(OnboardingStep.CARD_SELECTION);
  };

  const handleCardSelection = (cardId: string) => {
    setUserState(prev => ({ ...prev, selectedCardId: cardId }));
    goToStep(OnboardingStep.DASHBOARD);
  };

  const toggleInterest = (id: string) => {
    setUserState(prev => {
      const exists = prev.interests.includes(id);
      if (exists) return { ...prev, interests: prev.interests.filter(i => i !== id) };
      return { ...prev, interests: [...prev.interests, id] };
    });
  };

  // Calculate Progress
  const stepOrder = [
    OnboardingStep.WELCOME,
    OnboardingStep.VERIFICATION,
    OnboardingStep.KYC,
    OnboardingStep.IDENTITY,
    OnboardingStep.INTERESTS,
    OnboardingStep.ANALYSIS,
    OnboardingStep.AI_SETUP,
    OnboardingStep.CARD_SELECTION,
    OnboardingStep.DASHBOARD
  ];
  const currentProgressIndex = stepOrder.indexOf(currentStep);
  const totalSteps = stepOrder.length - 1;

  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Chat Overlay */}
      <ChatInterface 
        isOpen={isChatOpen} 
        onClose={() => { setIsChatOpen(false); setInitialChatMsg(undefined); }} 
        user={userState}
        initialMessage={initialChatMsg}
      />

      {/* Main Content Container */}
      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header / Logo */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 font-display font-bold text-2xl tracking-wide cursor-pointer" onClick={() => goToStep(OnboardingStep.WELCOME)}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white">N</div>
            NOVA
          </div>
          {currentStep !== OnboardingStep.DASHBOARD && currentStep !== OnboardingStep.WELCOME && (
             <div className="text-xs font-mono text-zinc-500">
               STEP {currentProgressIndex} / {totalSteps - 1}
             </div>
          )}
          {currentStep === OnboardingStep.DASHBOARD && (
            <button 
              onClick={() => setIsChatOpen(true)}
              className="md:hidden p-2 bg-zinc-800 rounded-full text-primary hover:bg-zinc-700 transition-colors"
            >
              <Bot size={20} />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {currentStep !== OnboardingStep.WELCOME && currentStep !== OnboardingStep.DASHBOARD && (
           <div className="max-w-xl mx-auto w-full">
              <ProgressBar current={currentProgressIndex} total={totalSteps} />
           </div>
        )}

        {/* Step Render Logic */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {currentStep === OnboardingStep.WELCOME && (
              <motion.div key="welcome" exit={{ opacity: 0, y: -20 }}>
                <WelcomeStep 
                  onNext={() => goToStep(OnboardingStep.VERIFICATION)} 
                  onLogin={handleLogin}
                />
              </motion.div>
            )}

            {currentStep === OnboardingStep.VERIFICATION && (
              <motion.div key="verification" exit={{ opacity: 0, y: -20 }}>
                <PhoneVerificationStep onNext={handlePhoneSubmit} />
              </motion.div>
            )}

            {currentStep === OnboardingStep.KYC && (
              <motion.div key="kyc" exit={{ opacity: 0, y: -20 }}>
                <KYCStep onNext={handleKYCSubmit} />
              </motion.div>
            )}

            {currentStep === OnboardingStep.IDENTITY && (
              <motion.div key="identity" exit={{ opacity: 0, y: -20 }}>
                <IdentityStep onNext={handleIdentitySubmit} />
              </motion.div>
            )}

            {currentStep === OnboardingStep.INTERESTS && (
              <motion.div key="interests" exit={{ opacity: 0, y: -20 }}>
                <InterestsStep 
                  onNext={handleInterestsSubmit} 
                  selected={userState.interests}
                  toggleInterest={toggleInterest}
                />
              </motion.div>
            )}

            {currentStep === OnboardingStep.ANALYSIS && (
              <motion.div key="analysis" exit={{ opacity: 0, scale: 0.95 }}>
                <AnalysisStep 
                  name={userState.name} 
                  interests={userState.interests} 
                  onComplete={handleAnalysisComplete} 
                />
              </motion.div>
            )}

            {currentStep === OnboardingStep.AI_SETUP && userState.persona && (
              <motion.div key="ai_setup" exit={{ opacity: 0, y: -20 }}>
                <AISetupStep
                  persona={userState.persona}
                  userName={userState.name}
                  onNext={handleAISetupComplete}
                />
              </motion.div>
            )}

            {currentStep === OnboardingStep.CARD_SELECTION && userState.persona && (
              <motion.div key="card" exit={{ opacity: 0, y: -20 }}>
                <CardSelectionStep 
                  persona={userState.persona} 
                  onSelect={handleCardSelection} 
                />
              </motion.div>
            )}

            {currentStep === OnboardingStep.DASHBOARD && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Dashboard 
                  user={userState} 
                  onOpenChat={handleOpenChat} 
                  onSignOut={handleSignOut}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
