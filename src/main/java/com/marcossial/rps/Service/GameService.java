package com.marcossial.rps.Service;

import com.marcossial.rps.Model.Choice;
import com.marcossial.rps.Model.Game;
import com.marcossial.rps.Model.Result;
import com.marcossial.rps.Model.User;
import com.marcossial.rps.Repository.GameRepository;
import com.marcossial.rps.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final GameLogicService gameLogicService;

    public GameService(GameRepository gameRepository, UserRepository userRepository, GameLogicService gameLogicService) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.gameLogicService = gameLogicService;
    }

    public Game newGame(Long userId , Choice userChoice) {
        User actualUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found. ID: " + userId));

        Choice npcChoice = gameLogicService.generateNpcChoice();
        Result result = gameLogicService.calculateResult(userChoice, npcChoice);

        Game game = new Game(actualUser, userChoice, npcChoice, result);
        return gameRepository.save(game);
    }

    public List<Game> getUserHistory(Long userId) {
        return gameRepository.findByUserIdOrderByDateDesc(userId);
    }
    
    public List<Game> getAllUserHistory(){
    	return gameRepository.findAll();
    }

    public Map<Result, Long> getUserStats(Long userId) {
        List<Game> games = gameRepository.findByUserId(userId);
        return games.stream()
                .collect(Collectors.groupingBy(Game::getResult, Collectors.counting()));
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }
}
