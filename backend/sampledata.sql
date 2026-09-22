BEGIN;

TRUNCATE TABLE
    reports,
    volunteer_applications,
    volunteer_opportunities,
    registrations,
    announcements,
    comments,
    posts,
    events,
    users
RESTART IDENTITY CASCADE;

-- -----------------------------------------------------------------------------
-- USERS  (5 Student, 3 Club Admin, 1 Platform Admin)
-- Passwords (plaintext -> shown in the credentials table at the bottom):
--   Students      : Student@123
--   Club Admins   : ClubAdmin@123
--   Platform Admin: PlatformAdmin@123
-- -----------------------------------------------------------------------------
INSERT INTO users (id, name, email, password, roll_number, batch, department, role) VALUES
(1, 'Malla Snehaja',   'mallasnehaja4bcs68@gmail.com',             '$2b$10$2RvE96vps0Ur9oN1J52IAup/XGemuYOKLRtSyeV16vP//cr1q3qdC', '2024BCS0068', '2024', 'Computer Science', 'STUDENT'),
(2, 'Shalini M',       'shalinim24bcs0308@iiitkottayam.ac.in',     '$2b$10$USqcWK02D1YwA1OOfl1XGusi3X6mMEHzL7Mlyf.4TZwsESwi/RI2S', '2024BCS0308', '2024', 'Computer Science', 'STUDENT'),
(3, 'Vamshika G',      'vamshikag24bcd16@iiitkottayam.ac.in',      '$2b$10$JzVbWkDD/DPxxXaWvXlIyuIrcXw/STeaGEGBBzNWusuB2Xs1tWWWS', '2024BCD0016', '2024', 'Computer Science', 'STUDENT'),
(4, 'Theertha S',      'theerthas24bcs0184@iiitkottayam.ac.in',    '$2b$10$XT4q/ZCwK2Yhmucg0CnHR.u/sX6siLHunO5pqnEGMGVyEkcC1aXfK', '2024BCS0184', '2024', 'Computer Science', 'STUDENT'),
(5, 'Arjun Menon',     'arjunmenon24bec0027@iiitkottayam.ac.in',   '$2b$10$Le0rwep4eA2bhvSlsmMBue2c0yHYovv1mQJ2OLw03znL4rJ9qhkO.', '2024BEC0027', '2024', 'Electronics and Communication', 'STUDENT'),
(6, 'Trendles Admin',  'trendles.club@iiitkottayam.ac.in',         '$2b$10$UiWmFAiDS2PjCIXvg/dpnOksCiGU4dxAeODPgUFqi5Iu3s6v6W9R6', NULL, NULL, 'Trendles',  'CLUB_ADMIN'),
(7, 'TinkerHub Admin', 'tinkerhub.club@iiitkottayam.ac.in',        '$2b$10$pLYjNoJwc7w0JyVfgb5IcurPxcZn3Eu68DeX00mpPY8XiMRGatdz6', NULL, NULL, 'TinkerHub', 'CLUB_ADMIN'),
(8, 'Under25 Admin',   'under25.club@iiitkottayam.ac.in',          '$2b$10$MD12400V2fl6JIRhpf4ZzOd.bfxUFqm5Xf2zQ73VK38Fv5TeIrVY.', NULL, NULL, 'Under25',   'CLUB_ADMIN'),
(9, 'Campus Admin',    'admin@iiitkottayam.ac.in',                 '$2b$10$rRp9kqpZEdvyg5BhvuOYnu.8j34EM/mEf/KPCbnoQlfuQGZUUndgO', NULL, NULL, 'Campus Life & Student Affairs', 'PLATFORM_ADMIN');

