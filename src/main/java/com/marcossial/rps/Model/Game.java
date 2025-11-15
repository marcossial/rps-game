package com.marcossial.rps.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private Choice userChoice;

    @Enumerated(EnumType.STRING)
    private Choice npcChoice;

    @Enumerated(EnumType.STRING)
    private Result result;

    private LocalDateTime date;

    public Game() {
        this.date = LocalDateTime.now();
    }

    public Game(Long userId, Choice userChoice, Choice npcChoice, Result result) {
        this.userId = userId;
        this.userChoice = userChoice;
        this.npcChoice = npcChoice;
        this.result = result;
        this.date = LocalDateTime.now();
    }

    public long getId() {
        return id;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public Choice getUserChoice() {
        return userChoice;
    }

    public void setUserChoice(Choice userChoice) {
        this.userChoice = userChoice;
    }

    public Choice getNpcChoice() {
        return npcChoice;
    }

    public void setNpcChoice(Choice npcChoice) {
        this.npcChoice = npcChoice;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
