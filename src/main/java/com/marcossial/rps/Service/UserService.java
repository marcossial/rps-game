package com.marcossial.rps.Service;

import com.marcossial.rps.Model.User;
import com.marcossial.rps.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    UserRepository repository;

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public User newUser(User user) {
        return repository.save(user);
    }

    public Optional<User> getUserById(long id) {
        return repository.findById(id);
    }

    public Optional<User> getUserByName(String name) {
        return repository.findByName(name);
    }

    public User updateScore(long id, long addedScore) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setScore(user.getScore() + addedScore);
        return repository.save(user);
    }

    public void deleteUser(long id) {
        repository.deleteById(id);
    }
}
