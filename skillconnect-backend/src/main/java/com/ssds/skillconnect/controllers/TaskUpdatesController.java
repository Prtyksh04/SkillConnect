package com.ssds.skillconnect.controllers;

import com.ssds.skillconnect.dao.TaskUpdates;
import com.ssds.skillconnect.model.TaskUpdatesCreateRequestModel;
import com.ssds.skillconnect.model.TaskUpdatesResponseModel;
import com.ssds.skillconnect.service.TaskUpdatesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/task-updates")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class TaskUpdatesController {

    private final TaskUpdatesService taskUpdatesService;

    @GetMapping("/get-all/{taskId}")
    ResponseEntity<List<TaskUpdatesResponseModel>> getAllTaskUpdates(
            @PathVariable Integer taskId,
            @RequestHeader(value="Authorization") String authorizationHeader
    ) {
        List<TaskUpdatesResponseModel> allTaskUpdates = taskUpdatesService.getAllTaskUpdates(
                taskId,
                authorizationHeader
        );
        return ResponseEntity.ok(allTaskUpdates);
    }

    @PostMapping("/add/{taskId}")
    ResponseEntity<TaskUpdatesResponseModel> addNewTaskUpdate(
            @PathVariable Integer taskId,
            @RequestBody TaskUpdatesCreateRequestModel taskUpdatesCreateRequestModel,
            @RequestHeader(value="Authorization") String authorizationHeader
    ) {
        TaskUpdatesResponseModel taskUpdatesResponseModel = taskUpdatesService.addNewTaskUpdate(
                taskId,
                taskUpdatesCreateRequestModel,
                authorizationHeader
        );
        return new ResponseEntity<>(taskUpdatesResponseModel, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{taskUpdatesId}")
    ResponseEntity<Void> deleteTaskUpdate(
            @PathVariable Integer taskUpdatesId,
            @RequestHeader(value="Authorization") String authorizationHeader
    ) {
        taskUpdatesService.deleteTaskUpdate(
                taskUpdatesId,
                authorizationHeader
        );
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
