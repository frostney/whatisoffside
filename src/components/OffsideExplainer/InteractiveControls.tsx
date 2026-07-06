import { restartOptions } from "./OffsideExplainer.data";
import type { Restart, Verdict } from "./types";

export function InteractiveControls({
  attackerX,
  ballX,
  isActive,
  onIsActiveChange,
  onRestartChange,
  restart,
  secondLastDefenderX,
  verdict,
}: {
  attackerX: number;
  ballX: number;
  isActive: boolean;
  onIsActiveChange: (value: boolean) => void;
  onRestartChange: (value: Restart) => void;
  restart: Restart;
  secondLastDefenderX: number;
  verdict: Verdict;
}) {
  return (
    <div className="grid min-h-0 shrink-0 grid-cols-[0.9fr_1.1fr] gap-2 lg:grid-cols-[1fr_1fr] lg:gap-3">
      <div className="grid content-start gap-2 rounded-lg bg-[var(--surface-strong)] p-2 text-[var(--foreground)] transition-[background-color,box-shadow] duration-300 ease-out lg:gap-3 lg:p-4">
        <ActiveToggle isActive={isActive} onIsActiveChange={onIsActiveChange} />
        <RestartPicker onRestartChange={onRestartChange} restart={restart} />
      </div>
      <DecisionCard
        attackerX={attackerX}
        ballX={ballX}
        isActive={isActive}
        restart={restart}
        secondLastDefenderX={secondLastDefenderX}
        verdict={verdict}
      />
    </div>
  );
}

function ActiveToggle({
  isActive,
  onIsActiveChange,
}: {
  isActive: boolean;
  onIsActiveChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-[var(--border)] px-2 py-1.5 font-semibold text-[11px] transition-[border-color,background-color] duration-200 ease-out hover:border-[var(--accent)] hover:bg-[var(--control-hover)] sm:gap-3 sm:px-3 sm:py-2 sm:text-sm">
      <input
        checked={isActive}
        className="h-4 w-4 accent-[var(--accent)] sm:h-5 sm:w-5"
        onChange={(event) => onIsActiveChange(event.target.checked)}
        type="checkbox"
      />
      Attacker becomes active
    </label>
  );
}

function RestartPicker({
  onRestartChange,
  restart,
}: {
  onRestartChange: (value: Restart) => void;
  restart: Restart;
}) {
  return (
    <div className="grid gap-1.5 sm:gap-2">
      <span className="font-semibold text-[11px] sm:text-sm">Restart</span>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {restartOptions.map((option) => (
          <button
            className={`rounded-md border px-2 py-1.5 font-bold text-[10px] transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.97] sm:px-3 sm:py-2 sm:text-xs ${
              restart === option.value
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)]"
                : "border-[var(--border)] bg-[var(--control)] text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--control-hover)]"
            }`}
            key={option.value}
            onClick={() => onRestartChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DecisionCard({
  attackerX,
  ballX,
  isActive,
  restart,
  secondLastDefenderX,
  verdict,
}: {
  attackerX: number;
  ballX: number;
  isActive: boolean;
  restart: Restart;
  secondLastDefenderX: number;
  verdict: Verdict;
}) {
  const decision = getDecisionState({
    attackerX,
    ballX,
    isActive,
    restart,
    secondLastDefenderX,
  });

  return (
    <article className="overflow-hidden rounded-lg bg-[var(--surface-warm)] p-2.5 text-[var(--foreground)] transition-[background-color,box-shadow] duration-300 ease-out sm:p-4">
      <p className="font-semibold text-[10px] text-[var(--accent-muted)] uppercase tracking-[0.16em] sm:text-sm">
        Verdict
      </p>
      <VerdictStamp decision={decision} />
      <p className="mt-2 text-[var(--text-muted)] text-xs leading-4 sm:mt-3 sm:text-sm sm:leading-6">
        {decision.note}
      </p>
      <ReasonList reasons={decision.reasons} />
      <InteractionHint />
      {!isActive || verdict.isOffside ? (
        <p className="mt-3 hidden text-[var(--text-muted)] text-xs leading-5 sm:block">
          {verdict.reason}
        </p>
      ) : null}
    </article>
  );
}

function getDecisionState({
  attackerX,
  ballX,
  isActive,
  restart,
  secondLastDefenderX,
}: {
  attackerX: number;
  ballX: number;
  isActive: boolean;
  restart: Restart;
  secondLastDefenderX: number;
}) {
  const reasons = [
    ["Ahead of the second-last opponent", attackerX > secondLastDefenderX],
    ["Ahead of the ball", attackerX > ballX],
    ["Inside the opponents' half", attackerX > 50],
  ] as const;
  const exemptRestart = restart !== "openPlay";
  const inOffsidePosition = reasons.every(([, ok]) => ok);

  if (exemptRestart) {
    return {
      isOffsidePosition: false,
      note: "Never called directly from a throw-in, corner kick, or goal kick.",
      reasons,
      stamp: "No offside",
    };
  }

  if (inOffsidePosition) {
    if (!isActive) {
      return {
        isOffsidePosition: false,
        note: "Position alone is not an offence until he becomes involved in active play.",
        reasons,
        stamp: "No offence",
      };
    }

    return {
      isOffsidePosition: true,
      note: "Offside is penalised because the attacker is in an offside position and becomes involved in active play.",
      reasons,
      stamp: "Offside offence",
    };
  }

  return {
    isOffsidePosition: false,
    note: "He can receive the ball freely from this position.",
    reasons,
    stamp: "Onside",
  };
}

function VerdictStamp({
  decision,
}: {
  decision: ReturnType<typeof getDecisionState>;
}) {
  const stampClassName = decision.isOffsidePosition
    ? "border-red-400 bg-red-400/10 text-red-300"
    : "border-emerald-300 bg-emerald-300/10 text-emerald-200";

  return (
    <h2
      className={`mt-1.5 inline-flex rounded-md border-2 px-2 py-1 font-black text-lg uppercase tracking-[0.08em] sm:mt-2 sm:px-3 sm:py-2 sm:text-2xl ${stampClassName}`}
    >
      {decision.stamp}
    </h2>
  );
}

function ReasonList({
  reasons,
}: {
  reasons: ReturnType<typeof getDecisionState>["reasons"];
}) {
  return (
    <ul className="mt-3 hidden gap-2 sm:grid">
      {reasons.map(([label, ok]) => (
        <li
          className="flex items-center gap-2 text-[var(--text-muted)] text-sm"
          key={label}
        >
          <span
            className={ok ? "text-emerald-500" : "text-[var(--text-subtle)]"}
          >
            {ok ? "✓" : "·"}
          </span>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}

function InteractionHint() {
  return (
    <p className="mt-3 hidden font-mono text-[var(--text-subtle)] text-xs leading-5 lg:block">
      Drag the passing teammate, the highlighted runner, or the second-last
      defender. Keyboard: tab to a piece, then arrow keys. Shift makes bigger
      jumps.
    </p>
  );
}
