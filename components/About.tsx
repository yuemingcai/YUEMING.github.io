
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface NewsItem {
  title: string;
  date: string;
  url: string;
}

const About: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTradeNews = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "https://www.kita.net/board/totalTradeNews/totalTradeNewsList.do 페이지에서 현재 가장 최신 뉴스 5개의 제목과 날짜를 정확히 추출해줘. 각 뉴스의 상세 페이지로 이동할 수 있는 URL을 포함해서 JSON 배열로 응답해줘.",
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  date: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["title", "date", "url"]
              }
            }
          }
        });

        const parsedData = JSON.parse(response.text);
        setNewsList(parsedData);
      } catch (error) {
        console.error("Error fetching KITA news list:", error);
        setNewsList([
          { title: "데이터를 불러오는 중 오류가 발생했습니다.", date: "-", url: "https://www.kita.net/board/totalTradeNews/totalTradeNewsList.do" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTradeNews();
  }, []);

  return (
    <section id="about" className="py-32 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* 좌측 설명 영역 (흰색 배경에 맞춘 텍스트 색상) */}
          <div className="lg:w-1/3 text-center lg:text-left">
            <div>
              <h2 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-3">실시간 무역 뉴스</h2>
              <h3 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                KITA <br/>무역뉴스 보드
              </h3>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                한국무역협회의 최신 소식을 실시간으로 확인하세요. <br/>
                중요한 글로벌 무역 흐름을 한눈에 파악할 수 있습니다. <br/>
                클릭 시 해당 페이지로 바로 이동합니다.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-slate-500 text-xs font-medium border border-slate-200">
                <i className="fa-solid fa-clock-rotate-left text-blue-600"></i>
                최근 업데이트 뉴스 5건
              </div>
            </div>
          </div>

          {/* 우측 뉴스 목록 영역 (흰색 배경에 맞춘 카드 디자인) */}
          <div className="lg:w-2/3 w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <i className="fa-solid fa-circle-notch animate-spin text-3xl text-blue-600 mb-4"></i>
                <p className="text-slate-400 font-medium">뉴스를 가져오는 중입니다...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                  {newsList.slice(0, 5).map((item, index) => (
                    <a 
                      key={index} 
                      href={item.url.includes('kita.net') ? item.url : "https://www.kita.net/board/totalTradeNews/totalTradeNewsList.do"}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-7 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-all group"
                    >
                      <div className="flex-1 pr-0 sm:pr-8 mb-3 sm:mb-0">
                        <p className="text-slate-800 font-semibold text-lg group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center justify-between sm:justify-end gap-8">
                        <span className="text-slate-400 text-sm font-medium tabular-nums font-mono">
                          {item.date}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
                          <i className="fa-solid fa-arrow-right text-[12px]"></i>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                
                <div className="flex justify-end pr-4">
                  <a 
                    href="https://www.kita.net/board/totalTradeNews/totalTradeNewsList.do" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-6 py-3 rounded-full text-slate-500 font-bold text-sm hover:text-blue-600 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                  >
                    전체 뉴스 보기 
                    <i className="fa-solid fa-chevron-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
