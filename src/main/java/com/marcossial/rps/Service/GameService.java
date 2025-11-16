package com.marcossial.rps.Service;

import com.marcossial.rps.Model.Choice;
import com.marcossial.rps.Model.Game;
import com.marcossial.rps.Model.Result;
import com.marcossial.rps.Model.User;
import com.marcossial.rps.Repository.GameRepository;
import com.marcossial.rps.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    @Transactional
    public Game newGame(Long userId , Choice userChoice) {
        User actualUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found. ID: " + userId));

        Choice npcChoice = gameLogicService.generateNpcChoice();
        Result result = gameLogicService.calculateResult(userChoice, npcChoice);

        int newStreak = actualUser.getCurrentStreak();
        long scoreChange = 0;
        if (result == Result.VICTORY) {
            newStreak++;
            scoreChange = (long) (10 * Math.pow(2, newStreak - 1));
        } else if (result == Result.DEFEAT) {
            newStreak = 0;
            scoreChange = -5;
        } else {
            newStreak = 0;
        }
        actualUser.setCurrentStreak(newStreak);
        actualUser.setScore(actualUser.getScore() + scoreChange);
        userRepository.save(actualUser);

        Game game = new Game(actualUser, userChoice, npcChoice, result);
        game.setUserStreak(newStreak);

        return gameRepository.save(game);
    }

    public Optional<Game> getGameById(Long id) {
        return gameRepository.findById(id);
    }

    public List<Game> getUserHistory(Long userId) {
        return gameRepository.findByUserIdOrderByDateDesc(userId);
    }

    @Transactional
    public List<Game> getAllUserHistory(){
        List<Game> games = gameRepository.findAll();

        games.forEach(game -> game.getUser().getId());
    	return games;
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
