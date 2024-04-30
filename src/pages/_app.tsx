import "@/styles/globals.css";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";



import { WagmiConfig } from "wagmi";
import { configureChains, createConfig } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import {
	baseSepolia, base
} from "wagmi/chains";

import { createPublicClient, http, webSocket } from 'viem'

const chains = [
	process.env.NEXT_PUBLIC_CHAIN_ID == '84532' ? baseSepolia : base
];

// const wss_url = process.env.NEXT_PUBLIC_CHAINSTACK_WSS || "";
// let _transport;
// if (wss_url != "") {
// 	_transport = webSocket(wss_url);
// } else {
// 	_transport = http('https://sepolia.base.org')
// }

// const _publicClient = createPublicClient({ 
// 	chain: process.env.NEXT_PUBLIC_CHAIN_ID == '84532' ? baseSepolia : base,
// 	transport: _transport
//   })

// const { chains, publicClient } = configureChains(_chains, [_publicClient]);

// 1. Get projectID at https://cloud.walletconnect.com

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";


const metadata = {
	name: "Next Starter Template",
	description: "A Next.js starter template with Web3Modal v3 + Wagmi",
	url: "https://web3modal.com",
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

export default function App({ Component, pageProps }: AppProps) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);
	return (
		<>
			{ready ? (
				<WagmiConfig config={wagmiConfig}>
					<Component {...pageProps} />
				</WagmiConfig>
			) : null}
		</>
	);
}
