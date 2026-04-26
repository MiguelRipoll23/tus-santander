import React from "react";
import { useState } from "react";
import { useI18n } from "../../contexts/I18nContext";
import {
  trackDonationTipButton,
  trackDonationCloseButton,
} from "../../utils/TelemetryUtils";
import Button from "../Button";

const LOCAL_STORAGE_KEY = "donation_bubble_hidden_until";
const DONATION_URL = "https://buymeacoffee.com/miguelripoll23";
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const THIRTY_DAYS_IN_MILLISECONDS = 30 * DAY_IN_MILLISECONDS;
const SIX_MONTHS_IN_MILLISECONDS = 180 * DAY_IN_MILLISECONDS;

interface DonationBubbleProps {
  favoritesCount: number;
}

function DonationBubble({ favoritesCount }: DonationBubbleProps): React.JSX.Element | null {
  const { getText } = useI18n();
  const [isHidden, setIsHidden] = useState<boolean>(() => {
    const hiddenUntil = localStorage.getItem(LOCAL_STORAGE_KEY);
    return hiddenUntil !== null && Date.now() < parseInt(hiddenUntil, 10);
  });

  const isVisible = !isHidden && favoritesCount > 1;

  const hideBubble = (duration: number): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, String(Date.now() + duration));
    setIsHidden(true);
  };

  const handleClose = (): void => {
    trackDonationCloseButton();
    hideBubble(THIRTY_DAYS_IN_MILLISECONDS);
  };

  const handleTip = (): void => {
    trackDonationTipButton();
    window.open(DONATION_URL, "_blank", "noopener,noreferrer");
    hideBubble(SIX_MONTHS_IN_MILLISECONDS);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#ffe4e6] text-[#881337] p-4 rounded-2xl mx-3.5 mb-3.5 relative dark:bg-[#3f0e18] dark:text-[#ffe4e6]">
      <div className="mb-3 text-base leading-[1.4]">{getText("donation_message")}</div>
      <div className="flex gap-3">
        <Button
          className="bg-[#be123c] dark:bg-[#e11d48] py-2 px-4 text-base"
          onClick={handleTip}
        >
          {getText("tip")}
        </Button>
        <Button
          className="bg-transparent dark:bg-transparent text-[#be123c] dark:text-[#e11d48] border-2 border-[#be123c] dark:border-[#e11d48] py-2 px-4 text-base"
          onClick={handleClose}
        >
          {getText("maybe_later")}
        </Button>
      </div>
    </div>
  );
}

export default DonationBubble;
