package com.ssds.skillconnect.dao;


import com.ssds.skillconnect.model.MessageRowResponseModel;
import com.ssds.skillconnect.model.UserDetailResponseModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;

@Entity
@Table(name = "message")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer messageId;

    @ManyToOne
    @JoinTable(
            name = "message_post_mapping",
            joinColumns = @JoinColumn(name = "message_post_message_id", referencedColumnName = "messageId"),
            inverseJoinColumns = @JoinColumn(name = "message_post_post_id", referencedColumnName = "postId")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Post postedOn;

    private String message;

    @ManyToOne
    @JoinTable(
            name = "message_user_mapping",
            joinColumns = @JoinColumn(name = "message_user_message_id", referencedColumnName = "messageId"),
            inverseJoinColumns = @JoinColumn(name = "message_user_user_id", referencedColumnName = "userId")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User sender;

    private Boolean isAuthor;

    private Timestamp createdOn;

}
