"use client";
import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  ScaleIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const TermsPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      {/* <div className="max-w-4xl mx-auto px-4 py-8"> */}
        <div className="bg-white rounded-lg shadow-sm border p-8 text-xs">
        <button 
              onClick={() => router.back()}
              className="text-[#5F22D9] hover:text-[#7e45ee] text-xs transition-colors cursor-pointer flex items-center gap-2"
            >
            <ArrowLeftIcon className="h-3 w-3" />
            Go Back
      </button>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <DocumentTextIcon className="h-8 w-8 text-[#5F22D9] mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                Terms and Conditions
              </h1>
            </div>
            <p className="text-gray-600">
              Date of Last Update: <span className="font-semibold">20 Feb 2025</span>
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of our website, 
              Plenti (www.plenti.co.in). By accessing or using the Website, you agree to be 
              bound by these Terms. If you disagree with any part of the Terms, please do not 
              access or use the Website.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {/* Modifications */}
            <section>
              <div className="flex items-start mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-gray-900">📜 Modifications</h2>
              </div>
              <p className="text-gray-700 leading-relaxed ml-9">
                We reserve the right to modify these Terms at any time, and we will notify you 
                of any changes by posting the updated Terms on our Website. Your continued use 
                of the Website after such modifications constitutes your acceptance of the 
                modified Terms.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <div className="flex items-start mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-gray-900">🌂 Intellectual Property</h2>
              </div>
              <p className="text-gray-700 leading-relaxed ml-9">
                The Website and its original content, features, and functionality are owned by 
                Plenti and are protected by copyright, trademark, trade secret, and other 
                intellectual property laws. You may not reproduce, distribute, modify, or use 
                any content from this Website without our prior written consent.
              </p>
            </section>

            {/* Prohibited Uses */}
            <section>
              <div className="flex items-start mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-gray-900">�� Prohibited Uses</h2>
              </div>
              <p className="text-gray-700 leading-relaxed ml-9 mb-4">
                You agree not to use the Website:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-9 space-y-2">
                <li>For any unlawful purpose.</li>
                <li>To solicit others to perform or participate in unlawful acts.</li>
                <li>To violate any national, state, or local regulations, rules, laws, or ordinances.</li>
                <li>To infringe upon or violate our intellectual property rights or those of others.</li>
                <li>To harass, abuse, defame, slander, discriminate, or intimidate anyone.</li>
                <li>To submit false or misleading information.</li>
                <li>To upload or transmit malicious code, viruses, or any harmful material.</li>
                <li>To spam, phish, crawl, scrape, or collect information illegally.</li>
                <li>For any obscene, fraudulent, or immoral purpose.</li>
                <li>To interfere with the Website's security or attempt unauthorized access.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed ml-9 mt-4">
                We reserve the right to terminate your access to the Website for violating any 
                of these prohibited uses.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <div className="flex items-start mb-4">
                <ScaleIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-gray-900">🛡️ Limitation of Liability</h2>
              </div>
              <p className="text-gray-700 leading-relaxed ml-9 mb-4">
                Plenti, its directors, employees, partners, suppliers, and affiliates shall not 
                be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-9 space-y-2">
                <li>Loss of profits, data, goodwill, or other intangible losses.</li>
                <li>Your inability to access or use the Website.</li>
                <li>Any third-party content or conduct on the Website.</li>
                <li>Unauthorized access, use, or alteration of your transmissions or data.</li>
              </ul>
            </section>

            {/* Disclaimer */}
            <section>
              <div className="flex items-start mb-4">
                <InformationCircleIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-gray-900">📚 Disclaimer</h2>
              </div>
              <p className="text-gray-700 leading-relaxed ml-9 mb-4">
                The Website is provided on an "AS IS" and "AS AVAILABLE" basis. Plenti does 
                not guarantee that:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-9 space-y-2">
                <li>The Website will be uninterrupted, secure, or error-free.</li>
                <li>Any defects or errors will be corrected.</li>
                <li>The Website is free of harmful components like viruses.</li>
                <li>The results of using the Website will meet your expectations.</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section>
              <div className="flex items-start mb-4">
                <GlobeAltIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-gray-900">🌏 Governing Law</h2>
              </div>
              <p className="text-gray-700 leading-relaxed ml-9">
                These Terms shall be governed and construed in accordance with the laws of 
                India, without regard to its conflict of law provisions. If any provision of 
                these Terms is deemed invalid or unenforceable, the remaining provisions will 
                remain in effect.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <div className="flex items-start mb-4">
                <EnvelopeIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-gray-900">🤝 Contact Us</h2>
              </div>
              <p className="text-gray-700 leading-relaxed ml-9 mb-4">
                If you have any questions or concerns about these Terms, please contact us at:
              </p>
              <div className="ml-9 space-y-3">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-[#5F22D9] mr-3" />
                  <span className="text-gray-700">
                    <strong>Email:</strong> info@plenti.co.in
                  </span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-[#5F22D9] mr-3" />
                  <span className="text-gray-700">
                    <strong>Phone:</strong> +91-9497344407
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-[#5F22D9] mr-3" />
                  <span className="text-gray-700">
                    <strong>Address:</strong> Plenti, Trivandrum, Kerala, India
                  </span>
                </div>
              </div>
            </section>

            {/* Effective Date */}
            <section>
              <div className="flex items-start mb-4">
                <CalendarIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-gray-900">�� Effective Date</h2>
              </div>
              <p className="text-gray-700 leading-relaxed ml-9">
                These Terms of Service are effective as of <span className="font-semibold">20/02/25</span> 
                and will remain in effect until updated or replaced by a new version.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Plenti. All rights reserved.
            </p>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default TermsPage;