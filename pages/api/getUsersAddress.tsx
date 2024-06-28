const myHeaders = new Headers();
const PRIVY_APP_ID = process.env.PRIVY_APP_ID;
const PRIVY_SECRET_ID = process.env.PRIVY_SECRET_ID;

const auth = btoa(`${PRIVY_APP_ID}:${PRIVY_SECRET_ID}`);

myHeaders.append("privy-app-id", PRIVY_APP_ID as string);
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Basic ${auth}`);

export const getUserEmbeddedWalletAddress = async (email: string) => {
    const raw = JSON.stringify({
        create_embedded_wallet: true,
        linked_accounts: [
            {
                address: email,
                type: "email",
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
    console.log(resText["linked_accounts"]);

    if ("linked_accounts" in resText) {
        resText["linked_accounts"].forEach((account: any) => {
            if (account.type === "wallet") {
                console.log(account.address);
                return account.address;
            }
        });
    }
};
