package com.marcossial.rps.Controller;

import com.marcossial.rps.Model.Choice;
import com.marcossial.rps.Model.Game;
import com.marcossial.rps.Service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
public class GameController {
    GameService service;

    @PostMapping("/game")
    public Game newGame(@RequestBody long userId, Choice userChoice) {
        return service.newGame(userId, userChoice);
    }

    @GetMapping("/users/{id}/games")
    public List<Game> getUserHistory(@PathVariable long id) {
        return service.getUserHistory(id);
    }

}
