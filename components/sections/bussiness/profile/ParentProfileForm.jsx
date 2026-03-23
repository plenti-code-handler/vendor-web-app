"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import TextField from "../../../fields/TextField";
import PrimaryButton from "../../../buttons/PrimaryButton";
import { Textarea } from "@headlessui/react";

import {
  fetchParentDetails,
  selectParentData,
  selectParentLoading,
  updateParentDetails,
} from "../../../../redux/slices/parentSlice";

const ParentProfileForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const parentData = useSelector(selectParentData);
  const parentLoading = useSelector(selectParentLoading);

  const [formData, setFormData] = useState({
    username: "",
    legal_name: "",
    phone_number: "",
    contact_person: "",
    gst_number: "",
    pan_number: "",
    address: "",
    latitude: "",
    longitude: "",
    address_url: "",
  });
  const [logoFallbackError, setLogoFallbackError] = useState(false);

  useEffect(() => {
    if (!parentData && !parentLoading) {
      dispatch(fetchParentDetails());
    }
  }, [dispatch, parentData, parentLoading]);

  useEffect(() => {
    if (!parentData) return;
    setFormData({
      username: parentData.username || "",
      legal_name: parentData.legal_name || "",
      phone_number: parentData.phone_number || "",
      contact_person: parentData.contact_person || "",
      gst_number: parentData.gst_number || "",
      pan_number: parentData.pan_number || "",
      address: parentData.address || "",
      latitude:
        parentData.latitude === null || parentData.latitude === undefined
          ? ""
          : String(parentData.latitude),
      longitude:
        parentData.longitude === null || parentData.longitude === undefined
          ? ""
          : String(parentData.longitude),
      address_url: parentData.address_url || "",
    });
  }, [parentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        username: formData.username.trim() || null,
        legal_name: formData.legal_name.trim() || null,
        phone_number: formData.phone_number.trim() || null,
        contact_person: formData.contact_person.trim() || null,
        gst_number: formData.gst_number.trim() || null,
        pan_number: formData.pan_number.trim() || null,
        address: formData.address.trim() || null,
        latitude: formData.latitude === "" ? null : parseFloat(formData.latitude),
        longitude:
          formData.longitude === "" ? null : parseFloat(formData.longitude),
        address_url: formData.address_url.trim() || null,
      };

      await dispatch(updateParentDetails(payload)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (e) {
      const detail =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        "Failed to update profile";
      toast.error(detail);
    }
  };

  return (
    <div className="w-full  mx-auto rounded-md bg-white animate-slide-in-left">
      <div className="p-5">
        <button
          type="button"
          onClick={() => router.replace("/parent/dashboard")}
          className="flex items-center gap-2 text-sm text-[#5F22D9] hover:text-[#4A1BB8] transition-colors mb-3"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          back to home
        </button>
        <h2 className="text-xl font-bold text-gray-900">Profile</h2>
        <p className="text-sm text-gray-500 mt-1">Update parent details</p>

        <div className="mt-4 mb-2 flex justify-center">
          <img
            alt="Parent profile"
            src={
              logoFallbackError
                ? "/User.jpeg"
                : parentData?.logo_url || "/User.jpeg"
            }
            onError={() => setLogoFallbackError(true)}
            className="w-20 h-20 rounded-full object-cover bg-gray-100"
          />
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <div>
            <h3 className="font-medium mb-1 ml-1">Username</h3>
            <TextField
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <h3 className="font-medium mb-1 ml-1">Legal name</h3>
            <TextField
              placeholder="Legal name"
              name="legal_name"
              value={formData.legal_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <h3 className="font-medium mb-1 ml-1">Phone number</h3>
            <TextField
              placeholder="Phone number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>

          <div>
            <h3 className="font-medium mb-1 ml-1">Contact person</h3>
            <TextField
              placeholder="Contact person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1 ml-1">GST number</h3>
              <TextField
                placeholder="GST number"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
              />
            </div>
            <div>
              <h3 className="font-medium mb-1 ml-1">PAN number</h3>
              <TextField
                placeholder="PAN number"
                name="pan_number"
                value={formData.pan_number}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-1 ml-1">Address</h3>
            <Textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Address"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1 ml-1">Latitude</h3>
              <TextField
                placeholder="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>
            <div>
              <h3 className="font-medium mb-1 ml-1">Longitude</h3>
              <TextField
                placeholder="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-1 ml-1">Address URL</h3>
            <TextField
              placeholder="Google maps / store url"
              name="address_url"
              value={formData.address_url}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end pt-2">
            <PrimaryButton
              onClick={handleUpdate}
              disabled={parentLoading}
              loading={parentLoading}
              loadingText="Updating..."
              className="px-6 py-3 rounded-xl"
            >
              Save changes
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfileForm;

