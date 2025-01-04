import { cn } from '~/lib/utils';

import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

interface GameDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  contentCls?: string;
}

export const GameDialog = ({
  isOpen,
  setIsOpen,
  trigger,
  contentCls,
  children,
}: GameDialogProps) => {
  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>{trigger ? trigger : null}</DialogTrigger>
      <DialogContent
        className={cn(
          'game-dialog aspect-video w-full max-w-xl border-none bg-transparent',
          contentCls
        )}
      >
        <div className='z-10 mx-6 my-4'>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
