package com.ssds.skillconnect.repository;

import com.ssds.skillconnect.dao.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    @Query("SELECT p " +
            "FROM Project p " +
            "WHERE p.projectCreator.userId = :userId OR :userId IN (SELECT u.userId FROM p.usersAssignedProjectList u)")
    Page<Project> findAllProjectByProjectCreatorOrPersonsAssigned(Pageable pageable, @Param("userId") Integer userId);

    @Query("SELECT p " +
            "FROM Project p " +
            "WHERE p.isFinished = false")
    List<Project> findAllOpenProjects();

}
