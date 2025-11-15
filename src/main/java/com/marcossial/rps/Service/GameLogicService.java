package com.marcossial.rps.Service;

import com.marcossial.rps.Model.Choice;
import com.marcossial.rps.Model.Result;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class GameLogicService {
    public Choice generateNpcChoice() {
        Random rand = new Random();
        Choice[] choices = Choice.values();
        return choices[rand.nextInt(choices.length)];
    }

    public Result calculateResult(Choice user, Choice npc) {
        if (user == npc) {
            return Result.DRAW;
        }

        if ((user == Choice.ROCK && npc == Choice.SCISSORS) ||
                (user == Choice.PAPER && npc == Choice.ROCK) ||
                (user == Choice.SCISSORS && npc == Choice.PAPER)) {
            return Result.VICTORY;
        }

        return Result.DEFEAT;
    }
}
