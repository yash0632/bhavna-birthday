import { useEffect, useRef } from "react";

const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbw098AleP8camcTnLad7vDHQkfZnnVNHBQIAPT4DC7ZaaUjOac10_k7pKigW6NpdL0omQ/exec";

function parseDevice(): { device: string; browser: string } {
  const ua = navigator.userAgent;

  const device = /Mobi|Android/i.test(ua)
    ? "Mobile"
    : /iPad|Tablet/i.test(ua)
      ? "Tablet"
      : "Desktop";

  let browser = "Other";

  if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";

  return { device, browser };
}

export function useSessionTracking(
  getSectionsReached: () => number
) {
  const startTimeRef = useRef(Date.now());
  const sentRef = useRef(false);

  useEffect(() => {
    const sendSession = () => {
      if (sentRef.current) return;

      sentRef.current = true;

      const { device, browser } = parseDevice();

      const durationSeconds = Math.round(
        (Date.now() - startTimeRef.current) / 1000
      );

      const payload = JSON.stringify({
        eventType: "session",
        timestamp: new Date().toISOString(),
        device,
        browser,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        durationSeconds,
        sectionsReached: getSectionsReached(),
      });

      // IMPORTANT:
      // Use text/plain instead of application/json.
      // This avoids CORS preflight problems with Google Apps Script.
      const blob = new Blob([payload], {
        type: "text/plain;charset=UTF-8",
      });

      if (navigator.sendBeacon) {
        const success = navigator.sendBeacon(WEBHOOK_URL, blob);

        if (!success) {
          // Fallback if browser refuses the beacon
          fetch(WEBHOOK_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "text/plain;charset=UTF-8",
            },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } else {
        fetch(WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=UTF-8",
          },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendSession();
      }
    };

    const handlePageHide = () => {
      sendSession();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [getSectionsReached]);
}