import { useEffect, useState } from "react";
import { EAS, Offchain, SchemaEncoder, SchemaRegistry, TransactionSigner, getSchemaUID } from "@ethereum-attestation-service/eas-sdk";
import { SmartAccountSigner } from "permissionless/accounts";
import { ENTRYPOINT_ADDRESS_V07, SmartAccountClient, providerToSmartAccountSigner } from "permissionless";
import { ENTRYPOINT_ADDRESS_V07_TYPE } from "permissionless/types/entrypoint";
import { KernelAccountClient, createKernelAccount, createKernelAccountClient } from "@zerodev/sdk";
import { baseSepolia } from "viem/chains";
import { easAbi } from "./easAbi";
import { useWallets } from "@privy-io/react-auth";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { createPimlicoPaymasterClient, createPimlicoBundlerClient } from "permissionless/clients/pimlico";
import { createPublicClient, http } from "viem";

const schemaRegistryContractAddress = "0x4200000000000000000000000000000000000020"; // base sepolia
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
const schema = "string github_url,string maintainer_github_id,string remark,string contributor_github_id";
const resolverAddress = "0x4200000000000000000000000000000000000020"; // base sepolia
const eas = "0x4200000000000000000000000000000000000021" as `0x${string}`;
const revocable = true;

const useEas = () => {
    const [accountClient, setAccountClient] = useState<null | KernelAccountClient<ENTRYPOINT_ADDRESS_V07_TYPE>>(null);
    const { wallets } = useWallets();

    // useEffect(() => {
    //     const attest = async () => {
    //         console.log("account client", accountClient);
    //         await attestSchema();
    //     };
    //     attest();
    // }, [accountClient]);
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

                console.log("smart wallet address :", account.address);
            } catch (error) {
                console.error("Error initializing account:", error);
            }
        };

        initializeAccount();
    }, [wallets]);

    // const attestSchema = async (github_url: string, maintainer_github_id: string, remark: string, contributor_github_id: string) => {
    //     const tx = await attestSchemaInBlockchain(github_url, maintainer_github_id, remark, contributor_github_id);
    //     if (tx !== undefined) {
    //         console.log("Transaction successful, tx:", tx);

    //     }
    // };

    const attestSchemaInBlockchain = async (
        github_url: string,
        maintainer_github_id: string,
        remark: string,
        contributor_github_id: string
    ) => {
        let schema = "uint256 score";
        // let schemaEncoded =
        const schemaEncoder = new SchemaEncoder(schema);
        const schemaUID = getSchemaUID(schema, "0x0000000000000000000000000000000000000000", true) as `0x${string}`;
        console.log("schemaUID", schemaUID);
        const data = schemaEncoder.encodeData([
            { name: "github_url", value: github_url, type: "string" },
            { name: "maintainer_github_id", value: maintainer_github_id, type: "string" },
            { name: "remark", value: remark, type: "string" },
            { name: "contributor_github_id", value: contributor_github_id, type: "string" },
        ]) as `0x${string}`;
        if (!accountClient) {
            console.error("Account client not found");
            return;
        }
        try {
            const tx = await accountClient.writeContract({
                account: accountClient.account ? accountClient.account : "0x",
                address: eas,
                chain: baseSepolia,
                abi: easAbi,
                functionName: "attest",
                args: [
                    {
                        schema: schemaUID,
                        data: {
                            recipient: "0xe95C4707Ecf588dfd8ab3b253e00f45339aC3054",
                            expirationTime: BigInt("1729782120075"),
                            revocable: true,
                            refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                            data: data,
                            value: BigInt("0"),
                        },
                    },
                ],
            });

            console.log("Transaction successful, tx:", tx);
            return tx;
        } catch (error) {
            console.error("An error occurred while writing the contract:", error);
        }
    };
    return { attestSchemaInBlockchain, setAccountClient, accountClient };
};

export default useEas;
