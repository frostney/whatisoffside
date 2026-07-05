import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Slide, Theme } from "./types";

export function SlidePanel({
  isInteractiveSlide,
  onNext,
  onPrevious,
  onSlideSelect,
  onSkip,
  onThemeChange,
  slide,
  slideCount,
  slideIndex,
  theme,
}: {
  isInteractiveSlide: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSlideSelect: (slideIndex: number) => void;
  onSkip: () => void;
  onThemeChange: (theme: Theme) => void;
  slide: Slide;
  slideCount: number;
  slideIndex: number;
  theme: Theme;
}) {
  return (
    <div className="flex min-h-0 flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors duration-300 ease-out sm:p-6 lg:min-h-[calc(100vh-2rem)] lg:overflow-hidden lg:gap-6 lg:p-7">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <p className="font-mono font-semibold text-[var(--line)] text-xs uppercase tracking-[0.22em]">
          {slide.eyebrow}
        </p>
        <div className="flex items-center gap-3">
          <ThemeToggle onThemeChange={onThemeChange} theme={theme} />
          <SlideDots
            onSlideSelect={onSlideSelect}
            slideCount={slideCount}
            slideIndex={slideIndex}
          />
        </div>
      </div>
      <SlideCopy key={slideIndex} slide={slide} />
      <SlideActions
        isInteractiveSlide={isInteractiveSlide}
        onNext={onNext}
        onPrevious={onPrevious}
        onSkip={onSkip}
        slideIndex={slideIndex}
      />
    </div>
  );
}

function SlideCopy({ slide }: { slide: Slide }) {
  return (
    <div className="min-h-0 flex-1 space-y-5 pr-1 lg:overflow-y-auto lg:[scrollbar-gutter:stable]">
      <h1 className="whitespace-pre-line text-balance font-display font-bold text-5xl uppercase leading-[0.94] tracking-normal sm:text-6xl lg:text-7xl">
        {slide.title}
      </h1>
      <p className="max-w-2xl text-pretty text-[var(--text-muted)] text-sm leading-6 sm:text-xl sm:leading-8">
        {slide.body}
      </p>
      <a
        className="inline-flex font-bold text-[var(--accent-muted)] text-sm underline decoration-[color-mix(in_srgb,var(--accent-muted)_30%,transparent)] underline-offset-4 hover:decoration-[var(--accent-muted)]"
        href="https://www.theifab.com/laws/latest/offside/"
        rel="noreferrer"
        target="_blank"
      >
        Source: IFAB Law 11
      </a>
    </div>
  );
}

function SlideActions({
  isInteractiveSlide,
  onNext,
  onPrevious,
  onSkip,
  slideIndex,
}: {
  isInteractiveSlide: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  slideIndex: number;
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-3 pt-1">
      <button
        aria-label="Back"
        className="grid h-12 w-12 place-items-center rounded-full border border-[var(--border)] bg-[var(--control)] text-[var(--foreground)] transition-[background-color,border-color,color,transform] duration-200 ease-out hover:border-[var(--accent)] hover:bg-[var(--control-hover)] active:scale-95 disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:bg-[var(--control)] disabled:text-[var(--text-muted)] disabled:opacity-100 disabled:active:scale-100"
        disabled={slideIndex === 0}
        onClick={onPrevious}
        type="button"
      >
        <ArrowLeft aria-hidden="true" size={22} strokeWidth={2.4} />
      </button>
      <button
        aria-label={isInteractiveSlide ? "Last slide" : "Next slide"}
        className="grid h-12 w-12 place-items-center rounded-full border border-transparent bg-[var(--accent)] text-[var(--accent-contrast)] transition-[background-color,border-color,color,filter,transform] duration-200 ease-out hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:bg-transparent disabled:text-[var(--text-muted)] disabled:opacity-100 disabled:hover:brightness-100 disabled:active:scale-100"
        disabled={isInteractiveSlide}
        onClick={onNext}
        type="button"
      >
        <ArrowRight aria-hidden="true" size={22} strokeWidth={2.4} />
      </button>
      <button
        className="rounded-md border border-transparent px-5 py-3 font-bold text-[var(--accent)] transition-[background-color,border-color,color,transform] duration-200 ease-out hover:border-[var(--border)] hover:bg-[var(--control-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:bg-transparent disabled:text-[var(--text-muted)] disabled:opacity-100 disabled:hover:border-[var(--border)] disabled:hover:bg-transparent disabled:active:scale-100"
        disabled={isInteractiveSlide}
        onClick={onSkip}
        type="button"
      >
        Skip to interactive
      </button>
    </div>
  );
}

function ThemeToggle({
  onThemeChange,
  theme,
}: {
  onThemeChange: (theme: Theme) => void;
  theme: Theme;
}) {
  return (
    <button
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-pressed={theme === "dark"}
      className="flex h-8 w-16 items-center rounded-full border border-[var(--border)] bg-[var(--toggle-track)] p-1 transition-[background-color,border-color,transform] duration-300 ease-out hover:border-[var(--accent)] active:scale-95"
      onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
      type="button"
    >
      <span
        className={`h-5 w-5 rounded-full bg-[var(--toggle-thumb)] shadow-sm transition-transform duration-300 ease-out ${
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SlideDots({
  onSlideSelect,
  slideCount,
  slideIndex,
}: {
  onSlideSelect: (slideIndex: number) => void;
  slideCount: number;
  slideIndex: number;
}) {
  const slideDots = Array.from({ length: slideCount }, (_, index) => ({
    id: `slide-dot-${index + 1}`,
    index,
  }));

  return (
    <nav
      aria-label="Slide navigation"
      className="flex flex-wrap justify-end gap-2"
    >
      {slideDots.map(({ id, index }) => (
        <button
          aria-current={index === slideIndex ? "step" : undefined}
          aria-label={`Go to ${
            index === slideCount - 1
              ? "interactive slide"
              : `slide ${index + 1}`
          }`}
          className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ease-out hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] active:scale-95 sm:h-3 sm:w-3 ${
            index === slideIndex
              ? "scale-125 bg-[var(--accent)] shadow-sm"
              : "scale-100 bg-[var(--border)] opacity-75"
          }`}
          key={id}
          onClick={() => onSlideSelect(index)}
          type="button"
        />
      ))}
    </nav>
  );
}
