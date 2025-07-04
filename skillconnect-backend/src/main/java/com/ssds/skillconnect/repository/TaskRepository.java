package com.ssds.skillconnect.repository;

import com.ssds.skillconnect.dao.Task;
import com.ssds.skillconnect.model.CountOfTaskTypesModel;
import com.ssds.skillconnect.model.TaskResponseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {

    @Query("SELECT t " +
            "FROM Task t " +
            "WHERE t.project.projectId = :projectId")
    List<Task> findAllTaskByProjectId(@Param("projectId") Integer projectId);

    @Query("SELECT new com.ssds.skillconnect.model.CountOfTaskTypesModel(" +
            "COUNT(t.taskId), " +
            "SUM(CASE WHEN t.taskStatus = 'COMPLETED' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN t.taskStatus = 'PENDING' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN t.taskStatus = 'IN_PROGRESS' THEN 1 ELSE 0 END)) " +
            "FROM Task t " +
            "WHERE t.project.projectId = :projectId")
    CountOfTaskTypesModel findCountOfTaskTypesModelInProjectId(@Param("projectId") Integer projectId);

}
