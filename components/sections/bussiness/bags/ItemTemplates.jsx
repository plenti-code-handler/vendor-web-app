"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axiosClient from "../../../../AxiosClient";
import { fetchAllBags } from "../../../../redux/slices/bagsSlice";
import { ITEM_TYPE_DISPLAY_NAMES } from "../../../../constants/itemTypes";
import BagSizeTag from "../../../common/BagSizeTag";
import DietIcon from "../../../common/DietIcon";
import StatusResultModal from "../../../modals/StatusResultModal";
import CreateTemplateDrawer from "../../../drawers/CreateTemplateDrawer";

const formatMinutes = (mins) => {
  const n = Math.max(0, Number(mins) || 0);
  const hours = Math.floor(n / 60);
  const minutes = n % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

const parseServings = (value) => {
  if (value === "") return 0;
  const n = parseInt(value, 10);
  return Number.isNaN(n) || n < 0 ? 0 : n;
};

// Updated to edit values directly in hours
const DurationField = ({ label, value, onChange, minHours = 0 }) => {
  const [editing, setEditing] = useState(false);
  // Convert minutes into hours for editing draft
  const [draftHours, setDraftHours] = useState(String((value || 0) / 60));

  useEffect(() => {
    if (!editing) setDraftHours(String((value || 0) / 60));
  }, [value, editing]);

  const commit = () => {
    const hoursNum = parseFloat(draftHours);
    const validHours = Number.isNaN(hoursNum) || hoursNum < minHours ? minHours : hoursNum;
    // Convert back to minutes for storage & handlers
    onChange(Math.round(validHours * 60));
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray bg-gray-50/80 px-2 py-1 rounded-lg border border-gray-100">
      <span className="text-gray font-medium">{label}:</span>
      {editing ? (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            type="number"
            step="any"
            min={minHours}
            value={draftHours}
            onChange={(e) => setDraftHours(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            className="w-12 rounded border border-[#5f22d9] bg-white px-1 py-0.5 text-xs font-bold text-gray-800 outline-none focus:ring-1 focus:ring-[#5f22d9]"
          />
          <span className="text-[10px] font-semibold text-[#5f22d9]">hrs</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1 font-semibold text-gray-800 hover:text-[#5f22d9] transition"
        >
          {formatMinutes(value)}
          <PencilSquareIcon className="h-3.5 w-3.5 text-gray-400 hover:text-[#5f22d9]" />
        </button>
      )}
    </div>
  );
};

const TemplateCard = ({ template, onGoLive, onDelete, goingLive }) => {
  const [vegServings, setVegServings] = useState(0);
  const [nonVegServings, setNonVegServings] = useState(0);
  const [windowDuration, setWindowDuration] = useState(template.window_duration || 60);
  const [bestBeforeDuration, setBestBeforeDuration] = useState(template.best_before_duration || 0);
  const canGoLive = vegServings > 0 || nonVegServings > 0;

  useEffect(() => {
    setWindowDuration(template.window_duration || 60);
    setBestBeforeDuration(template.best_before_duration || 0);
  }, [template.id, template.window_duration, template.best_before_duration]);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-100/80 bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
      {/* Decorative Gradient Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 opacity-80 group-hover:opacity-100 transition" />

      <button
        type="button"
        onClick={() => onDelete(template)}
        className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
        aria-label="Delete template"
      >
        <TrashIcon className="h-4 w-4" />
      </button>

      <div>
        <div className="pr-6">
          <h3 className="text-base font-semibold leading-snug text-gray-900 line-clamp-2">
            {template.description}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <BagSizeTag
              bagSize={ITEM_TYPE_DISPLAY_NAMES[template.item_type] || template.item_type}
              showIcon={false}
              showQuantity={false}
              className="uppercase tracking-wider font-bold text-[10px] bg-[#5f22d9]/10 text-[#5f22d9] border border-[#5f22d9]/20"
            />
          </div>
        </div>

        {/* Duration Fields in Hours */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <DurationField label="Window" value={windowDuration} minHours={0.1} onChange={setWindowDuration} />
          <DurationField label="Best Before" value={bestBeforeDuration} minHours={0} onChange={setBestBeforeDuration} />
        </div>
      </div>

      {/* Servings Inputs and Go Live Button */}
      <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
        <label className="flex min-w-[7.5rem] flex-1 items-center gap-1.5 rounded-xl border border-green-500 bg-green-50 px-2 py-1.5 focus-within:ring-2 focus-within:ring-green-400/60">
          <DietIcon diet="veg" size="sm" />
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-green-700">
            Veg
          </span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={vegServings || ""}
            onChange={(e) => setVegServings(parseServings(e.target.value))}
            placeholder="0"
            aria-label="Vegetarian servings"
            className="w-full min-w-0 bg-transparent text-sm font-bold text-green-800 outline-none placeholder:text-green-700/40"
          />
        </label>
        <label className="flex min-w-[8.5rem] flex-1 items-center gap-1.5 rounded-xl border border-red-500 bg-red-50 px-2 py-1.5 focus-within:ring-2 focus-within:ring-red-400/60">
          <DietIcon diet="non_veg" size="sm" />
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-red-700">
            Non-veg
          </span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={nonVegServings || ""}
            onChange={(e) => setNonVegServings(parseServings(e.target.value))}
            placeholder="0"
            aria-label="Non-vegetarian servings"
            className="w-full min-w-0 bg-transparent text-sm font-bold text-red-800 outline-none placeholder:text-red-700/40"
          />
        </label>
        <button
          type="button"
          disabled={!canGoLive || goingLive}
          onClick={async () => {
            const ok = await onGoLive(template, {
              veg_servings: vegServings,
              non_veg_servings: nonVegServings,
              window_duration: windowDuration,
              best_before_duration: bestBeforeDuration,
            });
            if (ok) {
              setVegServings(0);
              setNonVegServings(0);
            }
          }}
          className={`shrink-0 w-[100%] rounded-xl px-3.5 py-2 text-xs font-bold transition-all transform active:scale-95 ${
            canGoLive
              ? "bg-[#5f22d9] text-white shadow-md shadow-[#5f22d9]/25 hover:bg-[#4A1BB8] hover:shadow-lg hover:shadow-[#5f22d9]/30"
              : "cursor-not-allowed bg-gray-100 text-gray-400"
          }`}
        >
          {goingLive ? "..." : "Go live"}
        </button>
      </div>
    </div>
  );
};

const ItemTemplates = () => {
  const dispatch = useDispatch();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [listingId, setListingId] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTemplates = useCallback(async (searchKey = "") => {
    try {
      setLoading(true);
      const params = searchKey.trim() ? { search: searchKey.trim() } : undefined;
      const response = await axiosClient.get("/v2/vendor/item/template", { params });
      setTemplates(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchTemplates(search), search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [search, fetchTemplates]);

  const handleGoLive = async (template, payload) => {
    try {
      setListingId(template.id);
      await axiosClient.post(`/v2/vendor/item/template/${template.id}/list`, payload);
      toast.success("Item listed successfully");
      dispatch(fetchAllBags({ active: true }));
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to list item");
      return false;
    } finally {
      setListingId(null);
    }
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;
    try {
      setDeleting(true);
      await axiosClient.delete(`/v2/vendor/item/template/${templateToDelete.id}`);
      toast.success("Template deleted successfully");
      setTemplateToDelete(null);
      fetchTemplates(search);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to delete template");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section
      className="mt-6 overflow-hidden rounded-[1.75rem] border border-[#5f22d9]/15 p-5 sm:p-6 shadow-sm"
      style={{
        background:
          "radial-gradient(120% 90% at 0% 0%, rgba(95,34,217,0.12) 0%, rgba(255,255,255,0.95) 42%), radial-gradient(90% 70% at 100% 110%, rgba(122,72,227,0.1) 0%, rgba(255,255,255,0.9) 55%)",
      }}
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl text-[#5f22d9] font-bold tracking-tight">Quick templates</h2>
          <p className="text-sm font-medium text-gray-500">Go live in 2 clicks</p>
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center lg:w-auto">
          <div className="flex w-full items-center gap-2 rounded-full border border-gray-200/80 bg-white/80 px-3.5 py-2 shadow-sm backdrop-blur-sm sm:w-60 focus-within:border-[#5f22d9] focus-within:ring-1 focus-within:ring-[#5f22d9] transition">
            <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 font-medium"
            />
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#5f22d9] px-4 py-2 text-sm font-bold text-white shadow-md shadow-[#5f22d9]/20 hover:bg-[#4A1BB8] hover:shadow-lg transition active:scale-95"
          >
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            Create a new template
          </button>
        </div>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm font-medium text-gray-500">Loading templates...</p>
      ) : templates.length === 0 ? (
        <p className="py-12 text-center text-sm font-medium text-gray-500">
          {search.trim() ? "No templates match your search." : "No templates yet. Create one to go live faster."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              goingLive={listingId === template.id}
              onGoLive={handleGoLive}
              onDelete={setTemplateToDelete}
            />
          ))}
        </div>
      )}

      <CreateTemplateDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreated={() => fetchTemplates(search)}
      />

      <StatusResultModal
        open={!!templateToDelete}
        onClose={() => !deleting && setTemplateToDelete(null)}
        variant="confirm"
        title="Delete template"
        message={`Remove “${templateToDelete?.description || "this template"}”? You can create it again later.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmLoading={deleting}
      />
    </section>
  );
};

export default ItemTemplates;