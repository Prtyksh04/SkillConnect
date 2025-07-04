package com.ssds.skillconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRowResponseModel {
    private Integer messageId;
    private String message;
    private Boolean isAuthor;
    private Timestamp createdOn;
    private UserDetailResponseModel sender;
}
