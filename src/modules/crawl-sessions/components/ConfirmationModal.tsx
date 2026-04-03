import { TriangleAlert } from 'lucide-react';
import { Modal } from '@/common/components/overlay';
import { Button } from '@/common/components/ui/Button';
import { cn } from '@/common/utils/cn';

interface ConfirmationModalProps {
  isOpen: boolean;
  sessionId: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  sessionId,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal.Root isOpen={isOpen} onClose={onCancel}>
      <Modal.Overlay />
      <Modal.Card accentColor="red" maxWidth="max-w-md">
        <Modal.Header
          showClose={false}
          title="Critical Action Required"
          subtitle={
            <>
              Terminating session{' '}
              <span className="text-red-400 font-mono">{sessionId}</span>
            </>
          }
          icon={
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <TriangleAlert size={22} />
            </div>
          }
        />

        <Modal.Body>
          <div className={cn('p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3')}>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Are you sure you want to terminate session{' '}
              <span className="text-white font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded">
                {sessionId}
              </span>
              ?
            </p>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Terminating this session will immediately stop all active extraction threads and may
              result in partial data loss for the current crawl cycle.{' '}
              <span className="text-red-400 font-medium">This action cannot be undone.</span>
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="destructive" size="lg" onClick={onConfirm} className="w-full">
            Confirm Termination
          </Button>
          <Button variant="ghost" size="lg" onClick={onCancel} className="w-full bg-zinc-800 hover:bg-zinc-700">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal.Card>
    </Modal.Root>
  );
}
