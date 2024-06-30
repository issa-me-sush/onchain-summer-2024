import { usePrivy, useToken, useWallets } from "@privy-io/react-auth";
import UserMenu from "../components/UserMenu";
import DeveloperCard from "../components/DeveloperCard";
import { useEffect, useState } from "react";

import { createWalletClient, custom } from "viem";
import { providerToSmartAccountSigner, ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { createPublicClient, http } from "viem";
import { createZeroDevPaymasterClient, createKernelAccount, createKernelAccountClient } from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { sepolia } from "viem/chains";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
const dummyDevelopers = [
    { id: 1, githubUsername: "dev1", image: "/github.png", contributions: 50, score: 85 },
    { id: 2, githubUsername: "dev2", image: "/github.png", contributions: 30, score: 70 },
    { id: 3, githubUsername: "dev3", image: "/github.png", contributions: 45, score: 90 },
];

// export const getServerSideProps: GetServerSideProps<{
//     addresses: { embedded_address: string; smart_contract_address: string };
// }> = async () => {
//     const addresses: { embedded_address: string; smart_contract_address: string } | void = await getUserEmbeddedWalletAddress("lazycoder1");
//     console.log("addressessssss", addresses);
//     if (addresses === undefined) {
//         return {
//             notFound: true,
//         };
//     }
//     return {
//         props: { addresses: addresses },
//     };
// };

const Home = () => {
    const { ready, authenticated, login, user } = usePrivy();
    const { wallets } = useWallets();
    const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
    const [accountAddress, setAccountAddress] = useState(null);

    useEffect(() => {
        const initializeAccount = async () => {
            // await privy.deleteUser("did:privy:cly0tp9c0029tqb0qgws71b7s");
            try {
                // Find the embedded wallet and get its EIP1193 provider
                wallets.forEach((wallet) => console.log("wallets", wallet));
                const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
                console.log("embeddedWallet", embeddedWallet?.address);
                console.log("embeddedChain", embeddedWallet?.chainId);
                if (!embeddedWallet) {
                    console.error("Embedded wallet not found");
                    return;
                }
                const provider = await embeddedWallet.getEthereumProvider();
                console.log("signed");
                // Use the EIP1193 `provider` from Privy to create a `SmartAccountSigner`
                const smartAccountSigner = await providerToSmartAccountSigner(provider);

                // Initialize a viem public client on your app's desired network
                const publicClient = createPublicClient({
                    transport: http(sepolia.rpcUrls.default.http[0]),
                });
                console.log("signer in ", smartAccountSigner);
                // Create a ZeroDev ECDSA validator from the `smartAccountSigner` from above and your `publicClient`
                const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
                    signer: smartAccountSigner,
                    entryPoint: ENTRYPOINT_ADDRESS_V07,
                    kernelVersion: "0.3.0",
                });

                // Create a Kernel account from the ECDSA validator
                const account = await createKernelAccount(publicClient, {
                    plugins: {
                        sudo: ecdsaValidator,
                    },
                    entryPoint: ENTRYPOINT_ADDRESS_V07,
                    kernelVersion: "0.3.0",
                });

                setAccountAddress(account.address);
                console.log("smart wallet address :", account.address);
            } catch (error) {
                console.error("Error initializing account:", error);
            }
        };

        initializeAccount();
    }, [wallets]);
    const { getAccessToken } = useToken();
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const fetchAccessToken = async () => {
            if (authenticated) {
                try {
                    const token = await getAccessToken();
                    console.log("token", token);
                    setAccessToken(token);
                } catch (error) {
                    console.error("Failed to fetch access token:", error);
                }
            }
        };

        fetchAccessToken();
    }, [authenticated, getAccessToken]);
    const disableLogin = !ready || (ready && authenticated);
    console.log(user?.linkedAccounts);

    return (
        <div className="bg-gradient-to-b from-[#FED4CA] to-[#FFE3E1] min-h-screen p-5">
            <div className="relative p-10 mt-5 text-center bg-white rounded-3xl shadow-clay-card">
                <img src="/banner.svg" alt="Banner" className="absolute inset-0 object-cover w-full h-full opacity-50 rounded-3xl" />
                <h2 className="relative text-2xl font-bold text-blue-900">
                    Showcase and hire developers based on their contributions and attestations on chain
                </h2>
                <p className="relative text-blue-700">Discover top developers and their contributions to open-source projects.</p>
                <button className="relative px-4 py-2 mt-4 text-white bg-blue-500 rounded shadow-clay-btn">Create a task</button>
            </div>

            <h3 className="mt-10 text-2xl font-semibold text-center">Top Developers</h3>
            <div className="grid grid-cols-1 gap-4 mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                {dummyDevelopers.map((developer) => (
                    <DeveloperCard key={developer.id} developer={developer} />
                ))}
            </div>
        </div>
    );
};

export default Home;
