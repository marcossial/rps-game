package com.marcossial.rps.Controller;

import com.marcossial.rps.DTO.GameRequest;
import com.marcossial.rps.Model.Game;
import com.marcossial.rps.Model.Result;
import com.marcossial.rps.Service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/game")
@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class GameController {
    private final GameService service;

    GameController(GameService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Game> create(@Validated @RequestBody GameRequest req) {
        Game createdGame = service.newGame(req.getUserId(), req.getUserChoice());
        return ResponseEntity.status(201).body(createdGame);
    }

    @GetMapping("/users/{id}/stats")
    public Map<Result, Long> getUserStats(@PathVariable Long userId) {
        return service.getUserStats(userId);
    }

    @GetMapping("/users/{id}")
    public List<Game> getUserHistory(@PathVariable Long id) {
        return service.getUserHistory(id);
    }
    
    @GetMapping
    public List<Game> getAllUsersHistory(){
    	return service.getAllUserHistory();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
    	service.deleteGame(id);
    	return ResponseEntity.noContent().build();
    }
}
