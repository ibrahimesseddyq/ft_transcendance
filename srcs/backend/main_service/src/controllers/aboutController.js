import asyncHandler from '../utils/asyncHandler.js';

const aboutUs = {
  name: "ft_transcendance",
  tagline: "A full-stack recruitment platform built as part of the 42 curriculum.",
  description:
    "ft_transcendance is a modern, full-stack web application designed to streamline the recruitment process. " +
    "It connects candidates and recruiters through a seamless interface, offering job listings, application tracking, " +
    "live chat, real-time notifications, quiz-based skill assessments, and a rich dashboard for recruiters. " +
    "Built with a microservices architecture, the platform consists of a main service handling users, jobs, " +
    "applications, conversations and profiles, and a dedicated quiz service for technical assessments. " +
    "The frontend is a single-page application powered by React and Vite.",
  mission:
    "Our mission is to make hiring transparent, fair, and efficient — giving every candidate the tools " +
    "to showcase their skills and every recruiter the insights needed to find the right talent.",
  features: [
    "User registration and authentication with JWT and two-factor authentication (2FA)",
    "Job posting and management for recruiters",
    "Application lifecycle tracking (submit, advance, reject, withdraw)",
    "Real-time chat between candidates and recruiters via Socket.IO",
    "Real-time notifications",
    "Quiz and MCQ-based technical assessments",
    "Recruiter dashboard with analytics",
    "Avatar / profile management",
    "Role-based access control (candidate, recruiter, admin)",
  ],
  team: [
    {
      name: "Ibrahim Esseddy",
      role: "Lead Developer",
      github: "https://github.com/ibrahimesseddyq",
    },
  ],
  techStack: {
    frontend: ["React", "Vite", "TypeScript"],
    backend: ["Node.js", "Express", "Prisma", "PostgreSQL"],
    infrastructure: ["Docker", "Kubernetes", "Nginx"],
    realtime: ["Socket.IO"],
  },
  contact: {
    github: "https://github.com/ibrahimesseddyq/ft_transcendance",
  },
  version: "1.0.0",
};

export const getAboutUs = asyncHandler((req, res) => {
  res.status(200).json({
    success: true,
    data: aboutUs,
  });
});