-- -----------------------------------------------------------------------------
-- EVENTS  (8 events — 5 published, 2 pending approval, 1 completed)
-- organizer_id 6 = Trendles Admin, 7 = TinkerHub Admin, 8 = Under25 Admin,
-- 9 = Campus Admin (official, cross-club events)
-- -----------------------------------------------------------------------------
INSERT INTO events (
    id, title, description, poster_url, event_date, venue, start_time, end_time,
    eligibility, max_registrations, registered_count, registration_deadline,
    volunteer_registration_enabled, rewards_enabled, approval_required, reward_xp,
    featured, free_entry, tags, organizer_id, status, created_at
) VALUES
(1, 'CODE KALARI 2026 - 24-Hour Hackathon',
    'IIIT Kottayam''s flagship hackathon. Bring a team of up to 4 or find one at kickoff. Tracks include AI, Web/App, and Open Innovation, with prizes for Best Overall, Best Design, and Best Use of AI.',
    NULL, '2026-10-24', 'Innovation Lab, Academic Block', '09:00:00', '09:00:00',
    'All Students', 80, 4, '2026-10-20',
    TRUE, TRUE, FALSE, 250,
    TRUE, TRUE, 'hackathon,coding,ai,teams', 7, 'PUBLISHED', '2026-09-14 09:00:00'),

(2, 'TinkerHub Build Session: IoT & Hardware Sprint',
    'A hands-on evening building a simple IoT sensor circuit from scratch - microcontrollers, breadboards, and a live demo at the end. Beginners welcome.',
    NULL, '2026-10-03', 'Electronics Lab, Academic Block', '15:00:00', '18:00:00',
    'All Students', 40, 3, '2026-10-01',
    TRUE, TRUE, FALSE, 60,
    FALSE, TRUE, 'tinkerhub,iot,hardware,workshop', 7, 'PUBLISHED', '2026-09-05 10:15:00'),

(3, 'Under25 Campus Meetup - Ideas & Chill',
    'An informal evening meetup for anyone under 25 with an idea, a side project, or just curiosity about the startup/creator scene. Snacks provided.',
    NULL, '2026-10-08', 'Amphitheatre Lawn', '17:30:00', '19:30:00',
    'All Students', 150, 3, '2026-10-06',
    FALSE, FALSE, FALSE, 0,
    FALSE, TRUE, 'under25,community,networking', 8, 'PUBLISHED', '2026-09-08 09:00:00'),

(4, 'Under25 Freshers'' Social Night',
    'A welcome mixer for the newest batch - games, music, and a chance to meet Under25 members from every department.',
    NULL, '2026-11-05', 'Student Activity Centre', '19:00:00', '22:00:00',
    'All Students', 120, 0, '2026-11-03',
    FALSE, FALSE, TRUE, 0,
    FALSE, TRUE, 'under25,freshers,social', 8, 'PENDING', '2026-09-18 08:45:00'),

(5, 'Trendles Fashion & Talent Showcase',
    'Trendles'' annual showcase - ramp walk, styling round, and open talent segment. Auditions open a week before.',
    NULL, '2026-10-17', 'Main Auditorium', '18:00:00', '21:00:00',
    'All Students', 200, 4, '2026-10-15',
    FALSE, FALSE, FALSE, 0,
    TRUE, TRUE, 'trendles,fashion,talent,showcase', 6, 'PUBLISHED', '2026-09-10 11:30:00'),

(6, 'Trendles Club Recruitment Drive 2026',
    'Open recruitment for the Trendles core team - styling, event management, photography, and social media roles.',
    NULL, '2026-11-21', 'Seminar Hall 1', '13:00:00', '16:00:00',
    'All Students', 60, 0, '2026-11-15',
    FALSE, FALSE, TRUE, 0,
    FALSE, TRUE, 'trendles,recruitment', 6, 'PENDING', '2026-09-19 16:20:00'),

(7, 'MindQuest Inter-Department Quiz Competition',
    'Teams of 2 represent their department in a 4-round general quiz - science, tech, pop culture, and a rapid-fire finale. Trophy and bragging rights on the line.',
    NULL, '2026-10-12', 'Lecture Hall A', '16:00:00', '18:30:00',
    'All Students', 100, 2, '2026-10-10',
    FALSE, TRUE, FALSE, 40,
    FALSE, TRUE, 'mindquest,quiz,competition', 9, 'PUBLISHED', '2026-09-11 12:00:00'),

