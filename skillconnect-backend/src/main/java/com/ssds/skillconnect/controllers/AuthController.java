package com.ssds.skillconnect.controllers;

import com.ssds.skillconnect.model.UserLoginModel;
import com.ssds.skillconnect.model.UserRegisterModel;
import com.ssds.skillconnect.service.AuthService;
import com.ssds.skillconnect.model.AuthenticationResponseModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    @PostMapping("/register")
    private ResponseEntity<AuthenticationResponseModel> registerUser(@RequestBody UserRegisterModel userRegisterModel) {
        AuthenticationResponseModel authenticationResponseModel = authService.registerUser(userRegisterModel);
        return ResponseEntity.ok(authenticationResponseModel);
    }

    @PostMapping("/authenticate")
    private ResponseEntity<AuthenticationResponseModel> loginUser(@RequestBody UserLoginModel userLoginModel) {
        AuthenticationResponseModel authenticationResponseModel = authService.authenticateUser(userLoginModel);
        return new ResponseEntity<>(authenticationResponseModel, HttpStatus.ACCEPTED);
    }

    @PostMapping("/logout")
    private ResponseEntity<Void> logoutUser(@RequestHeader(value="Authorization") String authorizationHeader) {
        authService.logoutUser(authorizationHeader);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/test")
    private String test() {
        return "test";
    }

}
