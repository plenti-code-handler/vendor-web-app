"use client";
import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  UserIcon,
  CogIcon,
  EyeIcon,
  LockClosedIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  LocationMarkerIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border p-8 text-xs">
        <Link 
          href="/verify_email"
          className="text-[#5F22D9] hover:text-[#7e45ee] font-medium transition-colors"
        >
          Back to Home
        </Link>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-[#5F22D9] mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-600">
            Effective Date: <span className="font-semibold">25 Apr 2025</span>
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            Plenti ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you use our 
            website https://www.plenti.co.in and our mobile applications (collectively, the "Services"). 
            By accessing or using our Services, you agree to the terms of this Privacy Policy.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* 1. Information We Collect */}
          <section>
            <div className="flex items-start mb-4">
              <UserIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
            </div>
            
            {/* a. Personal Information */}
            <div className="ml-9 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">a. Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We may collect personal information that you voluntarily provide to us when you register 
                on the Services, place an order, or interact with us. This may include:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1 ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Delivery address</li>
                <li>Payment information (Razorpay and Partner Bank Backend)</li>
                <li>Profile photo (Optional)</li>
                <li>Social login information (Google, Apple, etc.)</li>
              </ul>
            </div>

            {/* b. Usage Data */}
            <div className="ml-9 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">b. Usage Data</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We automatically collect certain information when you use our Services, such as:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1 ml-4">
                <li>Device information (IP address, device type, operating system)</li>
                <li>Log data (access times, pages viewed, referring URLs)</li>
                <li>Location data (if you grant permission)</li>
                <li>Usage patterns and preferences</li>
              </ul>
            </div>

            {/* c. Cookies and Tracking Technologies */}
            <div className="ml-9 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">c. Cookies and Tracking Technologies</h3>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage, 
                and deliver relevant content and advertisements.
              </p>
            </div>

            {/* d. Compliance and Security */}
            <div className="ml-9">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">d. Compliance and Security</h3>
              <p className="text-gray-700 leading-relaxed">
                All data transferred across our network is secured via TLS protocol and we are committed 
                to complying with the General Data Protection Regulation (GDPR) for storing and handling 
                sensitive data.
              </p>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <div className="flex items-start mb-4">
              <CogIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-9 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-9 space-y-2">
              <li>Provide, operate, and maintain our Services</li>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your account or transactions</li>
              <li>Send you updates, promotional materials, and notifications (with your consent)</li>
              <li>Improve and personalize your experience</li>
              <li>Monitor and analyze usage and trends</li>
              <li>Ensure the security and integrity of our Services</li>
            </ul>
          </section>

          {/* 3. How We Share Your Information */}
          <section>
            <div className="flex items-start mb-4">
              <EyeIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-gray-900">3. How We Share Your Information</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-9 mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-9 space-y-2">
              <li><strong>Vendors and Partners:</strong> To fulfill your orders and provide customer support.</li>
              <li><strong>Service Providers:</strong> For payment processing, analytics, marketing, and other business operations.</li>
              <li><strong>Legal Requirements:</strong> If required by law or to protect our rights, users, or others.</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition of all or part of our business.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed ml-9 mt-4">
              <strong>We do not sell your personal information to third parties.</strong>
            </p>
          </section>

          {/* 4. Data Security */}
          <section>
            <div className="flex items-start mb-4">
              <LockClosedIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-gray-900">4. Data Security</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-9">
              We implement reasonable security measures to protect your information from unauthorized 
              access, alteration, disclosure, or destruction. However, no method of transmission over 
              the Internet or electronic storage is 100% secure.
            </p>
          </section>

          {/* 5. Your Choices */}
          <section>
            <div className="flex items-start mb-4">
              <BellIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-gray-900">5. Your Choices</h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-9 space-y-2">
              <li><strong>Account Information:</strong> You may update or correct your account information at any time by logging into your account.</li>
              <li><strong>Marketing Communications:</strong> You can opt out of receiving promotional emails by following the unsubscribe instructions in those emails.</li>
              <li><strong>Location Data:</strong> You can enable or disable location services through your device settings.</li>
              <li><strong>Cookies:</strong> Most browsers allow you to control cookies through their settings.</li>
            </ul>
          </section>

          {/* 6. Children's Privacy */}
          <section>
            <div className="flex items-start mb-4">
              <UserIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-gray-900">6. Children's Privacy</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-9">
              Our Services are not intended for children under the age of 18. We do not knowingly 
              collect personal information from children under 18. If we become aware that we have 
              collected such information, we will take steps to delete it.
            </p>
          </section>

          {/* 7. International Data Transfers */}
          <section>
            <div className="flex items-start mb-4">
              <GlobeAltIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-gray-900">7. International Data Transfers</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-9">
              Your information may be transferred to and maintained on servers located outside your 
              state or country. By using our Services, you consent to such transfers.
            </p>
          </section>

          {/* 8. Changes to This Privacy Policy */}
          <section>
            <div className="flex items-start mb-4">
              <DocumentTextIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-gray-900">8. Changes to This Privacy Policy</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-9">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy on this page and updating the effective date.
            </p>
          </section>

          {/* 9. Contact Us */}
          <section>
            <div className="flex items-start mb-4">
              <EnvelopeIcon className="h-6 w-6 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
              <h2 className="text-xl font-semibold text-gray-900">9. Contact Us</h2>
            </div>
            <p className="text-gray-700 leading-relaxed ml-9 mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, 
              please contact us at:
            </p>
            <div className="ml-9 space-y-3">
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-[#5F22D9] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-semibold">Plenti</p>
                  <p className="text-gray-700">
                    455/9, Firdouse, Thamarakulam, Pallipuram P O<br />
                    Thiruvananthapuram, Kerala
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-[#5F22D9] mr-3" />
                <span className="text-gray-700">
                  <strong>Email:</strong> info@plenti.co.in
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Plenti. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;