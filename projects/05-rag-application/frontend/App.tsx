import React, { useState } from 'react';

// 这是一个极其经典的企业级 RAG UI (带资料引用的对话界面)
// Citation (右侧的高亮引文) 几乎成为了诸如 Perplexity, Kimi 等产品的标配

export default function RagChatApp() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);

  // 模拟请求后端的全流程
  const handleQuery = async () => {
    if (!query) return;

    const newMessage = {
      id: Date.now(),
      question: query,
      answer: "正在深度搜索内部企业知识库并生成答案...",
      citations: [],    // 获取到的引文支持来源
      loading: true,
    };
    
    setResponses(prev => [...prev, newMessage]);
    setQuery('');

    // 【重点】这里是向后端发请求得到大模型流式响应的环节（为了演示，仅模拟数据）
    setTimeout(() => {
      setResponses(prev => prev.map(msg => {
        if (msg.id === newMessage.id) {
          return {
            ...msg,
            // 后端 RAG 引擎会顺手把参考的切片 ID 发给前端
            // 另外它生成的文本里也会带角标： [1], [2] 方便我们提取转为超链接
            answer: "根据内部员工手册，试用期期间是不允许休年假的，详情参见手册补充条款。[1] 但您可以提前申请无薪病假。[2]",
            citations: [
              { index: 1, text: "试用期期间休年假条款补充声明...", sourceName: "员工入职指南 V2.pdf" },
              { index: 2, text: "特殊无薪事假的跨级审批流程...", sourceName: "2024 HR Policy.md" }
            ],
            loading: false
          };
        }
        return msg;
      }));
    }, 1500);
  }

  // 渲染正文时，利用正则把 "[1]" 提取出来变成可点击/悬浮高亮的 Reference 小标
  const renderAnswerWithCitations = (text) => {
    const parts = text.split(/(\[\d+\])/g);
    
    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        return (
          <sup key={i} className="cursor-pointer text-blue-500 font-bold px-1 hover:underline">
            {match[0]}
          </sup>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-6 font-sans">
      <header className="border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          企业 RAG 智能知识库
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto space-y-6">
        {responses.map(res => (
          <div key={res.id} className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Q: {res.question}</h3>
            
            <div className={`text-gray-600 ${res.loading ? 'animate-pulse' : ''} mb-4`}>
              A: {renderAnswerWithCitations(res.answer)}
            </div>
            
            {/* 引文展示模块：大厂 AI 面试必看 */}
            {res.citations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-500 mb-2">参考信息源：</p>
                <div className="flex flex-wrap gap-2">
                  {res.citations.map(cit => (
                    <div key={cit.index} className="flex items-center bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 shadow-sm cursor-help hover:border-blue-300">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-4 h-4 flex items-center justify-center mr-2">
                        {cit.index}
                      </span>
                      {cit.sourceName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </main>

      <footer className="mt-6 flex bg-white shadow-lg border rounded-full p-2">
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleQuery()}
          placeholder="提问：关于我们公司的休假制度..." 
          className="flex-1 px-4 outline-none rounded-l-full"
        />
        <button 
          onClick={handleQuery}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
        >
          发送
        </button>
      </footer>
    </div>
  );
}
