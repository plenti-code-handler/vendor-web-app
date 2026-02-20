"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingSummary } from "../../../../redux/slices/ratingSlice";
import { selectRatingSummary } from "../../../../redux/slices/ratingSlice";
import Card from "./Card";
import RatingsCard from "./RatingsCard";
import { ShoppingBagIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import RatingsModal from "./RatingsModal";

const CardsRow = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ratingSummary = useSelector(selectRatingSummary);
  const [totalBags, setTotalBags] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ratingsModalOpen, setRatingsModalOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const storedBags = localStorage.getItem("Totalbags");
      const storedOrders = localStorage.getItem("Totalorders");
      if (storedBags) setTotalBags(parseInt(storedBags, 10));
      if (storedOrders) setTotalOrders(parseInt(storedOrders, 10));
    }, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    dispatch(fetchRatingSummary());
  }, [dispatch]);

  return (
    <div className="flex w-full gap-2">
      <div className="flex-1 min-w-0 flex">
        <RatingsCard
          ratingSummary={ratingSummary}
          onViewMore={() => setRatingsModalOpen(true)}
        />
      </div>
      <div className="flex-1 min-w-0 flex">
        <Card
          icon={<ShoppingBagIcon className="w-6 h-6 fill-[#5f22d9]" />}
          title={totalBags.toLocaleString("en-US")}
          content="Total Bags Made"
          onViewMore={() => { router.push("/business/manage-bags") }}
        />
      </div>
      <div className="flex-1 min-w-0 flex">
        <Card
          icon={<ShoppingCartIcon className="w-6 h-6 fill-[#5f22d9]" />}
          title={totalOrders.toLocaleString("en-US")}
          content="Total Orders"
          onViewMore={() => { router.push("/business/orders") }}
        />
      </div>
      <RatingsModal
        open={ratingsModalOpen}
        onClose={() => setRatingsModalOpen(false)}
        summary={ratingSummary}
      />
    </div>
  );
};
export default CardsRow;