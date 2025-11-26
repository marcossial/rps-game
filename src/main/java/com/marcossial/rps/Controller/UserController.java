package com.marcossial.rps.Controller;

import com.marcossial.rps.Model.User;
import com.marcossial.rps.Service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Users", description = "Basic user operations")
@RestController
@RequestMapping("/users")
public class UserController {
    UserService service;

    UserController(UserService service) {
        this.service = service;
    }

    @Operation(summary = "List all users")
    @GetMapping
    public List<User> getAll() {
        return service.getAllUsers();
    }

    @Operation(summary = "Find user by id")
    @GetMapping("id/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return service.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Find user by name")
    @GetMapping("name/{name}")
    public ResponseEntity<User> getByName(@PathVariable String name) {
        return service.getUserByName(name)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create new user")
    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        User created = service.createUser(user);
        return ResponseEntity.status(201).body(created);
    }

    @Operation(summary = "Update user")
    @PutMapping("id/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User details) {
        Optional<User> updated = service.updateUser(id, details);

        return updated
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete existing user")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
