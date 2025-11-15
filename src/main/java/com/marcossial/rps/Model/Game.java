package com.marcossial.rps.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @Enumerated(EnumType.STRING)
    private Choice userChoice;

    @Enumerated(EnumType.STRING)
    private Choice npcChoice;

    @Enumerated(EnumType.STRING)
    private Result result;

    @CreationTimestamp
    private LocalDateTime date;

    /**
     * Armazena qual era o streak do usuário APÓS esta partida.
     */
    @Column(name = "user_streak_after")
    private int userStreak;

    public Game() { }

    public Game(User user, Choice userChoice, Choice npcChoice, Result result) {
        this.user = user;
        this.userChoice = userChoice;
        this.npcChoice = npcChoice;
        this.result = result;
    }

    public Long getId() {
        return id;
    }

    public void setUserChoice(Choice userChoice) {
        this.userChoice = userChoice;
    }

    public Choice getUserChoice() {
        return userChoice;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public int getUserStreak() {
        return userStreak;
    }

    public void setUserStreak(int userStreak) {
        this.userStreak = userStreak;
    }


}
