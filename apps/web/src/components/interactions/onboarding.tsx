import { useState } from 'react';

import { useLensAccount } from '~/lib/lens';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useStep } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import { GameButton } from '../game-button';
import { IconButton } from '../icon-button';

export const Onboarding = () => {
  const [step, actions] = useStep(6);

  return (
    <div className='hide-scrollbar relative mx-auto flex h-full max-w-3xl flex-col gap-4 pt-8'>
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      {step === 4 && <Step4 goTo={actions.setStep} />}
      {step === 5 && <Step5 goTo={actions.setStep} />}
      {step === 6 && <Step6 />}
      <div className='absolute top-1/2 flex w-full flex-row items-center justify-between gap-4 px-4'>
        {actions.canGoToPrevStep ? (
          <IconButton
            icon='prev-btn'
            onClick={() => {
              actions.goToPrevStep();
            }}
          />
        ) : (
          <div />
        )}
        {actions.canGoToNextStep ? (
          <IconButton
            icon='next-btn'
            onClick={() => {
              actions.goToNextStep();
            }}
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

const Step1 = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='font-minecraftia text-3xl font-black'>Welcome to</div>
      <img alt='logo' className='max-w-md' src='/logo-text-brown.png' />
    </div>
  );
};

const Step2 = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <div className='max-w-lg items-center font-minecraftia text-lg font-black'>
        Step into Sproutsville, where farming meets a decentralized social
        world! <div className='inline-flex -translate-y-3 px-1'>🌾</div>Build
        your dream farm, plant and harvest crops, raise animals, and trade
        resources to grow your village.
        <br />
        <br />
        But there&lsquo;s more, this isn&lsquo;t just any farming game.
      </div>
    </div>
  );
};

const Step3 = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <div className='max-w-lg items-center font-minecraftia text-lg font-black'>
        Explore a shared world, create your Lens profile, follow other players,
        post updates, and dive into social feeds
        <div className='inline-flex -translate-y-3 px-1'>📜</div>. Interact with
        villagers, contribute to the global economy, and uncover unique quests
        while connecting through the Lens ecosystem.
        <br />
        <br />
        Now, enough talk! Let&lsquo;s get you started on your journey to
        Sproutsville <div className='inline-flex -translate-y-3 px-1'>🌱</div>
      </div>
    </div>
  );
};

const Step4 = ({ goTo }: { goTo: (step: number) => void }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const { registerUser } = useLensAccount();

  const onCreateProfile = async () => {
    if (!name || !username) {
      return;
    }
    try {
      await registerUser(username, name);
      toast.success('Profile created successfully');
      goTo(6);
    } catch (error: unknown) {
      console.log(error);
      toast.error((error as Error).message);
    }
  };

  const onLogin = () => {
    try {
      goTo(5);
    } catch (error: unknown) {
      console.log(error);
      toast.error((error as Error).message);
    }
  };
  return (
    <div className='mx-auto flex h-full max-w-lg flex-col'>
      <div className='text-center font-minecraftia text-2xl font-black'>
        Create your Sproutsville Profile
      </div>
      <div className='flex flex-col items-center justify-center gap-2 py-8'>
        <div className='text-center font-minecraftia text-lg font-black'>
          What should we call you?
        </div>
        <input
          className='border-brown-500 relative flex h-10 w-[20rem] cursor-pointer items-center justify-center rounded-xl border-2 border-[#6B5052] pt-4 text-center font-minecraftia text-xl text-[#6B5052] focus:outline-none'
          placeholder='John Doe'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className='mx-auto flex flex-row items-center font-minecraftia text-[#6B5052]'>
        <div className='rounded-l-xl border-t-2 border-b-2 border-l-2 border-[#6B5052] bg-[#C3AC90] pt-2 pl-4 font-black'>
          sproutsville/
        </div>
        <input
          className='w-[10rem] rounded-r-xl border-t-2 border-r-2 border-b-2 border-[#6B5052] bg-[#C3AC90] pt-2'
          placeholder='johndoe'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className='mx-auto flex flex-col gap-4 pt-12'>
        <GameButton
          className='h-16 w-72'
          innerClassName='text-base font-minecraftia pt-3'
          onClick={onCreateProfile}
        >
          Create Profile
        </GameButton>
        <GameButton
          className='h-16 w-72'
          innerClassName='text-base font-minecraftia pt-3'
          onClick={onLogin}
        >
          Login
        </GameButton>
      </div>
    </div>
  );
};

const Step5 = ({ goTo }: { goTo: (step: number) => void }) => {
  const { getAllAccounts, accountLogin } = useLensAccount();
  const { address } = useAccount();
  const { data: accounts } = useQuery({
    queryKey: ['all-accounts'],
    queryFn: getAllAccounts,
    refetchOnWindowFocus: false,
    enabled: Boolean(address),
    initialData: [],
  });
  return (
    <div className='mx-auto flex h-full max-w-lg flex-col'>
      <div className='text-center font-minecraftia text-2xl font-black'>
        Select your Sproutsville Profile
      </div>

      <div className='mx-auto flex flex-col gap-4 pt-12'>
        {accounts.map((acc) => (
          <GameButton
            key={acc.address}
            className='h-16 w-72'
            innerClassName='text-base font-minecraftia pt-3'
            onClick={async () => {
              await accountLogin('accountOwner', acc.address);
              goTo(6);
            }}
          >
            {acc.completeName}
          </GameButton>
        ))}
      </div>
    </div>
  );
};

const Step6 = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <div className='max-w-lg items-center text-center font-minecraftia text-lg font-black'>
        Congratulations! You&lsquo;ve successfully created your Sproutsville
        Profile.
        <br />
        <br />
        Now, you can start your journey in Sproutsville and explore the
        farmlands. <div className='inline-flex -translate-y-3 px-1'>🌾</div>
      </div>
    </div>
  );
};
