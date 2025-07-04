package com.ssds.skillconnect.model;

import com.ssds.skillconnect.dao.Department;
import com.ssds.skillconnect.dao.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponseModel {
    private Integer projectId;
    private UserDetailResponseModel projectCreator;
    private String projectName;
    private String projectDetails;
    private Timestamp startDate;
    private Timestamp endDate;
    private Boolean isFinished;
    private Department department;
    private List<UserDetailResponseModel> usersAssignedProjectList = new ArrayList<>();
}
