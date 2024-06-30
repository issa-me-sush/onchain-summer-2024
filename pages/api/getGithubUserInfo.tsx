import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        const response = await getUserId(username as string);
        if (!response) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching user data" });
    }
}

const getUserId = async (userName: string): Promise<{ sub: string; name: string } | undefined> => {
    const github_auth = `Bearer ${process.env.GITHUB_TOKEN}`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", github_auth);
    myHeaders.append("Content-Type", "application/json");
    try {
        const res = await fetch("https://api.github.com/users/" + userName, {
            headers: myHeaders,
        });
        const resText: any = JSON.parse(await res.text());
        return resText;
    } catch (error) {
        console.error(`Error getting user ID for ${userName}: `, error);
        throw error;
    }
};
