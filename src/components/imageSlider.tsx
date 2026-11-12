import React, { useRef, useEffect, useState } from "react";
import resumeImg from "../assets/img/resume.jpg";
import resumeImg1 from "../assets/img/resume1.jpg";

const BeforeAfterSlider = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (x: number) => {
    if (!wrapperRef.current || !afterRef.current || !scrollerRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(x - rect.left, rect.width));

    afterRef.current.style.width = `${offsetX}px`;
    scrollerRef.current.style.left = `${offsetX - 25}px`; // Half of scroller width
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.pageX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].pageX);
    };

    const stopDragging = () => {
      setIsDragging(false);
      scrollerRef.current?.classList.remove("opacity-100", "pointer-events-none");
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("mouseleave", stopDragging);

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", stopDragging);
    document.addEventListener("touchcancel", stopDragging);

    handleMove(150); // initial position

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("mouseleave", stopDragging);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", stopDragging);
      document.removeEventListener("touchcancel", stopDragging);
    };
  }, [isDragging]);

  return (
    <div className="relative w-[470px] h-[600px] mx-auto shadow-lg overflow-hidden rounded-lg" ref={wrapperRef}>
      <div className="absolute inset-0">
        <img
          src={resumeImg1}
          alt="Before"
          className="w-fit h-fit object-cover pointer-events-none rounded-lg"
          draggable={false}
        />
      </div>
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        ref={afterRef}
        style={{ width: "150px" }}
      >
        <img
          src={resumeImg}
          alt="After"
          className="w-fit h-fit object-cover rounded-lg"
          draggable={false}
        />
      </div>
      <div
        className="absolute top-1/2 transform -translate-y-1/2 w-[50px] h-[50px] bg-white border-4 border-white rounded-full flex items-center justify-center opacity-90 cursor-pointer z-10"
        ref={scrollerRef}
        style={{ left: "125px" }}
        onMouseDown={() => {
          setIsDragging(true);
          scrollerRef.current?.classList.add("opacity-100", "pointer-events-none");
        }}
        onTouchStart={() => {
          setIsDragging(true);
          scrollerRef.current?.classList.add("opacity-100", "pointer-events-none");
        }}
      >
        <svg
          className="w-full h-full p-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
        >
          <polygon points="0 50 37 68 37 32 0 50" fill="#000" />
          <polygon points="100 50 64 32 64 68 100 50" fill="#000" />
        </svg>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
