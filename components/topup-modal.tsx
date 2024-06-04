'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

import { Checkbox } from '@/components/ui/checkbox';
import { cn, formatMoneyRMG } from '@/lib/utils';
import { Button } from './ui/button';
import { useTopupModal } from '@/hooks/use-topup-modal';
import { useTopup } from '@/hooks/use-topup';
import { useParams } from 'next/navigation';

export const costPerToken = 3000;
const amountList = [
  {
    id: '1',
    token: 50,
  },
  {
    id: '2',
    token: 100,
  },
  {
    id: '3',
    token: 200,
  },
  {
    id: '4',
    token: 300,
  },
  {
    id: '5',
    token: 500,
  },
  {
    id: '6',
    token: 1000,
  },
];

export const TopupModal = () => {
  const params = useParams();
  const topupModal = useTopupModal();
  const [isChecked, setChecked] = useState(false);
  const [selectedToken, setSelectedToken] = useState(0);
  const { handleCheckout } = useTopup();

  useEffect(() => {
    if (topupModal.isOpen) {
      setChecked(false);
      setSelectedToken(0);
    }
  }, [topupModal.isOpen]);

  const handleTopup = () => {
    topupModal.onClose();
    handleCheckout({ token: selectedToken, orgId: params.orgId as string });
  };

  return (
    <Dialog open={topupModal.isOpen} onOpenChange={topupModal.onClose}>
      <DialogContent className="sm:max-w-lg md:min-w-max">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center justify-center gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 py-1 font-bold">
              Isi ulang Token Anda
            </div>
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-2 text-center font-medium text-zinc-900">
            <div className="grid grid-cols-2 gap-4 ">
              {amountList.map((el) => (
                <div
                  key={el.id}
                  className={cn(' rounded-lg  p-4 shadow-lg', {
                    'cursor-pointer': selectedToken !== el.token,
                    'bg-slate-100': selectedToken !== el.token,
                    'bg-primary': selectedToken === el.token,
                    'text-white': selectedToken === el.token,
                  })}
                  onClick={() => setSelectedToken(el.token)}
                >
                  <p className="text-xl font-bold">
                    {el.token}
                    <span className="text-right text-sm"> token</span>
                  </p>
                  <p className="mt-4 text-xl">
                    {formatMoneyRMG(el.token * costPerToken, 'IDR')}
                  </p>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        {!!selectedToken && (
          <DialogFooter className="items-center md:justify-between">
            <div
              className={cn(
                'relative flex w-full flex-col bg-slate-50 px-5 py-8 sm:rounded-2xl',
              )}
            >
              <p className="relative -top-2 flex items-center justify-center">
                <span className="text-[2rem] leading-none text-slate-900">
                  {formatMoneyRMG(selectedToken * costPerToken, 'IDR')}
                </span>
                <span className="ml-3 text-sm">
                  <span className="font-semibold text-slate-900">
                    Total tagihan
                  </span>
                </span>
              </p>

              <div className="mt-2 flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={isChecked}
                  onCheckedChange={() => setChecked(!isChecked)}
                />
                <label
                  htmlFor="terms"
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  By Clicking This You Agree with Our{' '}
                  <a
                    className="text-blue-400 underline"
                    href="https://drive.google.com/file/d/1u-DULua9EUEYjhK15JV6lrnKEDrLRuqZ/view?usp=sharing"
                    target="_blank"
                  >
                    Terms of Service
                  </a>
                </label>
              </div>

              <Button
                variant="premium2"
                size="lg"
                className="mt-3 w-full"
                onClick={handleTopup}
                disabled={!isChecked}
              >
                Pay
                <Zap className="ml-2 h-4 w-4 fill-white" />
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};