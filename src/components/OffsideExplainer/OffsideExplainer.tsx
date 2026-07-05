"use client";

import { useMemo, useState } from "react";
import { getOffsideVerdict } from "@/offside/getOffsideVerdict";
import { FieldGraphic } from "./FieldGraphic";
import { InteractiveControls } from "./InteractiveControls";
import {
  interactiveSlide,
  interactiveSlideIndex,
  restartOptions,
  teachingSlides,
} from "./OffsideExplainer.data";
import { RuleCards } from "./RuleCards";
import { SlidePanel } from "./SlidePanel";
import type { Restart, SlideScene } from "./types";
import { useSystemTheme } from "./useSystemTheme";

export function OffsideExplainer() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [attackerX, setAttackerX] = useState(78);
  const [attackerY, setAttackerY] = useState(36);
  const [ballX, setBallX] = useState(48);
  const [ballY, setBallY] = useState(56);
  const [secondLastDefenderX, setSecondLastDefenderX] = useState(70);
  const [secondLastDefenderY, setSecondLastDefenderY] = useState(55);
  const [isActive, setIsActive] = useState(true);
  const [restart, setRestart] = useState<Restart>(restartOptions[0].value);
  const { setTheme, theme } = useSystemTheme();

  const isInteractiveSlide = slideIndex === interactiveSlideIndex;
  const activeSlide = isInteractiveSlide
    ? interactiveSlide
    : teachingSlides[slideIndex];
  const fieldScene: SlideScene = isInteractiveSlide
    ? {
        attackerX,
        attackerY,
        ballX,
        ballY,
        focus: "interactive" as const,
        secondLastDefenderX,
        secondLastDefenderY,
        wideRunnerX: 62,
        wideRunnerY: 70,
      }
    : activeSlide.scene;

  const verdict = useMemo(
    () =>
      getOffsideVerdict({
        attackerX,
        ballX,
        fromTeammate: true,
        inOpponentsHalf: true,
        involvement: isActive ? "receiving" : "none",
        restart,
        secondLastDefenderX,
      }),
    [attackerX, ballX, isActive, restart, secondLastDefenderX],
  );

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] lg:h-dvh lg:overflow-hidden">
      <section className="mx-auto grid min-h-dvh w-full max-w-7xl content-start gap-3 px-3 py-3 sm:px-5 lg:h-dvh lg:content-stretch lg:grid-cols-[0.92fr_1.08fr] lg:grid-rows-1 lg:gap-6 lg:px-8">
        <SlidePanel
          isInteractiveSlide={isInteractiveSlide}
          onNext={() =>
            setSlideIndex((currentIndex) =>
              Math.min(currentIndex + 1, interactiveSlideIndex),
            )
          }
          onPrevious={() =>
            setSlideIndex((currentIndex) => Math.max(currentIndex - 1, 0))
          }
          onSlideSelect={setSlideIndex}
          onSkip={() => setSlideIndex(interactiveSlideIndex)}
          onThemeChange={setTheme}
          slide={activeSlide}
          slideCount={interactiveSlideIndex + 1}
          slideIndex={slideIndex}
          theme={theme}
        />

        <div className="flex min-h-0 flex-col gap-3 rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-3 text-white shadow-2xl shadow-[var(--panel-shadow)] transition-[background-color,border-color,box-shadow] duration-300 ease-out sm:p-4 lg:min-h-[calc(100vh-2rem)] lg:overflow-hidden lg:gap-4">
          <FieldGraphic
            isInteractive={isInteractiveSlide}
            positionHandlers={{
              attacker: (position) => {
                setAttackerX(position.x);
                setAttackerY(position.y);
              },
              ball: (position) => {
                setBallX(position.x);
                setBallY(position.y);
              },
              secondLastDefender: (position) => {
                setSecondLastDefenderX(position.x);
                setSecondLastDefenderY(position.y);
              },
            }}
            scene={fieldScene}
            verdictIsOffside={verdict.isOffside}
          />

          {isInteractiveSlide ? (
            <InteractiveControls
              attackerX={attackerX}
              ballX={ballX}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onRestartChange={setRestart}
              restart={restart}
              secondLastDefenderX={secondLastDefenderX}
              verdict={verdict}
            />
          ) : (
            <RuleCards />
          )}
        </div>
      </section>
    </main>
  );
}
