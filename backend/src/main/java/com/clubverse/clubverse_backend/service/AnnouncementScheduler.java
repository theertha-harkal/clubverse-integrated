
package com.clubverse.clubverse_backend.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AnnouncementScheduler {

    private final AnnouncementService announcementService;

    public AnnouncementScheduler(
            AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @Scheduled(fixedRate = 60000)
    public void publishScheduledAnnouncements() {
        announcementService.publishDueAnnouncements();
    }
}
