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

    public Game newGame(Long userId , Choice userChoice) {
        User actualUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found. ID: " + userId));

        Choice npcChoice = gameLogicService.generateNpcChoice();
        Result result = gameLogicService.calculateResult(userChoice, npcChoice);

        // --- INÍCIO DA LÓGICA DO STREAK ---

        // 3. Calcula o novo valor do streak
        int newStreak;
        if (result == Result.VICTORY) {
            // Se venceu, incrementa o streak atual do usuário
            newStreak = actualUser.getCurrentStreak() + 1;
        } else {
            // Se perdeu OU empatou, reseta o streak para 0
            newStreak = 0;
        }

        // 4. Atualiza o objeto do usuário com o novo streak
        actualUser.setCurrentStreak(newStreak);

        // 5. SALVA o usuário atualizado no banco (IMPORTANTE!)
        userRepository.save(actualUser);

        Game game = new Game(actualUser, userChoice, npcChoice, result);

        // 7. Adiciona o streak ao objeto Game (para o front-end ver)
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
