import { motion } from 'framer-motion';
import { Bot, User, Send, Check } from 'lucide-react';
import { useState } from 'react';
import { Message, sendAskKheizaranWebhook } from '../../lib/chat-service';

interface MessageBubbleProps {
  message: Message;
}

// Format text with markdown-like syntax
function formatText(text: string): string {
  return text
    // Bold text **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-dark-800">$1</strong>')
    // Inline code `code`
    .replace(/`([^`]+)`/g, '<code class="bg-dark-100 text-dark-700 px-1.5 py-0.5 rounded text-[13px] font-mono">$1</code>');
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [isAskKheizaranSent, setIsAskKheizaranSent] = useState(false);
  const [isAskKheizaranLoading, setIsAskKheizaranLoading] = useState(false);

  const handleAskKheizaran = async () => {
    if (!message.notFoundUserMessage || isAskKheizaranSent || isAskKheizaranLoading) return;
    
    setIsAskKheizaranLoading(true);
    try {
      await sendAskKheizaranWebhook(message.notFoundUserMessage);
      setIsAskKheizaranSent(true);
    } catch (error) {
      console.error('Failed to send ask kheizaran webhook:', error);
    } finally {
      setIsAskKheizaranLoading(false);
    }
  };

  // Parse content into structured elements
  const renderContent = () => {
    const lines = message.content.split('\n');
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Empty line - add spacing
      if (trimmedLine === '') {
        elements.push(<div key={i} className="h-2" />);
        i++;
        continue;
      }

      // H1 Header: # Title
      if (trimmedLine.startsWith('# ')) {
        elements.push(
          <h1 
            key={i} 
            className="text-lg font-bold text-dark-800 mt-4 mb-2 pb-1 border-b border-dark-100"
            dangerouslySetInnerHTML={{ __html: formatText(trimmedLine.slice(2)) }}
          />
        );
        i++;
        continue;
      }

      // H2 Header: ## Title
      if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h2 
            key={i} 
            className="text-base font-bold text-dark-800 mt-4 mb-2 flex items-center gap-2"
          >
            <span className="w-1 h-5 bg-primary rounded-full flex-shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: formatText(trimmedLine.slice(3)) }} />
          </h2>
        );
        i++;
        continue;
      }

      // H3 Header: ### Title
      if (trimmedLine.startsWith('### ')) {
        elements.push(
          <h3 
            key={i} 
            className="text-[15px] font-semibold text-dark-700 mt-3 mb-1.5"
            dangerouslySetInnerHTML={{ __html: formatText(trimmedLine.slice(4)) }}
          />
        );
        i++;
        continue;
      }

      // Numbered list with possible sub-items: 1) or 1.
      const numberedMatch = trimmedLine.match(/^(\d+)[\)\.]\s*(.*)/);
      if (numberedMatch) {
        const listItems: JSX.Element[] = [];
        
        while (i < lines.length) {
          const currentLine = lines[i];
          const currentTrimmed = currentLine.trim();
          const numMatch = currentTrimmed.match(/^(\d+)[\)\.]\s*(.*)/);
          
          if (numMatch) {
            // Collect sub-items (lines starting with - or • after this)
            const subItems: string[] = [];
            let j = i + 1;
            while (j < lines.length) {
              const subLine = lines[j].trim();
              if (subLine.startsWith('-') || subLine.startsWith('•')) {
                subItems.push(subLine.replace(/^[-•]\s*/, ''));
                j++;
              } else if (subLine.startsWith('  -') || subLine.startsWith('  •')) {
                subItems.push(lines[j].trim().replace(/^[-•]\s*/, ''));
                j++;
              } else {
                break;
              }
            }
            
            listItems.push(
              <div key={i} className="mb-3">
                <div className="flex items-start gap-2 flex-row-reverse">
                  <span className="text-primary-600 font-bold min-w-[1.5rem] flex-shrink-0 text-left">
                    {numMatch[1]})
                  </span>
                  <span 
                    className="flex-1 font-medium"
                    dangerouslySetInnerHTML={{ __html: formatText(numMatch[2]) }} 
                  />
                </div>
                {subItems.length > 0 && (
                  <div className="mr-6 mt-1.5 space-y-1">
                    {subItems.map((sub, idx) => (
                      <div key={idx} className="flex items-start gap-2 flex-row-reverse text-[14px]">
                        <span className="text-primary-500 mt-1 flex-shrink-0">•</span>
                        <span 
                          className="flex-1 text-dark-600"
                          dangerouslySetInnerHTML={{ __html: formatText(sub) }} 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
            i = j;
          } else if (currentTrimmed === '' || currentTrimmed.startsWith('#')) {
            break;
          } else {
            i++;
            break;
          }
        }
        
        elements.push(
          <div key={`list-${i}`} className="my-2">
            {listItems}
          </div>
        );
        continue;
      }

      // Bullet point: - or •
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        const bulletItems: string[] = [];
        
        while (i < lines.length) {
          const currentLine = lines[i].trim();
          if (currentLine.startsWith('-') || currentLine.startsWith('•')) {
            bulletItems.push(currentLine.replace(/^[-•]\s*/, ''));
            i++;
          } else if (currentLine === '') {
            i++;
            break;
          } else {
            break;
          }
        }
        
        elements.push(
          <div key={`bullets-${i}`} className="my-2 space-y-1.5">
            {bulletItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 flex-row-reverse">
                <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                <span 
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: formatText(item) }} 
                />
              </div>
            ))}
          </div>
        );
        continue;
      }

      // Regular paragraph
      elements.push(
        <p
          key={i}
          className="my-1.5 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatText(line) }}
        />
      );
      i++;
    }

    return elements;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          ${isUser ? 'bg-dark-100' : 'bg-primary'}
        `}
      >
        {isUser ? (
          <User className="w-5 h-5 text-dark-600" />
        ) : (
          <Bot className="w-5 h-5 text-dark-700" />
        )}
      </div>

      {/* Message Content */}
      <div
        dir="rtl"
        className={`
          max-w-[85%] sm:max-w-[80%] p-4 rounded-2xl text-right
          ${isUser 
            ? 'bg-primary text-dark-700 rounded-bl-sm' 
            : 'bg-white text-dark-700 shadow-md rounded-br-sm'
          }
        `}
      >
        {/* Rendered content */}
        <div className="text-[15px] leading-relaxed">
          {renderContent()}
        </div>

        {/* Timestamp */}
        <div
          dir="ltr"
          className={`
            text-[11px] mt-3 pt-2 border-t border-dark-50 opacity-60
            ${isUser ? 'text-right' : 'text-left'}
          `}
        >
          {message.timestamp.toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>

        {/* Ask Kheizaran Button - shown when notFoundUserMessage is present */}
        {message.notFoundUserMessage && !isUser && (
          <div className="mt-3 pt-3 border-t border-dark-100">
            {isAskKheizaranSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium"
              >
                <Check className="w-4 h-4" />
                <span>سوالت برای خیزران ارسال شد</span>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAskKheizaran}
                disabled={isAskKheizaranLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-primary-600 text-dark-700 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAskKheizaranLoading ? (
                  <div className="w-4 h-4 border-2 border-dark-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>از خیزران بپرس</span>
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

