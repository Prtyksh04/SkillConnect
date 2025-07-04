package com.ssds.skillconnect.model;

import com.ssds.skillconnect.dao.Skill;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Array;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Data
public class PostRowResponseModel {
    private Integer postId;
    private String postTitle;
    private String postDescription;
    private Integer urgencyLevel;
    private String projectName;
    private String departmentName;
    private List<Skill> listOfSkillsRequired = null;
    private Timestamp createdOn;
    private Boolean isSaved;
    private Integer totalNumberOfPages;

    public PostRowResponseModel() {
        isSaved = false;
    }

    public PostRowResponseModel(Integer postId,
                                String postTitle,
                                String postDescription,
                                Integer urgencyLevel,
                                String projectName,
                                String departmentName,
                                Timestamp createdOn) {
        this.postId = postId;
        this.postTitle = postTitle;
        this.postDescription = postDescription;
        this.urgencyLevel = urgencyLevel;
        this.projectName = projectName;
        this.departmentName = departmentName;
        this.createdOn = createdOn;
    }

    public PostRowResponseModel(Integer postId,
                                String postTitle,
                                String postDescription,
                                Integer urgencyLevel,
                                String projectName,
                                String departmentName,
                                Timestamp createdOn,
                                List<Skill> listOfSkillsRequired) {
        this.postId = postId;
        this.postTitle = postTitle;
        this.postDescription = postDescription;
        this.urgencyLevel = urgencyLevel;
        this.projectName = projectName;
        this.departmentName = departmentName;
        this.createdOn = createdOn;
        this.listOfSkillsRequired = listOfSkillsRequired;
        this.isSaved = false;
    }

}