(8, 'Sportec Football Tournament - Semester Kickoff',
    'The opening football tournament of the semester - department teams, knockout format, finals on the main ground.',
    NULL, '2026-08-29', 'Main Sports Ground', '15:00:00', '19:00:00',
    'All Students', 150, 3, '2026-08-27',
    FALSE, FALSE, FALSE, 0,
    FALSE, TRUE, 'sportec,football,sports', 9, 'COMPLETED', '2026-08-10 10:00:00');

-- -----------------------------------------------------------------------------
-- REGISTRATIONS  (event_id, user_id) — respects the unique(event_id,user_id)
-- constraint. registered_count above was set to match these counts exactly.
-- -----------------------------------------------------------------------------
INSERT INTO registrations (id, event_id, user_id, status, registered_at) VALUES
(1, 1, 1, 'CONFIRMED', '2026-09-15 09:00:00'),
(2, 1, 2, 'CONFIRMED', '2026-09-15 09:10:00'),
(3, 1, 3, 'CONFIRMED', '2026-09-15 10:00:00'),
(4, 1, 5, 'CONFIRMED', '2026-09-17 21:00:00'),

(5, 2, 1, 'CONFIRMED',  '2026-09-06 09:00:00'),
(6, 2, 3, 'CONFIRMED',  '2026-09-07 12:40:00'),
(7, 2, 2, 'WAITLISTED', '2026-09-25 19:50:00'),

(8,  3, 2, 'CONFIRMED', '2026-09-09 10:00:00'),
(9,  3, 4, 'CONFIRMED', '2026-09-10 08:30:00'),
(10, 3, 5, 'CONFIRMED', '2026-09-11 20:15:00'),

(11, 5, 1, 'CONFIRMED', '2026-09-11 09:00:00'),
(12, 5, 2, 'CONFIRMED', '2026-09-11 09:20:00'),
(13, 5, 4, 'CONFIRMED', '2026-09-12 15:45:00'),
(14, 5, 5, 'CONFIRMED', '2026-09-13 18:05:00'),

(15, 7, 3, 'CONFIRMED', '2026-09-12 09:00:00'),
(16, 7, 4, 'CONFIRMED', '2026-09-13 11:00:00'),

(17, 8, 1, 'CONFIRMED', '2026-08-12 09:00:00'),
(18, 8, 3, 'CONFIRMED', '2026-08-13 14:00:00'),
(19, 8, 5, 'CONFIRMED', '2026-08-15 17:30:00');

-- -----------------------------------------------------------------------------
-- VOLUNTEER OPPORTUNITIES  (tied to events with volunteer_registration_enabled)
-- filled_slots below was set to match the ACCEPTED applications inserted next.
-- -----------------------------------------------------------------------------
INSERT INTO volunteer_opportunities (
    id, event_id, role, team, requirements, reward_xp,
    application_deadline, total_slots, filled_slots, active
) VALUES
(1, 1, 'Registration Desk Lead', 'Front of House',
    'Comfortable checking people in, calm under pressure during the morning rush.', 80,
    '2026-10-20', 3, 2, TRUE),

(2, 1, 'Technical Support Crew', 'Tech & AV',
    'Basic networking/AV troubleshooting; you''ll be on call for projector and wifi issues.', 100,
    '2026-10-20', 4, 1, TRUE),

(3, 2, 'Hardware Kits Assistant', 'Logistics',
    'Help distribute and pack up hardware kits before/after the build session - no prior experience needed.', 40,
    '2026-10-01', 2, 1, TRUE);

-- -----------------------------------------------------------------------------
-- VOLUNTEER APPLICATIONS  (opportunity_id, user_id) — unique pair per opportunity
-- -----------------------------------------------------------------------------
INSERT INTO volunteer_applications (id, opportunity_id, user_id, application_message, status, applied_at) VALUES
(1, 1, 1, 'I helped run registration for last year''s CODE KALARI, happy to do it again!', 'ACCEPTED', '2026-09-16 10:00:00'),
(2, 1, 3, 'I''m organized and free the whole weekend.',                                   'ACCEPTED', '2026-09-16 11:30:00'),
(3, 1, 2, 'Would love to help out, first time volunteering for a hackathon.',             'PENDING',  '2026-09-17 09:00:00'),
(4, 2, 4, 'I do AV setup for department events, comfortable with mixers and projectors.', 'ACCEPTED', '2026-09-17 14:20:00'),
(5, 2, 5, 'I know basic networking from my coursework.',                                  'REJECTED', '2026-09-17 16:45:00'),
(6, 3, 2, 'I''m attending the session anyway, happy to come early and help set up.',      'ACCEPTED', '2026-09-06 12:00:00');

