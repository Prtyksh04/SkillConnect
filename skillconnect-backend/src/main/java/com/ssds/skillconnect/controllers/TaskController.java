package com.ssds.skillconnect.controllers;

import com.ssds.skillconnect.model.TaskCreateRequestModel;
import com.ssds.skillconnect.model.TaskResponseModel;
import com.ssds.skillconnect.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("api/v1/task")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final Logger logger = Logger.getLogger(TaskController.class.getName());

    @GetMapping("/all")
    private ResponseEntity<List<TaskResponseModel>> getAllTasks() {
        List<TaskResponseModel> allTasks = taskService.getAllTasks();
        return ResponseEntity.ok(allTasks);
    }

    @GetMapping("/all/{projectId}")
    private ResponseEntity<List<TaskResponseModel>> getAllTasksByProjectId( @PathVariable Integer projectId ) {
        List<TaskResponseModel> allTasksByProjectId = taskService.getAllTasksByProjectId(projectId);
        return ResponseEntity.ok(allTasksByProjectId);
    }

    @PostMapping("/{projectId}/add-new-task")
    private ResponseEntity<TaskResponseModel> addNewTask(
            @PathVariable Integer projectId,
            @RequestBody TaskCreateRequestModel taskCreateRequestModel,
            @RequestHeader(value="Authorization") String authorizationHeader) {
        TaskResponseModel taskResponseModel = taskService.addNewTask(projectId, taskCreateRequestModel, authorizationHeader);
        return ResponseEntity.ok(taskResponseModel);
    }

    @PostMapping("/{taskId}/update-status/{status}")
    private ResponseEntity<TaskResponseModel> updateTaskStatus(
            @PathVariable Integer taskId,
            @PathVariable String status,
            @RequestHeader(value="Authorization") String authorizationHeader) {
        TaskResponseModel taskResponseModel = taskService.updateTaskStatus(taskId, status, authorizationHeader);
        return ResponseEntity.ok(taskResponseModel);
    }

}
