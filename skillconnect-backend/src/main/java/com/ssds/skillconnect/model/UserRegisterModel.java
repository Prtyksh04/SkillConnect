package com.ssds.skillconnect.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterModel {
    private String name;
    private String password;
    private String email;
    private Integer departmentId;
    private Timestamp joiningDate;
}
