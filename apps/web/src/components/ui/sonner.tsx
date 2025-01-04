import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      className='toaster group'
      theme={theme as ToasterProps['theme']}
      toastOptions={{
        classNames: {
          icon: 'pb-2',
          toast:
            'group toast group-[.toaster]:!bg-[#C3AC90] group-[.toaster]:!text-black group-[.toaster]:!border-[6B5052] group-[.toaster]:shadow-lg group-[.toaster]:font-minecraftia group-[.toaster]:!pt-6',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
