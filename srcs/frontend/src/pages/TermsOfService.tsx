import { ScrollText, UserPlus, ShieldCheck, Ban, Scale, AlertTriangle, RefreshCw, Mail } from 'lucide-react';

const sections = [
  {
    icon: UserPlus,
    title: 'Acceptance of Terms',
    content: `By accessing or using the Hirefy platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform.

These terms apply to all users of the platform, including candidates, recruiters, and administrators. By creating an account, you confirm that you are at least 18 years of age and have the legal capacity to enter into these terms.`,
  },
  {
    icon: ShieldCheck,
    title: 'User Accounts',
    content: `To access the features of Hirefy, you must create an account and provide accurate, complete information. You are responsible for:

• Maintaining the confidentiality of your login credentials and two-factor authentication settings.
• All activities that occur under your account.
• Notifying us immediately of any unauthorized use of your account.

We reserve the right to suspend or terminate accounts that violate these terms or are used for fraudulent purposes. Each user may maintain only one account, and accounts are non-transferable.`,
  },
  {
    icon: Ban,
    title: 'Acceptable Use',
    content: `When using Hirefy, you agree not to:

• Submit false, misleading, or fraudulent information in your profile, job postings, or applications.
• Impersonate another person or misrepresent your affiliation with any entity.
• Use the chat feature to send spam, harassing, offensive, or unsolicited messages.
• Attempt to gain unauthorized access to other users' accounts or platform systems.
• Use automated tools (bots, scrapers) to access or collect data from the platform without permission.
• Interfere with or disrupt the platform's infrastructure, services, or other users' experience.
• Upload malicious content, viruses, or any material that could harm the platform or its users.
• Use the platform for any purpose that violates applicable laws or regulations.`,
  },
  {
    icon: Scale,
    title: 'Intellectual Property',
    content: `The Hirefy platform, including its design, code, features, logos, and content, is the intellectual property of the Hirefy team. You may not copy, modify, distribute, or reverse-engineer any part of the platform without prior written consent.

Content you submit to the platform (such as profile information, resumes, and messages) remains your property. By submitting content, you grant Hirefy a limited license to use, display, and process that content solely for the purpose of providing our recruitment services.`,
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content: `Hirefy is provided "as is" without warranties of any kind, whether express or implied. While we strive to maintain a reliable and secure platform, we do not guarantee:

• Uninterrupted or error-free access to the platform.
• The accuracy or completeness of job listings, candidate profiles, or assessment results.
• The outcome of any recruitment process facilitated through the platform.

To the maximum extent permitted by law, Hirefy and its team shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to loss of data, loss of employment opportunities, or unauthorized access to your account.`,
  },
  {
    icon: RefreshCw,
    title: 'Termination & Changes',
    content: `We reserve the right to:

• Suspend or terminate your account at any time for violation of these terms, with or without notice.
• Modify, update, or discontinue any part of the platform at our discretion.
• Update these Terms of Service at any time. Continued use of the platform after changes constitutes acceptance of the revised terms.

You may delete your account at any time by contacting our team. Upon termination, your right to access the platform ceases immediately, though we may retain certain data as required by law or for legitimate business purposes.`,
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content: `If you have any questions about these Terms of Service, please reach out to us through our GitHub repository or contact any member of the Hirefy team.

These Terms of Service were last updated on January 1, 2025.`,
  },
];

export function TermsOfService() {
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
            <ScrollText size={28} />
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Terms of Service</h1>
          </div>
          <p className="text-base md:text-lg opacity-90 font-medium">
            Please read these terms carefully before using the Hirefy platform. By using our services, you agree to these terms.
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
