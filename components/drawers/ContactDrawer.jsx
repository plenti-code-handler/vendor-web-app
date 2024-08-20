"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Textarea,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/contactUserSlice";
import { Input } from "@headlessui/react";

const ContactDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.contactUser.drawerOpen);

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-[999999]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 overflow-hidden rounded-md">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <DialogPanel
              transition
              className="pointer-events-auto relative lg:w-[960px] transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-5 shadow-xl">
                <div className="text-[70%] md:text-[100%]">
                  <div className="mx-10 flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                      <h1 className="text-[#404146] text-[1.875em] font-[500]">
                        Contact Us
                      </h1>
                      <button onClick={handleClose} className="p-4">
                        {closeIcon}
                      </button>
                    </div>
                    <p>
                      Molestiae id cumque ut fugit. Doloremque maiores
                      voluptatem sint porro. Voluptates rem voluptates ipsa
                      deleniti vero quia deleniti illum. Vero laudantium debitis
                      sunt veritatis. Iure molestias maxime est et cupiditate.
                      Et dolorem qui ullam est ipsum.
                    </p>
                    <hr className="w-1/2 " />
                    <div className="flex md:flex-row flex-col font-[400] text-[1.5em] items-center justify-between">
                      <p>Or drop us a line</p>
                      <p className="underline">contact@foodiefinder.com</p>
                    </div>
                    <div className="flex md:flex-row flex-col md:items-center gap-5 justify-between">
                      <div className="flex flex-col gap-3 basis-full">
                        <label>Name *</label>
                        <Input className="px-4 w-full rounded-[6px] h-[60px] border-2 border-[#404146]" />
                      </div>
                      <div className="flex flex-col gap-3 basis-full">
                        <label>Email *</label>
                        <Input className="px-4 w-full rounded-[6px] h-[60px] border-2 border-[#404146]" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 basis-full">
                      <label>Message *</label>
                      <Textarea
                        rows={5}
                        className="p-4 w-full rounded-[6px] border-2 border-[#404146]"
                      />
                    </div>
                    <button className="flex self-center justify-center bg-pinkBgDark text-white font-bold py-3 px-4 rounded hover:bg-pinkBgDarkHover2 w-full sm:w-auto sm:px-6 lg:w-[35%]">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ContactDrawer;

const closeIcon = (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.7305 8.01551L21.9845 6.26953L15 13.254L8.01551 6.26953L6.26953 8.01551L13.254 15L6.26953 21.9845L8.01551 23.7305L15 16.746L21.9845 23.7305L23.7305 21.9845L16.746 15L23.7305 8.01551Z"
      fill="#404146"
    />
  </svg>
);
