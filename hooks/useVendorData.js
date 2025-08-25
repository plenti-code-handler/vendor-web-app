


import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectVendorData, fetchVendorDetails } from '../redux/slices/vendorSlice';

export const useVendorData = () => {
  const dispatch = useDispatch();
  const vendorData = useSelector(selectVendorData);
  const [availableDescriptions, setAvailableDescriptions] = useState([]);

  // Fetch vendor data and catalogue data on component mount
  useEffect(() => {
    // Fetch vendor details if not already available
    if (!vendorData) {
      console.log("Fetching vendor data...");
      dispatch(fetchVendorDetails());
    }
  }, [dispatch, vendorData]);

  // Update available descriptions when vendor data changes
  useEffect(() => {
    if (vendorData && vendorData.item_descriptions) {
      console.log("Updating available descriptions:", vendorData.item_descriptions);
      setAvailableDescriptions(vendorData.item_descriptions);
    }
  }, [vendorData]);

  return { vendorData, availableDescriptions };
};