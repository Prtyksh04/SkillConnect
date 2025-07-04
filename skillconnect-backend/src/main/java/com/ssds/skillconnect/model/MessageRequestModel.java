package com.ssds.skillconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequestModel {
    private Integer postId;
    private String message;
    private Timestamp createdOn = new Timestamp(System.currentTimeMillis());
}
