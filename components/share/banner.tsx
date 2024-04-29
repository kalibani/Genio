'use client';
import { FC, ReactElement } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { useCurrentUser } from '@/hooks/use-current-user';

interface BannerProps {
  src: string;
  desc: string;
  btnTitle: string;
}

const Banner: FC<BannerProps> = ({ src, desc, btnTitle }): ReactElement => {
  const user = useCurrentUser();
  return (
    <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-rose-600 via-[#A24688] to-[#4E3ABA] px-11 py-4">
      <div className="flex-1 text-white">
        <h1 className="mb-5 text-3xl">{user?.name}</h1>
        <p className="max-w-[883px] text-sm">{desc}</p>
        <Button className="mt-3 w-fit text-sm font-medium" variant="secondary">
          Wellcome {btnTitle}
        </Button>
      </div>
      <Image alt="icon" src={src} />
    </div>
  );
};

export default Banner;
