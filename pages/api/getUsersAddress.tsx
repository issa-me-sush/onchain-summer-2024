import { createKernelAccount } from "@zerodev/sdk";

const myHeaders = new Headers();
const PRIVY_APP_ID = process.env.PRIVY_APP_ID;
const PRIVY_SECRET_ID = process.env.PRIVY_SECRET_ID;

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
            resText["linked_accounts"].forEach((account: any) => {
                if (account.type === "wallet") {
                    return account.address;
                }
            });
        }
    } catch (error) {
        console.error(`Error getting wallet address for ${userName}: `, error);
        throw error;
    }
};
