
// import {PrivyClient} from "@privy-io/server-auth"
// const privy = new PrivyClient( "clxzce5br008ld6b8qlrm5kjn" , "2L6LqQF3YyH55GFrEMsbfCowwBvvwa8ErRkfZnZjKw2Fwxdmbb4UjMDBhaZQvkXGbywPMjz57Y4akhc782Nuybtr");
// export default async function handler(req, res) {
//     if (req.method === 'GET') {
//       try {
//         const user = await privy.importUser({
//           linkedAccounts: [
//             {
//                 type: "github_oauth",
//                 subject: "0",
//                 username: "issa-me-sush",
//                 name: "sushthecoda", 
          
               
//             },
//           ],
//           createEmbeddedWallet: true,
//         });
//         res.status(200).json({ user });
//       } catch (error) {
//         console.log(error)
//         res.status(500).json({ error: 'Failed to pregenerate wallet' });
//       }
//     } else {
//       res.status(405).json({ error: 'Method not allowed' });
//     }
//   }