import Image from "next/image";
import type { CSSProperties, KeyboardEvent, RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PassArrow, SceneStamp, SlideFocus, SlideScene } from "./types";

type ScenePiece = {
  alt: string;
  className: string;
  drag?: DragConfig;
  src: string;
  x: number;
  y: number;
};

type DragConfig = {
  label: string;
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  onChange: (position: ScenePosition) => void;
  position: ScenePosition;
};

type ScenePosition = {
  x: number;
  y: number;
};

type ScenePositions = {
  attackerY: number;
  ballY: number;
  secondLastDefenderY: number;
  wideRunnerY: number;
};

type ScenePositionHandlers = Partial<
  Record<
    "attacker" | "ball" | "secondLastDefender" | "wideRunner",
    (position: ScenePosition) => void
  >
>;

const focusedPlayerClassName = "player-highlight ring-4 ring-white/80";
const supportRunnerAlt = "Support runner in a red jersey";
const stampClassNames = {
  legal: "border-emerald-300 text-emerald-200",
  off: "border-red-300 text-red-200",
  on: "border-emerald-300 text-emerald-200",
} as const;

export function FieldGraphic({
  isInteractive = false,
  positionHandlers = {},
  scene,
  verdictIsOffside,
}: {
  isInteractive?: boolean;
  positionHandlers?: ScenePositionHandlers;
  scene: SlideScene;
  verdictIsOffside: boolean;
}) {
  const fieldRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative min-h-[220px] flex-1 overflow-hidden rounded-lg border border-white/35 bg-[#147a52] transition-[border-color,box-shadow] duration-300 ease-out sm:min-h-[300px] lg:min-h-[360px]"
      ref={fieldRef}
    >
      <Image
        alt="Generated top-down football pitch with goals"
        className="absolute inset-0 h-full w-full object-cover object-[72%_center]"
        fill
        priority
        src="/generated/football-pitch.png"
        unoptimized
      />
      {scene.passArrow ? <PassArrowGraphic arrow={scene.passArrow} /> : null}
      <OffsideLine
        label={scene.lineLabel ?? "Offside line"}
        secondLastDefenderX={scene.secondLastDefenderX}
      />
      <DecisionFrame focus={scene.focus} verdictIsOffside={verdictIsOffside} />
      {scene.stamp ? <SceneStampBadge stamp={scene.stamp} /> : null}
      {getScenePieces({
        handlers: positionHandlers,
        isInteractive,
        scene,
      }).map((piece) => (
        <SceneImage fieldRef={fieldRef} key={piece.alt} piece={piece} />
      ))}
    </div>
  );
}

function getScenePieces({
  handlers,
  isInteractive,
  scene,
}: {
  handlers: ScenePositionHandlers;
  isInteractive: boolean;
  scene: SlideScene;
}) {
  const positions = getScenePositions(scene);
  const pieces: ScenePiece[] = [
    getPassingTeammatePiece({ handlers, isInteractive, positions, scene }),
    getHighlightedRunnerPiece({ handlers, isInteractive, positions, scene }),
    getSupportRunnerPiece({ handlers, isInteractive, positions, scene }),
    getLastDefenderPiece({ handlers, isInteractive, positions, scene }),
    getGoalkeeperPiece(),
    getBallPiece({ positions, scene }),
  ];

  return pieces.filter(
    (piece) => !isInteractive || piece.alt !== supportRunnerAlt,
  );
}

function getScenePositions(scene: SlideScene): ScenePositions {
  return {
    attackerY: withDefault(scene.attackerY, 36),
    ballY: withDefault(scene.ballY, 56),
    secondLastDefenderY: withDefault(scene.secondLastDefenderY, 55),
    wideRunnerY: withDefault(scene.wideRunnerY, 70),
  };
}

function withDefault(value: number | undefined, fallback: number) {
  return value === undefined ? fallback : value;
}

