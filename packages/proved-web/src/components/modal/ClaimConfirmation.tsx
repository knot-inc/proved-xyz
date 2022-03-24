/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Proof } from "API";
import { ShareForm } from "components/ui/ShareForm";

export const ClaimConfirmationModal = ({
  onClose,
  proof,
}: {
  onClose: () => void;
  proof: Proof;
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = (
    e: boolean | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (typeof e !== "boolean") {
      e.preventDefault();
    }
    setOpen(false);
    onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={handleClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-proved-300 rounded-lg px-4 mt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-2xl sm:w-full sm:m-6">
              <div className="absolute right-3 top-2">
                <button className="" onClick={handleClose}>
                  <XIcon
                    className="block h-6 w-6 text-gray-300"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <h2 className="text-3xl pt-6 text-center font-bold leading-tight text-white">
                Your claim proposal is ready!
              </h2>
              <div className="pt-3 text-center text-gray-300 sm:mt-0 sm:ml-4 ">
                <p>To mint this NFT, at least one colleague in your DAO</p>
                <p>
                  needs to
                  <span className="inline font-bold italic"> prove</span> this.
                </p>
              </div>
              <div className="pt-3 w-full">
                <ShareForm
                  proofId={proof.id}
                  orgName={proof?.org?.name as string}
                  orgId={proof?.org?.id as string}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
