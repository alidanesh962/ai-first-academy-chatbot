import { motion } from 'framer-motion';
import { Bot, User, Send, Check } from 'lucide-react';
import { useState, createContext, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, sendAskKheizaranWebhook } from '../../lib/chat-service';

interface MessageBubbleProps {
  message: Message;
}

// Context to track if we're inside an ordered list
const ListContext = createContext<{ ordered: boolean; index: number }>({ ordered: false, index: 0 });

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
        {/* Rendered Markdown content */}
        <div className={`markdown-content text-[15px] leading-relaxed ${isUser ? 'user-message' : 'assistant-message'}`} dir="rtl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Headers
              h1: ({ children }) => (
                <h1 className="text-xl font-bold text-dark-800 mt-4 mb-3 pb-2 border-b-2 border-primary/30 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-bold text-dark-800 mt-5 mb-2 flex items-center gap-2 flex-row-reverse first:mt-0">
                  <span className="w-1 h-5 bg-primary rounded-full flex-shrink-0" />
                  <span className="flex-1">{children}</span>
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold text-dark-700 mt-4 mb-2 first:mt-0">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-[15px] font-semibold text-dark-600 mt-3 mb-1.5 first:mt-0">
                  {children}
                </h4>
              ),
              // Paragraph
              p: ({ children }) => (
                <p className="my-2 leading-relaxed first:mt-0 last:mb-0">
                  {children}
                </p>
              ),
              // Unordered Lists
              ul: ({ children }) => (
                <ListContext.Provider value={{ ordered: false, index: 0 }}>
                  <ul className="my-3 space-y-2">
                    {children}
                  </ul>
                </ListContext.Provider>
              ),
              // Ordered Lists
              ol: ({ children, start }) => {
                let index = (start || 1) - 1;
                return (
                  <ol className="my-3 space-y-2 list-none">
                    {Array.isArray(children) 
                      ? children.map((child, i) => (
                          <ListContext.Provider key={i} value={{ ordered: true, index: ++index }}>
                            {child}
                          </ListContext.Provider>
                        ))
                      : <ListContext.Provider value={{ ordered: true, index: start || 1 }}>
                          {children}
                        </ListContext.Provider>
                    }
                  </ol>
                );
              },
              // List Items
              li: ({ children }) => {
                const listContext = useContext(ListContext);
                
                if (listContext.ordered) {
                  return (
                    <li className="flex items-start gap-3 flex-row-reverse">
                      <span className="text-primary-600 font-bold min-w-[1.5rem] flex-shrink-0 mt-0.5">
                        {listContext.index})
                      </span>
                      <span className="flex-1">{children}</span>
                    </li>
                  );
                }
                
                return (
                  <li className="flex items-start gap-2 flex-row-reverse">
                    <span className="text-primary-600 mt-1.5 flex-shrink-0 text-lg leading-none">•</span>
                    <span className="flex-1">{children}</span>
                  </li>
                );
              },
              // Blockquote
              blockquote: ({ children }) => (
                <blockquote className="my-4 pr-4 border-r-4 border-primary bg-primary/5 py-3 pl-4 rounded-l-lg text-dark-600 italic">
                  {children}
                </blockquote>
              ),
              // Code
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-dark-100 text-dark-700 px-1.5 py-0.5 rounded text-[13px] font-mono" dir="ltr">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="block bg-dark-800 text-dark-100 p-4 rounded-lg text-sm font-mono overflow-x-auto my-3" dir="ltr">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="my-3 rounded-lg overflow-hidden" dir="ltr">
                  {children}
                </pre>
              ),
              // Strong/Bold
              strong: ({ children }) => (
                <strong className="font-bold text-dark-800">
                  {children}
                </strong>
              ),
              // Emphasis/Italic
              em: ({ children }) => (
                <em className="italic text-dark-600">
                  {children}
                </em>
              ),
              // Links
              a: ({ children, href }) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-700 underline underline-offset-2 hover:text-primary-800 transition-colors"
                >
                  {children}
                </a>
              ),
              // Horizontal Rule
              hr: () => (
                <hr className="my-5 border-t-2 border-dark-100" />
              ),
              // Table
              table: ({ children }) => (
                <div className="my-4 overflow-x-auto rounded-lg border border-dark-100">
                  <table className="w-full text-sm">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-primary/20 text-dark-800">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-dark-100">
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-dark-50 transition-colors">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 font-bold border-b-2 border-primary/30">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3">
                  {children}
                </td>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
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
