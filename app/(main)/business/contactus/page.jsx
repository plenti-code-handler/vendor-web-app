"use client";
import React from "react";
import { EnvelopeIcon, PhoneIcon, DocumentTextIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ContactUsPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-600">
          Have questions or need support? We're here to help!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Email Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#5f22d91a] rounded-full flex items-center justify-center">
              <EnvelopeIcon className="h-6 w-6 text-[#5f22d9]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Send us an email and we'll respond within 24 hours
          </p>
          <a
            href="mailto:partner@plenti.co.in"
            className="text-[#5f22d9] font-medium hover:underline inline-flex items-center gap-1"
          >
            partner@plenti.co.in
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Phone Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#5f22d91a] rounded-full flex items-center justify-center">
              <PhoneIcon className="h-6 w-6 text-[#5f22d9]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Speak with our support team during business hours
          </p>
          <a
            href="tel:+918062179564"
            className="text-[#5f22d9] font-medium hover:underline inline-flex items-center gap-1"
          >
            +91 8062179564
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Terms & Conditions Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#5f22d91a] rounded-full flex items-center justify-center">
              <DocumentTextIcon className="h-6 w-6 text-[#5f22d9]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Read our terms of service and partnership agreement
          </p>
          <Link
            href="/terms"
            className="text-[#5f22d9] font-medium hover:underline inline-flex items-center gap-1"
          >
            View Terms
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Privacy Policy Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#5f22d91a] rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-[#5f22d9]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Privacy Policy</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Learn how we protect and handle your data
          </p>
          <Link
            href="/privacy"
            className="text-[#5f22d9] font-medium hover:underline inline-flex items-center gap-1"
          >
            View Privacy Policy
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Support Hours */}
      <div className="mt-6 bg-purple-50 border border-purple-100 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Support Hours</h3>
        <p className="text-sm text-gray-600">
          Monday - Saturday: 9:00 AM - 9:00 PM IST
        </p>
        <p className="text-sm text-gray-600">
          Sunday: 9:00 AM - 6:00 PM IST
        </p>
      </div>
    </div>
  );
};

export default ContactUsPage;
