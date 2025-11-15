package com.marcossial.rps.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    private long score;

    private LocalDateTime createdDate;

    public User() {
        this.createdDate = LocalDateTime.now();
    }

    /**
     * Armazena a contagem de vitórias seguidas do usuário.
     * É zerado se o usuário perder ou empatar.
     */
    @Column(name = "current_streak", nullable = false, columnDefinition = "INT DEFAULT 0")
    private int currentStreak = 0;

    public User(String name, long score) {
        this.name = name;
        this.score = score;
        this.createdDate = LocalDateTime.now();
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getScore() {
        return score;
    }

    public void setScore(long score) {
        this.score = score;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }
}
