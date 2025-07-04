package com.ssds.skillconnect.controllers;

import com.ssds.skillconnect.model.PostResponseModel;
import com.ssds.skillconnect.model.PostRowResponseModel;
import com.ssds.skillconnect.model.UserDetailResponseModel;
import com.ssds.skillconnect.service.PostService;
import com.ssds.skillconnect.dao.Post;
import com.ssds.skillconnect.dao.User;
import com.ssds.skillconnect.model.PostCreateRequestModel;
import com.ssds.skillconnect.utils.exception.ApiRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(value = "api/v1/post")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<List<PostRowResponseModel>> getAllPosts(
            @RequestHeader(value="Authorization") String authorizationHeader,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Integer priority,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Integer sort,
            @RequestParam(value = "pageNumber", defaultValue = "0") Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "3") Integer pageSize
    ) {
        List<PostRowResponseModel> postList = postService.getAllPosts(
                authorizationHeader,
                departmentId,
                priority,
                skill,
                sort,
                pageNumber,
                pageSize);
        return ResponseEntity.ok(postList);
    }



    @PostMapping("/create")
    @ResponseBody
    public ResponseEntity<PostResponseModel> createPost(
            @RequestBody PostCreateRequestModel postCreateRequestModel,
            @RequestHeader(value="Authorization") String authorizationHeader
    ) {
        PostResponseModel post = postService.createPost(postCreateRequestModel, authorizationHeader);
        return new ResponseEntity<>(post, HttpStatus.CREATED);
    }

    @GetMapping("/{postId}")
    @ResponseBody
    public ResponseEntity<PostResponseModel> getPostById(
            @PathVariable Integer postId
    ) {
        PostResponseModel postById = postService.getPostById(postId);
        return ResponseEntity.ok(postById);
    }

    @GetMapping("{postId}/applicants")
    public ResponseEntity<List<UserDetailResponseModel>> getAllApplicantsToPost(@PathVariable Integer postId) {
        List<UserDetailResponseModel> allApplicantsToPost = postService.getAllApplicantsToPost(postId);
        return ResponseEntity.ok(allApplicantsToPost);
    }

    @PostMapping("{postId}/apply")
    public ResponseEntity<PostResponseModel> applyToPost(
            @PathVariable Integer postId,
            @RequestHeader(value="Authorization") String authorizationHeader
    ) {
        PostResponseModel postResponseModel = postService.applyToPost(postId, authorizationHeader);
        return ResponseEntity.ok(postResponseModel);
    }

    @PostMapping("{postId}/approve/{userId}")
    public ResponseEntity<PostResponseModel> approveTheUser(
            @PathVariable Integer postId,
            @PathVariable Integer userId,
            @RequestHeader(value="Authorization") String authorizationHeader
    ) {
        PostResponseModel postResponseModel = postService.approveTheUser(postId, userId, authorizationHeader);
        return new ResponseEntity<>(postResponseModel, HttpStatus.ACCEPTED);
    }

}
