package com.ssds.skillconnect.service;

import com.ssds.skillconnect.config.JwtService;
import com.ssds.skillconnect.dao.Department;
import com.ssds.skillconnect.dao.Project;
import com.ssds.skillconnect.dao.User;
import com.ssds.skillconnect.model.ProjectCreateRequestModel;
import com.ssds.skillconnect.repository.*;
import com.ssds.skillconnect.utils.exception.ApiRequestException;
import com.ssds.skillconnect.utils.helper.Mapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    @Autowired
    private ProjectService underTest;
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
    @Mock
    private DepartmentRepository departmentRepository;
    @Mock
    private TaskRepository taskRepository;

    private final String authHeader = "Bearer ";
    private User user;
    private User user2;
    private List<User> userAssignProjectList;
    private Project project;
    private Department department;

    @BeforeEach
    void setUp() {

        department = Department.builder()
                .departmentId(1)
                .departmentName("test")
                .build();

        user = User.builder()
                .userId(1)
                .email("test@test")
                .build();

        user2 = User.builder()
                .userId(2)
                .email("test2@test")
                .build();

        userAssignProjectList = new ArrayList<>();
        userAssignProjectList.add(user2);


        project = Project.builder()
                .projectName("test")
                .projectDetails("test")
                .projectCreator(user)
                .department(department)
                .usersAssignedProjectList(userAssignProjectList)
                .build();

        lenient().when(jwtService.extractUserEmail("")).thenReturn("test@test");
        lenient().when(userRepository.findByEmail("test@test")).thenReturn(Optional.ofNullable(user));
        lenient().when(userRepository.findById(1)).thenReturn(Optional.ofNullable(user));
        lenient().when(userRepository.findById(2)).thenReturn(Optional.ofNullable(user2));
        lenient().when(userRepository.findAllById(new ArrayList<>(List.of(user2.getUserId())))).thenReturn(userAssignProjectList);
        lenient().when(userRepository.findAllUsersInProject(user.getUserId(), project.getProjectId())).thenReturn(Optional.ofNullable(userAssignProjectList));
        lenient().when(departmentRepository.findById(department.getDepartmentId())).thenReturn(Optional.ofNullable(department));
        lenient().when(projectRepository.findById(project.getProjectId())).thenReturn(Optional.ofNullable(project));


        mapper = new Mapper();

        underTest = new ProjectService(
                projectRepository,
                userRepository,
                departmentRepository,
                taskRepository,
                jwtService,
                mapper
        );

    }

    @Test
    void getAllProjects() {
        //given

        Integer pageNumber = 0;
        Integer pageSize = 1;
        //when

        assertThrows(
                ApiRequestException.class,
                () -> underTest.getAllProjects(
                        authHeader,
                        pageNumber,
                        pageSize
                )
        );
        //then
        verify(projectRepository).findAll(PageRequest.of(pageNumber, pageSize));
    }

    @Test
    void getProjectByUser() {
        //given
        Integer pageNumber = 0;
        Integer pageSize = 1;
        //when
        assertThrows(
                ApiRequestException.class,
                () -> underTest.getProjectByUser(
                        authHeader,
                        pageNumber,
                        pageSize
                )
        );
        //then
        verify(projectRepository).findAllProjectByProjectCreatorOrPersonsAssigned(
                PageRequest.of(pageNumber, pageSize),
                user.getUserId()
        );
    }

    @Test
    void createProject() {
        //given

        Integer departmentId = department.getDepartmentId();
        String projectName = project.getProjectName();
        String projectDetails = project.getProjectDetails();

        ProjectCreateRequestModel projectCreateRequestModel = ProjectCreateRequestModel.builder()
                .projectName(projectName)
                .projectDetails(projectDetails)
                .departmentId(departmentId)
                .userIdsAssignedProjectList(userAssignProjectList.stream().map(User::getUserId).toList())
                .build();

        //when
        underTest.createProject(
                projectCreateRequestModel,
                authHeader
        );
        //then
        verify(projectRepository).save(project);
    }

    @Test
    void getProjectById() {
        //given
        Integer projectId = project.getProjectId();
        //when
        underTest.getProjectById(
                projectId
        );
        //then
        verify(projectRepository).findById(projectId);
    }

    @Test
    void addUserToProject() {
        //given
        Integer projectId = project.getProjectId();
        Integer userId = user.getUserId();
        //when
        underTest.addUserToProject(
                projectId,
                userId,
                authHeader
        );
        //then
        verify(projectRepository).findById(projectId);
        verify(userRepository).findById(userId);
        verify(projectRepository).save(project);
    }

    @Test
    void removeUserFromProject() {
        //given
        Integer projectId = project.getProjectId();
        Integer userId = user2.getUserId();
        //when
        underTest.removeUserFromProject(
                projectId,
                userId
        );
        //then
        verify(projectRepository).findById(projectId);
        verify(userRepository).findById(userId);
        verify(projectRepository).save(project);
    }

    @Test
    void getAllOpenProjects() {
        //given

        //when
        underTest.getAllOpenProjects();
        //then
        verify(projectRepository).findAllOpenProjects();
    }

    @Test
    void getAllUsersInProject() {
        //given
        Integer userId = user.getUserId();
        Integer projectId = project.getProjectId();
        //when
        underTest.getAllUsersInProject(
                authHeader,
                projectId
        );
        //then
        verify(userRepository).findAllUsersInProject(
                userId,
                projectId
        );
    }
}