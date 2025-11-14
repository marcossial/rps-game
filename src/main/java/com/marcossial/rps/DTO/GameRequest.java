package com.marcossial.rps.DTO;

import com.marcossial.rps.Model.Choice;

public class GameRequest {
    private long userId;
    private Choice userChoice;

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
}
