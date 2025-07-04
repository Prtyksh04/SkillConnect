package com.ssds.skillconnect.dao;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;

@Entity
@Table(name = "task_updates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer taskUpdateId;
    private String taskUpdateDescription;
    private Timestamp taskUpdateCreatedOn;

    @ManyToOne
    @JoinTable(
            name = "task_updates_task_mapping",
            joinColumns = @JoinColumn(name = "task_update_id", referencedColumnName = "taskUpdateId"),
            inverseJoinColumns = @JoinColumn(name = "task_id", referencedColumnName = "taskId")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Task task;

}
