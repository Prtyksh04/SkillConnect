package com.ssds.skillconnect.repository;

import com.ssds.skillconnect.dao.Department;
import com.ssds.skillconnect.dao.Project;
import com.ssds.skillconnect.dao.User;
import lombok.extern.java.Log;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Log
class ProjectRepositoryTest {

    @Autowired
    private ProjectRepository underTest;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private UserRepository userRepository;

    private List<Project> sampleProjectList;
    private Department sampleDepartment;
    private User sampleUserCreator;
    private List<User> sampleUserAssignedList;

    @BeforeEach
    void setUp() {

        sampleDepartment = Department.builder()
                .departmentName("department1")
                .build();

        sampleUserCreator = User.builder()
                .name("user1")
                .email("email1")
                .department(sampleDepartment)
                .build();

        sampleUserAssignedList = new ArrayList<>(
                List.of(
                        User.builder()
                                .name("user2")
                                .email("email2")
                                .department(sampleDepartment)
                                .build(),
                        User.builder()
                                .name("user3")
                                .email("email3")
                                .department(sampleDepartment)
                                .build()
                )
        );


        sampleProjectList = new ArrayList<>(
                List.of(
                        Project.builder()
                                .projectCreator(sampleUserCreator)
                                .projectName("project1")
                                .projectDetails("project1 description")
                                .startDate(Timestamp.valueOf(LocalDate.now().atStartOfDay()))
                                .endDate(Timestamp.valueOf(LocalDate.now().plusMonths(1).atStartOfDay()))
                                .department(sampleDepartment)
                                .usersAssignedProjectList(sampleUserAssignedList)
                                .isFinished(false)
                                .build(),
                        Project.builder()
                                .projectCreator(sampleUserCreator)
                                .projectName("project2")
                                .projectDetails("project2 description")
                                .startDate(Timestamp.valueOf(LocalDate.now().atStartOfDay()))
                                .endDate(Timestamp.valueOf(LocalDate.now().plusMonths(1).atStartOfDay()))
                                .department(sampleDepartment)
                                .usersAssignedProjectList(sampleUserAssignedList)
                                .isFinished(true)
                                .build(),
                        Project.builder()
                                .projectCreator(sampleUserCreator)
                                .projectName("project3")
                                .projectDetails("project3 description")
                                .startDate(Timestamp.valueOf(LocalDate.now().atStartOfDay()))
                                .endDate(Timestamp.valueOf(LocalDate.now().plusMonths(1).atStartOfDay()))
                                .department(sampleDepartment)
                                .isFinished(true)
                                .build()

                )
        );
    }


    void saveAllDataInDb() {
        sampleDepartment = departmentRepository.save(sampleDepartment);
        sampleUserCreator = userRepository.save(sampleUserCreator);
        sampleUserAssignedList = userRepository.saveAll(sampleUserAssignedList);
        sampleProjectList = underTest.saveAll(sampleProjectList);
    }


    @Test
    void itShouldFindAllProjectByProjectCreatorOrPersonsAssigned_WhenProjectCreator() {
        // given
        saveAllDataInDb();
        // when
        Pageable pageable = PageRequest.of(0, sampleProjectList.size());
        List<Project> actual = underTest.findAllProjectByProjectCreatorOrPersonsAssigned(pageable, sampleUserCreator.getUserId()).getContent();
        // then
        assertEquals(3, actual.size(), "should return 3 projects");

        List<String> projectNames = actual.stream().map(Project::getProjectName).toList();
        assertTrue(projectNames.contains("project1") && projectNames.contains("project2") && projectNames.contains("project3"), "should contain project1 and project2");
    }

    @Test
    void itShouldFindAllProjectByProjectCreatorOrPersonsAssigned_WhenPersonAssigned() {
        // given
        saveAllDataInDb();
        // when
        Pageable pageable = PageRequest.of(0, sampleProjectList.size());
        List<Project> actual = underTest.findAllProjectByProjectCreatorOrPersonsAssigned(pageable, sampleUserAssignedList.get(0).getUserId()).getContent();
        // then
        assertEquals(2, actual.size(), "should return 2 projects");

        List<String> projectNames = actual.stream().map(Project::getProjectName).toList();
        assertTrue(projectNames.contains("project1") && projectNames.contains("project2"), "should contain project1 and project2");
    }


    @Test
    void itShouldFindAllOpenProjects() {
        // given
        saveAllDataInDb();
        // when
        List<Project> actual = underTest.findAllOpenProjects();
        // then
        assertEquals(1, actual.size());
        assertEquals("project1", actual.get(0).getProjectName(), "should return project1");
    }


    @AfterEach
    void tearDown() {
        sampleDepartment = null;
        sampleProjectList.clear();
    }


}