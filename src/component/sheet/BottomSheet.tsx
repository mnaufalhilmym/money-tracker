"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export default function BottomSheet(props: Readonly<Props>) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(props.isOpen);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [maxHeight, setMaxHeight] = useState(150);
  const [minHeight, setMinHeight] = useState(maxHeight / 2);

  const padding = 56;

  useEffect(() => {
    if (props.isOpen) {
      setIsShow(true);
    }
  }, [props.isOpen]);

  // full opened height
  useEffect(() => {
    setMaxHeight(window.innerHeight);
  }, []);

  // minimum visible height when closed
  useEffect(() => {
    if (translateY === 0) {
      const height =
        maxHeight - (sheetRef.current?.getBoundingClientRect().top ?? 0);
      setMinHeight(height / 2);
    }
  }, [translateY, maxHeight, sheetRef.current?.getBoundingClientRect().top]);

  const contentHeight = useMemo(
    () => sheetContentRef.current?.offsetHeight ?? 0,
    [sheetContentRef.current?.offsetHeight]
  );

  // Mouse and touch events
  const startDrag = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    setStartY("touches" in e ? e.touches[0].clientY : e.clientY);
  };

  const onDrag = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;

    const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaY = currentY - startY;
    setTranslateY(deltaY);
  };

  const stopDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateY > minHeight) {
      props.setIsOpen(false);
    }
    setTranslateY(0);
  };

  // Add/remove global listeners
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => onDrag(e);
    const handleMouseMove = (e: MouseEvent) => onDrag(e);
    const handleEnd = () => stopDrag();

    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchend", handleEnd);
      document.addEventListener("mouseup", handleEnd);
    } else {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchend", handleEnd);
      document.removeEventListener("mouseup", handleEnd);
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchend", handleEnd);
      document.removeEventListener("mouseup", handleEnd);
    };
  }, [isDragging, translateY]);

  function onTransitionEnd() {
    if (!props.isOpen) {
      setIsShow(false);
    }
  }

  return (
    <div
      aria-hidden="true"
      onClick={() => props.setIsOpen(false)}
      className={`fixed left-0 right-0 bottom-0 top-0 max-w-md mx-auto transition-colors ${
        props.isOpen ? "bg-black/60" : "bg-black/0"
      } ${isShow ? "visible" : "invisible"}`}
    >
      <div
        ref={sheetRef}
        aria-hidden="true"
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={onTransitionEnd}
        className="absolute bottom-0 w-full p-4 bg-zinc-800 rounded-t-2xl"
        style={{
          transform: `translateY(${
            props.isOpen
              ? maxHeight - (contentHeight + padding) + translateY
              : maxHeight
          }px)`,
          height: maxHeight,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
      >
        <div
          aria-hidden="true"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          className="w-12 h-1 mx-auto mb-4 bg-white rounded-full cursor-grab"
        />
        <div ref={sheetContentRef}>{props.children}</div>
      </div>
    </div>
  );
}
