package com.ssds.skillconnect.repository;

import com.ssds.skillconnect.dao.*;
import lombok.extern.java.Log;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;


@DataJpaTest
@Log
class PostRepositoryTest {
    @Autowired
    private PostRepository underTest;
    @Autowired
    private SkillRepository skillRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private ProjectRepository projectRepository;
    private List<Post> samplePostList;
    private List<Skill> sampleSkillList;
    private List<Project> sampleProjectList;
    private Department sampleDepartment;


    @BeforeEach
    void setUp() {

        sampleSkillList = new ArrayList<>(
                List.of(
                        Skill.builder().skillName("skill1").build(),
                        Skill.builder().skillName("skill2").build()
                )
        );

        sampleDepartment = Department.builder()
                .departmentName("department1")
                .build();

        sampleProjectList = new ArrayList<>(
                List.of(
                        Project.builder()
                                .projectName("project1")
                                .projectDetails("details1")
                                .department(sampleDepartment)
                                .build(),
                        Project.builder()
                                .projectName("project2")
                                .projectDetails("details2")
                                .department(sampleDepartment)
                                .build()
                )
        );


        samplePostList = new ArrayList<>(
                List.of(
                        Post.builder()
                                .postTitle("title1")
                                .postDescription("description1")
                                .urgencyLevel(1)
                                .isOpen(true)
                                .listOfSkillsRequired(sampleSkillList)
                                .createdOn(Timestamp.valueOf(LocalDate.now().minusMonths(10).atStartOfDay()))
                                .project(sampleProjectList.get(0))
                                .build(),
                        Post.builder()
                                .postTitle("title2")
                                .postDescription("description2")
                                .urgencyLevel(1)
                                .isOpen(true)
                                .listOfSkillsRequired(sampleSkillList)
                                .createdOn(Timestamp.valueOf(LocalDate.now().minusMonths(10).atStartOfDay()))
                                .project(sampleProjectList.get(1))
                                .build()
                )
        );

    }

    void saveAllDataInDb() {
        sampleSkillList = skillRepository.saveAll(sampleSkillList);
        sampleDepartment = departmentRepository.save(sampleDepartment);
        sampleProjectList = projectRepository.saveAll(sampleProjectList);
        samplePostList = underTest.saveAll(samplePostList);
        log.info("sampleSkillList: " + sampleSkillList + "\n");
        log.info("sampleDepartment: " + sampleDepartment + "\n");
        log.info("sampleProjectList: " + sampleProjectList + "\n");
        log.info("samplePostList: " + samplePostList + "\n");
    }

    @Test
    void itShouldFindPostByDepartmentIdAndSkillAndUrgencyLevelForAllNull() {
        // Given
        Long expected = 0L;
        // When
        Page<Post> actual = underTest.findPostByDepartmentIdAndSkillAndUrgencyLevel(
                null,
                null,
                null,
                null
        );
        // Then
        assertEquals(expected, actual.getTotalElements());
    }

    @Test
    void itShouldFindPostByDepartmentIdAndSkillAndUrgencyLevelForAllNotNull() {
        // Given
        Long expected = 0L;
        // When
        Page<Post> actual = underTest.findPostByDepartmentIdAndSkillAndUrgencyLevel(
                sampleDepartment.getDepartmentId(),
                1,
                "skill1",
                PageRequest.of(0, 1, Sort.by("createdOn").descending())
        );
        // Then
        assertEquals(expected, actual.getTotalElements());
    }

    @Test
    void itShouldFindPostByDepartmentIdAndSkillAndUrgencyLevelForData() {
        // Given
        saveAllDataInDb();
        // When
        Page<Post> actual = underTest.findPostByDepartmentIdAndSkillAndUrgencyLevel(
                sampleDepartment.getDepartmentId(),
                1,
                "skill1",
                PageRequest.of(0, 1, Sort.by("createdOn").descending())
        );
        // Then
        assertEquals(2, actual.getTotalElements(), "Total elements should be 1");
        assertEquals(samplePostList.get(0).getPostId(), actual.getContent().get(0).getPostId(), "Post id should be 1");
        assertEquals(samplePostList.get(0).getPostTitle(), actual.getContent().get(0).getPostTitle(), "Post title should be title1");
        assertEquals(samplePostList.get(0).getPostDescription(), actual.getContent().get(0).getPostDescription(), "Post description should be description1");
        assertEquals(samplePostList.get(0).getUrgencyLevel(), actual.getContent().get(0).getUrgencyLevel(), "Urgency level should be 1");
        assertEquals(2, actual.getTotalPages(), "Total pages should be 2");
    }


    @Test
    void itShouldDeleteAllByIsOpenAndCreatedOnBefore() {
        // Given
        saveAllDataInDb();
        Long expected = 0L;
        // When
        Timestamp thresholdDate = Timestamp.valueOf(LocalDate.now().atStartOfDay());
        underTest.deleteAllByIsOpenAndCreatedOnBefore(true, thresholdDate);
        // Then
        assertEquals(expected, underTest.count(), "Count should be 0 as all posts are deleted");
    }


    @AfterEach
    void tearDown() {
        samplePostList.clear();
        sampleSkillList.clear();
        sampleProjectList.clear();
        sampleDepartment = null;
    }

}