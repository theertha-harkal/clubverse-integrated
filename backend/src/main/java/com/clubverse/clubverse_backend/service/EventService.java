package com.clubverse.clubverse_backend.service;

import com.clubverse.clubverse_backend.dto.EventRequest;
import com.clubverse.clubverse_backend.dto.EventResponse;
import com.clubverse.clubverse_backend.entity.Event;
import com.clubverse.clubverse_backend.repository.EventRepository;
import org.springframework.stereotype.Service;
import com.clubverse.clubverse_backend.entity.User;
import com.clubverse.clubverse_backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(
        EventRepository eventRepository,
        UserRepository userRepository) {

    this.eventRepository = eventRepository;
    this.userRepository = userRepository;
    }

    public EventResponse createEvent(
            EventRequest request,
            String email) {
        User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

        Long organizerId = user.getId();

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setPosterUrl(request.getPosterUrl());
        event.setEventDate(request.getEventDate());
        event.setVenue(request.getVenue());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setEligibility(request.getEligibility());
        event.setMaxRegistrations(request.getMaxRegistrations());
        event.setRegisteredCount(0);
        event.setRegistrationDeadline(
                request.getRegistrationDeadline()
        );
        event.setVolunteerRegistrationEnabled(
                request.isVolunteerRegistrationEnabled()
        );
        event.setRewardsEnabled(
                request.isRewardsEnabled()
        );
        event.setApprovalRequired(
                request.isApprovalRequired()
        );
        event.setRewardXp(
                request.getRewardXp()
        );
        event.setFeatured(
                request.isFeatured()
        );
        event.setFreeEntry(
                request.isFreeEntry()
        );
        event.setTags(request.getTags());

        event.setOrganizerId(organizerId);

        event.setStatus(
                request.isApprovalRequired()
                        ? Event.Status.PENDING
                        : Event.Status.PUBLISHED
        );

        event.setCreatedAt(LocalDateTime.now());

        Event savedEvent = eventRepository.save(event);

        return convertToResponse(savedEvent);
    }

    public List<EventResponse> getAllEvents() {

        return eventRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public EventResponse getEvent(Long eventId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        return convertToResponse(event);
    }

    public EventResponse updateStatus(Long eventId, String status) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        Event.Status newStatus;

        try {
            newStatus = Event.Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(
                    "Invalid status. Use DRAFT, PENDING, PUBLISHED, REJECTED, COMPLETED or CANCELLED"
            );
        }

        event.setStatus(newStatus);

        Event saved = eventRepository.save(event);

        return convertToResponse(saved);
    }

    private EventResponse convertToResponse(Event event) {

        // EventResponse previously only exposed organizerId, forcing the
        // frontend to show a raw numeric id where a club/organizer name was
        // expected (see EventsFeed/EventDetail screens). There's no
        // dedicated "get user by id" endpoint, so we resolve the name here.
        String organizerName = userRepository.findById(event.getOrganizerId())
                .map(User::getName)
                .orElse("Unknown organizer");

        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getPosterUrl(),
                event.getEventDate(),
                event.getVenue(),
                event.getStartTime(),
                event.getEndTime(),
                event.getEligibility(),
                event.getMaxRegistrations(),
                event.getRegisteredCount(),
                event.getRegistrationDeadline(),
                event.isVolunteerRegistrationEnabled(),
                event.isRewardsEnabled(),
                event.isApprovalRequired(),
                event.getRewardXp(),
                event.isFeatured(),
                event.isFreeEntry(),
                event.getTags(),
                event.getOrganizerId(),
                organizerName,
                event.getStatus().name(),
                event.getCreatedAt()
        );
    }
}