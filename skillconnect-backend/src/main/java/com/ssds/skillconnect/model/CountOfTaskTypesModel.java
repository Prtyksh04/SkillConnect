package com.ssds.skillconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CountOfTaskTypesModel {
    private Long tasksCount;
    private Long tasksCompleted;
    private Long tasksPending;
    private Long tasksInProgress;
}
