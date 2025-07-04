package com.ssds.skillconnect.service;

import com.ssds.skillconnect.config.JwtService;
import com.ssds.skillconnect.dao.Post;
import com.ssds.skillconnect.dao.Project;
import com.ssds.skillconnect.dao.User;
import com.ssds.skillconnect.model.PostCreateRequestModel;
import com.ssds.skillconnect.repository.PostRepository;
import com.ssds.skillconnect.repository.ProjectRepository;
import com.ssds.skillconnect.repository.SkillRepository;
import com.ssds.skillconnect.repository.UserRepository;
import com.ssds.skillconnect.utils.exception.ApiRequestException;
import com.ssds.skillconnect.utils.helper.Mapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {
    @Autowired
    private PostService underTest;
    @Autowired
    private Mapper mapper;
    @Mock
    private JwtService jwtService;
    @Mock
    private PostRepository postRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private SkillRepository skillRepository;

    private String authHeader = "Bearer ";
    private User user;
    private Post post;


    @BeforeEach
    void setUp() {

        user = User.builder()
                .userId(1)
                .email("test@test")
                .build();

        Project project = Project.builder()
                .projectId(1)
                .projectCreator(user)
                .usersAssignedProjectList(new ArrayList<>())
                .build();

        post = Post.builder()
                .postTitle("title")
                .postDescription("description")
                .urgencyLevel(1)
                .user(user)
                .project(project)
                .listOfSkillsRequired(new ArrayList<>())
                .totalApplicants(0)
                .build();


        lenient().when(jwtService.extractUserEmail("")).thenReturn("test@test");
        lenient().when(userRepository.findByEmail("test@test")).thenReturn(Optional.ofNullable(user));
        lenient().when(userRepository.findById(1)).thenReturn(Optional.ofNullable(user));
        lenient().when(userRepository.findSavedPostsIdByUserId(1)).thenReturn(Optional.of(new ArrayList<>()));
        lenient().when(projectRepository.findById(1)).thenReturn(Optional.ofNullable(project));
        lenient().when(postRepository.findById(1)).thenReturn(Optional.ofNullable(post));

        mapper = new Mapper();

        underTest = new PostService(
                postRepository,
                userRepository,
                projectRepository,
                skillRepository,
                jwtService,
                mapper
        );

        authHeader = "Bearer ";

    }

    @Test
    void getAllPosts() {

        //given
        Integer departmentId = 1;
        Integer priority = 1;
        String skill = "skill";
        Integer sort = 0;
        Integer pageNumber = 0;
        Integer pageSize = 1;

        //when

        //then
        //ApiRequestException("No posts found", HttpStatus.NOT_FOUND);
        assertThrows(
                ApiRequestException.class,
                () -> underTest.getAllPosts(
                        authHeader,
                        departmentId,
                        priority,
                        skill,
                        sort,
                        pageNumber,
                        pageSize
                )
        );

        verify(postRepository).findPostByDepartmentIdAndSkillAndUrgencyLevel(
                departmentId,
                priority,
                skill,
                PageRequest.of(
                        pageNumber,
                        pageSize,
                        Sort.by("createdOn").descending())
        );

    }

    @Test
    void createPost() {
        //given
        PostCreateRequestModel postCreateRequestModel =
                PostCreateRequestModel.builder()
                        .postTitle("title")
                        .postDescription("description")
                        .urgencyLevel(1)
                        .projectId(1)
                        .totalApplicants(0)
                        .build();

        underTest.createPost(postCreateRequestModel, authHeader);

        //when
        verify(postRepository).save(post);

    }

    @Test
    void getPostById() {
        //given
        Integer postId = 1;

        //when
        post.setListOfApplicants(new ArrayList<>());
        underTest.getPostById(postId);

        //then
        verify(postRepository).findById(postId);
    }

    @Test
    void getAllApplicantsToPost() {
        //given
        Integer postId = 1;

        //when
        post.setListOfApplicants(new ArrayList<>());
        underTest.getAllApplicantsToPost(postId);

        //then
        verify(postRepository).findById(postId);
    }

    @Test
    void approveTheUser() {
        //given
        Integer postId = post.getPostId();
        Integer userId = user.getUserId();

        //when
        post.setListOfApplicants(new ArrayList<>());
        underTest.approveTheUser(postId, userId, authHeader);

        //then
        verify(postRepository).findById(postId);
    }

    @Test
    void applyToPost() {
        //given
        Integer postId = post.getPostId();

        //when
        post.setListOfApplicants(new ArrayList<>());
        underTest.applyToPost(postId, authHeader);

        //then
        verify(postRepository).findById(postId);
    }

    @Test
    void deleteClosedPostsOlderThan3Month() {
        //given

        //when
        underTest.deleteClosedPostsOlderThan3Month();

        //then
        Timestamp thresholdDate = Timestamp.valueOf(LocalDate.now().minusMonths(3).atStartOfDay());
        verify(postRepository).deleteAllByIsOpenAndCreatedOnBefore(false, thresholdDate);
    }

}