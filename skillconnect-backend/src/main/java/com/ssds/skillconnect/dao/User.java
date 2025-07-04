package com.ssds.skillconnect.dao;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssds.skillconnect.model.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "sk_user")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    private String name;

    @Column(unique=true)
    private String email;

    private String password;

    @ManyToOne
    @JoinTable(
            name = "user_department_mapping",
            joinColumns = @JoinColumn(name = "department_user_id", referencedColumnName = "userId"),
            inverseJoinColumns = @JoinColumn(name = "department_id", referencedColumnName = "departmentId")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Department department;


    @ManyToMany()
    @JoinTable(
            name = "user_saved_post_mapping",
            joinColumns = @JoinColumn(name = "saved_post_user_id", referencedColumnName = "userId"),
            inverseJoinColumns = @JoinColumn(name = "post_id", referencedColumnName = "postId"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Post> savedPosts = new ArrayList<>();

    //private List<Integer> savedPostsId = new ArrayList<>();

    @Column(columnDefinition = "TEXT", length = 10000)
    private String experience = "";


    @ManyToMany
    @JoinTable(
            name = "user_skill_mapping",
            joinColumns = @JoinColumn(name = "skill_user_id", referencedColumnName = "userId"),
            inverseJoinColumns = @JoinColumn(name = "skill_id", referencedColumnName = "skillId"))

    private List<Skill> listOfSkills = new ArrayList<>();

    //private List<String> listOfSkills = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


    @JsonIgnore
    public List<Post> getSavedPosts() { return savedPosts; }

}