function getPassingTeammatePiece({
  handlers,
  isInteractive,
  positions,
  scene,
}: {
  handlers: ScenePositionHandlers;
  isInteractive: boolean;
  positions: ScenePositions;
  scene: SlideScene;
}): ScenePiece {
  return {
    alt: "Passing teammate in a red jersey",
    className: getFocusClassName(scene.focus, "passer"),
    drag: createDragConfig({
      isInteractive,
      label: "Passing teammate with the ball",
      maxX: 78,
      maxY: 76,
      minX: 42,
      minY: 24,
      onChange: handlers.ball,
      position: { x: scene.ballX, y: positions.ballY },
    }),
    src: "/generated/player-red.png",
    x: scene.ballX,
    y: positions.ballY,
  };
}

function getHighlightedRunnerPiece({
  handlers,
  isInteractive,
  positions,
  scene,
}: {
  handlers: ScenePositionHandlers;
  isInteractive: boolean;
  positions: ScenePositions;
  scene: SlideScene;
}): ScenePiece {
  return {
    alt: "Highlighted runner in a red jersey",
    className: `${getFocusClassName(
      scene.focus,
      "runner",
    )} drop-shadow-[0_0_14px_rgba(245,158,11,0.95)]`,
    drag: createDragConfig({
      isInteractive,
      label: "Highlighted attacking runner",
      maxX: 90,
      maxY: 76,
      minX: 50,
      minY: 20,
      onChange: handlers.attacker,
      position: { x: scene.attackerX, y: positions.attackerY },
    }),
    src: "/generated/player-red.png",
    x: scene.attackerX,
    y: positions.attackerY,
  };
}

function getSupportRunnerPiece({
  handlers,
  isInteractive,
  positions,
  scene,
}: {
  handlers: ScenePositionHandlers;
  isInteractive: boolean;
  positions: ScenePositions;
  scene: SlideScene;
}): ScenePiece {
  return {
    alt: supportRunnerAlt,
    className: `${getFocusClassName(scene.focus, "wideRunner")} opacity-90`,
    drag: createDragConfig({
      isInteractive,
      label: "Support runner",
      maxX: 86,
      maxY: 82,
      minX: 42,
      minY: 24,
      onChange: handlers.wideRunner,
      position: { x: scene.wideRunnerX, y: positions.wideRunnerY },
    }),
    src: "/generated/player-red.png",
    x: scene.wideRunnerX,
    y: positions.wideRunnerY,
  };
}

function getLastDefenderPiece({
  handlers,
  isInteractive,
  positions,
  scene,
}: {
  handlers: ScenePositionHandlers;
  isInteractive: boolean;
  positions: ScenePositions;
  scene: SlideScene;
}): ScenePiece {
  return {
    alt: "Second-last defender in a blue jersey",
    className: getFocusClassName(scene.focus, "line"),
    drag: createDragConfig({
      isInteractive,
      label: "Second-last defender carrying the offside line",
      maxX: 90,
      maxY: 76,
      minX: 50,
      minY: 24,
      onChange: handlers.secondLastDefender,
      position: {
        x: scene.secondLastDefenderX,
        y: positions.secondLastDefenderY,
      },
    }),
    src: "/generated/player-blue.png",
    x: scene.secondLastDefenderX,
    y: positions.secondLastDefenderY,
  };
}

function getGoalkeeperPiece(): ScenePiece {
  return {
    alt: "Goalkeeper in a yellow jersey",
    className: "",
    src: "/generated/player-yellow.png",
    x: 91,
    y: 49,
  };
}

function getBallPiece({
  positions,
  scene,
}: {
  positions: ScenePositions;
  scene: SlideScene;
}): ScenePiece {
  return {
    alt: "Football at the passing teammate's feet",
    className: "",
    src: "/generated/ball.png",
    x: scene.ballX + 2,
    y: positions.ballY + 7,
  };
}

function getFocusClassName(focus: SlideFocus, target: SlideFocus) {
  return focus === target ? focusedPlayerClassName : "";
}

function createDragConfig({
  isInteractive,
  label,
  maxX,
  maxY,
  minX,
  minY,
  onChange,
  position,
}: {
  isInteractive: boolean;
  label: string;
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  onChange?: (position: ScenePosition) => void;
  position: ScenePosition;
}) {
  if (!isInteractive || !onChange) {
    return undefined;
  }

  return {
    label,
    maxX,
    maxY,
    minX,
    minY,
    onChange,
    position,
  };
}

