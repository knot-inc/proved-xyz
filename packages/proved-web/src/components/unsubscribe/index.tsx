import { useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "contexts/UserContext";
import { GradientBtn } from "components/ui/GradientBtn";
import { userUpdate } from "graphql/mutations";
import { User, UserUpdateInput, UserUpdateMutation } from "API";
import { API } from "aws-amplify";

export default function Unsubscribe() {
  const [validateError, setValidateError] = useState<undefined | string>();
  const [isUnsubscribed, setUnsubscribed] = useState(false);
  const { query } = useRouter();
  const user = useUser();

  const handleUnsubscribe = async () => {
    if (user.data?.address !== query?.id) {
      setValidateError(
        `You need to connect a wallet that matches the address: ${
          query?.id || ""
        }`
      );
      return;
    }
    setValidateError("");
    const userInput: UserUpdateInput = {
      id: query?.id as string,
      subscribeMessage: false,
    };
    const r = (await API.graphql({
      query: userUpdate,
      variables: {
        input: userInput,
      },
    })) as { data: UserUpdateMutation };
    const updatedUser = r.data.userUpdate as User;
    setUnsubscribed(!updatedUser.subscribeMessage);
  };

  return (
    <div className="bg-proved-500 min-h-full">
      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-200 sm:text-4xl">
          <span className="block">Unsubscribe Email</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-200">
          You will not receive emails related to transactions on Proved.
        </p>
        <div className="mt-8 flex justify-center sm:space-x-4 flex-col">
          <GradientBtn onClick={handleUnsubscribe} disabled={isUnsubscribed}>
            {isUnsubscribed ? "Unsubscribed" : "Unsubscribe"}
          </GradientBtn>
          {validateError?.length && (
            <div className="text-red-400 m-4 max-w-3xl self-center">
              {validateError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
