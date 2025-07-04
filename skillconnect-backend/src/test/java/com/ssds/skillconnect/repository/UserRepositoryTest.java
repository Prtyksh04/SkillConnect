package com.ssds.skillconnect.repository;

import com.ssds.skillconnect.dao.Department;
import com.ssds.skillconnect.dao.Post;
import com.ssds.skillconnect.dao.User;
import lombok.extern.java.Log;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Log
class UserRepositoryTest {


    @Autowired
    private UserRepository underTest;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private PostRepository postRepository;


    private Department sampleDepartment;
    private List<Post> sampleSavedPostsList;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleDepartment = Department.builder()
                .departmentName("department1")
                .build();

        sampleSavedPostsList = new ArrayList<>(
                List.of(
                        Post.builder()
                                .postTitle("title1")
                                .postDescription("description1")
                                .build(),
                        Post.builder()
                                .postTitle("title2")
                                .postDescription("description2")
                                .build()
                )
        );

        sampleUser = User.builder()
                .name("user1")
                .email("email1")
                .department(sampleDepartment)
                .savedPosts(sampleSavedPostsList)
                .build();
    }

    void saveAllDataInDB() {
        sampleDepartment = departmentRepository.save(sampleDepartment);
        sampleSavedPostsList = postRepository.saveAll(sampleSavedPostsList);
        sampleUser = underTest.save(sampleUser);
    }

    @Test
    void itShouldFindByEmail() {
        //given
        saveAllDataInDB();
        //when
        Optional<User> actual = underTest.findByEmail(sampleUser.getEmail());
        //then
        assertTrue(actual.isPresent());
        assertEquals(sampleUser, actual.get());
    }

    @Test
    void itShouldFindAllUserByDepartmentId() {
        //given
        saveAllDataInDB();
        //when
        Optional<List<User>> actual = underTest.findAllUserByDepartmentId(sampleDepartment.getDepartmentId());
        //then
        assertTrue(actual.isPresent());
        assertEquals(sampleUser, actual.get().get(0));
    }

    @Test
    void itShouldFindByNameContainingAndNotInProject() {
        //TODO: implement this test
        assert true;
    }

    @Test
    void itShouldFindSavedPostsIdByUserId() {
        //given
        saveAllDataInDB();
        //when
        Optional<List<Integer>> actual = underTest.findSavedPostsIdByUserId(sampleUser.getUserId());
        //then
        assertTrue(actual.isPresent());
        assertArrayEquals(
                sampleSavedPostsList.stream().mapToInt(Post::getPostId).toArray(),
                actual.get().stream().mapToInt(Integer::intValue).toArray()
        );
    }

    @Test
    void itShouldFindSavedPostsByUserId() {
        //given
        saveAllDataInDB();
        //when
        Optional<List<Post>> actual = underTest.findSavedPostsByUserId(sampleUser.getUserId());
        //then
        assertTrue(actual.isPresent());
        assertEquals(sampleSavedPostsList, actual.get());
    }

    @Test
    void itShouldFindAllUsersInProject() {
        //TODO: implement this test
        assert true;
    }

    @AfterEach
    void tearDown() {
        sampleUser = null;
        sampleSavedPostsList.clear();
        sampleDepartment = null;
    }

}