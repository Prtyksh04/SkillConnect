package com.ssds.skillconnect.service;

import com.ssds.skillconnect.dao.Skill;
import com.ssds.skillconnect.repository.SkillRepository;
import com.ssds.skillconnect.utils.exception.ApiRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public List<Skill> findSimilarSkills(String skillName) {
        return skillRepository.findSimilarSkills(skillName);
    }

    public Skill getSkillById(Integer skillId) {
        return skillRepository.findById(skillId)
                .orElseThrow(() -> new ApiRequestException("Skill not found"));
    }

    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

}
