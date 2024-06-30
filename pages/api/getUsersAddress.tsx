import { KernelSmartAccount, createKernelAccount, createKernelAccountClient } from "@zerodev/sdk";
import { ENTRYPOINT_ADDRESS_V06, ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { createPublicClient, http } from "viem";
import { ENTRYPOINT_ADDRESS_V07_TYPE } from "permissionless/_types/types";
import { KERNEL_V3_0 } from "@zerodev/sdk/_types/constants";
import { ENTRYPOINT_ADDRESS_V06_TYPE } from "permissionless/types/entrypoint";
const myHeaders = new Headers();
const PRIVY_APP_ID = process.env.PRIVY_APP_ID;
const PRIVY_SECRET_ID = process.env.PRIVY_SECRET_ID;
const BUNDLER_PAYMASTER_URL = process.env.BUNDLER_PAYMASTER_URL;
const RPC = process.env.RPC;
const auth = btoa(`${PRIVY_APP_ID}:${PRIVY_SECRET_ID}`);

myHeaders.append("privy-app-id", PRIVY_APP_ID as string);
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Basic ${auth}`);

export const getUserId = async (userName: string) => {
    try {
        const res = await fetch("https://api.github.com/users/" + userName);
        const resText: any = JSON.parse(await res.text());
        if ("id" in resText) {
            return resText.id;
        }
    } catch (error) {
        console.error(`Error getting user ID for ${userName}: `, error);
        throw error;
    }
};

export const getUserEmbeddedWalletAddress = async (userName: string) => {
    try {
        const sub = await getUserId(userName);
        const raw = JSON.stringify({
            create_embedded_wallet: true,
            linked_accounts: [
                {
                    username: userName,
                    subject: sub.toString(),
                    type: "github_oauth",
                },
            ],
        });

        const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        const res = await fetch("https://auth.privy.io/api/v1/users", requestOptions);
        const resText: any = JSON.parse(await res.text());

        if ("linked_accounts" in resText) {
            resText["linked_accounts"].forEach(async (account: any) => {
                if (account.type === "wallet") {
                    await getKernelAccountClient(account.address);
                    return account.address;
                }
            });
        }
    } catch (error) {
        console.error(`Error getting wallet address for ${userName}: `, error);
        throw error;
    }
};

export const getKernelAccountClient = async (address: `0x${string}`) => {
    try {
        // Initialize a viem public client on your app's desired network
        const publicClient = createPublicClient({
            transport: http(RPC as string),
        });

        // Create a ZeroDev ECDSA validator from the `smartAccountSigner` from above and your `publicClient`
        const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
            signer: {
                address,
                type: "local",
                signMessage: async ({ message }) => `0xabcd`,
                signTypedData: async ({ message }) => `0xabcd`,
                publicKey: address,
                source: "local",
            },
            entryPoint: ENTRYPOINT_ADDRESS_V07,
            kernelVersion: "0.3.1",
        });

        // Create a Kernel account from the ECDSA validator
        const account: KernelSmartAccount<ENTRYPOINT_ADDRESS_V07_TYPE> = await createKernelAccount(publicClient, {
            plugins: {
                sudo: ecdsaValidator,
            },
            entryPoint: ENTRYPOINT_ADDRESS_V07,
            kernelVersion: "0.3.1",
        });

        console.log("kernel acount", account.address);
    } catch (error) {
        console.error(`Error creating Kernel account for address ${address}: `, error);
        throw error;
    }
};
