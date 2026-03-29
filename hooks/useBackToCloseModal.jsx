import { useEffect } from "react";

/**
 * Hook to close a modal/drawer when the browser back button is pressed.
 * @param {boolean} isOpen - The current open state of the modal.
 * @param {function} onClose - The function to call to close the modal.
 */
export const useBackToClose = (isOpen, onClose) => {
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ modalOpen: true }, "");

    const handlePopState = (event) => {
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);
};