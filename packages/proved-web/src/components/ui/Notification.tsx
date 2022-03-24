/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, BanIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import {
  NotificationType,
  useNotificationDispatch,
} from "contexts/NotificationContext";
import type { Content } from "contexts/NotificationContext";

const NotificationIcon = ({ type }: { type?: NotificationType }) => {
  switch (type) {
    case NotificationType.Success:
      return (
        <CheckCircleIcon
          className="h-6 w-6 text-green-400"
          aria-hidden="true"
        />
      );
    case NotificationType.Warning:
    case NotificationType.Error:
      return <BanIcon className="h-6 w-6 text-red-400" aria-hidden="true" />;
    default:
      return null;
  }
};
export const Notification = ({ content }: { content?: Content }) => {
  const [show, setShow] = useState(true);
  const dispatch = useNotificationDispatch();

  const hide = () => {
    setShow(false);
    dispatch({ type: "HIDE_NOTIFICATION" });
  };

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="max-w-sm w-full bg-gray-900 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <NotificationIcon type={content?.type} />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-white">
                      {content?.title || "Successfully updated!"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {content?.message || "Anyone can view this information."}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="bg-gray-900 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      onClick={hide}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
};
