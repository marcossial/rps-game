package com.marcossial.rps.Service;

import com.marcossial.rps.Model.Choice;
import com.marcossial.rps.Model.Game;
import com.marcossial.rps.Model.Result;
import com.marcossial.rps.Repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GameService {
    GameRepository repository;

    
    public GameService(GameRepository repository) {
        this.repository = repository;
    }

    public Game newGame(Long userId, Choice userChoice) {
        Choice npcChoice = Choice.random();
        Result result = userChoice.playAgainst(npcChoice);

        Game game = new Game(userId, userChoice, npcChoice, result);
        return repository.save(game);
    }

    public List<Game> getUserHistory(long userId) {
        return repository.findUserByUserIdOrderByDateDesc(userId);
    }
    
    public List<Game> geAllUserHistory(){
    	return repository.findAll();
    }

    public Map<Result, Long> getUserStats(Long userId) {
        List<Game> games = repository.findByUserId(userId);
        return games.stream()
                .collect(Collectors.groupingBy(Game::getResult, Collectors.counting()));
    }

    public void deleteGame(Long id) {
        repository.deleteById(id);
    }
}
