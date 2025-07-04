package com.ssds.skillconnect.repository;

import com.ssds.skillconnect.dao.Post;
import com.ssds.skillconnect.dao.Skill;
import com.ssds.skillconnect.dao.User;
import com.ssds.skillconnect.model.UserSearchResponseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u " +
            "FROM User u " +
            "WHERE u.department.departmentId = :departmentId")
    Optional<List<User>> findAllUserByDepartmentId(@Param("departmentId") Integer departmentId);

    @Query("SELECT new com.ssds.skillconnect.model.UserSearchResponseModel( " +
            "u.userId, " +
            "u.name, " +
            "u.email ) " +
            "FROM User u " +
            "WHERE (:name is NULL OR lower(u.name) LIKE lower(concat('%', :name,'%'))) " +
            "AND u.userId NOT IN (SELECT uAPL.userId FROM Project p JOIN p.usersAssignedProjectList uAPL WHERE p.projectId = :projectId)")
    Optional<List<UserSearchResponseModel>> findByNameContainingAndNotInProject(
            @Param("projectId") Integer projectId,
            @Param("name") String name);

    @Query("SELECT sP.postId " +
            "FROM User u " +
            "JOIN u.savedPosts sP WHERE u.userId = :userId")
    Optional<List<Integer>> findSavedPostsIdByUserId(@Param("userId") Integer userId);

    @Query("SELECT u.savedPosts " +
            "FROM User u " +
            "WHERE u.userId = :userId")
    Optional<List<Post>> findSavedPostsByUserId(@Param("userId") Integer userId);


    //TODO: not required for now
    @Query("SELECT u.listOfSkills " +
            "FROM User u " +
            "WHERE u.userId = :userId")
    List<Skill> findListOfSkillsByUserId(@Param("userId") Integer userId);


    @Query("SELECT u FROM User u " +
            "WHERE u.userId IN (SELECT uAPL.userId FROM Project p JOIN p.usersAssignedProjectList uAPL WHERE p.projectId = :projectId) " +
            "AND u.userId != :userId")
    Optional<List<User>> findAllUsersInProject(
            @Param("userId") Integer userId,
            @Param("projectId") Integer projectId
    );
}
