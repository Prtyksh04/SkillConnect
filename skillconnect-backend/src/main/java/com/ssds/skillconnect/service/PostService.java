package com.ssds.skillconnect.service;

import com.ssds.skillconnect.config.JwtService;
import com.ssds.skillconnect.dao.Post;
import com.ssds.skillconnect.dao.Project;
import com.ssds.skillconnect.dao.Skill;
import com.ssds.skillconnect.dao.User;
import com.ssds.skillconnect.model.PostCreateRequestModel;
import com.ssds.skillconnect.model.PostResponseModel;
import com.ssds.skillconnect.model.PostRowResponseModel;
import com.ssds.skillconnect.model.UserDetailResponseModel;
import com.ssds.skillconnect.repository.PostRepository;
import com.ssds.skillconnect.repository.ProjectRepository;
import com.ssds.skillconnect.repository.SkillRepository;
import com.ssds.skillconnect.repository.UserRepository;
import com.ssds.skillconnect.utils.exception.ApiRequestException;
import com.ssds.skillconnect.utils.helper.Mapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final JwtService jwtService;
    private final Mapper mapper;

    final Integer Descending = 0;
    final Integer Ascending = 1;

    private Logger logger = Logger.getLogger(this.getClass().getName());

    public List<PostRowResponseModel> getAllPosts(
            String authorizationHeader,
            Integer departmentId,
            Integer priority,
            String skill,
            Integer sort,
            Integer pageNumber, Integer pageSize) {

        try {
            Page<Post> allPosts;
            if (departmentId != null || priority != null || skill != null || sort != null) {

                skill = (skill != null && skill.equals("")) ? null : skill;
                sort = (sort == null) ? Descending : sort;

                Pageable pageable = PageRequest.of(
                        pageNumber,
                        pageSize,
                        sort.equals(Descending) ? Sort.by("createdOn").descending() : Sort.by("createdOn").ascending()
                );

                allPosts = postRepository.findPostByDepartmentIdAndSkillAndUrgencyLevel(
                        departmentId,
                        priority,
                        skill,
                        pageable
                );

            } else {

                Pageable pageable = PageRequest.of(
                        pageNumber,
                        pageSize,
                        Sort.by("createdOn").descending()
                );

                allPosts = postRepository.findAll(pageable);
            }

            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);
            Integer currentUserUserId = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found", HttpStatus.NOT_FOUND)).getUserId();

            List<Integer> savedPostIds = userRepository.findSavedPostsIdByUserId(currentUserUserId)
                    .orElseThrow(() -> new ApiRequestException("User not found", HttpStatus.NOT_FOUND));

            if (allPosts == null) {
                throw new ApiRequestException("No posts found", HttpStatus.NOT_FOUND);
            }

            List<PostRowResponseModel> allPostsRowResponseModel = allPosts.getContent().stream()
                    .map(mapper::Post_to_PostRowResponseModel)
                    .collect(Collectors.toList());

            for (PostRowResponseModel postRowResponseModel : allPostsRowResponseModel) {
                postRowResponseModel.setIsSaved(savedPostIds.contains(postRowResponseModel.getPostId()));
                //postRowResponseModel.setListOfSkillsRequired(postRepository.findSkillsByPostId(postRowResponseModel.getPostId()));
                postRowResponseModel.setTotalNumberOfPages(allPosts.getTotalPages());
            }

            return allPostsRowResponseModel;

        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }

    }

    public PostResponseModel createPost(PostCreateRequestModel postCreateRequestModel, String authorizationHeader) {
        try {
            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);

            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found", HttpStatus.NOT_FOUND));

            Project currentProject = projectRepository
                    .findById(postCreateRequestModel.getProjectId())
                    .orElseThrow(() -> new ApiRequestException("Project not found", HttpStatus.NOT_FOUND));

            if (!Objects.equals(currentProject.getProjectCreator().getUserId(), currentUser.getUserId())
                    && !currentProject.getUsersAssignedProjectList().contains(currentUser)) {
                // If the current user is not the creator of the project and is not assigned to the project, then throw an exception
                throw new ApiRequestException("You are not authorized to create a post for this project");
            }

            Post newPost = Post.builder()
                    .postTitle(postCreateRequestModel.getPostTitle())
                    .postDescription(postCreateRequestModel.getPostDescription())
                    .urgencyLevel(postCreateRequestModel.getUrgencyLevel())
                    .createdOn(postCreateRequestModel.getCreatedOn())
                    .isOpen(postCreateRequestModel.getIsOpen())
                    .totalApplicants(postCreateRequestModel.getTotalApplicants())
                    .user(currentUser)
                    .project(currentProject)
                    .build();

            List<Skill> listOfSkills = new ArrayList<>();

            if (postCreateRequestModel.getListOfSkillStringsRequired() != null &&
                    postCreateRequestModel.getListOfSkillStringsRequired().size() > 0) {
                postCreateRequestModel.getListOfSkillStringsRequired().forEach(
                        skillName -> {
                            Optional<Skill> skill = skillRepository.findBySkillName(skillName);
                            if (skill.isPresent()) {
                                listOfSkills.add(skill.get());
                            } else {
                                Skill newSkill = Skill.builder()
                                        .skillName(skillName)
                                        .build();
                                listOfSkills.add(skillRepository.save(newSkill));
                            }
                        }
                );
            }

            newPost.setListOfSkillsRequired(listOfSkills);

            Post savedPost = postRepository.save(newPost);

            return mapper.Post_to_PostResponseModel(savedPost);

        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }

    public PostResponseModel getPostById(Integer postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ApiRequestException("Post not found", HttpStatus.NOT_FOUND));

        return mapper.Post_to_PostResponseModel(post);

    }


    public List<UserDetailResponseModel> getAllApplicantsToPost(Integer postId) {
        try {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new ApiRequestException("Post not found", HttpStatus.NOT_FOUND));

            return post.getListOfApplicants().stream().map(
                    mapper::User_to_UserDetailResponseModel
            ).toList();

        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }

    public PostResponseModel approveTheUser(Integer postId, Integer userId, String authorizationHeader) {
        try {
            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);
            Post currentPost = postRepository.findById(postId)
                    .orElseThrow(() -> new ApiRequestException("Post not found", HttpStatus.NOT_FOUND));

            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found", HttpStatus.NOT_FOUND));

            User postCreatedUser = currentPost.getUser();
            if (!Objects.equals(userEmail, postCreatedUser.getEmail())) {
                throw new ApiRequestException("User has no authority to approve", HttpStatus.UNAUTHORIZED);
            }

            User applyingUser = userRepository.findById(userId)
                    .orElseThrow(() -> new ApiRequestException("User not found", HttpStatus.NOT_FOUND));

            //Mark the post as close
            currentPost.setIsOpen(false);
            postRepository.save(currentPost);

            //Add current user to project
            Project project = currentPost.getProject();
            List<User> projectUsers = project.getUsersAssignedProjectList();
            projectUsers.add(applyingUser);
            project.setUsersAssignedProjectList(projectUsers);
            projectRepository.save(project);

            return mapper.Post_to_PostResponseModel(currentPost);
        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }

    public PostResponseModel applyToPost(Integer postId, String authorizationHeader) {
        try {

            String jwtToken = authorizationHeader.substring(7);
            String userEmail = jwtService.extractUserEmail(jwtToken);

            Post currentPost = postRepository.findById(postId)
                    .orElseThrow(() -> new ApiRequestException("Post not found", HttpStatus.NOT_FOUND));

            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ApiRequestException("User not found", HttpStatus.NOT_FOUND));

            List<User> applicants = currentPost.getListOfApplicants();
            applicants.add(currentUser);
            currentPost.setListOfApplicants(applicants);
            currentPost.setTotalApplicants(currentPost.getTotalApplicants() + 1);
            return mapper.Post_to_PostResponseModel(postRepository.save(currentPost));

        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }


    public void deleteClosedPostsOlderThan3Month() {
        try {
            Timestamp thresholdDate = Timestamp.valueOf(LocalDate.now().minusMonths(3).atStartOfDay());
            postRepository.deleteAllByIsOpenAndCreatedOnBefore(false, thresholdDate);
        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }


}
