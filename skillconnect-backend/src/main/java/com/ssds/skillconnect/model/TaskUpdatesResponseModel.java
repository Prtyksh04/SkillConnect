package com.ssds.skillconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdatesResponseModel {
    private Integer taskUpdateId;
    private String taskUpdateDescription;
    private Timestamp taskUpdateCreatedOn;
}
