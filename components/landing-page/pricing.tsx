import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import check from '@/public/icon/checked.svg';

import { HelpCircle } from 'lucide-react';
import React from 'react';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import Image from 'next/image';
import { Button } from '../ui/button';

// temporary type any
const Pricing = ({ items }: { items: any[] }) => {
  return (
    <ScrollArea className=" w-full whitespace-nowrap">
      <div className="mx-auto mt-11  grid w-[1024px] grid-cols-5 text-center">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'flex flex-col items-center rounded-md  text-center',
              index % 2 !== 0 ? 'bg-[#F7FAFC]' : 'bg-white',
              index === 0 && 'items-start justify-start',
              item.id === 4 && 'relative border border-primary'
            )}
          >
            {item.title === 'pro' && (
              <div className="absolute -top-5  left-0 right-0 mx-auto w-fit rounded-full bg-primary px-6 py-2 text-xs font-light text-white">
                <p>Best Seller</p>
              </div>
            )}
            <div className="my-5 mb-6 flex  flex-col items-center justify-end gap-y-5">
              <h4
                className={cn(
                  'text-xl font-medium capitalize',
                  item.id === 1 && 'opacity-0'
                )}
              >
                {item.title || ''}
              </h4>
              <p
                className={cn(
                  'text-xs text-[#4F525A]',
                  item.id === 1 && 'opacity-0'
                )}
              >
                {item.desc}
              </p>
              <p
                className={cn(
                  'text-2xl font-semibold ',
                  index === 0 && 'mb-2 text-lg font-medium capitalize '
                )}
              >
                {item.price}
              </p>
            </div>
            <div
              className={cn(
                'flex w-full items-center justify-center py-6',
                index === 0 && 'items-start justify-start',
                index !== 0 && index % 2 === 0 ? 'bg-[#F7FAFC]' : 'bg-white'
              )}
            >
              <p>{item.files} cvs</p>
              {item.id !== 1 && (
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="ml-1.5 mt-0.5 flex cursor-default">
                      <HelpCircle className="h-3 w-3 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-2">
                      Screening CV Automatically up to {item.files} Candidates
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div
              className={cn(
                'flex w-full items-center justify-center  py-6',
                index === 0 && 'items-start justify-start',
                index % 2 !== 0 ? 'bg-[#F7FAFC]' : 'bg-white'
              )}
            >
              <p>{item.generate}</p>
              {item.id !== 1 && (
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="ml-1.5 mt-0.5 flex cursor-default">
                      <HelpCircle className="h-3 w-3 text-zinc-500" />
                    </TooltipTrigger>
                    <TooltipContent className="w-80 p-2">
                      Screening CV Automatically up to {item.generate}{' '}
                      Candidates.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div
              className={cn(
                'flex w-full flex-col items-center justify-center gap-x-1 gap-y-10 py-6',
                index === 0 && 'items-start justify-start',
                index % 2 !== 0 ? 'bg-[#F7FAFC]' : 'bg-white'
              )}
            >
              {item.benef.map((item: string, index: number) => (
                <>
                  {item === 'check' ? (
                    <Image
                      alt="icon"
                      src={check}
                      sizes="100%"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <p key={item}>{item}</p>
                  )}
                </>
              ))}
            </div>
            <div
              className={cn('mb-6 mt-12 w-full px-10', index === 0 && 'hidden')}
            >
              <Button
                className={cn(
                  'w-fit text-sm font-semibold hover:bg-primary hover:text-white',
                  index > 1 ? 'font-normal' : 'font-semibold'
                )}
                variant={index > 1 ? 'outline' : 'default'}
              >
                {index > 1 ? 'select' : 'Get Started Free'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Pricing;
