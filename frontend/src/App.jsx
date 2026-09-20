import React, { useState } from "react";
import { PhoneFrame, DesktopFrame, T } from "./lib/ui";
import { useAuth } from "./lib/auth";

import Onboarding from "./screens/student/Onboarding";
import Login from "./screens/student/Login";
import HomeFeed from "./screens/student/HomeFeed";
import CreatePost from "./screens/student/CreatePost";
import PostDetail from "./screens/student/PostDetail";
import Communities from "./screens/student/Communities";
import Search from "./screens/student/Search";
import CommunityDetail from "./screens/student/CommunityDetail";
import EventsFeed from "./screens/student/EventsFeed";
import EventDetail from "./screens/student/EventDetail";
import VolunteerOps from "./screens/student/VolunteerOps";
import Profile from "./screens/student/Profile";
import Messages from "./screens/student/Messages";

import AdminLogin from "./screens/clubadmin/AdminLogin";
import AdminDashboard from "./screens/clubadmin/AdminDashboard";
import ClubProfile from "./screens/clubadmin/ClubProfile";
import EventsManagement from "./screens/clubadmin/EventsManagement";
import CreateEvent from "./screens/clubadmin/CreateEvent";
import EventManagement from "./screens/clubadmin/EventManagement";
import Registrations from "./screens/clubadmin/Registrations";
import VolunteersOverview from "./screens/clubadmin/VolunteersOverview";
import VolunteerDetail from "./screens/clubadmin/VolunteerDetail";
import ClubMembers from "./screens/clubadmin/ClubMembers";
import Announcements from "./screens/clubadmin/Announcements";
import CreateAnnouncement from "./screens/clubadmin/CreateAnnouncement";
import RewardsManagement from "./screens/clubadmin/RewardsManagement";
import Analytics from "./screens/clubadmin/Analytics";
import AdminNotifications from "./screens/clubadmin/AdminNotifications";
import AdminSettings from "./screens/clubadmin/AdminSettings";

import CampusLogin from "./screens/campusadmin/CampusLogin";
import CampusDashboard from "./screens/campusadmin/CampusDashboard";
import ModerationQueue from "./screens/campusadmin/ModerationQueue";
import ModerationReview from "./screens/campusadmin/ModerationReview";
import ReportsManagement from "./screens/campusadmin/ReportsManagement";
import EventApprovalQueue from "./screens/campusadmin/EventApprovalQueue";
import CampusAnnouncements from "./screens/campusadmin/CampusAnnouncements";
import StudentManagement from "./screens/campusadmin/StudentManagement";
import CampusAnalytics from "./screens/campusadmin/CampusAnalytics";
import AuditLogs from "./screens/campusadmin/AuditLogs";
import CampusSettings from "./screens/campusadmin/CampusSettings";

const STUDENT_SCREENS = new Set(["onboarding", "login", "home", "create", "postDetail", "communities", "search", "communityDetail", "events", "eventDetail", "volunteerOps", "profile", "notifications"]);
const CLUB_SCREENS = new Set(["adminLogin", "dashboard", "clubProfile", "eventsManagement", "createEvent", "eventManagement", "registrations", "volunteersOverview", "volunteerDetail", "clubMembers", "announcements", "createAnnouncement", "rewardsManagement", "clubAnalytics", "clubNotifications", "settings"]);
const CAMPUS_SCREENS = new Set(["campusLogin", "campusDashboard", "moderationQueue", "moderationReview", "reportsManagement", "eventApprovalQueue", "campusAnnouncements", "studentManagement", "campusAnalytics", "auditLogs", "campusSettings"]);

