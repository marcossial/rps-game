package com.marcossial.rps.Controller;

import com.marcossial.rps.Model.User;
import com.marcossial.rps.Service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@Controller
public class UserController {
    UserService service;

    UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/users/id/{id}")
    public Optional<User> getUserById(@PathVariable long id) {
        return service.getUserById(id);
    }

    @GetMapping("/users/name/{name}")
    public Optional<User> getUserByName(@PathVariable String name) {
        return service.getUserByName(name);
    }

    @PostMapping("/users/create")
    public User newUser(@RequestBody String name) {
        return service.newUser(name);
    }
}
