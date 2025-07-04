package com.ssds.skillconnect.service;


import com.ssds.skillconnect.dao.Department;
import com.ssds.skillconnect.repository.DepartmentRepository;
import com.ssds.skillconnect.utils.exception.ApiRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        try {
            return departmentRepository.findAll();
        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }
}
