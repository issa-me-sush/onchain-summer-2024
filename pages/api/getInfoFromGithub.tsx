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
          }
          isPrivate
          description
        }
      }
    }
}`;

const url = "https://api.github.com/graphql";
const auth = `Bearer ${process.env.GITHUB_TOKEN}`;
const myHeaders = new Headers();
myHeaders.append("Authorization", auth);
myHeaders.append("Content-Type", "application/json");

const options = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({ query: query, variables: { login: "lazycoder1" } }),
};

export const getInfoFromGithub = async () => {
    console.log("running github");
    const res = await fetch(url, options);
    const resText: any = JSON.parse(await res.text());
    if ("data" in resText && "repositoryOwner" in resText["data"] && "repositories" in resText["data"]["repositoryOwner"]) {
        // console.log(resText["data"]["repositoryOwner"]["repositories"]["nodes"]);
        let orgs = resText["data"]["repositoryOwner"]["repositories"]["nodes"].filter((repo: any) => repo.isInOrganization);
        let customeData = orgs.map((repo: any) => {
            return {
                name: repo.name,
                org: repo.owner.login,
                description: repo.description,
                isPrivate: repo.isPrivate,
                updatedAt: repo.updatedAt,
            };
        });
        return customeData;
    }
    return resText;
};
