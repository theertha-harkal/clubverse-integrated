
package com.clubverse.clubverse_backend.repository;

import com.clubverse.clubverse_backend.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AnnouncementRepository
        extends JpaRepository<Announcement, Long> {

    List<Announcement> findByStatus(
            Announcement.Status status);

    List<Announcement> findByTargetAudience(
            Announcement.TargetAudience targetAudience);

    List<Announcement> findByCreatedBy(
            Long createdBy);

    List<Announcement> findByStatusAndScheduledAtLessThanEqual(
            Announcement.Status status,
            LocalDateTime scheduledAt);
}
