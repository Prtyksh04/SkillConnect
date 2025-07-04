package com.ssds.skillconnect.schedulers;

import com.ssds.skillconnect.service.PostService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@EnableScheduling
@Log
public class DeleteClosedPostOlderThan3MonthScheduler {

    @Autowired
    private PostService postService;
    @Scheduled(cron = "0 0 0 1,15 * ?")
    public void DeleteClosedPostsOlderThan3Month() {
        log.info("Deleting closed posts older than 3 months");
        postService.deleteClosedPostsOlderThan3Month();
    }

}
