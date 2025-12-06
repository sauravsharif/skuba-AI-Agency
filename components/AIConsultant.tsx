import React, { useState, useEffect, useRef } from 'react';
import { GenerateContentResponse, Chat } from "@google/genai";
import { createChatSession, sendMessageToNexus } from '../services/gemini';
import { IconSend, IconBot, IconX } from './Icons';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIConsultant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello. I am Skuba. I help ambitious businesses scale with AI. How can I help you increase your profit margins today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatSessionRef.current) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const stream = await sendMessageToNexus(chatSessionRef.current, userMessage);
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        const content = chunk as GenerateContentResponse;
        if (content.text) {
          fullResponse += content.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullResponse;
            return newMessages;
          });
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Connection interrupted. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 hover:scale-110 border border-nexus-accent/30 ${isOpen ? 'bg-nexus-900 rotate-90' : 'bg-nexus-800 animate-pulse-slow'}`}
      >
        {isOpen ? <IconX className="text-white w-6 h-6" /> : <IconBot className="text-nexus-accent w-8 h-8" />}
      </button>

      {/* Chat Interface */}
      <div 
        className={`fixed bottom-24 right-8 z-40 w-96 max-w-[calc(100vw-40px)] glass-panel rounded-2xl overflow-hidden transition-all duration-500 origin-bottom-right flex flex-col border-nexus-accent/20 border
        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}`}
        style={{ height: '550px' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-nexus-900 to-nexus-800 p-4 border-b border-white/10 flex items-center gap-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-nexus-accent/5" />
          <div className="p-2 bg-nexus-500/10 rounded-lg border border-nexus-accent/20 relative z-10">
             <IconBot className="text-nexus-accent w-6 h-6" />
          </div>
          <div className="relative z-10">
            <h3 className="text-white font-bold text-sm font-mono tracking-widest">SKUBA INTELLIGENCE</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-nexus-accent rounded-full animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
              <span className="text-[10px] text-nexus-400 uppercase tracking-wider">System Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-nexus-900/80">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed backdrop-blur-sm ${
                  msg.role === 'user' 
                    ? 'bg-nexus-500/90 text-white rounded-br-none shadow-lg shadow-nexus-500/20' 
                    : 'bg-white/5 text-gray-200 rounded-bl-none border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start animate-fade-in">
               <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center border border-white/10">
                 <span className="w-1.5 h-1.5 bg-nexus-accent rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                 <span className="w-1.5 h-1.5 bg-nexus-accent rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                 <span className="w-1.5 h-1.5 bg-nexus-accent rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-nexus-950 border-t border-white/10">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask how to automate your business..."
              className="w-full bg-nexus-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-nexus-accent/50 focus:ring-1 focus:ring-nexus-accent/50 transition-all font-mono shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-nexus-500/80 hover:bg-nexus-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            >
              <IconSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};