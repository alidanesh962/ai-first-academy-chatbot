import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  suggestions: string[];
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  isLoading,
  suggestions,
  placeholder = 'پیام خود را بنویسید...',
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      onSend(suggestion);
    }
  };

  return (
    <div className="bg-white border-t border-dark-100">
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 border-b border-dark-50 overflow-x-auto"
        >
          <div className="flex gap-2 min-w-max">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="
                  px-4 py-2 bg-dark-50 hover:bg-dark-100
                  text-dark-600 text-sm rounded-full
                  transition-colors whitespace-nowrap
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="p-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              rows={1}
              className="
                w-full px-4 py-3 pr-4
                bg-dark-50 border border-dark-100 rounded-2xl
                text-dark-700 placeholder-dark-300
                resize-none overflow-hidden
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              "
              style={{ minHeight: '48px', maxHeight: '150px' }}
            />
          </div>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="
              w-12 h-12 rounded-xl
              bg-primary hover:bg-primary-400
              text-dark-700
              flex items-center justify-center
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 rotate-180" />
            )}
          </motion.button>
        </div>

        {/* Helper Text */}
        <p className="text-center text-xs text-dark-300 mt-3">
          Shift + Enter برای خط جدید • Enter برای ارسال
        </p>
      </div>
    </div>
  );
}

