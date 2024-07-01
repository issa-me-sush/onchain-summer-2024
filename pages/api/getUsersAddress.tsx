import { KernelSmartAccount, createKernelAccount, createKernelAccountClient } from "@zerodev/sdk";
import { ENTRYPOINT_ADDRESS_V06, ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { createPublicClient, http } from "viem";
import { ENTRYPOINT_ADDRESS_V07_TYPE } from "permissionless/_types/types";
import { KERNEL_V3_0 } from "@zerodev/sdk/_types/constants";
import { ENTRYPOINT_ADDRESS_V06_TYPE } from "permissionless/types/entrypoint";
const myHeaders = new Headers();
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
console.log("PRIVY_APP_ID", PRIVY_APP_ID);
const PRIVY_SECRET_ID = process.env.PRIVY_SECRET_ID;
const BUNDLER_PAYMASTER_URL = process.env.BUNDLER_PAYMASTER_URL;
const RPC = process.env.RPC;
const auth = btoa(`${PRIVY_APP_ID}:${PRIVY_SECRET_ID}`);

myHeaders.append("privy-app-id", PRIVY_APP_ID as string);
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Basic ${auth}`);

export const getUserId = async (userName: string): Promise<{ sub: string; name: string } | undefined> => {
    const github_auth = `Bearer ${process.env.GITHUB_TOKEN}`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", github_auth);
    myHeaders.append("Content-Type", "application/json");
    try {
        const res = await fetch("https://api.github.com/users/" + userName, {
            headers: myHeaders,
        });
        const resText: any = JSON.parse(await res.text());
        if ("id" in resText) {
            return { sub: resText.id, name: resText.name };
        }
    } catch (error) {
        console.error(`Error getting user ID for ${userName}: `, error);
        throw error;
    }
};

export const getUserEmbeddedWalletAddress = async (userName: string) => {
    try {
        const userInfo = (await getUserId(userName)) as { sub: string; name: string };
        const sub = userInfo.sub;
        const name = userInfo.name;
        const raw = JSON.stringify({
            create_embedded_wallet: true,
            linked_accounts: [
                {
                    username: userName,
                    subject: sub.toString(),
                    name: name,
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
            const results = [];
            for (const account of resText["linked_accounts"]) {
                if (account.type === "wallet") {
                    const kernerl_account = await getKernelAccountClient(account.address);
                    // @ts-ignore
                    results.push({ embedded_address: account.address, smart_contract_address: kernerl_account });
                }
            }
            return results;
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
        // @ts-ignore
        const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
            signer: {
                address: address,
                type: "local",
                signMessage: async ({ message }) => {
                    console.log("sign message is being called");
                    return `0xabcd`;
                },
                signTypedData: async ({ message }) => {
                    console.log("sign typed data is being called");
                    return `0xabcd`;
                },
                publicKey: address,
                source: "custom",
            },
            entryPoint: ENTRYPOINT_ADDRESS_V07,
            kernelVersion: "0.3.0",
        });

        // Create a Kernel account from the ECDSA validator
        // @ts-ignore
        const account: KernelSmartAccount<ENTRYPOINT_ADDRESS_V07_TYPE> = await createKernelAccount(publicClient, {
            plugins: {
                sudo: ecdsaValidator,
            },
            entryPoint: ENTRYPOINT_ADDRESS_V07,
            kernelVersion: "0.3.0",
        });

        // console.log("kernel acount", account.address);
        return account.address;
    } catch (error) {
        console.error(`Error creating Kernel account for address ${address}: `, error);
        throw error;
    }
};
// @ts-ignore
export default async (req, res) => {
    const { username } = req.query;
    const data = await getUserEmbeddedWalletAddress(username);
    res.status(200).json(data);
};
