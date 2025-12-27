import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trash2, Sparkles } from 'lucide-react';
import { MessageBubble, ChatInput, TypingIndicator } from '../components/chat';
import { Button } from '../components/ui';
import { Container } from '../components/layout';
import { useChat } from '../hooks/useChat';
import { useDevice } from '../hooks/useDevice';
import { isOnboardingComplete, loadOnboarding } from '../lib/onboarding';

export default function Chat() {
  const navigate = useNavigate();
  const { isMobile, isDesktop } = useDevice();
  const {
    messages,
    isLoading,
    suggestions,
    sendUserMessage,
    clearChat,
    initChat,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Gate chat behind onboarding + initialize greeting
  useEffect(() => {
    const ok = isOnboardingComplete(loadOnboarding());
    if (!ok) {
      navigate('/onboarding', { replace: true });
      return;
    }
    initChat();
  }, [initChat, navigate]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="h-screen flex flex-col bg-dark-50">
      {/* Header */}
      <header className="bg-white border-b border-dark-100 py-3 sm:py-4 px-4 flex-shrink-0">
        <Container size="lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-dark-50 rounded-xl transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-dark-600" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-dark-700" />
                </div>
                <div>
                  <h1 className="font-bold text-dark-700 text-sm sm:text-base">
                    مشاور دوره AI-First
                  </h1>
                  <p className="text-xs text-dark-400">
                    آنلاین • آماده پاسخگویی
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              icon={<Trash2 className="w-4 h-4" />}
              className="text-dark-400 hover:text-dark-600"
            >
              {!isMobile && 'پاک کردن'}
            </Button>
          </div>
        </Container>
      </header>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
      >
        <Container size={isDesktop ? 'md' : 'full'}>
          <div className="py-6 space-y-6">
            {/* Welcome Banner - shown when no messages or only greeting */}
            {messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-dark-700" />
                </div>
                <h2 className="text-2xl font-bold text-dark-700 mb-3">
                  خوش آمدید!
                </h2>
                <p className="text-dark-400 max-w-md mx-auto leading-relaxed">
                  من مشاور دوره آکادمی AI-First هستم. هر سوالی درباره محتوای دوره، مسیرهای یادگیری یا هوش مصنوعی دارید بپرسید.
                </p>
              </motion.div>
            )}

            {/* Messages */}
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isLoading && <TypingIndicator />}
            </AnimatePresence>

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </Container>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0">
        <Container size={isDesktop ? 'md' : 'full'}>
          <ChatInput
            onSend={sendUserMessage}
            isLoading={isLoading}
            suggestions={suggestions}
          />
        </Container>
      </div>
    </div>
  );
}