-- -----------------------------------------------------------------------------
-- ANNOUNCEMENTS
-- -----------------------------------------------------------------------------
INSERT INTO announcements (id, title, message_body, media_url, target_audience, event_id, scheduled_at, status, created_by, created_at, updated_at) VALUES
(1, 'CODE KALARI 2026 Registrations Now Open!',
    'Registration for CODE KALARI 2026 is live. Teams of up to 4, all departments and skill levels welcome. Sign up on the Events tab before Oct 20.',
    NULL, 'ENTIRE_CAMPUS', 1, NULL, 'PUBLISHED', 7, '2026-09-14 09:30:00', '2026-09-14 09:30:00'),

(2, 'TinkerHub Weekly Build Session Moved to Saturday',
    'Heads up - this week''s build session moves from Friday to Saturday, same time and lab, due to a maintenance conflict.',
    NULL, 'CLUB_MEMBERS', NULL, NULL, 'PUBLISHED', 7, '2026-09-16 08:00:00', '2026-09-16 08:00:00'),

(3, 'Under25 Freshers'' Social Night - RSVP Now',
    'If you''re planning to come to the Freshers'' Social, RSVP on the event page so we can plan food and seating. See you there!',
    NULL, 'EVENT_REGISTRANTS', 4, NULL, 'PUBLISHED', 8, '2026-09-20 12:00:00', '2026-09-20 12:00:00'),

(4, 'Trendles Recruitment Drive 2026 - Applications Open',
    'Trendles is recruiting for styling, event management, photography, and social media roles. Full details coming once the drive is approved.',
    NULL, 'ENTIRE_CAMPUS', 6, NULL, 'DRAFT', 6, '2026-09-19 16:30:00', '2026-09-19 16:30:00'),

(5, 'Campus Portal Maintenance Notice',
    'ClubVerse will be briefly unavailable for scheduled maintenance early Sunday morning. No action needed on your part.',
    NULL, 'ENTIRE_CAMPUS', NULL, '2026-09-28 03:00:00', 'SCHEDULED', 9, '2026-09-21 10:00:00', '2026-09-21 10:00:00');

-- -----------------------------------------------------------------------------
-- POSTS
-- -----------------------------------------------------------------------------
INSERT INTO posts (id, community, title, content, media_url, anonymous, like_count, created_at, user_id) VALUES
(1, 'TinkerHub', 'CODE KALARI 2026 hype is real!',
    'So hyped for CODE KALARI this year! Already got my team of 4 locked in, anyone else building something with AI?',
    NULL, FALSE, 14, '2026-09-15 19:00:00', 4),

(2, 'Placements', 'Anyone up for mock interviews before placement season?',
    'Trying to get a group together for peer mock interviews - mix of technical and HR rounds. Drop a comment if interested.',
    NULL, FALSE, 9, '2026-09-16 13:20:00', 2),

(3, 'TinkerHub', 'TinkerHub Build Session was so useful - built my first IoT sensor circuit!',
    'Went in knowing nothing about microcontrollers, left with a working temperature sensor. Highly recommend the next session.',
    NULL, FALSE, 11, '2026-09-04 20:00:00', 3),

(4, 'General', 'Anonymous confession: hostel food quality has really gone downhill this semester',
    'Does anyone else feel like the mess menu has gotten worse since the new semester started? Just me?',
    NULL, TRUE, 27, '2026-09-17 21:40:00', 5),

(5, 'CS Department', 'OS assignment 3 scheduling algorithms - anyone else stuck?',
    'The Banker''s algorithm part of assignment 3 is kicking my butt. Study group anyone?',
    NULL, FALSE, 8, '2026-09-18 22:10:00', 1),

