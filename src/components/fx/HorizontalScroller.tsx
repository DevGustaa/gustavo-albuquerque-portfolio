"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface HorizontalScrollerProps {
  children: ReactNode;
  label: string;
  previousLabel: string;
  nextLabel: string;
}

const EDGE_TOLERANCE = 4;
const DRAG_THRESHOLD = 6;
const FRICTION = 0.94;
const MIN_VELOCITY = 0.02;
const FRAME_MS = 16;

export function decayVelocity(velocity: number): number {
  const next = velocity * FRICTION;
  return Math.abs(next) < MIN_VELOCITY ? 0 : next;
}

const arrowStyles =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white/80 text-zinc-700 backdrop-blur transition-all hover:border-brand-500 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500 disabled:pointer-events-none disabled:opacity-30 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:text-accent-300";

interface DragState {
  pointerId: number;
  startX: number;
  startScroll: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  moved: boolean;
}

export function HorizontalScroller({
  children,
  label,
  previousLabel,
  nextLabel,
}: HorizontalScrollerProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [dragging, setDragging] = useState(false);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > EDGE_TOLERANCE);
    setCanNext(track.scrollLeft < maxScroll - EDGE_TOLERANCE);
  }, []);

  const stopMomentum = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const releaseSnap = useCallback(() => {
    trackRef.current?.style.removeProperty("scroll-snap-type");
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateEdges();
    track.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      track.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
      stopMomentum();
    };
  }, [updateEdges, stopMomentum]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    stopMomentum();
    releaseSnap();
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const handlePointerDown = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    stopMomentum();
    const now = performance.now();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: event.currentTarget.scrollLeft,
      lastX: event.clientX,
      lastTime: now,
      velocity: 0,
      moved: false,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLUListElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const track = event.currentTarget;
    const delta = event.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      drag.moved = true;
      setDragging(true);
      track.style.setProperty("scroll-snap-type", "none");
      track.setPointerCapture?.(event.pointerId);
    }
    const now = performance.now();
    const elapsed = now - drag.lastTime;
    if (elapsed > 0) drag.velocity = (event.clientX - drag.lastX) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = now;
    track.scrollLeft = drag.startScroll - delta;
  };

  const endDrag = (event: PointerEvent<HTMLUListElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) return;
    suppressClickRef.current = true;
    setDragging(false);
    const track = event.currentTarget;
    track.releasePointerCapture?.(event.pointerId);

    let velocity = reducedMotion ? 0 : drag.velocity;
    const step = () => {
      velocity = decayVelocity(velocity);
      if (velocity === 0) {
        frameRef.current = null;
        releaseSnap();
        return;
      }
      track.scrollLeft -= velocity * FRAME_MS;
      frameRef.current = requestAnimationFrame(step);
    };
    if (decayVelocity(velocity) === 0) releaseSnap();
    else frameRef.current = requestAnimationFrame(step);
  };

  const handleClickCapture = (event: MouseEvent<HTMLUListElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div>
      <div className="relative">
        <ul
          ref={trackRef}
          aria-label={label}
          data-dragging={dragging ? "true" : undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={handleClickCapture}
          onDragStart={(event) => event.preventDefault()}
          className="-mx-6 flex cursor-grab snap-x snap-proximity gap-6 overflow-x-auto overscroll-x-contain scroll-px-6 px-6 pt-2 pb-6 select-none [scrollbar-width:thin] data-[dragging=true]:cursor-grabbing"
        >
          {children}
        </ul>
        <span
          aria-hidden="true"
          data-edge="start"
          className={`pointer-events-none absolute inset-y-0 -left-6 w-12 bg-gradient-to-r from-white to-transparent transition-opacity duration-300 dark:from-zinc-950 ${canPrev ? "opacity-100" : "opacity-0"}`}
        />
        <span
          aria-hidden="true"
          data-edge="end"
          className={`pointer-events-none absolute inset-y-0 -right-6 w-12 bg-gradient-to-l from-white to-transparent transition-opacity duration-300 dark:from-zinc-950 ${canNext ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <div className="mt-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          disabled={!canPrev}
          aria-label={previousLabel}
          className={arrowStyles}
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          disabled={!canNext}
          aria-label={nextLabel}
          className={arrowStyles}
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
