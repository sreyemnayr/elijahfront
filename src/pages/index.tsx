import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useContractRead, useAccount, useContractWrite } from 'wagmi'
import { formatEther } from "viem";
import { useState, useEffect } from "react";

import { ElijahMint, Face } from "@/components/ElijahMint";

import {elijahNFTAddress, elijahNFTABI, elijahERC20Address, erc20ABI} from "@/web3/config"


export default function Home() {
	

	  const [invert, setInvert] = useState(false);

	
	return (
		<>
			<Head>
				<title>mint elijah nft</title>
				<meta
					name="description"
					content="elijah wheel nft"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
				<meta name="msapplication-TileColor" content="#da532c" />
				<meta name="theme-color" content="#ffffff" />
			</Head>
			{/* <header>
				<div
					className={styles.backdrop}
					style={{
						opacity:
							isConnectHighlighted || isNetworkSwitchHighlighted
								? 1
								: 0,
					}}
				/>
				<div className={styles.header}>
					<div className={styles.logo}>
						ELIJAH TEST
					</div>
					<div className={styles.buttons}>
						<div
							onClick={closeAll}
							className={`${styles.highlight} ${
								isNetworkSwitchHighlighted
									? styles.highlightSelected
									: ``
							}`}
						>
							<w3m-network-button />
						</div>
						<div
							onClick={closeAll}
							className={`${styles.highlight} ${
								isConnectHighlighted
									? styles.highlightSelected
									: ``
							}`}
						>
							<w3m-button />
						</div>
					</div>
				</div>
			</header> */}
			<div>
					
				</div>
			<main className={`${styles.main} ${invert ? "bg-white" : "bg-black"}`}>
			{/* <ElijahMint invert={invert} setInvert={setInvert} /> */}
			<Face invert={invert} green={true} />
			
				
			</main>
		</>
	);
}
