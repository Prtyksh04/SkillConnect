package com.ssds.skillconnect.controllers;

import com.ssds.skillconnect.dao.Post;
import com.ssds.skillconnect.model.PostResponseModel;
import com.ssds.skillconnect.model.UserDetailResponseModel;
import com.ssds.skillconnect.model.UserModel;
import com.ssds.skillconnect.model.UserSearchResponseModel;
import com.ssds.skillconnect.service.UserService;
import com.ssds.skillconnect.dao.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("api/v1/user")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private static final Logger logger = Logger.getLogger(UserController.class.getName());

    @GetMapping("/get")
    private ResponseEntity<UserDetailResponseModel> getUserById(
            @RequestHeader(value="Authorization") String authorizationHeader
    ) {
        UserDetailResponseModel user = userService.getUser(authorizationHeader);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/get/{userId}")
    private ResponseEntity<UserDetailResponseModel> getUserById(
            @PathVariable Integer userId
    ) {
        UserDetailResponseModel userById = userService.getUserById(userId);
        return ResponseEntity.ok(userById);
    }

    @GetMapping("/search/{projectId}/{name}")
    private ResponseEntity<List<UserSearchResponseModel>> getAllUsersLike(
            @PathVariable Integer projectId,
            @PathVariable String name
    ) {
        List<UserSearchResponseModel> allUsersLike = userService.getAllUsersLike(projectId, name);
        return ResponseEntity.ok(allUsersLike);
    }

    @PutMapping("/update")
    private ResponseEntity<UserDetailResponseModel> updateUserById(
            @RequestHeader(value="Authorization") String authorizationHeader,
            @RequestBody UserModel userModel
    ) {
        UserDetailResponseModel userDetailResponseModel = userService.updateUserById(authorizationHeader, userModel);
        return new ResponseEntity<>(userDetailResponseModel, HttpStatus.CREATED);
    }

    @GetMapping("/get-all-saved-posts")
    private ResponseEntity<List<Integer>> getAllSavedPosts(
            @RequestHeader(value="Authorization") String authorizationHeader
    ) {
        List<Integer> allSavedPostsId = userService.getAllSavedPostsId(authorizationHeader);
        return ResponseEntity.ok(allSavedPostsId);
    }

    @GetMapping("/get-all-saved-posts-details")
    private ResponseEntity<List<PostResponseModel>> getAllSavedPostsDetails(
            @RequestHeader(value="Authorization") String authorizationHeader
    ) {
        List<PostResponseModel> allSavedPosts = userService.getAllSavedPosts(authorizationHeader);
        return ResponseEntity.ok(allSavedPosts);
    }

    @GetMapping("/save-post/{postId}")
    private ResponseEntity<List<Integer>> savePost(
            @RequestHeader(value="Authorization") String authorizationHeader,
            @PathVariable Integer postId
    ) {
        List<Integer> integers = userService.savePost(authorizationHeader, postId);
        return ResponseEntity.ok(integers);
    }

    @GetMapping("/un-save-post/{postId}")
    private ResponseEntity<List<Integer>> unSavePost(
            @RequestHeader(value="Authorization") String authorizationHeader,
            @PathVariable Integer postId
    ) {
        List<Integer> integers = userService.unSavePost(authorizationHeader, postId);
        return ResponseEntity.ok(integers);
    }

    @GetMapping("get-all-users/{departmentId}")
    private ResponseEntity<List<UserDetailResponseModel>> getAllUsersByDepartmentId(
            @PathVariable Integer departmentId
    ) {
        List<UserDetailResponseModel> allUsersByDepartmentId = userService.getAllUsersByDepartmentId(departmentId);
        return ResponseEntity.ok(allUsersByDepartmentId);
    }

}
