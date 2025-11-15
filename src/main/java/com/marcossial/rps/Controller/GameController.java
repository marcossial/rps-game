package com.marcossial.rps.Controller;

import com.marcossial.rps.DTO.GameRequest;
import com.marcossial.rps.Model.Game;
import com.marcossial.rps.Service.GameService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("/game")
@Controller
public class GameController {
    GameService service;

    GameController(GameService service) {
        this.service = service;
    }

    @PostMapping
    public Game newGame(@RequestBody GameRequest req) {
        return service.newGame(req.getUserId(), req.getUserChoice());
    }

    @GetMapping("/users/{id}")
    public List<Game> getUserHistory(@PathVariable long id) {
        return service.getUserHistory(id);
    }
    
    @GetMapping
    public List<Game> getAllUsersHistory(){
    	return service.geAllUserHistory();
    }
    
    @DeleteMapping
    public void deleteGameById (@PathVariable Long id) {
    	service.deleteGame(id);
    	
    }
}
