import { Shield, Database, Share2, Lock, Cookie, UserCheck, Mail } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: `When you use Hirefy, we collect the following types of information:

• Account Information: Your name, email address, password, and profile details you provide during registration.
• Profile Data: Professional information such as your skills, experience, education, resume, and profile picture that you add to your candidate or recruiter profile.
• Application Data: Information related to job applications you submit or receive, including application status and quiz/assessment results.
• Communication Data: Messages exchanged through our real-time chat feature between candidates and recruiters.
• Usage Data: Information about how you interact with the platform, including pages visited, features used, and timestamps of activity.
• Device Information: Browser type, operating system, and IP address collected automatically when you access the platform.`,
  },
  {
    icon: Share2,
    title: 'How We Use Your Information',
    content: `We use the information we collect to:

• Provide and maintain the Hirefy recruitment platform and its features.
• Enable job posting, application submission, and application lifecycle management.
• Facilitate real-time communication between candidates and recruiters.
• Deliver notifications about application updates, new messages, and relevant job opportunities.
• Administer quiz-based skill assessments and provide results to relevant parties.
• Populate recruiter dashboards with analytics and recruitment insights.
• Authenticate users and enforce role-based access control (candidate, recruiter, admin).
• Improve the platform's performance, security, and user experience.`,
  },
  {
    icon: Lock,
    title: 'Data Sharing & Security',
    content: `We do not sell your personal information to third parties. Your data may be shared in the following limited circumstances:

• Between Candidates and Recruiters: Profile information and application data are shared as necessary to facilitate the recruitment process.
• Service Providers: We may share data with trusted third-party services that help us operate the platform (e.g., hosting, email delivery), under strict confidentiality agreements.
• Legal Requirements: We may disclose information if required by law or to protect the rights and safety of our users and platform.

We implement industry-standard security measures including encrypted passwords, JWT-based authentication, optional two-factor authentication (2FA), and secure HTTPS connections to protect your data.`,
  },
  {
    icon: Cookie,
    title: 'Cookies & Local Storage',
    content: `Hirefy uses cookies and browser local storage to:

• Maintain your authenticated session so you stay logged in.
• Store your theme preference (light/dark mode).
• Enable essential platform functionality such as real-time notifications and chat.

We use only essential, functional cookies. We do not use advertising or third-party tracking cookies.`,
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: `As a Hirefy user, you have the right to:

• Access: View the personal data we hold about you through your profile and account settings.
• Update: Edit your profile information, skills, experience, and other personal details at any time.
• Delete: Request deletion of your account and associated data by contacting our team.
• Withdraw: Withdraw job applications you have submitted.
• Data Portability: Request a copy of your personal data in a portable format.

To exercise any of these rights, please contact us using the information provided below.`,
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content: `If you have any questions or concerns about this Privacy Policy or our data practices, please reach out to us through our GitHub repository or contact any member of the Hirefy team.

This Privacy Policy was last updated on January 1, 2025. We may update this policy from time to time and will notify users of any significant changes through the platform.`,
  },
];

export function PrivacyPolicy() {
  return (
    <div className="h-full w-full overflow-y-auto p-4 transition-colors duration-300 custom-scrollbar md:p-6">
      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-500 opacity-90" />
        <div className="flex max-w-3xl flex-col gap-3">
          <div className="inline-flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">Privacy Policy</h1>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Hirefy privacy notice</p>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
            Your privacy matters to us. This policy explains how Hirefy collects, uses, and protects your personal information.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <Icon size={17} />
                </div>
                <h2 className="text-base font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                  {section.title}
                </h2>
              </div>
              <p className="whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                {section.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
