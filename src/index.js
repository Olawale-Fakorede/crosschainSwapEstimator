import { createApp } from "@deroll/app";
import { stringToHex, hexToString } from "viem";

const app = createApp({
    url: process.env.ROLLUP_HTTP_SERVER_URL || "http://127.0.0.1:5004",
});

app.addAdvanceHandler(async ({ metadata, payload }) => {
    const payloadString = hexToString(payload);
    const jsonPayload = JSON.parse(payloadString);

    const fromChain = jsonPayload.fromChain;
    const toChain = jsonPayload.toChain;
    const amount = parseFloat(jsonPayload.amount);

    // Assuming a helper function estimateCrossChainSwap exists
    const { fee, time } = await estimateCrossChainSwap(fromChain, toChain, amount);

    console.log(`Cross-Chain Swap Fee: ${fee} ETH, Estimated Time: ${time} minutes`);

    const reportPayload = stringToHex(`Fee: ${fee} ETH, Time: ${time} minutes`);
    await app.createReport({ payload: reportPayload });

    return "accept";
});

app.start().catch((e) => {
    console.error(e);
    process.exit(1);
});

