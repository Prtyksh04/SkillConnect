package com.ssds.skillconnect.controllers;

import com.ssds.skillconnect.dao.Skill;
import com.ssds.skillconnect.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/skill")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping("/all")
    ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> allSkills = skillService.getAllSkills();
        return ResponseEntity.ok(allSkills);
    }

    @GetMapping("/search/{skillName}") //skillName can be empty
    ResponseEntity<List<Skill>> findSimilarSkills(@PathVariable String skillName) {
        List<Skill> similarSkills = skillService.findSimilarSkills(skillName);
        return ResponseEntity.ok(similarSkills);
    }


}
