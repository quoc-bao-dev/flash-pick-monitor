'use client';

import React, { createContext, use, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/common/utils/cn';

// ─── Animation Hook ───────────────────────────────────────────────────────────
function useModalAnimation(isOpen: boolean, duration = 250) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Defer to next paint so CSS transition fires
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), duration);
      return () => clearTimeout(t);
    }
  }, [isOpen, duration]);

  return { mounted, visible };
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface ModalContextValue {
  visible: boolean;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
  const ctx = use(ModalContext);
  if (!ctx) throw new Error('Modal compound components must be used within <Modal.Root>');
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
interface ModalRootProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Animation duration in ms, default 250 */
  duration?: number;
}

function ModalRoot({ isOpen, onClose, children, duration = 250 }: ModalRootProps) {
  const { mounted, visible } = useModalAnimation(isOpen, duration);
  const portalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalRef.current = document.body;
  }, []);

  if (!mounted || !portalRef.current) return null;

  return createPortal(
    <ModalContext value={{ visible, onClose }}>
      {children}
    </ModalContext>,
    portalRef.current,
  );
}

// ─── Overlay ──────────────────────────────────────────────────────────────────
interface ModalOverlayProps {
  className?: string;
}

function ModalOverlay({ className }: ModalOverlayProps) {
  const { visible, onClose } = useModalContext();
  return (
    <div
      aria-hidden="true"
      onClick={onClose}
      className={cn(
        'fixed inset-0 z-50 bg-[#080E1D]/85 backdrop-blur-sm transition-opacity duration-250 ease-out',
        visible ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
type AccentColor = 'orange' | 'red' | 'blue' | 'none';

interface ModalCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: AccentColor;
  maxWidth?: string;
}

const accentGlowMap: Record<AccentColor, string> = {
  orange: 'border-orange-500/30 [&>[data-glow]]:bg-orange-500/20',
  red:    'border-red-500/30    [&>[data-glow]]:bg-red-500/10',
  blue:   'border-blue-500/30   [&>[data-glow]]:bg-blue-500/10',
  none:   'border-white/10',
};

function ModalCard({
  children,
  className,
  accentColor = 'orange',
  maxWidth = 'max-w-lg',
}: ModalCardProps) {
  const { visible } = useModalContext();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none',
      )}
    >
      <div
        className={cn(
          // Base glass card
          'glass-panel relative w-full overflow-hidden rounded-3xl p-8',
          'border shadow-[0_32px_64px_rgba(0,0,0,0.8)]',
          'pointer-events-auto',
          // Animation
          'transition-all duration-250 ease-out',
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4',
          // Accent border
          accentGlowMap[accentColor],
          maxWidth,
          className,
        )}
      >
        {/* Accent glow blob — targeted via CSS sibling selector above */}
        {accentColor !== 'none' && (
          <div
            data-glow=""
            className="absolute -top-24 -right-24 w-64 h-64 blur-3xl rounded-full pointer-events-none"
          />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
interface ModalHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  showClose?: boolean;
  className?: string;
}

function ModalHeader({ title, subtitle, icon, showClose = true, className }: ModalHeaderProps) {
  const { onClose } = useModalContext();
  return (
    <div className={cn('flex items-start justify-between mb-8', className)}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="shrink-0">{icon}</div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-headline">{title}</h2>
          {subtitle && <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>}
        </div>
      </div>
      {showClose && (
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="ml-4 shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────
interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn('mt-8 flex flex-col gap-3', className)}>
      {children}
    </div>
  );
}

// ─── Compound Export ──────────────────────────────────────────────────────────
export const Modal = {
  Root:    ModalRoot,
  Overlay: ModalOverlay,
  Card:    ModalCard,
  Header:  ModalHeader,
  Body:    ModalBody,
  Footer:  ModalFooter,
};
