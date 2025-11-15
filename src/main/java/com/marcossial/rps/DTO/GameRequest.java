package com.marcossial.rps.DTO;

import com.marcossial.rps.Model.Choice;
import com.marcossial.rps.Model.Result;
import com.marcossial.rps.Model.User;

public class GameRequest {
    private Long userId;
    private Choice userChoice;
    private Choice npcChoice;
    private Result result;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
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
}
