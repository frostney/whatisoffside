import type { Slide } from "./types";

export const teachingSlides = [
  {
    eyebrow: "The one rule everyone gets stuck on",
    title: "Offside,\non the board",
    body: "A player is in an offside position if they're in the opponents' half and closer to the goal line than both the ball and the second-last opponent when a teammate plays or touches the ball. Everything below is the same pitch, attacking left to right. The amber line is the one to watch.",
    focus: "passer",
    scene: {
      attackerX: 78,
      ballX: 48,
      focus: "passer",
      secondLastDefenderX: 70,
      wideRunnerX: 62,
    },
  },
  {
    eyebrow: "What it is / 01",
    title: "The line and the position",
    body: "The amber line sits level with the second-last opponent, usually the last outfield defender, since the keeper is deepest. The glowing attacker is past the line and ahead of the ball, so he's in an offside position. Note the word position: on its own it isn't an offence yet.",
    focus: "runner",
    scene: {
      attackerX: 82,
      ballX: 46,
      focus: "runner",
      secondLastDefenderX: 70,
      stamp: { kind: "off", text: "Offside position", x: 75, y: 25 },
      wideRunnerX: 57,
    },
  },
  {
    eyebrow: "The escape hatch / 02",
    title: "Level is onside",
    body: "If the attacker is level with the second-last opponent, or level with the last two opponents, he is onside. Ties go to the attacker. That's why you'll see players try to time their run to stay shoulder-to-shoulder with the back line.",
    focus: "runner",
    scene: {
      attackerX: 70,
      ballX: 47,
      focus: "runner",
      lineLabel: "Level here",
      secondLastDefenderX: 70,
      stamp: { kind: "on", text: "Onside", x: 69, y: 25 },
      wideRunnerX: 58,
    },
  },
  {
    eyebrow: "The bit everyone misses / 03",
    title: "It's judged when the ball is played, not received",
    body: "This is the heart of it. The attacker is onside when the teammate plays or touches the ball. He then sprints in behind and collects it well past the defenders, and it's still legal, because the offside position is judged at that earlier contact, not when the pass arrives.",
    focus: "runner",
    scene: {
      attackerX: 64,
      ballX: 45,
      focus: "runner",
      lineLabel: "Line now",
      passArrow: { x1: 47, x2: 82, y1: 63, y2: 38 },
      secondLastDefenderX: 70,
      stamp: { kind: "on", text: "Onside", x: 58, y: 25 },
      wideRunnerX: 55,
    },
  },
  {
    eyebrow: "Position is not offence / 04",
    title: "Standing offside isn't a crime",
    body: "The faded attacker up top is in an offside position, but the ball goes to a teammate who's onside, and the high player never touches it, blocks anyone, or gains an advantage. No offence, play on. He's only penalised the moment he gets involved.",
    focus: "wideRunner",
    scene: {
      attackerX: 82,
      ballX: 45,
      focus: "wideRunner",
      passArrow: { x1: 47, x2: 62, y1: 63, y2: 70 },
      secondLastDefenderX: 70,
      stamp: { kind: "on", text: "Not involved", x: 75, y: 22 },
      wideRunnerX: 62,
    },
  },
  {
    eyebrow: "The exemptions / 05",
    title: "Three restart exemptions",
    body: "Offside is never called directly from a throw-in, corner kick, or goal kick. Other restarts, including free kicks and dropped balls, can still produce offside. Here the ball comes from a throw-in on the touchline, so the attacker can be as far forward as he likes and still be onside the moment he receives it.",
    focus: "runner",
    scene: {
      attackerX: 86,
      ballX: 76,
      focus: "runner",
      passArrow: { x1: 76, x2: 86, y1: 14, y2: 36 },
      secondLastDefenderX: 70,
      stamp: { kind: "legal", text: "No offside", x: 78, y: 25 },
      wideRunnerX: 58,
    },
  },
] satisfies readonly Slide[];

export const interactiveSlideIndex = teachingSlides.length;

export const interactiveSlide = {
  eyebrow: "Your turn / drag",
  title: "Move the pieces, watch the call",
  body: "Drag the passing teammate, the highlighted runner, or the second-last defender. The ball moves with the passer, and the defender carries the amber offside line.",
  focus: "interactive",
  scene: {
    attackerX: 78,
    ballX: 48,
    focus: "interactive",
    secondLastDefenderX: 70,
    wideRunnerX: 62,
  },
} satisfies Slide;

export const restartOptions = [
  { label: "Open play", value: "openPlay" },
  { label: "Throw-in", value: "throwIn" },
  { label: "Corner", value: "cornerKick" },
  { label: "Goal kick", value: "goalKick" },
] as const;
