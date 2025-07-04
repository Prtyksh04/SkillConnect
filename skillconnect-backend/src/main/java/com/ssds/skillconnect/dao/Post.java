package com.ssds.skillconnect.dao;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ssds.skillconnect.model.PostResponseModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "post")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;

    private String postTitle;

    @Column(columnDefinition = "TEXT", length = 10000)
    private String postDescription;

    // 0 - low, 1 - medium, 2 - high
    private Integer urgencyLevel;

    @ManyToOne()
    @JoinTable(
            name = "post_user_mapping",
            joinColumns = @JoinColumn(name = "post_id", referencedColumnName = "postId"),
            inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "userId")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    //@JsonManagedReference
    private User user; //id of the user who posted the post

    @OneToOne()
    @JoinTable(
            name = "post_project_mapping",
            joinColumns = @JoinColumn(name = "post_id", referencedColumnName = "postId"),
            inverseJoinColumns = @JoinColumn(name = "project_id", referencedColumnName = "projectId")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project project; //id of the project for which the post is posted

    @ManyToMany
    @JoinTable(
            name = "post_skill_mapping",
            joinColumns = @JoinColumn(name = "post_id", referencedColumnName = "postId"),
            inverseJoinColumns = @JoinColumn(name = "skill_id", referencedColumnName = "skillId"))
    private List<Skill> listOfSkillsRequired = new ArrayList<>();
    //private List<String> listOfSkillsRequired = new ArrayList<>();

    @OneToMany(
            orphanRemoval = true
    )
    @JoinTable(
            name = "post_applicant_mapping",
            joinColumns = @JoinColumn(name = "post_id", referencedColumnName = "postId"),
            inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "userId")
    )
    private List<User> listOfApplicants = new ArrayList<>();

    private Integer totalApplicants;

    private Boolean isOpen;

    private Timestamp createdOn;
}
