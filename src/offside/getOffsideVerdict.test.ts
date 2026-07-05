import { expect, test } from "bun:test";
import { getOffsideVerdict } from "./getOffsideVerdict";

test("flags an active attacker beyond the ball and second-last defender", () => {
  const verdict = getOffsideVerdict({
    attackerX: 78,
    ballX: 58,
    fromTeammate: true,
    inOpponentsHalf: true,
    involvement: "receiving",
    restart: "openPlay",
    secondLastDefenderX: 70,
  });

  expect(verdict.isOffside).toBe(true);
});

test("keeps a level attacker onside", () => {
  const verdict = getOffsideVerdict({
    attackerX: 70,
    ballX: 58,
    fromTeammate: true,
    inOpponentsHalf: true,
    involvement: "receiving",
    restart: "openPlay",
    secondLastDefenderX: 70,
  });

  expect(verdict.isOffside).toBe(false);
});

test("does not penalize passive position", () => {
  const verdict = getOffsideVerdict({
    attackerX: 80,
    ballX: 58,
    fromTeammate: true,
    inOpponentsHalf: true,
    involvement: "none",
    restart: "openPlay",
    secondLastDefenderX: 70,
  });

  expect(verdict.isOffside).toBe(false);
});

test("exempts direct throw-ins, corners, and goal kicks", () => {
  for (const restart of ["throwIn", "cornerKick", "goalKick"] as const) {
    const verdict = getOffsideVerdict({
      attackerX: 82,
      ballX: 58,
      fromTeammate: true,
      inOpponentsHalf: true,
      involvement: "receiving",
      restart,
      secondLastDefenderX: 70,
    });

    expect(verdict.isOffside).toBe(false);
  }
});
