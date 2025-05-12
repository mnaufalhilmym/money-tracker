"use client";

import useWindowInnerSize from "@/hook/useWindowInnerSize";
import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
}

const padding = 50;

export default function BottomSheet(props: Readonly<Props>) {
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(props.isOpen);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const maxHeight = useWindowInnerSize().height * 0.9;
  const [minHeight, setMinHeight] = useState(maxHeight / 2);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overscrollBehaviorY = "contain";
      setIsShow(true);
    } else {
      document.body.style.overscrollBehaviorY = "";
    }

    return () => {
      document.body.style.overscrollBehaviorY = "";
    };
  }, [props.isOpen]);

  // minimum visible height when closed
  useEffect(() => {
    if (translateY === 0 && maxHeight > 0) {
      const height =
        maxHeight -
        (padding + (sheetContentRef.current?.getBoundingClientRect().top ?? 0));
      setMinHeight(height / 2);
    }
  }, [
    translateY,
    maxHeight,
    sheetContentRef.current?.getBoundingClientRect().top,
  ]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (sheetContentRef.current) {
        setContentHeight(sheetContentRef.current.offsetHeight);
      }
    });

    if (sheetContentRef.current) {
      resizeObserver.observe(sheetContentRef.current);
    }

    return () => {
      if (sheetContentRef.current) {
        resizeObserver.unobserve(sheetContentRef.current);
      }
    };
  }, []);

  // Mouse and touch events
  function startDrag(e: React.TouchEvent | React.MouseEvent) {
    setIsDragging(true);
    setStartY("touches" in e ? e.touches[0].clientY : e.clientY);
  }

  function onDrag(e: TouchEvent | MouseEvent) {
    if (!isDragging) return;

    const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaY = currentY - startY;
    const translateY = maxHeight - (contentHeight + padding) + deltaY;
    if (translateY > 0) {
      setTranslateY(deltaY);
    }
  }

  function stopDrag() {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateY > minHeight) {
      props.close();
    }
    setTranslateY(0);
  }

  function onTransitionEnd() {
    if (!props.isOpen) {
      setIsShow(false);
    }
  }

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

  return (
    <div
      onClick={props.close}
      className={`fixed left-0 right-0 bottom-0 top-0 max-w-md mx-auto transition-colors ${
        props.isOpen ? "bg-black/60" : "bg-black/0"
      } ${isShow ? "visible" : "invisible"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={onTransitionEnd}
        className="absolute bottom-0 w-full px-4 pt-2 pb-4 bg-zinc-800 rounded-t-2xl flex flex-col"
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
        <button
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          className="block w-12 mx-auto mb-2 py-2 cursor-grab"
        >
          <div className="w-full h-1 bg-white rounded-full" />
        </button>
        <div ref={sheetContentRef} className="min-h-0 flex flex-col">
          {props.children}
        </div>
      </div>
    </div>
  );
}
