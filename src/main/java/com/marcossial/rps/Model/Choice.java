package com.marcossial.rps.Model;

import java.util.Random;

public enum Choice {
    ROCK,
    PAPER,
    SCISSORS;

    public Result playAgainst(Choice other) {
        if (this == other) {
            return Result.DRAW;
        }
        return switch (this) {
            case ROCK -> (other == SCISSORS) ? Result.VICTORY : Result.DEFEAT;
            case PAPER -> (other == ROCK) ? Result.VICTORY : Result.DEFEAT;
            case SCISSORS -> (other == PAPER) ? Result.VICTORY : Result.DEFEAT;
            default -> throw new IllegalStateException("Invalid choice");
        };
    }

    private static final Random RANDOM = new Random();
    public static Choice random() {
        Choice[] values = Choice.values();
        return values[RANDOM.nextInt(values.length)];
    }
}
