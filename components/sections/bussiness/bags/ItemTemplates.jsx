"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AxiosClient from "../../../../AxiosClient";
import { setOpenDrawer, setTemplateItem } from "../../../../redux/slices/editBagSlice";
import { ArrowPathIcon, PlusIcon, ClockIcon, DocumentTextIcon, CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import BagSizeTag from "../../../common/BagSizeTag";
import { getRecency } from "../../../../utility/FormatTime";
import DietIcon from "../../../common/DietIcon";

const ItemTemplates = () => {
    const dispatch = useDispatch();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await AxiosClient.get("/v1/vendor/item/get/all?active=false");
            if (response.data && Array.isArray(response.data)) {
                // Sort by created_at descending and take top 5
                const sorted = response.data.sort((a, b) => b.created_at - a.created_at).slice(0, 5);
                setTemplates(sorted);
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUseTemplate = (item) => {
        dispatch(setTemplateItem(item));
        dispatch(setOpenDrawer(true));
    };

    const formatDuration = (start, end) => {
        if (!start || !end) return "N/A";
        const diffInMinutes = Math.floor((end - start) / 60);
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        let durationStr = "";
        if (hours > 0) durationStr += `${hours}h `;
        if (minutes > 0) durationStr += `${minutes}m`;
        return durationStr.trim() || "0m";
    };

    if (loading) {
        return (
            <div className="w-full py-8 text-center text-gray-500">
                <ArrowPathIcon className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm">Loading templates...</p>
            </div>
        );
    }

    if (templates.length === 0) {
        return null;
    }

    return (
        <div className="m-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <CursorArrowRaysIcon className="w-5 h-5 text-[#5f22d9]" />
                        <h2 className="text-lg font-semibold text-gray-900">Quick Templates</h2>
                    </div>
                    <p className="text-sm text-gray-500">Relist your previous bags in a single click</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {templates.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleUseTemplate(item)}
                        className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#5f22d9]/30 hover:shadow-[0_8px_30px_rgb(95,34,217,0.12)] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                    >
                        {/* Header: Date & Status */}
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-semibold tracking-wide text-gray-800 uppercase">
                                {getRecency(item.created_at)}
                            </span>
                            <div className="rounded-full bg-[#5f22d9] flex flex-row items-center justify-start gap-2 transition-colors duration-300 p-1 px-2">
                                <p className="text-xs font-semibold text-white">Add</p>
                                <PlusIcon className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>

                        {/* Body: Type, Duration & Description */}
                        <div className="mb-4 flex-grow space-y-3">
                            {/* Item Type */}
                            <div>
                                <BagSizeTag
                                    bagSize={item.item_type?.replace(/_/g, ' ')}
                                    className="uppercase tracking-wide text-[13px]"
                                />
                            </div>

                            {/* Duration */}
                            <div className="flex items-center gap-2 text-gray-600">
                                <ClockIcon className="w-4 h-4 flex-shrink-0 text-gray-400" />
                                <span className="text-xs font-medium">
                                    Duration: {formatDuration(item.window_start_time, item.window_end_time)}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="flex items-start gap-2 bg-gray-100 rounded-md p-1">
                                <DocumentTextIcon className="w-4 h-4 flex-shrink-0 text-gray-800 mt-0.5" />
                                <p className="text-xs line-clamp-2 leading-relaxed text-gray-800">
                                    {item.description || "No description available"}
                                </p>
                            </div>
                        </div>

                        {/* Footer: Servings Pills */}
                        <div className="pt-3 border-t border-gray-50 flex gap-2">
                            {item.veg_servings_start > 0 && (
                                <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border">
                                    <DietIcon diet="veg" size="sm" />
                                    <span className="text-[10px] font-semibold text-green-700">{item.veg_servings_start} Veg</span>
                                </div>
                            )}
                            {item.non_veg_servings_start > 0 && (
                                <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border">
                                    <DietIcon diet="non_veg" size="sm" />
                                    <span className="text-[10px] font-semibold text-red-700">{item.non_veg_servings_start} Non-Veg</span>
                                </div>
                            )}
                            {(item.veg_servings_start === 0 && item.non_veg_servings_start === 0) && (
                                <div className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                    <span className="text-[10px] font-medium text-gray-400">No servings</span>
                                </div>
                            )}
                        </div>

                        {/* Hover Overlay Element (Subtle bottom accent) */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5f22d9] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemTemplates;
