package com.ssds.skillconnect.repository;

import com.ssds.skillconnect.dao.TaskUpdates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskUpdatesRepository extends JpaRepository<TaskUpdates, Integer> {

    @Query("SELECT tU " +
            "FROM TaskUpdates tU " +
            "WHERE tU.task.taskId = :taskId")
    Optional<List<TaskUpdates>> findAllByTaskId(@Param("taskId") Integer taskId);

}
