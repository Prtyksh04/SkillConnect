package com.ssds.skillconnect.repository;

import com.ssds.skillconnect.dao.Message;
import com.ssds.skillconnect.model.MessageRowResponseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    //TODO: not required for now
    @Query("SELECT new com.ssds.skillconnect.model.MessageRowResponseModel(" +
            "m.messageId, " +
            "m.message, " +
            "m.sender.userId, " +
            "m.sender.name, " +
            "m.isAuthor, " +
            "m.createdOn) " +
            "FROM Message m WHERE m.postedOn.postId = :postId ORDER BY m.createdOn DESC")
    List<MessageRowResponseModel> findAllMessageRowResponseModelSortedByCreatedOn(@Param("postId") Integer postId);



    //TODO: not required for now
    @Query("SELECT new com.ssds.skillconnect.model.MessageRowResponseModel(" +
            "m.messageId, " +
            "m.message, " +
            "m.sender.userId, " +
            "m.sender.name, " +
            "m.isAuthor, " +
            "m.createdOn) " +
            "FROM Message m WHERE m.messageId = :messageId")
    MessageRowResponseModel findMessageRowResponseModelByMessageId(@Param("messageId") Integer messageId);



    @Query("SELECT m " +
            "FROM Message m " +
            "WHERE m.postedOn.postId = :postId " +
            "ORDER BY m.createdOn DESC")
    List<Message> findAllByPostedOnPostId(Integer postId);
}
