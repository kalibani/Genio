"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { usePricing } from "@/hooks/use-pricing";
import { useUser } from "@/hooks/use-user";

// import { trpc } from "@/app/_trpc/client";

interface Ibutton {
  plan?: string;
  price?: number;
}

const UpgradeButton = ({ plan, price }: Ibutton) => {
  // const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
  //   onSuccess: ({ url }) => {
  //     window.location.href = url ?? "/pricing";
  //   },
  // });

  const { onOpen } = useProModal();
  const { setPrice } = usePricing();
  const { setSubscriptionType } = useUser();

  const handleUpgrade = () => {
    setPrice(price!);
    setSubscriptionType(plan!);
    onOpen();
  };

  return (
    <Button onClick={handleUpgrade} className="w-full">
      Upgrade now
      <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};

export default UpgradeButton;
