export type Restart = "cornerKick" | "goalKick" | "openPlay" | "throwIn";

export type SlideFocus =
  | "line"
  | "none"
  | "passer"
  | "runner"
  | "wideRunner"
  | "interactive";

export type SceneStamp = {
  kind: "legal" | "off" | "on";
  text: string;
  x: number;
  y: number;
};

export type PassArrow = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

export type SlideScene = {
  attackerX: number;
  attackerY?: number;
  ballX: number;
  ballY?: number;
  focus: SlideFocus;
  lineLabel?: string;
  passArrow?: PassArrow;
  secondLastDefenderX: number;
  secondLastDefenderY?: number;
  stamp?: SceneStamp;
  wideRunnerX: number;
  wideRunnerY?: number;
};

export type Slide = {
  body: string;
  eyebrow: string;
  focus: SlideFocus;
  scene: SlideScene;
  title: string;
};

export type Theme = "light" | "dark";

export type Verdict = {
  isOffside: boolean;
  reason: string;
};
