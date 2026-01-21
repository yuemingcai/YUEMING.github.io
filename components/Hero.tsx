
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
  metadata?: any;
  timestamp: Date;
}

interface GroundingSource {
  title: string;
  uri: string;
  index: number;
}

const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤: 메시지 추가나 로딩 상태 변경 시 하단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const parseTable = (line: string, isHeader: boolean = false) => {
    const cells = line.split('|').filter(c => c.trim() !== '' || (line.indexOf(c) > 0 && line.indexOf(c) < line.length - 1));
    return (
      <tr className={isHeader ? "bg-blue-600/20 border-b border-blue-500/30" : "border-b border-white/5 hover:bg-white/5 transition-colors"}>
        {cells.map((cell, i) => (
          <td key={i} className={`px-4 py-3 text-sm whitespace-nowrap ${isHeader ? "font-black text-blue-400 uppercase tracking-wider" : "text-slate-300"}`}>
            {cell.trim()}
          </td>
        ))}
      </tr>
    );
  };

  const renderMessageContent = (msg: Message) => {
    const text = msg.text;
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentTableRows: React.ReactNode[] = [];
    let isInsideTable = false;

    lines.forEach((line, lineIdx) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('|') && trimmedLine.includes('|')) {
        if (trimmedLine.includes('---')) return;
        isInsideTable = true;
        currentTableRows.push(parseTable(trimmedLine, currentTableRows.length === 0));
      } else {
        if (isInsideTable) {
          elements.push(
            <div key={`table-${lineIdx}`} className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-black/20 shadow-inner">
              <table className="w-full border-collapse">
                <tbody>{currentTableRows}</tbody>
              </table>
            </div>
          );
          currentTableRows = [];
          isInsideTable = false;
        }
        if (trimmedLine !== '') {
          elements.push(<p key={`p-${lineIdx}`} className="mb-3 last:mb-0 leading-relaxed text-slate-300">{trimmedLine.replace(/\*\*/g, '')}</p>);
        }
      }
    });

    if (isInsideTable) {
      elements.push(
        <div key="final-table" className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-black/20 shadow-inner">
          <table className="w-full border-collapse">
            <tbody>{currentTableRows}</tbody>
          </table>
        </div>
      );
    }

    return elements;
  };

  const startOrSendMessage = async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setIsLoading(true);
    setSearchQuery('');
    
    // 유저 메시지 즉시 추가
    const userMsg: Message = { role: 'user', text: trimmedQuery, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    
    // 첫 검색 시 챗봇 모드로 전환
    if (!hasSearched) setHasSearched(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let currentSession = chatSession;

      if (!currentSession) {
        currentSession = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: "You are CAIRUILIN STUDIO's AI Research Lead. Provide professional, data-driven insights. ALWAYS use Markdown tables for data comparisons or list of statistics. For every key fact, cite the search result. Link every citation to the source URL.",
            tools: [{ googleSearch: {} }],
          },
        });
        setChatSession(currentSession);
      }

      const response = await currentSession.sendMessage({ message: trimmedQuery });
      const modelText = response.text || "";
      const metadata = response.candidates?.[0]?.groundingMetadata;

      // 출처 정보 갱신 (누적)
      if (metadata?.groundingChunks) {
        const newSources: GroundingSource[] = metadata.groundingChunks
          .filter((c: any) => c.web)
          .map((c: any, i: number) => ({
            title: c.web.title || 'Source',
            uri: c.web.uri,
            index: i + 1
          }));
        setSources(prev => {
          const combined = [...newSources, ...prev];
          // 중복 URI 제거
          const unique = Array.from(new Map(combined.map(s => [s.uri, s])).values());
          return unique.slice(0, 15);
        });
      }

      setMessages(prev => [...prev, {
        role: 'model',
        text: modelText,
        metadata,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "데이터를 분석하는 과정에서 오류가 발생했습니다. 다시 시도해 주세요.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startOrSendMessage(searchQuery);
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 pt-20 pb-10 overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-full">
        
        {/* Header Section: 검색 전에는 중앙, 검색 후에는 상단 작게 */}
        <div className={`flex flex-col items-center transition-all duration-700 ease-in-out ${hasSearched ? 'mb-4' : 'mb-12'}`}>
          <h1 className={`font-black text-white tracking-tighter uppercase italic leading-none transition-all duration-700 ${hasSearched ? 'text-xl sm:text-2xl opacity-40' : 'text-5xl sm:text-8xl drop-shadow-2xl'}`}>
            CRACK THE <span className="text-blue-500">CASE</span>
          </h1>
          {!hasSearched && (
            <p className="mt-4 text-slate-500 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] animate-pulse">
              Professional Insight & Global Strategic Research
            </p>
          )}
        </div>

        {/* Content Mode Switcher */}
        {!hasSearched ? (
          /* MODE 1: Initial Search Interface (Centralized) */
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            <form onSubmit={handleSearch} className="relative w-full group mb-12">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="조사하고 싶은 비즈니스 주제를 입력하세요..." 
                className="w-full px-8 py-7 sm:py-8 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg sm:text-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-[1.5rem] flex items-center justify-center transition-all disabled:bg-slate-700"
              >
                <i className={`fa-solid ${isLoading ? 'fa-circle-notch animate-spin' : 'fa-bolt'} text-xl`}></i>
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-3">
              {["글로벌 반도체 공급망 현황", "2025 무역 분쟁 전망", "전기차 배터리 시장 점유율 표"].map((hint) => (
                <button 
                  key={hint}
                  onClick={() => startOrSendMessage(hint)}
                  className="px-6 py-3 rounded-full border border-white/5 bg-white/5 text-slate-400 text-xs font-bold hover:bg-white/10 hover:text-white transition-all"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* MODE 2: Chat Interface (Full Width with Sidebar) */
          <div className="flex flex-col lg:flex-row gap-6 h-[75vh] overflow-hidden">
            
            {/* Chat Messages Area */}
            <div className="flex flex-col flex-grow bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div 
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-6 sm:p-10 space-y-8 scroll-smooth"
              >
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[92%] sm:max-w-[85%] rounded-[2rem] p-6 sm:p-8 ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                    }`}>
                      <div className="text-sm sm:text-base">
                        {renderMessageContent(msg)}
                      </div>
                      <div className={`mt-4 text-[9px] font-black uppercase tracking-widest opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] rounded-tl-none p-8 flex items-center gap-4">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Researching Data...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar (Inside Chat Area) */}
              <div className="p-6 sm:p-8 border-t border-white/5 bg-slate-900/60">
                <form onSubmit={handleSearch} className="relative group">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="추가 질문을 입력하세요..." 
                    className="w-full px-8 py-5 sm:py-6 rounded-[2rem] bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xl"
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all disabled:bg-slate-700 shadow-lg"
                  >
                    <i className={`fa-solid ${isLoading ? 'fa-circle-notch animate-spin' : 'fa-paper-plane'} text-lg`}></i>
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar: Sources & Info */}
            <div className="w-full lg:w-80 shrink-0 space-y-6 flex flex-col h-full overflow-hidden">
              <div className="flex-grow p-6 rounded-[2.5rem] bg-slate-900/60 border border-white/5 flex flex-col overflow-hidden">
                <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2 shrink-0">
                  <i className="fa-solid fa-link"></i> Verified Sources
                </h3>
                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                  {sources.length > 0 ? sources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/40 hover:bg-blue-600/5 transition-all"
                    >
                      <p className="text-slate-200 text-xs font-bold truncate group-hover:text-blue-400">{source.title}</p>
                      <p className="text-slate-500 text-[9px] uppercase mt-1 opacity-60 font-mono">{new URL(source.uri).hostname}</p>
                    </a>
                  )) : (
                    <p className="text-slate-600 text-[10px] italic text-center py-10">출처 정보를 수집하고 있습니다.</p>
                  )}
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-blue-600/10 border border-blue-500/20 shrink-0">
                <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-3">Professional Tip</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  "방금 정보를 표로 요약해줘"라고 요청하면 더 직관적으로 데이터를 확인할 수 있습니다.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
        
        /* Message scroll area scrollbar */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(37, 99, 235, 0.5);
        }
      `}</style>
    </section>
  );
};

export default Hero;
