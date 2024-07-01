import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { schema, schemaId } from "../../constants/constants";

type ResponseData = {
    message: string;
    data?: any;
};

const myHeaders = new Headers();
myHeaders.append("content-type", "application/json");

const query = `
query Attestations($where: AttestationWhereInput)  {
    attestations(take: 25, orderBy: {time: desc}, where: $where) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
      schemaId
    }
  }`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const { recipient } = req.query;

    if (!recipient) {
        res.status(400).json({ message: "Missing attestor or recipient in the request." });
        return;
    }

    const graphql = JSON.stringify({
        query: query,
        variables: {
            where: {
                recipient: {
                    equals: recipient,
                },
                schemaId: {
                    equals: schemaId,
                },
            },
        },
    });

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
        redirect: "follow",
    };

    try {
        const response = await fetch("https://base-sepolia.easscan.org/graphql", requestOptions);
        console.log(response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        if ("data" in result && "attestations" in result["data"]) {
            result["data"]["attestations"] = result["data"]["attestations"].map((attestation: any) => {
                attestation.decodedData = decodeData(attestation.data);
                return attestation;
            });
        }

        res.status(200).json({ message: "Data fetched successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching data." });
    }
}

const decodeData = (data: string) => {
    const encoder = new SchemaEncoder(schema);
    console.log(encoder.decodeData(data));
    const decodedData: any = encoder.decodeData(data);

    return {
        github_url: decodedData[0]["value"].value,
        maintainer_github_id: decodedData[1]["value"].value,
        remark: decodedData[2]["value"].value,
        contributor_github_id: decodedData[3]["value"].value,
    };
};

/*
    const decodedData = [
  {
    name: 'github_url',
    type: 'string',
    signature: 'string github_url',
    value: { name: 'github_url', type: 'string', value: 'tset' }
  },
  {
    name: 'maintainer_github_id',
    type: 'string',
    signature: 'string maintainer_github_id',
    value: { name: 'maintainer_github_id', type: 'string', value: 'test' }
  },
  {
    name: 'remark',
    type: 'string',
    signature: 'string remark',
    value: { name: 'remark', type: 'string', value: 'test' }
  },
  {
    name: 'contributor_github_id',
    type: 'string',
    signature: 'string contributor_github_id',
    value: { name: 'contributor_github_id', type: 'string', value: 'test' }
  }
]*/
