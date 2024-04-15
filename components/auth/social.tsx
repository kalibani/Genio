'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const googleSignin = () => {
    signIn('google', { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full flex items-center justify-center gap-x-4"
        variant="outline"
        onClick={googleSignin}
      >
        <Image
          src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
          width={20}
          height={20}
          alt="google"
          className="object-contain"
          sizes="100%"
        />
        Continue with google
      </Button>
    </div>
  );
};

export default Social;