function OffsideLine({
  label,
  secondLastDefenderX,
}: {
  label: string;
  secondLastDefenderX: number;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-y-0 z-10 w-3 -translate-x-1/2"
        style={{ left: `${secondLastDefenderX}%` }}
      >
        <span className="absolute inset-y-0 left-1/2 w-[7px] -translate-x-1/2 rounded-full bg-black/20 blur-[1px]" />
        <span className="absolute inset-y-0 left-1/2 w-[5px] -translate-x-1/2 rounded-full bg-[#f5a623] shadow-[0_0_16px_rgba(245,166,35,0.8)]" />
      </div>
      <div
        className="absolute top-2 z-30 -translate-x-1/2 rounded-sm border border-[#f5a623] bg-black/80 px-2 py-1 font-black text-[#f5a623] text-[10px] uppercase tracking-[0.08em] shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
        style={{ left: `${secondLastDefenderX}%` }}
      >
        {label}
      </div>
    </>
  );
}

function PassArrowGraphic({ arrow }: { arrow: PassArrow }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <marker
          id="pass-arrow"
          markerHeight="7"
          markerWidth="7"
          orient="auto"
          refX="6"
          refY="3.5"
        >
          <path d="M0 0 L7 3.5 L0 7 Z" fill="rgba(245,242,233,.88)" />
        </marker>
      </defs>
      <line
        markerEnd="url(#pass-arrow)"
        stroke="rgba(245,242,233,.88)"
        strokeDasharray="1 2.4"
        strokeLinecap="round"
        strokeWidth="0.7"
        x1={arrow.x1}
        x2={arrow.x2}
        y1={arrow.y1}
        y2={arrow.y2}
      />
    </svg>
  );
}

function SceneStampBadge({ stamp }: { stamp: SceneStamp }) {
  return (
    <div
      className={`absolute z-20 rounded-md border-2 bg-black/60 px-2.5 py-1 font-black text-[10px] uppercase tracking-[0.08em] shadow-lg backdrop-blur-sm ${stampClassNames[stamp.kind]}`}
      style={{ left: `${stamp.x}%`, top: `${stamp.y}%` }}
    >
      {stamp.text}
    </div>
  );
}

function DecisionFrame({
  focus,
  verdictIsOffside,
}: {
  focus: SlideFocus;
  verdictIsOffside: boolean;
}) {
  const borderClassName =
    focus !== "interactive"
      ? "border-transparent shadow-none"
      : verdictIsOffside
        ? "border-red-400 shadow-[0_0_18px_rgba(248,113,113,0.35)]"
        : "border-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.35)]";

  return (
    <div
      className={`absolute inset-3 rounded-md border-2 transition-[border-color,box-shadow] duration-300 ease-out ${borderClassName}`}
    />
  );
}

function SceneImage({
  fieldRef,
  piece,
}: {
  fieldRef: RefObject<HTMLDivElement | null>;
  piece: ScenePiece;
}) {
  if (!piece.drag) {
    return <StaticSceneImage piece={piece} />;
  }

  return (
    <DraggableSceneImage drag={piece.drag} fieldRef={fieldRef} piece={piece} />
  );
}

