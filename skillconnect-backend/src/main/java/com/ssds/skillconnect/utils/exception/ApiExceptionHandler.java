package com.ssds.skillconnect.utils.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(value = {ApiRequestException.class})
    public ResponseEntity<Object> handelApiRequestException(ApiRequestException apiRequestException) {

        //Kind of filter for exceptions as it converts ApiRequestException to ResponseEntity with payload - message, status, timestamp

        // 1. Create Payload containing Exception and details;
        ApiException apiException = new ApiException(
                apiRequestException.getMessage(),
                apiRequestException.getStatus(),
                ZonedDateTime.now(ZoneId.of("Z"))
        );

        // 2. Return ResponseEntity
        return new ResponseEntity<>(apiException, apiRequestException.getStatus());

    }
}
