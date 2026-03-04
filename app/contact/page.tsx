import { Container, Section } from '@/components/layout';
import ContactForm from '@/components/forms/ContactForm';
import type { Metadata } from 'next';

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Baan Maa Dog Rescue. We\'d love to hear from you!',
};

// =============================================================================
// Contact Page
// =============================================================================

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <Section background="blue" padding="md">
        <Container size="md" className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-white/90">
            Have a question or want to get involved? We&apos;d love to hear from you.
          </p>
        </Container>
      </Section>

      {/* Contact Form & Info */}
      <Section background="sand" padding="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <h2 className="font-display text-2xl font-bold text-blue-800 mb-6">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="lg:pt-8">
              <h2 className="font-display text-2xl font-bold text-blue-800 mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
{/* Email */}
                <ContactItem
                  icon={<EmailIcon />}
                  title="Email"
                  content={
                    <a
                      href="mailto:beccaj@baanmaa.org"
                      className="text-teal-600 hover:text-teal-700"
                    >
                      beccaj@baanmaa.org
                    </a>
                  }
                />

                {/* Social */}
                <ContactItem
                  icon={<SocialIcon />}
                  title="Follow Us"
                  content={
                    <div className="flex gap-4 mt-2">
                      <a
                        href="https://www.facebook.com/BaanMaaTheDogHouse"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 hover:bg-blue-200 transition-colors"
                        aria-label="Facebook"
                      >
                        <FacebookIcon />
                      </a>
                      <a
                        href="https://www.instagram.com/BaanMaaDogHouse"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 hover:bg-blue-200 transition-colors"
                        aria-label="Instagram"
                      >
                        <InstagramIcon />
                      </a>
                      <a
                        href="https://www.youtube.com/@BaanMaaTheDogHouse2"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 hover:bg-blue-200 transition-colors"
                        aria-label="YouTube"
                      >
                        <YouTubeIcon />
                      </a>
                    </div>
                  }
                />
              </div>

              {/* FAQ Link */}
              <div className="mt-8 p-6 bg-white rounded-xl">
                <h3 className="font-semibold text-blue-800 mb-2">Common Questions</h3>
                <p className="text-sand-700 text-sm mb-4">
                  Looking for information about adoption, sponsorship, or volunteering?
                  Check out our dedicated pages:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/adoption" className="text-teal-600 hover:text-teal-700">
                      Adoption Information →
                    </a>
                  </li>
                  <li>
                    <a href="/sponsorship" className="text-teal-600 hover:text-teal-700">
                      Sponsorship Information →
                    </a>
                  </li>
                  <li>
                    <a href="/volunteering" className="text-teal-600 hover:text-teal-700">
                      Volunteering Information →
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>


    </>
  );
}

// =============================================================================
// Contact Item
// =============================================================================

function ContactItem({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-blue-800 mb-1">{title}</h3>
        <div className="text-sand-700">{content}</div>
      </div>
    </div>
  );
}

// =============================================================================
// Icons
// =============================================================================

function LocationIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function SocialIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
