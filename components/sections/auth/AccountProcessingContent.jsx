"use client";

import React, { useState } from 'react';
import {
    ClockIcon,
    EnvelopeIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { fetchVendorDetails } from '../../../redux/slices/vendorSlice';

const AccountProcessingContent = () => {
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(fetchVendorDetails()).unwrap();
        } catch (error) {
            console.error('Error refreshing:', error);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <div className="w-full max-w-md py-10">
            {/* Animated Icon */}
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-purple-100">
                        <ClockIcon className="w-10 h-10 text-[#5F22D9]" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                    Account Under Review
                </h1>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                    We're currently processing your Plenti account. This usually takes 24-48 hours. You'll receive an email notification once your account is approved.
                </p>

                {/* Contact Info */}
                <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600">
                            Have questions about your application?
                        </p>
                    </div>
                    <p className="text-sm text-[#5F22D9] font-medium">
                        partner@plenti.co.in
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${refreshing
                                ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                                : 'bg-purple-100 text-[#5F22D9] hover:bg-purple-200 hover:scale-105'
                            }`}
                    >
                        <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        <span>{refreshing ? 'Checking...' : 'Check Status'}</span>
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-400">
                        © 2024 Plenti. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccountProcessingContent;
