"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  children?: React.ReactNode;
  className?: string;
  fallbackHref?: string;
};

export default function BackButton({
  children = "Back",
  className,
  fallbackHref = "/",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button className={className} type="button" onClick={handleBack}>
      {children}
    </button>
  );
}
