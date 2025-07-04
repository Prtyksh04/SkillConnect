package com.ssds.skillconnect.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskCreateRequestModel {
    private String taskTitle;
    private String taskDescription;
    private Integer taskAssignedUserId;
    private String taskStatus = TaskStatus.PENDING.toString();
    private Timestamp taskCreatedOn = new Timestamp(System.currentTimeMillis());
}
