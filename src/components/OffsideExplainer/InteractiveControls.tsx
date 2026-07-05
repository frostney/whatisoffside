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
    <div className="grid min-h-0 gap-3 lg:grid-cols-[1fr_1fr]">
      <div className="grid content-start gap-3 rounded-lg bg-[var(--surface-strong)] p-3 text-[var(--foreground)] transition-[background-color,box-shadow] duration-300 ease-out lg:p-4">
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
    <label className="flex items-center gap-3 rounded-md border border-[var(--border)] px-3 py-2 font-semibold text-sm transition-[border-color,background-color] duration-200 ease-out hover:border-[var(--accent)] hover:bg-[var(--control-hover)]">
      <input
        checked={isActive}
        className="h-5 w-5 accent-[var(--accent)]"
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
    <div className="grid gap-2">
      <span className="font-semibold text-sm">Restart</span>
      <div className="flex flex-wrap gap-2">
        {restartOptions.map((option) => (
          <button
            className={`rounded-md border px-3 py-2 font-bold text-xs transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.97] ${
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
    <article className="rounded-lg bg-[var(--surface-warm)] p-4 text-[var(--foreground)] transition-[background-color,box-shadow] duration-300 ease-out">
      <p className="font-semibold text-[var(--accent-muted)] text-sm uppercase tracking-[0.16em]">
        Verdict
      </p>
      <VerdictStamp decision={decision} />
      <p className="mt-3 text-[var(--text-muted)] text-sm leading-6">
        {decision.note}
      </p>
      <ReasonList reasons={decision.reasons} />
      <InteractionHint />
      {!isActive || verdict.isOffside ? (
        <p className="mt-3 text-[var(--text-muted)] text-xs leading-5">
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
    ["Ahead of the second-last defender", attackerX > secondLastDefenderX],
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
      className={`mt-2 inline-flex rounded-md border-2 px-3 py-2 font-black text-2xl uppercase tracking-[0.08em] ${stampClassName}`}
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
    <ul className="mt-3 grid gap-2">
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
    <p className="mt-3 font-mono text-[var(--text-subtle)] text-xs leading-5">
      Drag the passing teammate, the highlighted runner, or the last defender.
      Keyboard: tab to a piece, then arrow keys. Shift makes bigger jumps.
    </p>
  );
}
