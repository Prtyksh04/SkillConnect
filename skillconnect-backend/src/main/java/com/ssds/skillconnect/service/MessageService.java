package com.ssds.skillconnect.service;

import com.ssds.skillconnect.config.JwtService;
import com.ssds.skillconnect.dao.Message;
import com.ssds.skillconnect.dao.Post;
import com.ssds.skillconnect.dao.User;
import com.ssds.skillconnect.model.MessageRequestModel;
import com.ssds.skillconnect.model.MessageRowResponseModel;
import com.ssds.skillconnect.model.UserDetailResponseModel;
import com.ssds.skillconnect.repository.MessageRepository;
import com.ssds.skillconnect.repository.PostRepository;
import com.ssds.skillconnect.repository.UserRepository;
import com.ssds.skillconnect.utils.exception.ApiRequestException;
import com.ssds.skillconnect.utils.helper.Mapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;

@Service
@Log
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final Mapper mapper;

    public List<MessageRowResponseModel> getMessageRowResponseModelByPostId(Integer postId) {
        try {
            return messageRepository.findAllByPostedOnPostId(postId).stream().map(
                    mapper::Message_to_MessageRowResponseModel
            ).toList();

        } catch (Exception e) {
            throw new ApiRequestException("Error while fetching messages");
        }
    }

    public MessageRowResponseModel postMessageRowResponseModelByPostId(MessageRequestModel messageRequestModel, String authorizationHeader) {
        try {
            Post post = postRepository.findById(messageRequestModel.getPostId())
                    .orElseThrow(() -> new ApiRequestException("Post not found"));

            User userCreatedPost = userRepository.findById(post.getUser().getUserId())
                    .orElseThrow(() -> new ApiRequestException("User who created post not found"));

            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);

            User sender = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found"));

            Message newMessage = new Message();

            newMessage.setMessage(messageRequestModel.getMessage());
            newMessage.setPostedOn(post);
            newMessage.setSender(sender);
            newMessage.setCreatedOn(messageRequestModel.getCreatedOn());

            boolean isAuthor = false;
            if(userCreatedPost != null) {
                isAuthor = Objects.equals(userCreatedPost.getUserId(), sender.getUserId());
            }
            newMessage.setIsAuthor(isAuthor);

            return mapper.Message_to_MessageRowResponseModel(messageRepository.save(newMessage));

        } catch (Exception e) {
            throw new ApiRequestException("Error while posting message" + e.getMessage());
        }
    }


}