(6, 'TinkerHub', 'Hackathon team looking for 1 more member (frontend/design)',
    'We''re 3 people, solid on backend and hardware, need someone comfortable with frontend/design for CODE KALARI 2026.',
    NULL, FALSE, 6, '2026-09-19 15:30:00', 2),

(7, 'Campus Life', 'Lost my ID card near the Academic Block',
    'If anyone finds a student ID under the name Vamshika G near the Academic Block, please hand it to the reception. Thank you!',
    NULL, FALSE, 3, '2026-09-20 08:15:00', 3);

-- -----------------------------------------------------------------------------
-- COMMENTS  (including two threaded replies via parent_comment_id)
-- -----------------------------------------------------------------------------
INSERT INTO comments (id, content, anonymous, like_count, created_at, post_id, user_id, parent_comment_id) VALUES
(1, 'Same!! My team''s building an AI-based campus navigation app.',       FALSE, 3, '2026-09-15 19:20:00', 1, 1, NULL),
(2, 'That sounds amazing, let''s connect after the opening ceremony!',     FALSE, 2, '2026-09-15 19:45:00', 1, 4, 1),

(3, 'Count me in, I need this too.', FALSE, 4, '2026-09-16 14:00:00', 2, 3, NULL),

(4, 'Wait it''s open to non-members too? Definitely attending the next one.', FALSE, 5, '2026-09-05 09:30:00', 3, 2, NULL),

(5, 'Yes!! Let''s form a study group, I''m so lost on the Banker''s algorithm part.', FALSE, 2, '2026-09-18 22:30:00', 5, 2, NULL),
(6, 'Count me in, when works for everyone?',                                          FALSE, 1, '2026-09-18 23:00:00', 5, 1, 5),

(7, 'What''s the tech stack? I might know someone who''d be a good fit.', FALSE, 1, '2026-09-19 16:00:00', 6, 4, NULL),

(8, 'I think I saw an ID near the library too, was it turned in at the reception?', FALSE, 1, '2026-09-20 09:00:00', 7, 1, NULL);

-- -----------------------------------------------------------------------------
-- REPORTS  (no frontend screen creates these yet, but the endpoint/table is
-- fully wired - useful for testing the Campus Admin Reports view and API)
-- -----------------------------------------------------------------------------
INSERT INTO reports (id, report_type, reported_post_id, reported_event_id, reported_user_id, reporter_id, category, severity, status, created_at) VALUES
(1, 'POST',  4,    NULL, NULL, 2, 'SPAM',          'LOW',    'NEW',      '2026-09-18 08:00:00'),
(2, 'USER',  NULL, NULL, 3,    5, 'HARASSMENT',    'MEDIUM', 'PENDING',  '2026-09-19 12:30:00'),
(3, 'EVENT', NULL, 3,    NULL, 4, 'IMPERSONATION', 'HIGH',   'RESOLVED', '2026-09-11 09:00:00');

-- -----------------------------------------------------------------------------
-- Re-sync every identity sequence so the running application's next INSERT
-- (e.g. a new user registering, a new post) continues from the right number
-- instead of colliding with the explicit IDs used above.
-- -----------------------------------------------------------------------------
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('events', 'id'), (SELECT MAX(id) FROM events));
SELECT setval(pg_get_serial_sequence('registrations', 'id'), (SELECT MAX(id) FROM registrations));
SELECT setval(pg_get_serial_sequence('volunteer_opportunities', 'id'), (SELECT MAX(id) FROM volunteer_opportunities));
SELECT setval(pg_get_serial_sequence('volunteer_applications', 'id'), (SELECT MAX(id) FROM volunteer_applications));
SELECT setval(pg_get_serial_sequence('announcements', 'id'), (SELECT MAX(id) FROM announcements));
SELECT setval(pg_get_serial_sequence('posts', 'id'), (SELECT MAX(id) FROM posts));
SELECT setval(pg_get_serial_sequence('comments', 'id'), (SELECT MAX(id) FROM comments));
SELECT setval(pg_get_serial_sequence('reports', 'id'), (SELECT MAX(id) FROM reports));

COMMIT;
