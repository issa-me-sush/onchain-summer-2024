import { useEffect, useState } from "react";
import { EAS, Offchain, SchemaEncoder, SchemaRegistry, TransactionSigner, getSchemaUID } from "@ethereum-attestation-service/eas-sdk";
import { SmartAccountSigner } from "permissionless/accounts";
import { SmartAccountClient } from "permissionless";
import { ENTRYPOINT_ADDRESS_V07_TYPE } from "permissionless/types/entrypoint";
import { KernelAccountClient } from "@zerodev/sdk";
import { baseSepolia } from "viem/chains";
import { easAbi } from "./easAbi";
import { decodeErrorResult } from "viem";

const schemaRegistryContractAddress = "0x4200000000000000000000000000000000000020"; // base sepolia
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
const schema = "uint256 eventId, uint8 voteIndex";
const resolverAddress = "0x4200000000000000000000000000000000000020"; // base sepolia
const eas = "0x4200000000000000000000000000000000000021" as `0x${string}`;
const revocable = true;

const useEas = () => {
    const [accountClient, setAccountClient] = useState<null | KernelAccountClient<ENTRYPOINT_ADDRESS_V07_TYPE>>(null);
    useEffect(() => {
        const attest = async () => {
            console.log("account client", accountClient);
            await attestSchema();
        };
        attest();
    }, [accountClient]);
    const attestSchema = async () => {
        console.log("hereeeeee");
        let schema = "uint256 score";
        // let schemaEncoded =
        const schemaEncoder = new SchemaEncoder(schema);
        const schemaUID = getSchemaUID(schema, "0x0000000000000000000000000000000000000000", true) as `0x${string}`;
        console.log("schemaUID", schemaUID);
        const data = schemaEncoder.encodeData([{ name: "score", value: 100, type: "uint256" }]) as `0x${string}`;
        console.log("accClinet", accountClient);
        if (!accountClient) {
            console.error("Account client not found");
            return;
        }
        console.log("accountClient", accountClient.account);
        console.log(
            "decoding",
            decodeErrorResult({
                abi: easAbi,
                data: "0x08e8b937",
            })
        );
        try {
            const tx = await accountClient.writeContract({
                account: accountClient.account ? accountClient.account : "0x",
                address: eas,
                chain: baseSepolia,
                abi: easAbi,
                functionName: "attest",
                args: [
                    {
                        schema: schemaUID,
                        data: {
                            recipient: "0xe95C4707Ecf588dfd8ab3b253e00f45339aC3054",
                            expirationTime: BigInt("1719777755218"),
                            revocable: true,
                            refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                            data: data,
                            value: BigInt("0"),
                        },
                    },
                ],
            });

            console.log("Transaction successful, tx:", tx);
        } catch (error) {
            console.error("An error occurred while writing the contract:", error);
        }
    };
    return { attestSchema, setAccountClient, accountClient };
};

export default useEas;
