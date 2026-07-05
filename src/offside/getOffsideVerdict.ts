type Restart = "cornerKick" | "goalKick" | "openPlay" | "throwIn";

type Involvement = "none" | "receiving";

type OffsideInput = {
  attackerX: number;
  ballX: number;
  fromTeammate: boolean;
  inOpponentsHalf: boolean;
  involvement: Involvement;
  restart: Restart;
  secondLastDefenderX: number;
};

const exemptRestarts = new Set<Restart>(["cornerKick", "goalKick", "throwIn"]);

export function getOffsideVerdict(input: OffsideInput) {
  if (exemptRestarts.has(input.restart)) {
    return {
      isOffside: false,
      reason: "There is no offside offence directly from this restart.",
    };
  }

  if (!input.fromTeammate) {
    return {
      isOffside: false,
      reason: "Offside is judged from a teammate's play or touch.",
    };
  }

  if (!input.inOpponentsHalf) {
    return {
      isOffside: false,
      reason: "A player cannot be offside in their own half.",
    };
  }

  const isBeyondBall = input.attackerX > input.ballX;
  const isBeyondSecondLastDefender =
    input.attackerX > input.secondLastDefenderX;
  const isInOffsidePosition = isBeyondBall && isBeyondSecondLastDefender;

  if (!isInOffsidePosition) {
    return {
      isOffside: false,
      reason:
        "The attacker is level with or behind the ball or second-last opponent.",
    };
  }

  if (input.involvement === "none") {
    return {
      isOffside: false,
      reason:
        "Position alone is not an offence until the player becomes involved in active play.",
    };
  }

  return {
    isOffside: true,
    reason:
      "The attacker was beyond the ball and second-last opponent when the teammate played or touched the ball, then became active.",
  };
}
