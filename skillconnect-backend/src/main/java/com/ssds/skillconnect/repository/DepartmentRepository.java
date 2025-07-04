package com.ssds.skillconnect.repository;

import com.ssds.skillconnect.dao.Department;
import com.ssds.skillconnect.dao.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {

}
