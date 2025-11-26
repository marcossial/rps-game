package com.marcossial.rps.Controller;

import com.marcossial.rps.DTO.GameRequest;
import com.marcossial.rps.Model.Game;
import com.marcossial.rps.Model.Result;
import com.marcossial.rps.Service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Games", description = "Basic game operations")
@RequestMapping("/game")
@RestController
//@CrossOrigin(origins = "http://localhost:8080")
@CrossOrigin(origins = "*")
public class GameController {
    private final GameService service;

    GameController(GameService service) {
        this.service = service;
    }

    @Operation(summary = "Create new game")
    @PostMapping
    public ResponseEntity<Game> create(@Validated @RequestBody GameRequest req) {
        Game createdGame = service.newGame(req.getUserId(), req.getUserChoice());
        return ResponseEntity.status(201).body(createdGame);
    }

    /* Get by users */

    @Operation(summary = "Show user's stats")
    @GetMapping("/users/{id}/stats")
    public Map<Result, Long> getUserStats(@PathVariable Long id) {
        return service.getUserStats(id);
    }

    @Operation(summary = "Get user history")
    @GetMapping("/users/{id}")
    public List<Game> getUserHistory(@PathVariable Long id) {
        return service.getUserHistory(id);
    }

    @Operation(summary = "Get all users history (list all games)")
    @GetMapping
    public List<Game> getAllUsersHistory(){
        return service.getAllUserHistory();
    }

    /* Get game */

    @Operation(summary = "Search game by id")
    @GetMapping("/id/{id}")
    public ResponseEntity<Game> getById(@PathVariable Long id) {
        return service.getGameById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete existing game")
    @DeleteMapping("/id/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
    	service.deleteGame(id);
    	return ResponseEntity.noContent().build();
    }
}
