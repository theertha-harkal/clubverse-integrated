// Thin fetch wrapper around the ClubVerse Spring Boot API.
//
// Every function here corresponds to exactly one backend endpoint (see the
// controllers under clubverse-backend/.../controller). Nothing in this file
// invents data - if a screen needs something the backend doesn't expose,
// that screen stays on local/mock state and is flagged as such in its own
// file and in CHANGELOG.md.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const TOKEN_KEY = "clubverse_token";
const USER_KEY = "clubverse_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Generic request helper. Adds the Authorization header when a token exists,
// serializes JSON bodies, and throws an ApiError with the backend's message
// (see GlobalExceptionHandler on the backend) on any non-2xx response.
async function request(path, { method = "GET", body, params } = {}) {
  let url = `${BASE_URL}${path}`;

  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ).toString();
    if (qs) url += `?${qs}`;
  }

  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new ApiError(
      `Could not reach the ClubVerse API at ${BASE_URL}. Is the backend running?`,
      0
    );
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return data;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// ---- Auth ----
export const AuthApi = {
  register: (payload) => request("/api/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
};

// ---- Posts & comments ----
export const PostsApi = {
  list: () => request("/api/posts"),
  get: (postId) => request(`/api/posts/${postId}`),
  create: (payload) => request("/api/posts", { method: "POST", body: payload }),
  comments: (postId) => request(`/api/posts/${postId}/comments`),
  addComment: (postId, payload) =>
    request(`/api/posts/${postId}/comments`, { method: "POST", body: payload }),
};

// ---- Events & registrations ----
export const EventsApi = {
  list: () => request("/api/events"),
  get: (eventId) => request(`/api/events/${eventId}`),
  create: (payload) => request("/api/events", { method: "POST", body: payload }),
  updateStatus: (eventId, status) =>
    request(`/api/events/${eventId}/status`, { method: "PUT", params: { status } }),
  register: (eventId) =>
    request(`/api/events/${eventId}/registrations`, { method: "POST" }),
  registrations: (eventId) => request(`/api/events/${eventId}/registrations`),
  myRegistrations: () => request("/api/events/my-registrations"),
};

// ---- Volunteer opportunities & applications ----
export const VolunteerApi = {
  opportunities: () => request("/api/volunteer/opportunities"),
  createOpportunity: (payload) =>
    request("/api/volunteer/opportunities", { method: "POST", body: payload }),
  eventOpportunities: (eventId) =>
    request(`/api/volunteer/events/${eventId}/opportunities`),
  apply: (opportunityId, payload) =>
    request(`/api/volunteer/opportunities/${opportunityId}/apply`, {
      method: "POST",
      body: payload,
    }),
  applications: (opportunityId) =>
    request(`/api/volunteer/opportunities/${opportunityId}/applications`),
  myApplications: () => request("/api/volunteer/my-applications"),
  updateApplicationStatus: (applicationId, status) =>
    request(`/api/volunteer/applications/${applicationId}/status`, {
      method: "PUT",
      params: { status },
    }),
};

// ---- Announcements ----
export const AnnouncementsApi = {
  listAll: () => request("/api/announcements"),
  listPublished: () => request("/api/announcements/published"),
  get: (id) => request(`/api/announcements/${id}`),
  create: (payload) => request("/api/announcements", { method: "POST", body: payload }),
  saveDraft: (payload) =>
    request("/api/announcements/draft", { method: "POST", body: payload }),
  updateStatus: (id, status) =>
    request(`/api/announcements/${id}/status`, { method: "PUT", params: { status } }),
};

// ---- Reports (Campus Admin) ----
export const ReportsApi = {
  create: (payload) => request("/api/reports", { method: "POST", body: payload }),
  list: (filters) => request("/api/reports", { params: filters }),
  page: (filters) => request("/api/reports/page", { params: filters }),
};
