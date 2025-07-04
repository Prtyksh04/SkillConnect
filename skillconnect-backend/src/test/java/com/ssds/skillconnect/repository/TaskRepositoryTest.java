package com.ssds.skillconnect.repository;

import com.ssds.skillconnect.dao.Project;
import com.ssds.skillconnect.dao.Task;
import com.ssds.skillconnect.model.CountOfTaskTypesModel;
import com.ssds.skillconnect.model.TaskStatus;
import lombok.extern.java.Log;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Log
class TaskRepositoryTest {

    @Autowired
    private TaskRepository underTest;

    @Autowired
    private ProjectRepository projectRepository;

    private Project sampleProject;
    private List<Task> sampleTaskList;

    @BeforeEach
    void setUp() {

        sampleProject = Project.builder()
                .projectName("project1")
                .projectDetails("description1")
                .build();

        sampleTaskList = new ArrayList<>(
                List.of(
                        Task.builder()
                                .taskTitle("task1")
                                .taskDescription("description1")
                                .project(sampleProject)
                                .taskStatus(TaskStatus.PENDING)
                                .build(),
                        Task.builder()
                                .taskTitle("task2")
                                .taskDescription("description2")
                                .project(sampleProject)
                                .taskStatus(TaskStatus.PENDING)
                                .build(),
                        Task.builder()
                                .taskTitle("task3")
                                .taskDescription("description3")
                                .project(sampleProject)
                                .taskStatus(TaskStatus.IN_PROGRESS)
                                .build(),
                        Task.builder()
                                .taskTitle("task4")
                                .taskDescription("description4")
                                .project(sampleProject)
                                .taskStatus(TaskStatus.COMPLETED)
                                .build()
                )
        );

    }

    void saveAllDataInDB() {
        projectRepository.save(sampleProject);
        underTest.saveAll(sampleTaskList);
    }

    @Test
    void itShouldFindAllTaskByProjectId() {
        //given
        saveAllDataInDB();
        //when
        List<Task> actual = underTest.findAllTaskByProjectId(sampleProject.getProjectId());
        //then
        assertEquals(sampleTaskList, actual);
    }

    @Test
    void itShouldFindCountOfTaskTypesModelInProjectId() {
        //given
        saveAllDataInDB();
        Long expectedTasksCount = (long) sampleTaskList.size();
        Long expectedTasksPending = (long) sampleTaskList.stream()
                .filter(task -> task.getTaskStatus().equals(TaskStatus.PENDING))
                .toList()
                .size();
        Long expectedTasksInProgress = (long) sampleTaskList.stream()
                .filter(task -> task.getTaskStatus().equals(TaskStatus.IN_PROGRESS))
                .toList()
                .size();
        Long expectedTasksCompleted = (long) sampleTaskList.stream()
                .filter(task -> task.getTaskStatus().equals(TaskStatus.COMPLETED))
                .toList()
                .size();
        //when
        CountOfTaskTypesModel actual = underTest.findCountOfTaskTypesModelInProjectId(sampleProject.getProjectId());
        //then
        assertEquals(expectedTasksCount, actual.getTasksCount());
        assertEquals(expectedTasksPending, actual.getTasksPending());
        assertEquals(expectedTasksInProgress, actual.getTasksInProgress());
        assertEquals(expectedTasksCompleted, actual.getTasksCompleted());
    }

    @AfterEach
    void tearDown() {
        sampleProject = null;
        sampleTaskList.clear();
    }

}