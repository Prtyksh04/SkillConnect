package com.ssds.skillconnect.model;

import com.ssds.skillconnect.dao.Project;
import com.ssds.skillconnect.dao.Skill;
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
public class PostResponseModel {
    private Integer postId;
    private String postTitle;
    private String postDescription;
    private Integer urgencyLevel;
    private UserDetailResponseModel user;
    private ProjectResponseModel project;
    private List<Skill> listOfSkillsRequired = new ArrayList<>();
    private List<UserDetailResponseModel> listOfApplicants = new ArrayList<>();
    private Integer totalApplicants;
    private Boolean isOpen;
    private Timestamp createdOn;

}
