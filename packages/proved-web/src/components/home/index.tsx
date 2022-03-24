import { Proof, ProofListQuery } from "API";
import { API } from "aws-amplify";
import { GradientBtn } from "components/ui/GradientBtn";
import { ProofItem } from "components/ui/ProofItem";
import { useUser } from "contexts/UserContext";
import { proofList } from "graphql/queries";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const Home = () => {
  const router = useRouter();
  const user = useUser();
  const [proofs, setProofs] = useState<Proof[] | undefined>();

  useEffect(() => {
    if (user.data?.address) {
      fetchData(user.data.address);
    }
  }, [user.data?.address]);

  const fetchData = async (id: string) => {
    try {
      const r = (await API.graphql({
        query: proofList,
        variables: {
          id,
        },
      })) as { data: ProofListQuery };
      if (r.data.proofList) {
        setProofs(r.data.proofList as Proof[]);
      }
    } catch (e) {
      console.log("==== fetchdata", e);
    }
  };

  const handleClaim = () => {
    if (user.isAuthenticated && user.data?.verified) {
      router.push("/claim");
    } else {
      router.push("/signup");
    }
  };
  return (
    <div className="py-10 md:py-3 h-full  bg-proved-500">
      <div className="m-6 border-2 border-proved-100 bg-proved-300 rounded-md px-4 py-2 text-left text-white flex flex-row justify-between">
        <div className="text-xl self-center">
          Start claiming your contribution!
        </div>
        <div className="flex flex-col gap-2 items-center">
          <GradientBtn onClick={handleClaim}>Claim</GradientBtn>
          <Link href="/howto" passHref>
            <a className="text-gray-300 hover:text-gray-600">
              <div className="md:text-base text-sm">How to claim?</div>
            </a>
          </Link>
        </div>
      </div>
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl pt-6 font-bold leading-tight text-white">
            List of your contributions
          </h2>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-8 sm:px-0">
            {!proofs?.length && (
              <div className="text-xl self-center text-white">
                No contributions yet!
              </div>
            )}
            <div className="bg-white overflow-hidden sm:rounded-md">
              <ul role="list" className="bg-proved-500">
                {proofs?.map((proof) => (
                  <li key={proof.id} className="pb-2">
                    <ProofItem proof={proof} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
