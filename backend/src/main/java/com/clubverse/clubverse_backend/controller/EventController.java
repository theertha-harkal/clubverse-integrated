package com.clubverse.clubverse_backend.controller;

import com.clubverse.clubverse_backend.dto.EventRequest;
import com.clubverse.clubverse_backend.dto.EventResponse;
import com.clubverse.clubverse_backend.service.EventService;

import com.clubverse.clubverse_backend.service.EventFileService;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final EventFileService eventFileService;

    public EventController(EventService eventService ,
        EventFileService eventFileService) {
        this.eventService = eventService;
        this.eventFileService = eventFileService;
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @RequestBody EventRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        EventResponse response = eventService.createEvent(request, email);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {

        return ResponseEntity.ok(
                eventService.getAllEvents()
        );
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEvent(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                eventService.getEvent(eventId)
        );
    }

    // Previously missing: events created with approvalRequired=true are
    // saved as PENDING (see EventService.createEvent), but there was no way
    // for a Campus/Platform admin to actually approve or reject them - the
    // frontend's EventApprovalQueue screen had nothing to call. Mirrors the
    // existing AnnouncementController#updateStatus pattern.
    @PutMapping("/{eventId}/status")
    public ResponseEntity<EventResponse> updateStatus(
            @PathVariable Long eventId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                eventService.updateStatus(eventId, status)
        );
    }
    @PostMapping(
        value = "/upload-poster",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public ResponseEntity<String> uploadPoster(
        @RequestParam("file") MultipartFile file)
        throws IOException {

    String fileUrl = eventFileService.uploadPoster(file);
    return ResponseEntity.ok(fileUrl);
}
}