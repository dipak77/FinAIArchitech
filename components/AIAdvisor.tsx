import React, { useState, useRef, useEffect } from 'react';
import { LoanInput, LoanSummary, ChatMessage } from '../types';
import { chatWithAI } from '../services/geminiService';
import { Sparkles, Send, X, MessageCircle, Bot, User, Minimize2, Paperclip, Smile } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  input: LoanInput;
  summary: LoanSummary;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ input, summary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      text: `👋 Hi there! I'm your AI Loan Strategist. \n\nI see you have a **${input.loanType}** of **₹${(input.amount/100000).toFixed(1)}L**. \n\nAsk me anything! e.g., *"How can I save ₹5L interest?"* or *"What if I reduce tenure by 2 years?"*`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const responseText = await chatWithAI(userMsg.text, messages, input, summary);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
       // Error handled in service
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* --- Floating Toggle Button --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[60] p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group ${isOpen ? 'bg-slate-200 dark:bg-slate-800 rotate-90' : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-cyan-500/50'}`}
      >
        {isOpen ? (
          <X className="w-8 h-8 text-slate-600 dark:text-slate-300" />
        ) : (
          <>
            <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
            <Sparkles className="w-8 h-8 text-white relative z-10" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-slate-900">1</span>
          </>
        )}
      </button>

      {/* --- Chat Interface Window --- */}
      <div 
        className={`fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[380px] h-[600px] max-h-[80vh] rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 ease-out origin-bottom-right border border-white/20 dark:border-white/10 glass dark:bg-[#0f172a]/95 backdrop-blur-xl flex flex-col ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-slate-50/80 dark:bg-white/5 p-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">FinArch AI</h3>
              <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Online
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
            <Minimize2 className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-100/50 dark:bg-black/20">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}
            >
              {/* Avatar */}
              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm ${msg.role === 'user' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-gradient-to-br from-purple-500 to-cyan-500 text-white'}`}>
                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
              </div>

              {/* Bubble */}
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm relative ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-white/5'
                }`}
              >
                 <div className="markdown-chat">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                 </div>
                 <span className={`text-[9px] font-medium mt-1 block text-right opacity-70 ${msg.role === 'user' ? 'text-purple-200' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </span>
              </div>
            </div>
          ))}

          {isTyping && (
             <div className="flex items-center gap-2 animate-fade-in">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-white/5 shadow-sm">
                   <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                   </div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-colors">
                <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-colors hidden sm:block">
                <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Message..."
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-slate-400"
                />
            </div>
            
            <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95"
            >
                <Send className="w-4 h-4 fill-current" />
            </button>
        </div>
      </div>
    </>
  );
};

export default AIAdvisor;