import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    message: string;
};

const myHeaders = new Headers();
myHeaders.append("content-type", "application/json");

const query = `
query Attestations ($attestor: String, $recipient: String) {
    attestations(take: 25, orderBy: {time: desc}, where: {recipient: $recipient, attester: $attestor}) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
    }
  }`;

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const graphql = JSON.stringify({
        query: query,
        variables: {},
    });

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
        redirect: "follow",
    };

    fetch("https://easscan.org/graphql", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

    res.status(200).json({ message: "Hello from Next.js!" });
}
