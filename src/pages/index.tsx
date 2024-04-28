import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useContractRead, useAccount, useContractWrite } from 'wagmi'
import { formatEther } from "viem";
import { useState, useEffect } from "react";

import { ElijahMint } from "@/components/ElijahMint";

import {elijahNFTAddress, elijahNFTABI, elijahERC20Address, erc20ABI} from "@/web3/config"


export default function Home() {
	const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
		useState(false);
	const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

	const [amount, setAmount] = useState(1);
	

	const { address } = useAccount();


	const [ethPrice, setEthPrice] = useState<bigint>(BigInt(0));
	const [elijahPrice, setElijahPrice] = useState<bigint>(BigInt(0));

	const { data:mintable, isError:mintableError, isLoading:mintableLoading, refetch:refetchMintable } = useContractRead({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'checkMintable',
		args: [address]
	  })
	const {data: priceForAddress, isError:priceForAddressError, isLoading:priceForAddressLoading, refetch:refetchPriceForAddress} = useContractRead({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'pricesFor',
		args: [address]
	})
	const { data: balance, isError:balanceError, isLoading:balanceLoading, refetch:refetchBalance } = useContractRead({
		address: elijahERC20Address,
		abi: erc20ABI,
		functionName: 'balanceOf',
		args: [address]
	  })
	  const { data:mintStage, isError:mintStageError, isLoading:mintStageLoading, refetch:refetchMintStage } = useContractRead({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'MINT_STAGE'
	  })
	  const { data: isAllowed, isError:isAllowedError, isLoading:isAllowedLoading, refetch:refetchIsAllowed } = useContractRead({
		address: elijahERC20Address,
		abi: erc20ABI,
		functionName: 'allowance',
		args: [address, elijahNFTAddress]
	  })
	
	  const { data:minted, isError:mintedError, isLoading:mintedLoading, write:mint} = useContractWrite({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'mint',
		args: [amount],
		value: BigInt(amount) * ethPrice
	  })

	  const { data:mintedWithElijah, isError:mintedWithElijahError, isLoading:mintedWithElijahLoading, write:mintWithElijah} = useContractWrite({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'mintWithElijah',
		args: [amount]
	  })

	  const { data:mintedFree, isError:mintedFreeError, isLoading:mintedFreeLoading, write:mintFree} = useContractWrite({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'freeMint',
		// args: [address]
	  })

	  const { data: approvedTx, isError:approveError, isLoading:approveLoading, write:approve} = useContractWrite({
		address: elijahERC20Address,
		abi: erc20ABI,
		functionName: 'approve',
		args: [elijahNFTAddress, BigInt(amount) * elijahPrice]
	  })

	  const [mintStageUpdate, setMintStageUpdate] = useState<bigint>(BigInt(1));

	  const { data: updatedMintStageTo0, isError:updatedMintStage0Error, isLoading:updatedMintStage0Loading, write:updateMintStageTo0} = useContractWrite({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'updateMintStageTESTNET',
		args: [BigInt(0)]
	  })

	  const { data: updatedMintStageTo1, isError:updatedMintStage1Error, isLoading:updatedMintStage1Loading, write:updateMintStageTo1} = useContractWrite({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'updateMintStageTESTNET',
		args: [BigInt(1)]
	  })

	  const { data: updatedMintStageTo2, isError:updatedMintStage2Error, isLoading:updatedMintStage2Loading, write:updateMintStageTo2} = useContractWrite({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'updateMintStageTESTNET',
		args: [BigInt(2)]
	  })

	  const refreshAll = () => {
		refetchMintable();
		refetchBalance();
		refetchMintStage();
		refetchIsAllowed();
		refetchPriceForAddress();
		if(minted) {
			setTxHash(minted.hash);
		}
		if(mintedWithElijah) {
			setTxHash(mintedWithElijah.hash);
		}
		if(mintedFree) {
			setTxHash(mintedFree.hash);
		}
		if(updatedMintStageTo0) {
			setTxHash(updatedMintStageTo0.hash);
		}
		if(updatedMintStageTo1) {
			setTxHash(updatedMintStageTo1.hash);
		}
		if(updatedMintStageTo2) {
			setTxHash(updatedMintStageTo2.hash);
		}
		if(approvedTx) {
			setTxHash(approvedTx.hash);
		}
	  }

	  const [ txHash, setTxHash ] = useState<string>("");



	  useEffect(refreshAll, [approvedTx, minted, mintedWithElijah, mintedFree, updatedMintStageTo0, updatedMintStageTo1, updatedMintStageTo2]);


	  useEffect(() => {
		if (priceForAddress && typeof(priceForAddress) === 'object') {
			setEthPrice((priceForAddress as Array<bigint>)[0]);
			setElijahPrice((priceForAddress as Array<bigint>)[1]);
		}
		refetchPriceForAddress();
	  }, [priceForAddress]);

	  const [invert, setInvert] = useState(false);

	const closeAll = () => {
		setIsNetworkSwitchHighlighted(false);
		setIsConnectHighlighted(false);
	};
	return (
		<>
			<Head>
				<title>mint elijah nft</title>
				<meta
					name="description"
					content="Generated by create-wc-dapp"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
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
			<ElijahMint invert={invert} setInvert={setInvert} />
			{process.env.NEXT_PUBLIC_CHAIN_ID == "84532" && (
				<div className={styles.wrapper+ ' mt-[1024px]'}>
					<div className={styles.container }>
						<h1>Mint Elijah</h1>
						<div className={styles.content}>
							<div>ELIJAH Balance: {((balance || 0) as bigint).toString()}</div>
							<div>Mint Stage: {((mintStage || 0) as bigint).toString()}</div>
							<div>Can Mint? {((mintable || false) as boolean).toString()}</div>
							<div>ELJAH Approved? {((isAllowed || 0) as bigint).toString()}</div>
							<div>ETH Price: {formatEther(ethPrice as bigint)}</div>
							<div>ELIJAH Price: {(elijahPrice as bigint).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
							
							

							

							{!!(mintStage === 1 && mintable) && (
								<div>
									<button onClick={() => mintFree()}>Mint 3 Free NFTs</button>
								</div>
							)}
							{!!(mintStage === 2 && mintable) && (
								<>
								<input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
								{(((isAllowed || 0) as bigint) < elijahPrice * BigInt(amount)) ? (
									<div>
										<button onClick={() => approve()}>Approve ELIJAH</button>
									</div>
								): (
									<div>
									<button onClick={() => mintWithElijah()}>Mint with {(elijahPrice * BigInt(amount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ELIJAH</button>
									</div>
									
								)}
								<div>
									<button onClick={() => mint()}>Mint with {formatEther(ethPrice * BigInt(amount))} ETH</button>
								</div>
								
								</>
							)}
							{txHash !== "" && (
								<div><a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank">View Transaction</a></div>
							)}
							

							<h2 style={{marginTop: '40px'}}>Testnet Helpers</h2>
							<div><button onClick={() => updateMintStageTo0()}>Update to CLOSED Stage</button></div>
							<div><button onClick={() => updateMintStageTo1()}>Update to FREE Stage</button></div>
							<div><button onClick={() => updateMintStageTo2()}>Update to PAYABLE Stage</button></div>


							{/* <ul>
								<li>
									Edit <code>pages/index.tsx</code> and save
									to reload.
								</li>
								<li>
									Click{" "}
									<span
										onClick={() => {
											setIsConnectHighlighted(
												!isConnectHighlighted
											);
											setIsNetworkSwitchHighlighted(
												false
											);
										}}
										className={styles.button}
									>
										Connect Wallet
									</span>{" "}
									to connect to a WalletConnect v2.0
									compatible wallet.
								</li>
								<li>
									Click{" "}
									<span
										onClick={() => {
											setIsNetworkSwitchHighlighted(
												!isNetworkSwitchHighlighted
											);
											setIsConnectHighlighted(false);
										}}
										className={styles.button}
									>
										Select Network
									</span>{" "}
									to change networks.
								</li>
							</ul> */}
						</div>
					</div>
					{/* <div className={styles.footer}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							height={16}
							width={16}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
							/>
						</svg>
						<a
							href="https://docs.walletconnect.com/web3modal/react/about?utm_source=next-starter-template&utm_medium=github&utm_campaign=next-starter-template"
							target="_blank"
						>
							Check out the full documentation here
						</a>
					</div> */}
				</div>
			)}
				
			</main>
		</>
	);
}
