const query = `query lastUpdatedRepos ($login: String!) {
    repositoryOwner(login: $login) {
      repositories(first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
        nodes {
          name        
          pushedAt
          updatedAt
          nameWithOwner
          isInOrganization
          owner {
            id
            login
            url
            avatarUrl
          }
          isPrivate
          description
          stargazerCount
        }
      }
    }
}`;

const url = "https://api.github.com/graphql";
const auth = `Bearer ${process.env.GITHUB_TOKEN}`;
const myHeaders = new Headers();
myHeaders.append("Authorization", auth);
myHeaders.append("Content-Type", "application/json");

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userName = req.query.username as string;
    const options = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ query: query, variables: { login: userName } }),
    };
    const response = await fetch(url, options);
    const resText: any = JSON.parse(await response.text());
    if ("data" in resText && "repositoryOwner" in resText["data"] && "repositories" in resText["data"]["repositoryOwner"]) {
        let orgs = resText["data"]["repositoryOwner"]["repositories"]["nodes"].filter((repo: any) => repo.isInOrganization);
        let customeData = orgs.map((repo: any) => {
            return {
                name: repo.name,
                org: repo.owner.login,
                description: repo.description,
                isPrivate: repo.isPrivate,
                updatedAt: repo.updatedAt,
                stars: repo.stargazerCount,
                avatar: repo.owner.avatarUrl,
            };
        });
        res.status(200).json(customeData);
    } else {
        res.status(400).json(resText);
    }
    return resText;
}
// @ts-ignore
