import { Button } from '@/components/ui/button';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';

// Allowed colors
type Color =
  | 'white'
  | 'black'
  | 'blue'
  | 'red'
  | 'green'
  | 'amber'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'teal'
  | 'cyan'
  | 'light-blue'
  | 'lime'
  | 'yellow'
  | 'orange'
  | 'deep-orange'
  | 'brown'
  | 'blue-gray'
  | 'gray';

interface ConfirmProps {
  title?: string;
  message?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  color?: Color;
}

interface AlertProps {
  title?: string;
  message?: ReactNode;
  buttonText?: string;
  color?: Color;
}

interface DialogOptions {
  title: string;
  message: ReactNode;
  confirmText: string;
  cancelText: string;
  color: Color;
  hideCancel: boolean;
}

interface DialogContextType {
  confirm: (props: ConfirmProps) => Promise<boolean>;
  alert: (props: AlertProps) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    title: '',
    message: '',
    confirmText: 'Đồng ý',
    cancelText: 'Hủy',
    color: 'green',
    hideCancel: false,
  });

  const resolver = useRef<(value: boolean) => void>(null);

  // Confirm dialog
  const confirm = useCallback((props: ConfirmProps): Promise<boolean> => {
    setOptions({
      title: props.title || 'Xác nhận',
      message:
        props.message || 'Bạn có chắc chắn muốn thực hiện hành động này?',
      confirmText: props.confirmText || 'Đồng ý',
      cancelText: props.cancelText || 'Hủy',
      color: props.color || 'green',
      hideCancel: false,
    });
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  // Alert dialog
  const alert = useCallback((props: AlertProps): Promise<boolean> => {
    setOptions({
      title: props.title || 'Thông báo',
      message: props.message || '',
      confirmText: props.buttonText || 'Đóng',
      cancelText: '',
      color: props.color || 'blue',
      hideCancel: true,
    });
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    resolver.current?.(true);
    setOpen(false);
  };

  const handleCancel = () => {
    resolver.current?.(false);
    setOpen(false);
  };

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}

      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

          <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg">
            <AlertDialog.Title className="text-lg font-semibold">
              {options.title}
            </AlertDialog.Title>

            <AlertDialog.Description className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {options.message}
            </AlertDialog.Description>

            <div className="mt-6 flex justify-end gap-3">
              {!options.hideCancel && (
                <AlertDialog.Cancel asChild>
                  <Button
                    variant="secondary"
                    className="focus:outline-none"
                    onClick={handleCancel}
                  >
                    {options.cancelText}
                  </Button>
                </AlertDialog.Cancel>
              )}

              <AlertDialog.Action asChild>
                <Button
                  className="h-8 text-sm bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleConfirm}
                >
                  {options.confirmText}
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </DialogContext.Provider>
  );
}

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
