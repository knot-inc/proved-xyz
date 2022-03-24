import { useEffect, useState } from "react";
import TicketVisual from "components/ticket-visual";
import { GradientBtn } from "components/ui/GradientBtn";
import { useUser } from "contexts/UserContext";
import { ClaimConfirmationModal } from "components/modal/ClaimConfirmation";
import {
  Org,
  Proof,
  ProofCreateInput,
  ProofCreateMutation,
  S3Object,
  UserGetQuery,
} from "API";
import { API } from "aws-amplify";
import { userGet } from "graphql/queries";
import { validateInput } from "./validateInput";
import { useRouter } from "next/router";
import { proofCreate } from "graphql/mutations";
import * as ga from "utils/ga";

export interface Input {
  role: string;
  org: Org;
  startDate: string;
  endDate?: string;
}

const defaultOrg: Org = {
  __typename: "Org",
  id: "default",
  name: "Select",
};

export const Claim = () => {
  const user = useUser();
  const router = useRouter();

  const [input, setInput] = useState<Input>({
    org: defaultOrg,
    role: "",
    startDate: "",
    endDate: undefined,
  });

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>();
  const [validateError, setValidateError] = useState("");
  const [proof, setProof] = useState<Proof | undefined>(undefined);

  useEffect(() => {
    if (user.data?.address) {
      fetchData(user.data.address);
    }
  }, [user.data?.address]);

  const fetchData = async (id: string) => {
    try {
      const r = (await API.graphql({
        query: userGet,
        variables: {
          id,
        },
      })) as { data: UserGetQuery };
      if (r.data.userGet?.orgs) {
        const list = [defaultOrg, ...r.data.userGet.orgs] as Org[];
        setOrgs(list);
      }
    } catch (e) {
      console.log("==== fetchdata", e);
    }
  };

  const updateInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    let update;
    if (name === "orgName") {
      const o = orgs?.find((org) => org.name === e.target.value);
      update = {
        ...input,
        org: o as Org,
      };
    } else {
      update = {
        ...input,
        [name]: e.target.value,
      };
    }
    setInput(update);
  };

  const handleClaim = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setValidateError("");
    const result = validateInput(input);
    if (result.error) {
      setValidateError(result.error);
    }
    const proofInput: ProofCreateInput = {
      org: input.org,
      role: input.role,
      ownerId: user.data?.address as string,
      startDate: new Date(input.startDate).toISOString(),
    };
    if (input.endDate) {
      proofInput.endDate = new Date(input.endDate).toISOString();
    }

    const r = (await API.graphql({
      query: proofCreate,
      variables: {
        input: proofInput,
      },
    })) as { data: ProofCreateMutation };
    const proof = r.data.proofCreate as Proof;
    setProof(proof);
    setOpenConfirmationModal(true);
    ga.event({
      action: "claim_complete",
    });
  };

  const handleClose = () => {
    setOpenConfirmationModal(false);
    router.replace("/home");
  };

  return (
    <div className="bg-proved-500 min-h-full">
      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-200 sm:text-4xl">
          <span className="block">{`Hi ${user.data?.name}, let's create your claim proposal`}</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-12 ">
        <div className="px-4 col-span-1 sm:col-span-5 sm:pl-6 lg:flex-none lg:pl-20 xl:pl-24 self-center ">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="organization"
              className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2 "
            >
              Organization
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <select
                id="organization"
                name="orgName"
                value={input.org.name}
                onChange={updateInput}
                className="max-w-lg block text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md bg-transparent"
              >
                {orgs?.map((org) => (
                  <option key={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2 "
            >
              Role
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="text"
                name="role"
                id="role"
                placeholder="Developer"
                onChange={updateInput}
                className="max-w-lg block w-full shadow-sm text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md bg-transparent mx-1"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2 "
            >
              Started
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className={`sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-10 bg-transparent text-color border-gray-300 uppercase ${input.startDate ? 'text-white' : 'text-gray-500'}`}
              onChange={updateInput}
            />
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-200 sm:mt-px sm:pt-2 "
            >
              Ended (optional)
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className={`sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-10 bg-transparent text-color border-gray-300 uppercase ${input.endDate ? 'text-white' : 'text-gray-500'}`}
              onChange={updateInput}
            />
          </div>
        </div>
        <div className="ml-2 my-8 sm:my-0 col-span-1 sm:col-span-7 w-full px-4 sm:px-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-200">
              Preview
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              The NFT you can mint when the claim is proved.
            </p>
            <p className="max-w-2xl text-sm text-gray-400">
              The start and end dates will be included in the metadata.
            </p>
          </div>
          <div className="mt-2 sm:mt-6 max-w-[525px]">
            <TicketVisual
              name={user.data?.name as string}
              orgname={input.org.name}
              profileImage={user.data?.profileImage as S3Object}
              role={input.role}
              walletname={user.data?.address as string}
            />
          </div>
        </div>
      </div>
      {validateError && (
        <div className="text-red-400 ml-4">{validateError}</div>
      )}
      <div className="mt-8 w-full inline-flex items-center justify-center">
        <GradientBtn
          onClick={handleClaim}
          disabled={
            input.org.id === defaultOrg.id ||
            input.role === "" ||
            input.startDate === ""
          }
        >
          Claim proposal
        </GradientBtn>
      </div>
      {openConfirmationModal && proof && (
        <ClaimConfirmationModal onClose={handleClose} proof={proof} />
      )}
    </div>
  );
};
