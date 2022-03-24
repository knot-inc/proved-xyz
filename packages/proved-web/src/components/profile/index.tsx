import { useEffect, useState } from 'react';
import { Org, Proof, ProofListQuery } from 'API';
import { API } from 'aws-amplify';
import { GradientBtn } from 'components/ui/GradientBtn';
import { ProfileImage } from 'components/ui/ProfileImage';
import { WalletLogo } from 'components/ui/WalletLogo';
import { useUser } from 'contexts/UserContext';
import { proofList } from 'graphql/queries';
import { useVerify } from 'hooks/useVerify';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { shortenName } from 'utils/userName';
import { ProofsModal } from 'components/modal/Proofs';

export const Profile = () => {
  const user = useUser();
  const [{ loading: verifyLoading }, verify] = useVerify();
  const router = useRouter();
  const [proofs, setProofs] = useState<Proof[]>();
  const [modals, setModals] = useState<{[key: string]: boolean}>({});

  const userAddress = user.data?.address || '';
  const code = router.query.code as string;

  useEffect(() => {
    if (userAddress) fetchData();
    if (code && userAddress) {
      // Start verification to refresh user data
      verify({ address: userAddress, code, path: 'profile' }).catch((e) => {
        console.log(e);
      });
    }
  }, [code, userAddress]);

  const fetchData = async () => {
    try {
      const proofListData = (await API.graphql({
        query: proofList,
        variables: {
          id: userAddress,
        },
      })) as { data: ProofListQuery };
      if (proofListData.data.proofList) {
        setProofs(proofListData.data.proofList as Proof[]);
      }
    } catch (e) {
      console.log('==== fetchdata proof list', e);
    }
  };

  const renderOrgImage = (org: Org | null) => {
    if (!org) return null;
    const imgUrl = `https://cdn.discordapp.com/icons/${org.id}/${org.discordIcon}.webp?size=96`;
    return <Image className="rounded-full" src={imgUrl} width={48} height={48} />;
  };

  const renderOrgNFTs = (org: Org | null) => {
    if (!org || !user || !proofs) return null;
    const orgProofs = proofs.filter((p: Proof) => p.org?.id === org.id);
    if (!orgProofs || orgProofs.length === 0) return null;
    return (
      <div className="text-sm text-gray-400 hover:cursor-pointer" onClick={() => setModals({[org.id]: true})}>
        {orgProofs.length} {orgProofs.length === 1 ? 'NFT' : 'NFTs'} claimed
        {modals[org.id] && user.data && <ProofsModal onClose={() => setModals({})} proofs={orgProofs} user={user.data} />}
      </div>
    );
  };

  return (
    <div className="py-10 md:py-3 h-full max-w-7xl mx-auto px-6 md:px-8 text-white">
      <header className="text-3xl py-6 font-bold leading-tight">Profile</header>
      <main>
        <div className="flex md:flex-row flex-col justify-between">
          <div className="grid grid-cols-2">
            <ProfileImage size={64} profileImage={user.data?.profileImage} />
            <div>
              <p className="sm:text-xl font-semibold mt-1 mb-2">
                <span className={'flex items-center rounded relative'}>{user.data?.name}</span>
              </p>
              <span className="flex items-center text-xs">
                <WalletLogo />
                <div className="px-2">{shortenName(userAddress)}</div>
              </span>
            </div>
          </div>
          <div className="mt-6 inline-flex rounded-md shadow self-center">
            <Link href={process.env.NEXT_PUBLIC_DISCORD_AUTH_LINK_PROFILE as string}>
              <a>
                <GradientBtn
                  onClick={() => {
                    // Do nothing
                  }}
                >
                  Refresh Discord Data
                </GradientBtn>
              </a>
            </Link>
            {(verifyLoading || user.loading) && (
              <div className="self-center ml-2">
                <div className="animate-spin rounded-full px-2 self-center h-4 w-4 border-t-2 border-b-2 border-indigo-500" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 mb-4 text-2xl">Orgs</div>
        <div className="grid grid-cols-2 md:grid-cols-3">
          {user.data?.orgs?.map((org) => (
            <div key={org?.id} className="mt-6">
              <span className="align-middle mr-2">{renderOrgImage(org)}</span>
              <div className="inline-block align-middle">
                {org?.name}
                {renderOrgNFTs(org)}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
