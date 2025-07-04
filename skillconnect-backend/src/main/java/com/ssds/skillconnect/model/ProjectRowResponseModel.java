package com.ssds.skillconnect.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
public class ProjectRowResponseModel {
    private Integer projectId;
    private String projectName;
    private String projectDetails;
    private Timestamp startDate;
    private Timestamp endDate;
    private Boolean isFinished;
    private String departmentName;
    private Boolean isCreator;
    private CountOfTaskTypesModel countOfTaskTypes;
    private Integer totalNumberOfPages;

    public ProjectRowResponseModel(Integer projectId,
                            String projectName,
                            String projectDetails,
                            Timestamp startDate,
                            Timestamp endDate,
                            Boolean isFinished,
                            String departmentName) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectDetails = projectDetails;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isFinished = isFinished;
        this.departmentName = departmentName;
        this.isCreator = false;
    }


}
