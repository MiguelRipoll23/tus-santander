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
    <div className="bg-pink-100 dark:bg-rose-900 text-rose-900 dark:text-pink-100 p-4 rounded-2xl m-[0_14px_14px] relative">
      <div className="mb-3 text-base leading-1.4">{getText("donation_message")}</div>
      <div className="flex gap-3">
        <Button className="px-4 py-2 text-base" style={{ backgroundColor: "#be123c" }} onClick={handleTip}>
          {getText("tip")}
        </Button>
        <Button className="px-4 py-2 text-base border-2" style={{ borderColor: "#be123c", color: "#be123c", backgroundColor: "transparent" }} onClick={handleClose}>
          {getText("maybe_later")}
        </Button>
      </div>
    </div>
  );
}

export default DonationBubble;
