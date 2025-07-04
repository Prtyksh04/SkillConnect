package com.ssds.skillconnect.service;

import com.ssds.skillconnect.config.JwtService;
import com.ssds.skillconnect.dao.Department;
import com.ssds.skillconnect.model.Role;
import com.ssds.skillconnect.dao.User;
import com.ssds.skillconnect.model.UserLoginModel;
import com.ssds.skillconnect.model.UserRegisterModel;
import com.ssds.skillconnect.repository.DepartmentRepository;
import com.ssds.skillconnect.repository.UserRepository;
import com.ssds.skillconnect.model.AuthenticationResponseModel;
import com.ssds.skillconnect.utils.exception.ApiRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    public AuthenticationResponseModel registerUser(UserRegisterModel userRegisterModel) {
        User user = new User();
        user.setName(userRegisterModel.getName());
        user.setEmail(userRegisterModel.getEmail());
        user.setPassword(passwordEncoder.encode(userRegisterModel.getPassword()));
        user.setRole(Role.USER);

        Department userDepartment = departmentRepository.findById(userRegisterModel.getDepartmentId())
                .orElseThrow(() -> new ApiRequestException("Department not found", HttpStatus.NOT_FOUND));

        user.setDepartment(userDepartment);

        try {
            userRepository.save(user);
            String jwtToken = jwtService.generateToken(user);

            Timestamp expiryDateTime = new Timestamp(jwtService.extractExpiration(jwtToken).getTime());

            return new AuthenticationResponseModel(
                    jwtToken,
                    user.getUserId(),
                    expiryDateTime
            );
        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }

    public AuthenticationResponseModel authenticateUser(UserLoginModel userLoginModel) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userLoginModel.getEmail(),
                        userLoginModel.getPassword()
                )
        );

        // It is not needed as authenticationManager.authenticate() will throw an exception if authentication fails
        if(!authentication.isAuthenticated()) {
            throw new ApiRequestException("User not authenticated", HttpStatus.UNAUTHORIZED);
        }

        User user = userRepository.findByEmail(userLoginModel.getEmail())
                .orElseThrow( () -> new ApiRequestException("User not found", HttpStatus.NOT_FOUND));

        String jwtToken = jwtService.generateToken(user);

        Timestamp expiryDateTime = new Timestamp(jwtService.extractExpiration(jwtToken).getTime());

        return new AuthenticationResponseModel(
                jwtToken,
                user.getUserId(),
                expiryDateTime
        );
    }

    public void logoutUser(String authorizationHeader) {
        try {
            String jwtToken = authorizationHeader.substring(7);
            jwtService.invalidateToken(jwtToken);
        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }
}
