package com.ssds.skillconnect.service;

import com.ssds.skillconnect.config.JwtService;
import com.ssds.skillconnect.dao.Department;
import com.ssds.skillconnect.dao.Project;
import com.ssds.skillconnect.dao.User;
import com.ssds.skillconnect.model.*;
import com.ssds.skillconnect.repository.DepartmentRepository;
import com.ssds.skillconnect.repository.ProjectRepository;
import com.ssds.skillconnect.repository.TaskRepository;
import com.ssds.skillconnect.repository.UserRepository;
import com.ssds.skillconnect.utils.exception.ApiRequestException;
import com.ssds.skillconnect.utils.helper.Mapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log
public class ProjectService {

    private final ProjectRepository projectRepo;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final TaskRepository taskRepository;
    private final JwtService jwtService;
    private final Mapper mapper;

    public List<ProjectRowResponseModel> getAllProjects(
            String authorizationHeader,
            Integer pageNumber,
            Integer pageSize) {
        try {

            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);

            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found"));

            Integer userId = user.getUserId();

            Pageable pageable = PageRequest.of(pageNumber, pageSize);

            Page<Project> listOfProjects = projectRepo.findAll(pageable);

            if(listOfProjects == null || listOfProjects.isEmpty()) {
                throw new ApiRequestException("No projects found");
            }

            Page<ProjectRowResponseModel> projectRowResponseModelPage = listOfProjects.map(
                    mapper::Project_to_ProjectRowResponseModel
            );

            List<ProjectRowResponseModel> projectRowResponseModelList = projectRowResponseModelPage.getContent();

            projectRowResponseModelList.forEach(projectRowResponseModel -> {
                Integer projectId = projectRowResponseModel.getProjectId();
                CountOfTaskTypesModel countOfTaskTypesModel = taskRepository.findCountOfTaskTypesModelInProjectId(projectId);
                projectRowResponseModel.setCountOfTaskTypes(countOfTaskTypesModel);

                Project currentProject = projectRepo.findById(projectId)
                        .orElseThrow(() -> new ApiRequestException("Project not found"));

                projectRowResponseModel.setIsCreator(
                        Objects.equals(currentProject.getProjectCreator().getUserId(), userId)
                );
                projectRowResponseModel.setTotalNumberOfPages(projectRowResponseModelPage.getTotalPages());
            });

            return projectRowResponseModelList;

        } catch (Exception e) {
            throw new ApiRequestException("something went wrong : " + e.getMessage());
        }
    }

    public List<ProjectRowResponseModel> getProjectByUser(
            String authorizationHeader,
            Integer pageNumber,
            Integer pageSize) {
        try {
            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);

            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found"));

            Integer userId = user.getUserId();

            Pageable pageable = PageRequest.of(pageNumber, pageSize);

            Page<Project> projectRowResponseModelPage = projectRepo.findAllProjectByProjectCreatorOrPersonsAssigned(
                    pageable,
                    userId
            );

            if(projectRowResponseModelPage == null || projectRowResponseModelPage.isEmpty()) {
                throw new ApiRequestException("No projects found");
            }

            List<ProjectRowResponseModel>projectRowResponseModelList = projectRowResponseModelPage
                    .stream()
                    .map(mapper::Project_to_ProjectRowResponseModel)
                    .collect(Collectors.toList());

            projectRowResponseModelList.forEach(projectRowResponseModel -> {
                Integer projectId = projectRowResponseModel.getProjectId();
                CountOfTaskTypesModel countOfTaskTypesModel = taskRepository.findCountOfTaskTypesModelInProjectId(projectId);
                projectRowResponseModel.setCountOfTaskTypes(countOfTaskTypesModel);

                Project currentProject = projectRepo.findById(projectId)
                        .orElseThrow(() -> new ApiRequestException("Project not found"));

                projectRowResponseModel.setIsCreator(
                        Objects.equals(currentProject.getProjectCreator().getUserId(), userId)
                );
                projectRowResponseModel.setTotalNumberOfPages(projectRowResponseModelPage.getTotalPages());

            });

            return projectRowResponseModelList;

        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }


    public ProjectResponseModel createProject(
            ProjectCreateRequestModel projectCreateRequestModel,
            String authorizationHeader) {
        try {
            Project project = new Project();

            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);

            User projectCreator = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found"));

            project.setProjectCreator(projectCreator);

            project.setProjectName(projectCreateRequestModel.getProjectName());
            project.setProjectDetails(projectCreateRequestModel.getProjectDetails());
            project.setStartDate(projectCreateRequestModel.getStartDate());
            project.setEndDate(projectCreateRequestModel.getEndDate());
            project.setIsFinished(projectCreateRequestModel.getIsFinished());

            Department userDepartment = departmentRepository.findById(projectCreateRequestModel.getDepartmentId())
                    .orElseThrow(() -> new ApiRequestException("Department not found"));

            project.setDepartment(userDepartment);

            List<User> usersAssignedProjectList = userRepository
                    .findAllById(projectCreateRequestModel.getUserIdsAssignedProjectList());

            project.setUsersAssignedProjectList(usersAssignedProjectList);

            Project savedProject = projectRepo.save(project);

            return mapper.Project_to_ProjectCreateResponseModel(savedProject);

        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }

    public ProjectResponseModel getProjectById(Integer projectId) {
        try {
            Project project = projectRepo.findById(projectId)
                    .orElseThrow(() -> new ApiRequestException("Project not found"));

            return mapper.Project_to_ProjectCreateResponseModel(project);

        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }

    public ProjectResponseModel addUserToProject(
            Integer projectId,
            Integer userId,
            String authorizationHeader) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ApiRequestException("User not found"));

            Project project = projectRepo.findById(projectId)
                    .orElseThrow(() -> new ApiRequestException("Project not found"));


            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);

            User projectCreator = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found"));

            if (!project.getProjectCreator().equals(projectCreator)) {
                throw new ApiRequestException("Only project creator can add users to project");
            }

            List<User> usersAssignedProjectList = project.getUsersAssignedProjectList();
            if (usersAssignedProjectList.contains(user)) {
                throw new ApiRequestException("User already assigned to project");
            }
            usersAssignedProjectList.add(user);
            return mapper.Project_to_ProjectCreateResponseModel(projectRepo.save(project));

        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }

    public ProjectResponseModel removeUserFromProject(Integer projectId, Integer userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ApiRequestException("User not found"));

            Project project = projectRepo.findById(projectId)
                    .orElseThrow(() -> new ApiRequestException("Project not found"));

            List<User> usersAssignedProjectList = project.getUsersAssignedProjectList();
            if (!usersAssignedProjectList.contains(user)) {
                throw new ApiRequestException("User not assigned to project");
            }
            usersAssignedProjectList.remove(user);
            return mapper.Project_to_ProjectCreateResponseModel(projectRepo.save(project));

        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }

    public List<ProjectResponseModel> getAllOpenProjects() {
        try {
            List<Project> projects = projectRepo.findAllOpenProjects();
            if (projects == null) {
                throw new ApiRequestException("No projects found");
            }
            return projects.stream().map(
                    mapper::Project_to_ProjectCreateResponseModel
            ).toList();

        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }

    public List<UserDetailResponseModel> getAllUsersInProject(String authorizationHeader, Integer projectId) {
        try {

            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);

            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found"));

            Integer userId = user.getUserId();

            Project currentProject = projectRepo.findById(projectId)
                    .orElseThrow(() -> new ApiRequestException("Project not found"));

            if(!Objects.equals(currentProject.getProjectCreator().getUserId(), userId)){
                throw new ApiRequestException("Only project creator can view users in project");
            }

            List<User> userList = userRepository.findAllUsersInProject(userId, projectId)
                    .orElseThrow( () -> new ApiRequestException("No users found in project"));

            return userList
                    .stream()
                    .map(mapper::User_to_UserDetailResponseModel)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }
}


