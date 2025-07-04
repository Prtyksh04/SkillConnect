package com.ssds.skillconnect.controllers;

import com.ssds.skillconnect.dao.Message;
import com.ssds.skillconnect.model.MessageRequestModel;
import com.ssds.skillconnect.model.MessageRowResponseModel;
import com.ssds.skillconnect.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping(value = "api/v1/message")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
@Log
public class MessageController {

    @Autowired
    private SimpMessagingTemplate template;
    private final MessageService messageService;

    @GetMapping("/{postId}")
    public ResponseEntity<List<MessageRowResponseModel>> geAllInitialMessagesByPostId(@PathVariable Integer postId) {
        List<MessageRowResponseModel> messageRowResponseModelByPostId = messageService.getMessageRowResponseModelByPostId(postId);
        return ResponseEntity.ok(messageRowResponseModelByPostId);
    }

//    @GetMapping("/{postId}")
//    public List<Message> geAllInitialMessagesByPostId(@PathVariable Integer postId) {
//        return messageService.getMessageByPostId(postId);
//    }

    @PostMapping("/{postId}")
    public ResponseEntity<Void> postMessageByPostId(
            @PathVariable Integer postId,
            @RequestBody MessageRequestModel messageRequestModel,
            @RequestHeader(value="Authorization") String authorizationHeader
    ) {
        MessageRowResponseModel savedMessage = messageService.postMessageRowResponseModelByPostId(messageRequestModel, authorizationHeader);
        template.convertAndSend("/chatroom/"+ postId, savedMessage);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//@PostMapping("/{postId}")
//    public ResponseEntity<Void> postMessageByPostId(
//            @PathVariable Integer postId,
//            @RequestBody MessageRequestModel messageRequestModel,
//            @RequestHeader(value="Authorization") String authorizationHeader
//    ) {
//        Message savedMessage = messageService.postMessageByPostId(messageRequestModel, authorizationHeader);
//        template.convertAndSend("/post-chatroom/"+ postId, savedMessage);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }

}
