package com.marcossial.rps.Service;

import com.marcossial.rps.Model.User;
import com.marcossial.rps.Repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    UserRepository repository;

    
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> getAllUsers() {
        return repository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return repository.findById(id);
    }

    public Optional<User> getUserByName(String name) {
        return repository.findByName(name);
    }

    public User createUser(User user) {
        return repository.save(user);
    }

    public User updateScore(Long id, long addedScore) {
        if (addedScore < 0) {
            throw new RuntimeException("Added score must be positive");
        }

        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setScore(user.getScore() + addedScore);

        return repository.save(user);
    }

    public void deleteUser(Long id) {
        repository.deleteById(id);
    }

    public Optional<User> updateUser(Long id, User details) {
        return repository.findById(id)
                .map(existingUser -> {
                    if (details.getName() != null) {
                        existingUser.setName(details.getName());
                    }
                    if (details.getScore() != 0) {
                        existingUser.setScore(details.getScore());
                    }

                    return repository.save(existingUser);
                });


    }
}
