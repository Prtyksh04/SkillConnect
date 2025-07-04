package com.ssds.skillconnect.dao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer projectId;

    @ManyToOne
    @JoinTable(
            name = "project_creator_mapping",
            joinColumns = @JoinColumn(name = "created_project_id", referencedColumnName = "projectId"),
            inverseJoinColumns = @JoinColumn(name = "created_user_id", referencedColumnName = "userId")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User projectCreator;

    private String projectName;

    @Column(columnDefinition = "TEXT", length = 10000)
    private String projectDetails;

    private Timestamp startDate;

    private Timestamp endDate;

    private Boolean isFinished;

    @ManyToOne
    @JoinTable(
            name = "project_department_mapping",
            joinColumns = @JoinColumn(name = "department_project_id", referencedColumnName = "projectId"),
            inverseJoinColumns = @JoinColumn(name = "department_id", referencedColumnName = "departmentId")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Department department;

    @ManyToMany()
    @JoinTable(
            name = "project_user_mapping",
            joinColumns = @JoinColumn(name = "project_id", referencedColumnName = "projectId"),
            inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "userId"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<User> usersAssignedProjectList = new ArrayList<>();

}
