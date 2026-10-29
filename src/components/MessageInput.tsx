import { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Mic, Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-telegram-panel border-t border-telegram px-4 py-2 flex items-end gap-2 flex-shrink-0">
      {/* Emoji button */}
      <button className="icon-btn w-10 h-10 rounded-full flex items-center justify-center text-telegram-gray hover:text-white flex-shrink-0">
        <Smile size={22} strokeWidth={1.8} />
      </button>

      {/* Input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Написать сообщение..."
          rows={1}
          className="w-full input-telegram text-white placeholder-telegram-gray rounded-xl px-4 py-2.5 outline-none resize-none text-[14px] leading-relaxed"
          style={{ minHeight: '40px', maxHeight: '150px' }}
        />
      </div>

      {/* Attach button */}
      <button className="icon-btn w-10 h-10 rounded-full flex items-center justify-center text-telegram-gray hover:text-white flex-shrink-0">
        <Paperclip size={22} strokeWidth={1.8} />
      </button>

      {/* Send / Mic button */}
      {text.trim() ? (
        <button
          onClick={handleSend}
          className="icon-btn w-10 h-10 rounded-full flex items-center justify-center text-telegram-blue hover:text-white flex-shrink-0"
        >
          <Send size={22} strokeWidth={1.8} />
        </button>
      ) : (
        <button className="icon-btn w-10 h-10 rounded-full flex items-center justify-center text-telegram-gray hover:text-white flex-shrink-0">
          <Mic size={22} strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}