function StaticSceneImage({ piece }: { piece: ScenePiece }) {
  const { imageContent, pieceStyle } = getSceneImagePresentation(piece);

  return (
    <div
      className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 select-none transition-[left,top,transform,filter,opacity] duration-300 ease-out hover:scale-105 active:scale-95 ${piece.className}`}
      style={pieceStyle}
    >
      {imageContent}
    </div>
  );
}

function DraggableSceneImage({
  drag,
  fieldRef,
  piece,
}: {
  drag: DragConfig;
  fieldRef: RefObject<HTMLDivElement | null>;
  piece: ScenePiece;
}) {
  const { imageContent, pieceStyle, visualStyle } =
    getSceneImagePresentation(piece);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<number | null>(null);
  const pendingPositionRef = useRef<ScenePosition>(drag.position);
  const [isDragging, setIsDragging] = useState(false);
  const dragStyle: CSSProperties = {
    left: pieceStyle.left,
    top: pieceStyle.top,
    height: "clamp(76px, 15vw, 132px)",
    width: "clamp(76px, 15vw, 132px)",
  };
  const updateDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!fieldRef.current) {
        return;
      }

      const rect = fieldRef.current.getBoundingClientRect();
      const nextX = Math.round(((clientX - rect.left) / rect.width) * 100);
      const nextY = Math.round(((clientY - rect.top) / rect.height) * 100);
      const clampedPosition = {
        x: Math.max(drag.minX, Math.min(drag.maxX, nextX)),
        y: Math.max(drag.minY, Math.min(drag.maxY, nextY)),
      };
      pendingPositionRef.current = clampedPosition;

      if (buttonRef.current) {
        buttonRef.current.dataset.x = String(clampedPosition.x);
        buttonRef.current.dataset.y = String(clampedPosition.y);
        buttonRef.current.style.left = `${clampedPosition.x}%`;
        buttonRef.current.style.top = `${clampedPosition.y}%`;
      }

      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        drag.onChange(pendingPositionRef.current);
      });
    },
    [drag, fieldRef],
  );

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleMove = (event: MouseEvent | PointerEvent) => {
      event.preventDefault();
      updateDrag(event.clientX, event.clientY);
    };
    const handleRelease = () => setIsDragging(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleRelease);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleRelease);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleRelease);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleRelease);
    };
  }, [isDragging, updateDrag]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  return (
    <button
      aria-label={drag.label}
      aria-roledescription="draggable player"
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-grab select-none touch-none active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#facc15]"
      data-x={drag.position.x}
      data-y={drag.position.y}
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      onKeyDown={(event) => handleDragKeyDown(event, drag)}
      onMouseDown={(event) => {
        event.preventDefault();
        setIsDragging(true);
        updateDrag(event.clientX, event.clientY);
      }}
      onPointerDown={(event) => {
        event.preventDefault();
        setIsDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
        updateDrag(event.clientX, event.clientY);
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }}
      ref={buttonRef}
      style={dragStyle}
      type="button"
    >
      <span
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-[transform,filter,opacity] duration-150 ease-out hover:scale-105 active:scale-95 ${piece.className}`}
        style={visualStyle}
      >
        {imageContent}
      </span>
    </button>
  );
}

function handleDragKeyDown(
  event: KeyboardEvent<HTMLButtonElement>,
  drag: DragConfig,
) {
  const step = event.shiftKey ? 8 : 3;
  const nextPositions: Record<string, ScenePosition> = {
    ArrowDown: {
      ...drag.position,
      y: Math.min(drag.maxY, drag.position.y + step),
    },
    ArrowLeft: {
      ...drag.position,
      x: Math.max(drag.minX, drag.position.x - step),
    },
    ArrowRight: {
      ...drag.position,
      x: Math.min(drag.maxX, drag.position.x + step),
    },
    ArrowUp: {
      ...drag.position,
      y: Math.max(drag.minY, drag.position.y - step),
    },
  };
  const nextPosition = nextPositions[event.key];

  if (!nextPosition) {
    return;
  }

  event.preventDefault();
  drag.onChange(nextPosition);
}

function getSceneImagePresentation(piece: ScenePiece) {
  const isBall = piece.alt.startsWith("Football");
  const shadowClassName = isBall
    ? "top-[66%] h-[14%] w-[44%] bg-black/35 blur-[2px]"
    : "top-[77%] h-[10%] w-[36%] bg-black/40 blur-[3px]";
  const visualStyle = {
    height: isBall ? "clamp(22px, 5vw, 46px)" : "clamp(46px, 10vw, 92px)",
    width: isBall ? "clamp(22px, 5vw, 46px)" : "clamp(46px, 10vw, 92px)",
  };
  const pieceStyle = {
    ...visualStyle,
    left: `${piece.x}%`,
    top: `${piece.y}%`,
  };
  const imageContent = (
    <>
      <span
        aria-hidden="true"
        className={`absolute left-1/2 z-0 -translate-x-1/2 rounded-full ${shadowClassName}`}
      />
      <Image
        alt={piece.alt}
        className="pointer-events-none z-10 object-contain select-none"
        draggable={false}
        fill
        onDragStart={(event) => event.preventDefault()}
        src={piece.src}
        unoptimized
      />
    </>
  );
  return { imageContent, pieceStyle, visualStyle };
}
