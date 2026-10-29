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
    <div className="input-area">
      {/* Emoji button */}
      <button className="icon-btn">
        <Smile size={22} strokeWidth={1.8} />
      </button>

      {/* Input */}
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Написать сообщение..."
          rows={1}
          className="message-input"
        />
      </div>

      {/* Attach button */}
      <button className="icon-btn">
        <Paperclip size={22} strokeWidth={1.8} />
      </button>

      {/* Send / Mic button */}
      {text.trim() ? (
        <button
          onClick={handleSend}
          className="icon-btn send"
        >
          <Send size={22} strokeWidth={1.8} />
        </button>
      ) : (
        <button className="icon-btn">
          <Mic size={22} strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}
