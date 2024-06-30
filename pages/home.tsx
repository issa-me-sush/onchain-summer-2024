import { usePrivy, useToken, useWallets, useSendTransaction } from "@privy-io/react-auth";
import UserMenu from "../components/UserMenu";
import DeveloperCard from "../components/DeveloperCard";
import { useEffect, useState } from "react";
import { EAS, Offchain, SchemaEncoder, SchemaRegistry, getSchemaUID } from "@ethereum-attestation-service/eas-sdk";
import { createWalletClient, custom } from "viem";
import { providerToSmartAccountSigner, ENTRYPOINT_ADDRESS_V07, ENTRYPOINT_ADDRESS_V06 } from "permissionless";
import { createPublicClient, http } from "viem";
import { createZeroDevPaymasterClient, createKernelAccount, createKernelAccountClient } from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import ExtendedSmartAccountSigner from "../lib/extended";
import { Signer } from "ethers";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import useEas from "../hooks/eas";
import  {EAS_ABI} from "../constants/abi"
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico";

// import CustomSigner from "../lib/CustomSigner"
// import { useSigner,useProvider } from "../lib/eas-wagmi-utils";
import { useEthersProvider } from "../lib/eas-wagmi-utils";
import { baseSepolia, sepolia } from "viem/chains";
import { easAbi } from "../hooks/easAbi";
const dummyDevelopers = [
    { id: 1, githubUsername: "dev1", image: "/github.png", contributions: 50, score: 85 },
    { id: 2, githubUsername: "dev2", image: "/github.png", contributions: 30, score: 70 },
    { id: 3, githubUsername: "dev3", image: "/github.png", contributions: 45, score: 90 },
];
export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);
const Home = () => {
    const { ready, authenticated, login, user } = usePrivy();
    const { wallets } = useWallets();
    const { address } = useAccount();
    const { attestSchema, setAccountClient, accountClient } = useEas();
    console.log(address, "<- address");
    const { sendTransaction } = useSendTransaction();
    const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
    const [accountAddress, setAccountAddress] = useState(null);
    // const ethersigner = useSigner()
    // const etherprovider = useProvider()
    const providerwagmi = useEthersProvider();
    useEffect(() => {
        const initializeAccount = async () => {
            try {
                // Find the embedded wallet and get its EIP1193 provider
                const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
                if (!embeddedWallet) {
                    console.error("Embedded wallet not found");
                    return;
                }
                const provider = await embeddedWallet.getEthereumProvider();

                // Use the EIP1193 `provider` from Privy to create a `SmartAccountSigner`
                const smartAccountSigner = await providerToSmartAccountSigner(provider);

                // Wrap the smartAccountSigner with ExtendedSmartAccountSigner
                // const extendedSigner = new ExtendedSmartAccountSigner(smartAccountSigner, provider);
                // Initialize a viem public client on your app's desired network
                const publicClient = createPublicClient({
                    transport: http(baseSepolia.rpcUrls.default.http[0]),
                });

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
                // const kernelClient = createKernelAccountClient({
                //   account,
                //   chain: baseSepolia,
                //   entryPoint: ENTRYPOINT_ADDRESS_V07,
                //   bundlerTransport: http('https://api.pimlico.io/v2/84532/rpc?apikey=ddaba84e-c7ff-45da-8d21-7b8e25c79fe3'),
                //   middleware: {
                //     sponsorUserOperation: async ({ userOperation }) => {
                //       const zerodevPaymaster = createZeroDevPaymasterClient({
                //         chain: baseSepolia,
                //         entryPoint: ENTRYPOINT_ADDRESS_V07,
                //         transport: http('https://api.pimlico.io/v2/84532/rpc?apikey=ddaba84e-c7ff-45da-8d21-7b8e25c79fe3'),
                //       })
                //       return zerodevPaymaster.sponsorUserOperation({
                //         userOperation,
                //         entryPoint: ENTRYPOINT_ADDRESS_V07,
                //       })
                //     }
                //   }
                // })

                const BUNDLER_PAYMASTER_URL = "https://api.pimlico.io/v2/84532/rpc?apikey=ddaba84e-c7ff-45da-8d21-7b8e25c79fe3";
                const paymasterClient = createPimlicoPaymasterClient({
                    transport: http(BUNDLER_PAYMASTER_URL),
                    entryPoint: ENTRYPOINT_ADDRESS_V07,
                });

                const pimlicoBundlerClient = createPimlicoBundlerClient({
                    transport: http(BUNDLER_PAYMASTER_URL),
                    entryPoint: ENTRYPOINT_ADDRESS_V07,
                });

                const kernelClient = createKernelAccountClient({
                    account,
                    chain: baseSepolia,
                    entryPoint: ENTRYPOINT_ADDRESS_V07,
                    bundlerTransport: http(BUNDLER_PAYMASTER_URL),
                    middleware: {
                        sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
                        gasPrice: async () => (await pimlicoBundlerClient.getUserOperationGasPrice()).fast, // use pimlico bundler to get gas prices
                    },
                });
                setAccountClient(kernelClient);

                // attestSchema()
                // console.log("smart account :", account.address,account)
                // const txnHash = await kernelClient.sendTransaction({
                //   to: "0x694a967A60b61Cb23dAA46571A137e4Fb0656076",
                //   value: BigInt(ethers.utils.parseEther("0.001").toString()),
                //   data: "0x",
                // })
                // console.log("txn hash: ",txnHash)

                // setAccountAddress(account.address,account.client.getChainId);

                //       const transaction = {
                //   to: "0x694a967A60b61Cb23dAA46571A137e4Fb0656076", // Replace with the recipient address
                //   value: ethers.utils.parseEther("0.001"), // Sending 0.001 Ether

                // };

                // const transactionReceipt = await sendTransaction(transaction);

                //   console.log("ethersigner",smartAccountSigner,provider)
                //   const providerether =   new ethers.providers.Web3Provider(provider);
                //   // const signerwagmi = new ethers.providers.JsonRpcSigner(providerwagmi)
                //   // const signerwagmi2 = new ethers.JsonRpcSigner(smartAccountSigner,account.address)
                //   console.log("provider ether",providerether)
                //   const signerether = await providerether.getSigner()
                //   const provider2 = ethers.getDefaultProvider(
                //     "sepolia"
                //   );
                // const signerwagmi2 = await providerwagmi.getSigner()
                // console.log(signerwagmi)
                //   provider.signTypedData = function(params, types, signer) {
                //     return this._signTypedData(params, types, signer)
                // }
                // console.log("privy provider" , provider)
                // const extendedSigner = new ExtendedSmartAccountSigner(smartAccountSigner, provider);
                // console.log(extendedSigner)
                // eas.connect(extendedSigner);
                //   const offchain = await eas.getOffchain();
                //   console.log(offchain)
                // Create a custom signer that wraps the smartAccountSigner
                // const customSigner = new CustomSigner(smartAccountSigner, provider);
                // eas.connect(customSigner);

                //   console.log(eas)
                //   const schemaUID = "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995"; // Example schema UID
                //   const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
                //   const encodedData = schemaEncoder.encodeData([
                //     { name: "eventId", value: 1, type: "uint256" },
                //     { name: "voteIndex", value: 1, type: "uint8" },
                //   ]);
                // console.log(encodedData)
                // const offchainAttestation = await offchain.signOffchainAttestation({
                //   recipient: '0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165',
                //   // Unix timestamp of when attestation expires. (0 for no expiration)
                //   expirationTime: BigInt(0),
                //   // Unix timestamp of current time
                //   time: BigInt(1671219636),
                //   revocable: true, // Be aware that if your schema is not revocable, this MUST be false

                //   nonce: BigInt(0),
                //   schema: "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995",
                //   refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                //   data: encodedData,
                // }, extendedSigner);
                //  console.log("offchainattest",offchainAttestation)
                // Create an on-chain attestation
                //         const tx = await eas.attest({
                //           schema: schemaUID,
                //           data: {
                //             recipient: "0x694a967A60b61Cb23dAA46571A137e4Fb0656076",
                //             expirationTime: BigInt(0),
                //             revocable: true, // Be aware that if your schema is not revocable, this MUST be false
                //             data: encodedData,
                //           },
                //         });
                // console.log(tx)
                //         const receipt = await tx.wait();
                //         console.log( receipt.logs[0].args[0]);

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
