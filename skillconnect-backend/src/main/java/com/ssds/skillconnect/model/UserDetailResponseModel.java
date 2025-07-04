package com.ssds.skillconnect.model;


import com.ssds.skillconnect.dao.Department;
import com.ssds.skillconnect.dao.Skill;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class UserDetailResponseModel {
    private Integer userId;
    private String name;
    private String email;
    private Department department;
    private String experience;
    private List<Skill> listOfSkills;

    UserDetailResponseModel(
            Integer userId,
            String name,
            String email,
            Department department,
            String experience
    ){
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.department = department;
        this.experience = experience;
        this.listOfSkills = new ArrayList<>();
    }

    public UserDetailResponseModel(
            Integer userId,
            String name,
            String email,
            Department department,
            String experience,
            List<Skill> listOfSkills
    ){
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.department = department;
        this.experience = experience;
        this.listOfSkills = listOfSkills;
    }

}
