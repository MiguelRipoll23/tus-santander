import React from "react";
import { useState } from "react";
import { useI18n } from "../../contexts/I18nContext";
import {
  trackDonationTipButton,
  trackDonationCloseButton,
} from "../../utils/TelemetryUtils";
import Button from "../Button";
import styles from "./DonationBubble.module.css";

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
    <div className={styles.DonationBubble}>
      <div className={styles.DonationText}>{getText("donation_message")}</div>
      <div className={styles.ButtonContainer}>
        <Button className={styles.DonationButton} onClick={handleTip}>
          {getText("tip")}
        </Button>
        <Button className={styles.MaybeLaterButton} onClick={handleClose}>
          {getText("maybe_later")}
        </Button>
      </div>
    </div>
  );
}

export default DonationBubble;
