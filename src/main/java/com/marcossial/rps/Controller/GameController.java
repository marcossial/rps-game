package com.marcossial.rps.Controller.Api;

import com.marcossial.rps.DTO.GameRequest;
import com.marcossial.rps.Model.Game;
import com.marcossial.rps.Service.GameService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
public class GameController {
    GameService service;

    GameController(GameService service) {
        this.service = service;
    }

    @PostMapping("/game")
    public Game newGame(@RequestBody GameRequest req) {
        return service.newGame(req.getUserId(), req.getUserChoice());
    }

    @GetMapping("/users/{id}/games")
    public List<Game> getUserHistory(@PathVariable long id) {
        return service.getUserHistory(id);
    }

}
