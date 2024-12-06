import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export const Image_text = ({ heading, paragraph, image, classname }) => {
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeline = gsap.timeline();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);

    if (isVisible) {
      timeline
        .fromTo(
          headingRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
        )
        .fromTo(
          paragraphRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.5"
        );
    }

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <div
      ref={sectionRef}
      className={`flex flex-col-reverse justify-center items-center gap-[55px] ${classname}`}
    >
      <div className="sm:w-full m:w-1/2 l:w-1/2 xl:w-1/2 my-5 flex items-center justify-center">
        <img className="w-full h-full" src={image} />
      </div>
      <div className="sm:w-full m:w-1/2 l:w-1/2 xl:w-1/2 flex flex-col gap-3">
        <h2
          ref={headingRef}
          className="text-pinkTextOne text-[2.5em] font-bold opacity-0"
        >
          {heading}
        </h2>
        <p
          ref={paragraphRef}
          className="text-base text-[#222] font-[500] opacity-0"
          dangerouslySetInnerHTML={{ __html: paragraph }}
        ></p>
      </div>
    </div>
  );
};

export default Image_text;
