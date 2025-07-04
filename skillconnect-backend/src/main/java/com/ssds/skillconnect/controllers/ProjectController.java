package com.ssds.skillconnect.controllers;

import com.ssds.skillconnect.model.ProjectResponseModel;
import com.ssds.skillconnect.model.ProjectRowResponseModel;
import com.ssds.skillconnect.model.UserDetailResponseModel;
import com.ssds.skillconnect.service.ProjectService;
import com.ssds.skillconnect.model.ProjectCreateRequestModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.logging.Logger;

import static java.util.logging.Level.INFO;

@RestController
@RequestMapping("api/v1/project")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private static final Logger logger = Logger.getLogger(ProjectController.class.getName());

    @GetMapping("/all")
    private ResponseEntity<List<ProjectRowResponseModel>> getAllProjects(
            @RequestHeader(value="Authorization") String authorizationHeader,
            @RequestParam(value = "pageNumber", defaultValue = "0") Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "3") Integer pageSize
    ) {
        List<ProjectRowResponseModel> allProjects = projectService.getAllProjects(
                authorizationHeader,
                pageNumber,
                pageSize
        );
        return ResponseEntity.ok(allProjects);
    }

    @GetMapping("/user")
    private ResponseEntity<List<ProjectRowResponseModel>> getProjectByUser(
            @RequestHeader(value="Authorization") String authorizationHeader,
            @RequestParam(value = "pageNumber", defaultValue = "0") Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "3") Integer pageSize) {

        logger.log(INFO, "pageNumber: " + pageNumber);

        List<ProjectRowResponseModel> allProjects = projectService.getProjectByUser(
                authorizationHeader,
                pageNumber,
                pageSize);
        return ResponseEntity.ok(allProjects);
    }

    @GetMapping("/all-open")
    private ResponseEntity<List<ProjectResponseModel>> getAllOpenProjects() {
        List<ProjectResponseModel> allOpenProjects = projectService.getAllOpenProjects();
        return ResponseEntity.ok(allOpenProjects);
    }

    @PostMapping("/create")
    private ResponseEntity<ProjectResponseModel> createProject(
            @RequestBody ProjectCreateRequestModel projectCreateRequestModel,
            @RequestHeader(value="Authorization") String authorizationHeader
    ) {
        ProjectResponseModel project = projectService.createProject(projectCreateRequestModel, authorizationHeader);
        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @GetMapping("/{projectId}")
    private ResponseEntity<ProjectResponseModel> getProjectById(@PathVariable Integer projectId) {
        ProjectResponseModel projectById = projectService.getProjectById(projectId);
        return ResponseEntity.ok(projectById);
    }

    @PostMapping("/{projectId}/add-user/{userId}")
    private ResponseEntity<ProjectResponseModel> addUserToProject(
            @PathVariable Integer projectId,
            @PathVariable Integer userId,
            @RequestHeader(value="Authorization") String authorizationHeader) {
        ProjectResponseModel projectResponseModel = projectService.addUserToProject(
                projectId,
                userId,
                authorizationHeader
        );
        return ResponseEntity.ok(projectResponseModel);
    }

    @DeleteMapping("/{projectId}/remove-user/{userId}")
    private ResponseEntity<ProjectResponseModel> removeUserFromProject(
            @PathVariable Integer projectId,
            @PathVariable Integer userId) {
        ProjectResponseModel projectResponseModel = projectService.removeUserFromProject(projectId, userId);
        return ResponseEntity.ok(projectResponseModel);
    }

    @GetMapping("/all-users")
    private ResponseEntity<List<UserDetailResponseModel>> getAllUsersInProject(
            @RequestHeader(value="Authorization") String authorizationHeader,
            @RequestParam Integer projectId
    ) {
        List<UserDetailResponseModel> allUsersInProject = projectService.getAllUsersInProject(authorizationHeader, projectId);
        return ResponseEntity.ok(allUsersInProject);
    }

}
