package com.ssds.skillconnect.service;

import com.ssds.skillconnect.config.JwtService;
import com.ssds.skillconnect.dao.Project;
import com.ssds.skillconnect.dao.Task;
import com.ssds.skillconnect.dao.TaskUpdates;
import com.ssds.skillconnect.dao.User;
import com.ssds.skillconnect.model.TaskUpdatesCreateRequestModel;
import com.ssds.skillconnect.model.TaskUpdatesResponseModel;
import com.ssds.skillconnect.repository.TaskRepository;
import com.ssds.skillconnect.repository.TaskUpdatesRepository;
import com.ssds.skillconnect.repository.UserRepository;
import com.ssds.skillconnect.utils.exception.ApiRequestException;
import com.ssds.skillconnect.utils.helper.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TaskUpdatesService {

    private final TaskUpdatesRepository taskUpdatesRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final JwtService jwtService;
    private final Mapper mapper;
    public List<TaskUpdatesResponseModel> getAllTaskUpdates(
            Integer taskId,
            String authorizationHeader) {
        try {
            List<TaskUpdates> taskUpdatesList = taskUpdatesRepository.findAllByTaskId(taskId)
                    .orElseThrow(() -> new ApiRequestException("Task not found"));

            return taskUpdatesList.stream()
                    .map(mapper::TaskUpdates_To_TaskUpdatesResponseModel)
                    .toList();

        } catch (Exception e) {
            throw new ApiRequestException("Error while fetching all task updates : " + e.getMessage());
        }
    }

    public TaskUpdatesResponseModel addNewTaskUpdate(
            Integer taskId,
            TaskUpdatesCreateRequestModel taskUpdatesCreateRequestModel,
            String authorizationHeader) {
        try {

            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);

            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found"));


            Task currentTask = taskRepository.findById(taskId)
                    .orElseThrow(() -> new ApiRequestException("Task not found"));

            Project currentProject = currentTask.getProject();

            if (!Objects.equals(currentProject.getProjectCreator().getUserId(), currentUser.getUserId())
                    && !Objects.equals(currentTask.getTaskAssignedUser().getUserId(), currentUser.getUserId())) {
                throw new ApiRequestException("You are not authorized to view this task");
            }

            TaskUpdates taskUpdates = new TaskUpdates();
            taskUpdates.setTaskUpdateDescription(taskUpdatesCreateRequestModel.getTaskUpdateDescription());
            taskUpdates.setTaskUpdateCreatedOn(taskUpdatesCreateRequestModel.getTaskUpdateCreatedOn());
            taskUpdates.setTask(currentTask);

            return mapper.TaskUpdates_To_TaskUpdatesResponseModel(taskUpdatesRepository.save(taskUpdates));

        } catch (Exception e) {
            throw new ApiRequestException("Error while fetching all task updates : " + e.getMessage());
        }
    }

    public void deleteTaskUpdate(
            Integer taskUpdateId,
            String authorizationHeader) {
        try {

            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);

            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found"));

            Task currentTask = taskRepository.findById(taskUpdateId)
                    .orElseThrow(() -> new ApiRequestException("Task not found"));

            Project currentProject = currentTask.getProject();

            if (!Objects.equals(currentProject.getProjectCreator().getUserId(), currentUser.getUserId())
                    && !Objects.equals(currentTask.getTaskAssignedUser().getUserId(), currentUser.getUserId())) {
                throw new ApiRequestException("You are not authorized to view this task");
            }

            taskUpdatesRepository.deleteById(taskUpdateId);

        } catch (Exception e) {
            throw new ApiRequestException("Error while fetching all task updates : " + e.getMessage());
        }

    }

}
