package com.ssds.skillconnect.dao;

import com.ssds.skillconnect.model.TaskStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;

@Entity
@Table(name = "task")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer taskId;
    private String taskTitle;
    private String taskDescription;

    @Enumerated(EnumType.STRING)
    private TaskStatus taskStatus;

    private Timestamp taskCreatedOn;

    @ManyToOne
    @JoinTable(
            name = "task_project_mapping",
            joinColumns = @JoinColumn(name = "task_id", referencedColumnName = "taskId"),
            inverseJoinColumns = @JoinColumn(name = "project_id", referencedColumnName = "projectId")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project project;

    @ManyToOne
    @JoinTable(
            name = "task_assigned_user_mapping",
            joinColumns = @JoinColumn(name = "task_id", referencedColumnName = "taskId"),
            inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "userId")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User taskAssignedUser;

}