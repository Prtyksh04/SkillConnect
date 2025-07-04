package com.ssds.skillconnect.repository;

import com.ssds.skillconnect.dao.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Integer> {

    @Query("SELECT s " +
            "FROM Skill s " +
            "WHERE lower(s.skillName) LIKE lower(concat('%', :skillName,'%'))")
    List<Skill> findSimilarSkills(@Param("skillName") String skillName);

    Optional<Skill> findBySkillName(String skillName);
}
