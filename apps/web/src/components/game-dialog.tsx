import { cn } from '~/lib/utils';

import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

interface GameDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  contentCls?: string;
  outsideElement?: React.ReactNode;
  showCloseButton?: boolean;
}

export const GameDialog = ({
  isOpen,
  setIsOpen,
  trigger,
  contentCls,
  children,
  outsideElement,
  showCloseButton,
}: GameDialogProps) => {
  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className='w-fit'>
        {trigger ? trigger : null}
      </DialogTrigger>
      {isOpen ? outsideElement : null}
      <DialogContent
        showClose={showCloseButton}
        className={cn(
          'game-dialog z-[52] aspect-video w-full max-w-xl border-none bg-transparent',
          contentCls
        )}
      >
        <div className='z-[52] mx-6 my-4'>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
