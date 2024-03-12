'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const InfoDepartement = () => {
  const [position, setPosition] = useState(0);
  return (
    <div className="space-y-6">
      <div className="w-full space-x-6">
        {titleButton.map((title, index) => (
          <Button
            onClick={() => setPosition(index)}
            variant={index !== position ? 'outline' : 'default'}
            className={cn(
              'min-w-[300px] text-2xl font-medium min-h-[84px] hover:bg-primary hover:text-white hover:font-medium transition-all ease-in-out delay-100 ',
              index !== position && 'border-primary font-light'
            )}
            key={title}
          >
            {title}
          </Button>
        ))}
      </div>
      <div className="w-full flex border-primar border py-9 px-10 relative  items-center  overflow-hidden">
        <div className="flex gap-x-4 relative z-10">
          <div className="w-1/2 flex flex-col gap-y-4">
            <h4 className="text-3xl font-medium">
              Checking CV so much easier now
            </h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at
              magna sit amet urna facilisis ullamcorper. In id velit a leo
              dictum tincidunt ac vitae dolor. In id velit a leo dictum
              tincidunt ac vitae dolor. In id velit a leo dictum tincidunt ac
              vitae dolor.
            </p>
            <div className="flex gap-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-400"></div>
              <div>
                <p className="font-medium text-lg">John Doel</p>
                <p className="font-light max-w-[400px]">
                  “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  at magna sit amet urna facilisis ullamcorper.”
                </p>
              </div>
            </div>
          </div>
          <div className="w-1/2 ">
            <div className="bg-red-500 w-[552px] h-[277px]"></div>
          </div>
        </div>

        <div className="w-[500px] h-[500px] bg-[#D9D9D9] rounded-full absolute -right-36 -top-20" />
      </div>
    </div>
  );
};

export default InfoDepartement;

const titleButton = [
  'Talent Acquisition',
  'Human resources',
  'Job Platform Company',
];