function TierSwitcher({ tier, setTier }) {
  const tiers = [{ key: "student", label: "Student App" }, { key: "club", label: "Club Admin" }, { key: "campus", label: "Campus Admin" }];
  return (
    <div className="flex gap-2 mb-6 bg-white rounded-full p-1" style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.08)" }}>
      {tiers.map(t => (
        <button key={t.key} onClick={() => setTier(t.key)} className="px-5 py-2 rounded-full font-['Inter'] font-semibold text-[13px] border-none cursor-pointer"
          style={{ background: tier === t.key ? T.primary : "transparent", color: tier === t.key ? "white" : T.muted }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  // A user who's already logged in (token persisted in localStorage) should
  // land on the right screen for their role instead of a login screen -
  // otherwise every page refresh during development throws them back to a
  // login form even though they still have a valid session.
  const initialTierFor = (role) => {
    if (role === "CLUB_ADMIN") return "club";
    if (role === "PLATFORM_ADMIN") return "campus";
    return "student";
  };

  const [tier, setTier] = useState(user ? initialTierFor(user.role) : "student");
  const [studentScreen, setStudentScreen] = useState(user?.role === "STUDENT" ? "home" : "onboarding");
  const [clubScreen, setClubScreen] = useState(user?.role === "CLUB_ADMIN" ? "dashboard" : "adminLogin");
  const [campusScreen, setCampusScreen] = useState(user?.role === "PLATFORM_ADMIN" ? "campusDashboard" : "campusLogin");
  const [activePost, setActivePost] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [activeVolunteer, setActiveVolunteer] = useState(null);
  const [activeReview, setActiveReview] = useState(null);

  const go = (key) => {
    if (key === "notifications" && tier === "club") key = "clubNotifications";
    if (STUDENT_SCREENS.has(key)) { setTier("student"); setStudentScreen(key); }
    else if (CLUB_SCREENS.has(key)) { setTier("club"); setClubScreen(key); }
    else if (CAMPUS_SCREENS.has(key)) { setTier("campus"); setCampusScreen(key); }
  };
  const openPost = (p) => { setActivePost(p); go("postDetail"); };
  const openEvent = (e) => { setActiveEvent(e); go("eventDetail"); };
  const openManagedEvent = (e) => { setActiveEvent(e); go("eventManagement"); };
  const openCommunity = (c) => { setActiveCommunity(c); go("communityDetail"); };
  const openVolunteer = (v) => { setActiveVolunteer(v); go("volunteerDetail"); };
  const openReview = (r) => { setActiveReview(r); go("moderationReview"); };

  // club-admin screens use a shared bottom nav with key "notifications" -> map to clubNotifications
  const clubGo = (key) => go(key === "notifications" ? "clubNotifications" : key);

  let studentBody;
  switch (studentScreen) {
    case "onboarding": studentBody = <Onboarding go={go} />; break;
    case "login": studentBody = <Login go={go} />; break;
    case "home": studentBody = <HomeFeed go={go} openPost={openPost} />; break;
    case "create": studentBody = <CreatePost go={go} />; break;
    case "postDetail": studentBody = <PostDetail go={go} post={activePost} />; break;
    case "communities": studentBody = <Communities go={go} openCommunity={openCommunity} />; break;
    case "search": studentBody = <Search go={go} openPost={openPost} openEvent={openEvent} />; break;
    case "communityDetail": studentBody = <CommunityDetail go={go} community={activeCommunity} openPost={openPost} />; break;
    case "events": studentBody = <EventsFeed go={go} openEvent={openEvent} />; break;
    case "eventDetail": studentBody = <EventDetail go={go} event={activeEvent} />; break;
    case "volunteerOps": studentBody = <VolunteerOps go={go} />; break;
    case "profile": studentBody = <Profile go={go} />; break;
    case "notifications": studentBody = <Messages go={go} />; break;
    default: studentBody = <Onboarding go={go} />;
  }

  let clubBody;
  switch (clubScreen) {
    case "adminLogin": clubBody = <AdminLogin go={go} />; break;
    case "dashboard": clubBody = <AdminDashboard go={clubGo} />; break;
    case "clubProfile": clubBody = <ClubProfile go={clubGo} />; break;
    case "eventsManagement": clubBody = <EventsManagement go={clubGo} openEvent={openManagedEvent} />; break;
    case "createEvent": clubBody = <CreateEvent go={go} />; break;
    case "eventManagement": clubBody = <EventManagement go={go} event={activeEvent} />; break;
    case "registrations": clubBody = <Registrations go={go} event={activeEvent} />; break;
    case "volunteersOverview": clubBody = <VolunteersOverview go={clubGo} openVolunteer={openVolunteer} />; break;
    case "volunteerDetail": clubBody = <VolunteerDetail go={go} volunteer={activeVolunteer} />; break;
    case "clubMembers": clubBody = <ClubMembers go={clubGo} />; break;
    case "announcements": clubBody = <Announcements go={clubGo} />; break;
    case "createAnnouncement": clubBody = <CreateAnnouncement go={go} />; break;
    case "rewardsManagement": clubBody = <RewardsManagement go={clubGo} />; break;
    case "clubAnalytics": clubBody = <Analytics go={clubGo} />; break;
    case "clubNotifications": clubBody = <AdminNotifications go={clubGo} />; break;
    case "settings": clubBody = <AdminSettings go={go} />; break;
    default: clubBody = <AdminLogin go={go} />;
  }

  let campusBody;
  switch (campusScreen) {
    case "campusLogin": campusBody = <CampusLogin go={go} />; break;
    case "campusDashboard": campusBody = <CampusDashboard go={go} />; break;
    case "moderationQueue": campusBody = <ModerationQueue go={go} openReview={openReview} />; break;
    case "moderationReview": campusBody = <ModerationReview go={go} item={activeReview} />; break;
    case "reportsManagement": campusBody = <ReportsManagement go={go} />; break;
    case "eventApprovalQueue": campusBody = <EventApprovalQueue go={go} />; break;
    case "campusAnnouncements": campusBody = <CampusAnnouncements go={go} />; break;
    case "studentManagement": campusBody = <StudentManagement go={go} />; break;
    case "campusAnalytics": campusBody = <CampusAnalytics go={go} />; break;
    case "auditLogs": campusBody = <AuditLogs go={go} />; break;
    case "campusSettings": campusBody = <CampusSettings go={go} />; break;
    default: campusBody = <CampusLogin go={go} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4" style={{ background: "#e5e7eb" }}>
      <TierSwitcher tier={tier} setTier={(t) => {
        setTier(t);
        // Jump to the signed-in landing screen for that tier if the current
        // session's role matches it, otherwise send them to that tier's
        // login screen (previously this always skipped straight to the
        // dashboard, bypassing auth entirely).
        if (t === "student") setStudentScreen(user?.role === "STUDENT" ? "home" : "login");
        if (t === "club") setClubScreen(user?.role === "CLUB_ADMIN" ? "dashboard" : "adminLogin");
        if (t === "campus") setCampusScreen(user?.role === "PLATFORM_ADMIN" ? "campusDashboard" : "campusLogin");
      }} />
      {tier === "student" && <PhoneFrame>{studentBody}</PhoneFrame>}
      {tier === "club" && <PhoneFrame>{clubBody}</PhoneFrame>}
      {tier === "campus" && <DesktopFrame>{campusBody}</DesktopFrame>}
    </div>
  );
}
