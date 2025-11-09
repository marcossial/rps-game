package com.marcossial.rps.Repository;

import com.marcossial.rps.Model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findUserByUserIdOrderByDateDesc(long userId);
    List<Game> findByUserId(Long userId);
}
