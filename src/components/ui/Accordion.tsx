import { useState, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';

// Context for accordion state
interface AccordionContextType {
  openItems: string[];
  toggleItem: (id: string) => void;
  type: 'single' | 'multiple';
  iconStyle: 'chevron' | 'plus-minus';
}

const AccordionContext = createContext<AccordionContextType | null>(null);

// Main Accordion component
interface AccordionProps {
  children: ReactNode;
  type?: 'single' | 'multiple';
  defaultOpen?: string[];
  iconStyle?: 'chevron' | 'plus-minus';
  className?: string;
}

export function Accordion({
  children,
  type = 'single',
  defaultOpen = [],
  iconStyle = 'plus-minus',
  className = '',
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(id) ? [] : [id]);
    } else {
      setOpenItems(
        openItems.includes(id)
          ? openItems.filter((item) => item !== id)
          : [...openItems, id]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type, iconStyle }}>
      <div className={`divide-y divide-dark-100 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
}

// Accordion Item
interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({ id, children, className = '' }: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used within Accordion');

  const isOpen = context.openItems.includes(id);

  return (
    <div className={`py-4 ${className}`} data-state={isOpen ? 'open' : 'closed'}>
      {children}
    </div>
  );
}

// Accordion Trigger (Header)
interface AccordionTriggerProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function AccordionTrigger({ id, children, className = '' }: AccordionTriggerProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');

  const isOpen = context.openItems.includes(id);

  const Icon = context.iconStyle === 'chevron' 
    ? ChevronDown 
    : isOpen ? Minus : Plus;

  return (
    <button
      type="button"
      onClick={() => context.toggleItem(id)}
      className={`
        flex items-center justify-between w-full
        text-right font-semibold text-lg text-dark-700
        hover:text-dark-500 transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
        ${className}
      `}
      aria-expanded={isOpen}
    >
      <span className="flex-1">{children}</span>
      <motion.span
        animate={{ rotate: context.iconStyle === 'chevron' && isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0 mr-4"
      >
        <Icon className="w-5 h-5" />
      </motion.span>
    </button>
  );
}

// Accordion Content
interface AccordionContentProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function AccordionContent({ id, children, className = '' }: AccordionContentProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used within Accordion');

  const isOpen = context.openItems.includes(id);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="overflow-hidden"
        >
          <div className={`pt-4 text-dark-400 leading-relaxed ${className}`}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Accordion;

