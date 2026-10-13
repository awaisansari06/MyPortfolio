'use client';

import { ArrowUpRight, Sparkles } from 'lucide-react';

/** A reserved viewport rail keeps this launcher clear of scrolling page content. */
export function MobileAiLauncher({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  return <div className="ai-mobile-rail" hidden={open}>
    <button id="ask-ai-launcher-mobile" type="button" onClick={onOpen}
      aria-label="Open Ask Awais AI assistant" aria-haspopup="dialog"
      className="ai-launcher ai-launcher-mobile">
      <Sparkles aria-hidden="true" className="h-3.5 w-3.5" /><span>Ask AI</span><ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
    </button>
  </div>;
}
