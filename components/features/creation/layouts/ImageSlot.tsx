"use client";

import { useCallback, useRef, useState } from "react";
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/editor";

type Props = {
  slot: MoodboardSlot;
  onSelect: () => void;
  onChangeTransform: (patch: MoodboardSlotPatch) => void;
  className?: string;
};

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const ZOOM_DRAG_SENSITIVITY = 0.01;

export default function ImageSlot({
  slot,
  onSelect,
  onChangeTransform,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  /* ---------------- DEPLACEMENT ---------------- */

  const panState = useRef<{
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
  } | null>(null);

  const [isPanning, setIsPanning] = useState(false);
  const [panPresentation, setPanPresentation] = useState({
    translateX: 0,
    translateY: 0,
    objectPositionX: 50,
    objectPositionY: 50,
  });

  /* ---------------- ZOOM ---------------- */

  const zoomState = useRef<{
    startY: number;
    startScale: number;
  } | null>(null);

  const [isZooming, setIsZooming] = useState(false);

  /* ---------------- LIMITES DE DEPLACEMENT ---------------- */

  const getPanBounds = useCallback((scale: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const image = imageRef.current;

    if (!rect) {
      return {
        imageOffsetX: 0,
        imageOffsetY: 0,
        maxOffsetX: 0,
        maxOffsetY: 0,
        overflowX: 0,
        overflowY: 0,
      };
    }

    const coverScale =
      image?.naturalWidth && image.naturalHeight
        ? Math.max(
            rect.width / image.naturalWidth,
            rect.height / image.naturalHeight,
          )
        : 1;
    const overflowX = image?.naturalWidth
      ? Math.max(0, (image.naturalWidth * coverScale - rect.width) / 2)
      : 0;
    const overflowY = image?.naturalHeight
      ? Math.max(0, (image.naturalHeight * coverScale - rect.height) / 2)
      : 0;
    const imageOffsetX = overflowX * scale;
    const imageOffsetY = overflowY * scale;

    return {
      imageOffsetX,
      imageOffsetY,
      maxOffsetX: imageOffsetX + (rect.width * (scale - 1)) / 2,
      maxOffsetY: imageOffsetY + (rect.height * (scale - 1)) / 2,
      overflowX,
      overflowY,
    };
  }, []);

  const clampOffset = useCallback(
    (offsetX: number, offsetY: number, scale: number) => {
      const { maxOffsetX, maxOffsetY } = getPanBounds(scale);

      return {
        offsetX: Math.min(maxOffsetX, Math.max(-maxOffsetX, offsetX)),
        offsetY: Math.min(maxOffsetY, Math.max(-maxOffsetY, offsetY)),
      };
    },
    [getPanBounds],
  );

  const getPanPresentation = (
    offsetX: number,
    offsetY: number,
    scale: number,
  ) => {
    const bounds = getPanBounds(scale);
    const imageOffsetX = Math.max(
      -bounds.imageOffsetX,
      Math.min(bounds.imageOffsetX, offsetX),
    );
    const imageOffsetY = Math.max(
      -bounds.imageOffsetY,
      Math.min(bounds.imageOffsetY, offsetY),
    );

    return {
      translateX: offsetX - imageOffsetX,
      translateY: offsetY - imageOffsetY,
      objectPositionX: bounds.overflowX
        ? 50 - (imageOffsetX / scale / bounds.overflowX) * 50
        : 50,
      objectPositionY: bounds.overflowY
        ? 50 - (imageOffsetY / scale / bounds.overflowY) * 50
        : 50,
    };
  };

  /* ---------------- DOUBLE CLICK ---------------- */

  const handleDoubleClick = () => {
    if (!slot) return;

    setPanPresentation({
      translateX: 0,
      translateY: 0,
      objectPositionX: 50,
      objectPositionY: 50,
    });
    onChangeTransform({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    });
  };

  const handlePanPointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!slot) return;

    e.preventDefault();
    e.stopPropagation();

    e.currentTarget.setPointerCapture(e.pointerId);

    panState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: slot.offsetX,
      startOffsetY: slot.offsetY,
    };

    setIsPanning(true);
  };

  const handlePanPointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!slot || !panState.current) return;

    const deltaX = e.clientX - panState.current.startX;

    const deltaY = e.clientY - panState.current.startY;

    const { offsetX, offsetY } = clampOffset(
      panState.current.startOffsetX + deltaX,
      panState.current.startOffsetY + deltaY,
      slot.scale,
    );

    setPanPresentation(getPanPresentation(offsetX, offsetY, slot.scale));
    onChangeTransform({
      offsetX,
      offsetY,
    });
  };

  const handlePanPointerUp = () => {
    panState.current = null;
    setIsPanning(false);
  };

  const handlePanPointerCancel = () => {
    panState.current = null;
    setIsPanning(false);
  };

  const handleZoomPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!slot) return;

    e.preventDefault();
    e.stopPropagation();

    e.currentTarget.setPointerCapture(e.pointerId);

    zoomState.current = {
      startY: e.clientY,
      startScale: slot.scale,
    };

    setIsZooming(true);
  };

  const handleZoomPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!slot || !zoomState.current) return;

    const deltaY = zoomState.current.startY - e.clientY;

    const nextScale = Math.min(
      MAX_SCALE,
      Math.max(
        MIN_SCALE,
        zoomState.current.startScale + deltaY * ZOOM_DRAG_SENSITIVITY,
      ),
    );

    const { offsetX, offsetY } = clampOffset(
      slot.offsetX,
      slot.offsetY,
      nextScale,
    );

    setPanPresentation(getPanPresentation(offsetX, offsetY, nextScale));
    onChangeTransform({
      scale: nextScale,
      offsetX,
      offsetY,
    });
  };

  const handleZoomPointerUp = () => {
    zoomState.current = null;
    setIsZooming(false);
  };

  const handleZoomPointerCancel = () => {
    zoomState.current = null;
    setIsZooming(false);
  };

  return (
    <div
      ref={containerRef}
      className={`
        group
        relative
        w-full
        h-full
        min-w-0
        min-h-0
        overflow-hidden
        ${className}
      `}
    >
      {slot ? (
        <>
          {/* IMAGE */}
          <img
            ref={imageRef}
            src={slot.url}
            onLoad={() =>
              setPanPresentation(
                getPanPresentation(slot.offsetX, slot.offsetY, slot.scale),
              )
            }
            onDoubleClick={handleDoubleClick}
            onPointerDown={handlePanPointerDown}
            onPointerMove={handlePanPointerMove}
            onPointerUp={handlePanPointerUp}
            onPointerCancel={handlePanPointerCancel}
            draggable={false}
            style={{
              transform: `
                translate(${panPresentation.translateX}px, ${panPresentation.translateY}px)
                scale(${slot.scale})
              `,
              objectPosition: `${panPresentation.objectPositionX}% ${panPresentation.objectPositionY}%`,
              touchAction: "none",
            }}
            className={`
              absolute
              inset-0
              w-full
              h-full
              object-cover
              select-none
              ${isPanning ? "cursor-grabbing" : "cursor-grab"}
            `}
            alt=""
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect();
            }}
            className="
              export-hidden
              absolute
              bottom-2
              right-2
              z-20
              sm:w-4
              sm:h-4
              md:w-[17px]
              md:h-[17px]
              rounded-full
              bg-black/60
              text-white
              sm:text-[12px]
              md:text-[13px]
              flex
              items-center
              justify-center
              opacity-100
              transition-opacity
              touch-manipulation
              select-none
            "
            aria-label="Changer l'image"
          >
            ✎
          </button>
          <button
            type="button"
            onPointerDown={handleZoomPointerDown}
            onPointerMove={handleZoomPointerMove}
            onPointerUp={handleZoomPointerUp}
            onPointerCancel={handleZoomPointerCancel}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`
              export-hidden
              absolute
              top-2
              right-2
              z-20
              sm:w-4
              sm:h-4
              md:w-[17px]
              md:h-[17px]

              rounded-full
              bg-black/60
              text-white
              sm:text-[12px]
              md:text-[13px]

              flex
              items-center
              justify-center

              touch-none
              select-none

              transition-opacity

              ${
                isZooming
                  ? "cursor-ns-resize opacity-100"
                  : "cursor-ns-resize opacity-100 sm:opacity-70 sm:group-hover:opacity-100"
              }
            `}
            aria-label="Zoomer l'image"
          >
            🔍
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-black/30
            text-xs
            sm:text-[14px]
            md:text-[15px]
            lg:text-[16px]
            xl:text-[20px]
          "
        >
          +
        </button>
      )}
    </div>
  );
}
