import { useState } from "react";
import { useI18n } from "../../contexts/I18nContext.jsx";
import {
  trackDonationTipButton,
  trackDonationCloseButton,
} from "../../utils/TelemetryUtils.jsx";
import Button from "../Button.jsx";
import styles from "./DonationBubble.module.css";

const LOCAL_STORAGE_KEY = "donation_bubble_hidden_until";
const DONATION_URL = "https://buymeacoffee.com/miguelripoll23";
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const THREE_MONTHS_IN_MILLISECONDS = 90 * DAY_IN_MILLISECONDS;
const SIX_MONTHS_IN_MILLISECONDS = 180 * DAY_IN_MILLISECONDS;

const DonationBubble = ({ favoritesCount }) => {
  const { getText } = useI18n();
  const [isHidden, setIsHidden] = useState(() => {
    const hiddenUntil = localStorage.getItem(LOCAL_STORAGE_KEY);
    return hiddenUntil && Date.now() < parseInt(hiddenUntil, 10);
  });

  const isVisible = !isHidden && favoritesCount > 1;

  const hideBubble = (duration) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, Date.now() + duration);
    setIsHidden(true);
  };

  const handleClose = () => {
    trackDonationCloseButton();
    hideBubble(THREE_MONTHS_IN_MILLISECONDS);
  };

  const handleTip = () => {
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
};

export default DonationBubble;
