package com.ssds.skillconnect.controllers;
import com.ssds.skillconnect.dao.Message;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins="*")
public class WebSocketMessageController {

    @SendTo("/chatroom/${postId}")
    public Message receiveMessage(
            @Payload Message message
    ) {
        return message;
    }

}
