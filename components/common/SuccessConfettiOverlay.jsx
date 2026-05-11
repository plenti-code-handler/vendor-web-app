"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useRef, useState } from "react";

const DEFAULT_SRC = "/lottie/Confetti.lottie";

/** Full-screen dotLottie overlay, `pointer-events-none`, plays once; call `onComplete` to hide. */
export default function SuccessConfettiOverlay({
  show,
  onComplete,
  src = DEFAULT_SRC,
  className = "",
}) {
  const onCompleteRef = useRef(onComplete);
  const [dotLottie, setDotLottie] = useState(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!show) setDotLottie(null);
  }, [show]);

  useEffect(() => {
    if (!dotLottie) return undefined;
    const done = () => onCompleteRef.current?.();
    dotLottie.addEventListener("complete", done);
    dotLottie.addEventListener("loadError", done);
    return () => {
      dotLottie.removeEventListener("complete", done);
      dotLottie.removeEventListener("loadError", done);
    };
  }, [dotLottie]);

  if (!show) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[100] flex items-center justify-center ${className}`}
      aria-hidden
    >
      <div className="h-full w-full max-h-screen max-w-screen">
        <DotLottieReact
          src={src}
          loop={false}
          autoplay
          dotLottieRefCallback={setDotLottie}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
