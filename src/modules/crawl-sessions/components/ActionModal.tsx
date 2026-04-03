import { ChevronRight, Download, PauseCircle, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Modal } from '@/common/components/overlay';
import { Button } from '@/common/components/ui/Button';

interface ActionModalProps {
  isOpen: boolean;
  sessionId: string | null;
  onClose: () => void;
  onAction: (actionType: string) => void;
}

const ACTIONS = [
  {
    key: 'pause',
    icon: PauseCircle,
    label: 'Pause Session',
    description: 'Gracefully stop all current worker threads.',
  },
  {
    key: 'restart',
    icon: RotateCcw,
    label: 'Restart Session',
    description: 'Clear queue and re-initialize parameters.',
  },
  {
    key: 'export',
    icon: Download,
    label: 'Export Logs',
    description: 'Download session telemetry as JSON/CSV.',
  },
  {
    key: 'update',
    icon: SlidersHorizontal,
    label: 'Update Configuration',
    description: 'Modify proxy pools or thread limits live.',
  },
] as const;

export function ActionModal({ isOpen, sessionId, onClose, onAction }: ActionModalProps) {
  return (
    <Modal.Root isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Card accentColor="orange">
        <Modal.Header
          title="Crawl Session Management"
          subtitle={
            <>
              Configure or modify active session{' '}
              <span className="text-orange-500 font-mono">#{sessionId}</span>
            </>
          }
        />

        <Modal.Body>
          {ACTIONS.map(({ key, icon: Icon, label, description }) => (
            <button
              key={key}
              onClick={() => onAction(key)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-500/10 hover:border-orange-500/40 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
                <Icon size={20} />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-semibold">{label}</h4>
                <p className="text-xs text-zinc-500 group-hover:text-zinc-400">{description}</p>
              </div>
              <ChevronRight
                size={18}
                className="text-zinc-600 group-hover:text-orange-500 transition-colors shrink-0"
              />
            </button>
          ))}
        </Modal.Body>

        <Modal.Footer className="flex-row mt-10">
          <Button variant="primary" size="lg" onClick={onClose} className="flex-1">
            Apply Changes
          </Button>
          <Button variant="ghost" size="lg" onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white">
            Dismiss
          </Button>
        </Modal.Footer>
      </Modal.Card>
    </Modal.Root>
  );
}
