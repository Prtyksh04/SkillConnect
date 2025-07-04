package com.ssds.skillconnect.utils.helper;
import com.ssds.skillconnect.dao.*;
import com.ssds.skillconnect.model.*;
import org.springframework.stereotype.Component;

@Component
public class Mapper {

    public MessageRowResponseModel Message_to_MessageRowResponseModel(Message message) {
        return new MessageRowResponseModel(
                message.getMessageId(),
                message.getMessage(),
                message.getIsAuthor(),
                message.getCreatedOn(),
                new UserDetailResponseModel(
                        message.getSender().getUserId(),
                        message.getSender().getName(),
                        message.getSender().getEmail(),
                        message.getSender().getDepartment(),
                        message.getSender().getExperience(),
                        message.getSender().getListOfSkills()
                )
        );
    }

    public PostResponseModel Post_to_PostResponseModel(Post post) {

        if(post == null) return null;

        return new PostResponseModel(
                post.getPostId(),
                post.getPostTitle(),
                post.getPostDescription(),
                post.getUrgencyLevel(),
                User_to_UserDetailResponseModel(post.getUser()),
                Project_to_ProjectCreateResponseModel(post.getProject()),
                post.getListOfSkillsRequired(),
                post.getListOfApplicants().stream().map(this::User_to_UserDetailResponseModel).toList(),
                post.getTotalApplicants(),
                post.getIsOpen(),
                post.getCreatedOn()
        );
    }

    public ProjectResponseModel Project_to_ProjectCreateResponseModel(Project project) {

        if(project == null) return null;

        return new ProjectResponseModel(
                project.getProjectId(),
                User_to_UserDetailResponseModel(project.getProjectCreator()),
                project.getProjectName(),
                project.getProjectDetails(),
                project.getStartDate(),
                project.getEndDate(),
                project.getIsFinished(),
                project.getDepartment(),
                project.getUsersAssignedProjectList().stream().map(this::User_to_UserDetailResponseModel).toList()
        );
    }

    public UserDetailResponseModel User_to_UserDetailResponseModel(User user) {
        return new UserDetailResponseModel(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getDepartment(),
                user.getExperience(),
                user.getListOfSkills()
        );
    }

    public ProjectRowResponseModel Project_to_ProjectRowResponseModel(Project project) {
        return new ProjectRowResponseModel(
                project.getProjectId(),
                project.getProjectName(),
                project.getProjectDetails(),
                project.getStartDate(),
                project.getEndDate(),
                project.getIsFinished(),
                project.getDepartment().getDepartmentName()
        );
    }

    public TaskResponseModel Task_to_TaskCreateResponseModel(Task task) {
        return new TaskResponseModel(
                task.getTaskId(),
                task.getTaskTitle(),
                task.getTaskDescription(),
                task.getTaskAssignedUser().getUserId(),
                task.getTaskAssignedUser().getUsername(),
                task.getTaskStatus(),
                task.getTaskCreatedOn()
        );
    }

    public PostRowResponseModel Post_to_PostRowResponseModel(Post post) {
        return new PostRowResponseModel(
                post.getPostId(),
                post.getPostTitle(),
                post.getPostDescription(),
                post.getUrgencyLevel(),
                post.getProject().getProjectName(),
                post.getProject().getDepartment().getDepartmentName(),
                post.getCreatedOn(),
                post.getListOfSkillsRequired()
        );
    }

    public TaskUpdatesResponseModel TaskUpdates_To_TaskUpdatesResponseModel(TaskUpdates taskUpdates) {
        return new TaskUpdatesResponseModel(
                taskUpdates.getTaskUpdateId(),
                taskUpdates.getTaskUpdateDescription(),
                taskUpdates.getTaskUpdateCreatedOn()
        );
    }
}
