import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  Copy, 
  Check, 
  ChevronDown,
  MessageSquare,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { queryAksaAI, AIMessage } from '../services/aiService';

const QUICK_PROMPTS = [
  'Buat Pengumuman Kelas',
  'Buat Catatan Wali Kelas',
  'Ringkas Kehadiran Minggu Ini',
  'Buat Pesan untuk Orang Tua',
  'Bantu Menggunakan SekolahHub'
];

export const AksaAIFloating: React.FC = () => {
  const { teacherProfile, students } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Halo ${teacherProfile.teacherName || 'Bapak/Ibu Guru'}! 👋\nSaya **Aksa AI**, Asisten Pintar SekolahHub Class.\nAda yang bisa saya bantu untuk administrasi ${teacherProfile.className || 'kelas'} hari ini?`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || inputPrompt).trim();
    if (!promptText || isTyping) return;

    const userMessage: AIMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputPrompt('');
    setIsTyping(true);

    try {
      const responseText = await queryAksaAI(promptText, {
        teacherName: teacherProfile.teacherName,
        className: teacherProfile.className,
        schoolName: teacherProfile.schoolName,
        studentCount: students.length
      });

      const aiMessage: AIMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error in Aksa AI response:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          text: 'Maaf, terjadi kendala saat memproses tanggapan Aksa AI. Silakan coba kembali.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'assistant',
        text: `Halo ${teacherProfile.teacherName || 'Bapak/Ibu Guru'}! 👋\nSaya **Aksa AI**, Asisten Pintar SekolahHub Class.\nSilakan pilih prompt atau ketik instruksi Anda.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-[calc(100vw-2.5rem)] sm:w-[400px] h-[520px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Panel Header */}
          <div className="p-3.5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-xs tracking-tight text-white">Aksa AI Assistant</h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-blue-500/80 text-[9px] font-bold tracking-wider uppercase text-blue-100 border border-blue-400/40">
                    Smart
                  </span>
                </div>
                <p className="text-[10px] text-blue-100/90 font-medium">Asisten Cerdas Guru SekolahHub</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Reset percakapan"
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 shrink-0 mr-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Prompt:</span>
            </div>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-medium rounded-full shadow-xs transition-all disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-slate-800 text-white'
                        : 'bg-blue-600 text-white shadow-xs'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`group relative max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs whitespace-pre-line'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Copy Button for AI Messages */}
                    {!isUser && (
                      <div className="flex items-center justify-between mt-1 px-1">
                        <span className="text-[9px] text-slate-400 font-medium">{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-600 font-medium transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {isUser && (
                      <div className="text-right mt-1 px-1">
                        <span className="text-[9px] text-slate-400 font-medium">{msg.timestamp}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                </div>
                <div className="p-3 bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] font-medium text-slate-400">Aksa AI sedang berpikir...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Tanyakan sesuatu ke Aksa AI..."
                disabled={isTyping}
                className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isTyping}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl transition-all shadow-xs shrink-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-bold rounded-full shadow-lg shadow-blue-600/35 border border-white/20 hover:scale-105 active:scale-95 transition-all group"
      >
        <div className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600" />
        </div>
        <span className="text-xs tracking-tight">Aksa AI</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-blue-200" />
        ) : (
          <MessageSquare className="w-3.5 h-3.5 text-blue-200" />
        )}
      </button>
    </div>
  );
};
