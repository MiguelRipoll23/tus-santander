import { useState } from "react";
import { useI18n } from "../../contexts/I18nContext.jsx";
import Button from "../Button.jsx";
import styles from "./DonationBubble.module.css";

const DonationBubble = ({ favoritesCount }) => {
  const { getText } = useI18n();
  const [isHidden, setIsHidden] = useState(() => {
    const hiddenUntil = localStorage.getItem("donation_bubble_hidden_until");
    return hiddenUntil && Date.now() < parseInt(hiddenUntil, 10);
  });

  const isVisible = !isHidden && favoritesCount > 1;

  const handleClose = () => {
    const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      "donation_bubble_hidden_until",
      Date.now() + threeMonths
    );
    setIsHidden(true);
  };

  const handleTip = () => {
    const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      "donation_bubble_hidden_until",
      Date.now() + sixMonths
    );
    window.open("https://buymeacoffee.com/miguelripoll23", "_blank");
    setIsHidden(true);
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
