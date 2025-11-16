package com.marcossial.rps.Service;

import com.marcossial.rps.Model.Choice;
import com.marcossial.rps.Model.Result;
import org.junit.jupiter.api.Test; // Import do JUnit 5
import static org.junit.jupiter.api.Assertions.*; // Import para as verificações

class GameLogicServiceTest {

    // Cria uma instância do serviço que queremos testar
    private GameLogicService logicService = new GameLogicService();

    @Test // Marca este método como um teste
    void testPlayerWinsRockVsScissors() {
        // ARRANGE (Arrumar)
        Choice playerChoice = Choice.ROCK;
        Choice npcChoice = Choice.SCISSORS;

        // ACT (Agir)
        Result result = logicService.calculateResult(playerChoice, npcChoice);

        // ASSERT (Verificar)
        // Nós verificamos se o resultado é o que esperamos (VICTORY)
        assertEquals(Result.VICTORY, result);
    }

    @Test
    void testPlayerLosesPaperVsScissors() {
        // ARRANGE
        Choice playerChoice = Choice.PAPER;
        Choice npcChoice = Choice.SCISSORS;

        // ACT
        Result result = logicService.calculateResult(playerChoice, npcChoice);

        // ASSERT
        assertEquals(Result.DEFEAT, result);
    }

    @Test
    void testDraw() {
        // ACT
        Result result = logicService.calculateResult(Choice.ROCK, Choice.ROCK);
        // ASSERT
        assertEquals(Result.DRAW, result);
    }
}