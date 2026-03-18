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
    <div className="w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-6">
      {/* Hero */}
      <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-[#0086b8] p-8 md:p-12 text-white shadow-lg">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10 flex flex-col gap-3 max-w-3xl">
          <div className="inline-flex items-center gap-2">
            <Shield size={28} />
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Privacy Policy</h1>
          </div>
          <p className="text-base md:text-lg opacity-90 font-medium">
            Your privacy matters to us. This policy explains how Hirefy collects, uses, and protects your personal information.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-surface-main dark:bg-secondary-darkbg border border-gray-200 dark:border-slate-800 rounded-2xl p-6 transition-colors duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
                  <Icon size={18} />
                </div>
                <h2 className="text-lg font-bold text-black dark:text-surface-main tracking-wide">
                  {section.title}
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
