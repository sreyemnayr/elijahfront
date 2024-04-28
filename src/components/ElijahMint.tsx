import { useState, useEffect } from "react";

import { useAccount, useContractRead, useContractWrite, useNetwork, useSwitchNetwork } from "wagmi";
import { useWeb3Modal } from '@web3modal/wagmi/react'

import {elijahNFTAddress, elijahNFTABI, elijahERC20Address, erc20ABI} from "@/web3/config"

import { formatEther } from "viem";

/* Face OFF */

/* position: absolute;
width: 680.31px;
height: 907.09px;
left: calc(50% - 680.31px/2 + 0.16px);
top: calc(50% - 907.09px/2 - 0.45px); */

const cached_styles = [
  "text-black",
  "text-white",
  "bg-black",
  "bg-white",
]

interface Invertable {
  invert: boolean
  setInvert: (invert: boolean) => void
}

// default parameters
const defaultInvertable: Invertable = {
  invert: false,
  setInvert: () => {}
};

interface FaceProps {
  invert: boolean,
  green: boolean,
}

const defaultFace: FaceProps = {
  invert: false,
  green: false,
}


export const ElijahMint = ({invert, setInvert} = defaultInvertable) => {

  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
		useState(false);
	const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

	const [amount, setAmount] = useState(1);

  const { open: openWalletSelector } = useWeb3Modal();
	

	const { address, isConnected, connector } = useAccount();

  const { chain } = useNetwork()
    const { chains, error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork()

    useEffect(() => {
        console.log(chain, chain?.id, switchNetwork, process.env.NEXT_PUBLIC_CHAIN_ID)
        if (chain && chain?.id !== parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532')) {
            console.log("Switch network")
            switchNetwork?.(parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532'))
        }
    }, [chain, switchNetwork])


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
	
	  const { data:minted, isError:mintedError, isLoading:mintedLoading, isSuccess: mintedSuccess, isIdle: mintedIdle, write:mint} = useContractWrite({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'mint',
		args: [amount],
		value: BigInt(amount) * ethPrice
	  })

	  const { data:mintedWithElijah, isError:mintedWithElijahError, isSuccess: mintedWithElijahSuccess, isIdle: mintedWithElijahIdle, isLoading:mintedWithElijahLoading, write:mintWithElijah} = useContractWrite({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'mintWithElijah',
		args: [amount]
	  })

	  const { data:mintedFree, isError:mintedFreeError, isSuccess: mintedFreeSuccess, isIdle: mintedFreeIdle, isLoading:mintedFreeLoading, write:mintFree} = useContractWrite({
		address: elijahNFTAddress,
		abi: elijahNFTABI,
		functionName: 'freeMint',
		// args: [address]
	  })

	  const { data: approvedTx, isError:approveError, isSuccess: approveSuccess, isIdle: approveIdle, isLoading:approveLoading, write:approve} = useContractWrite({
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



	  useEffect(refreshAll, [approvedTx, approveSuccess, minted, mintedWithElijah, mintedFree, updatedMintStageTo0, updatedMintStageTo1, updatedMintStageTo2]);

    useEffect(()=>{
      refreshAll();
      if(mintedSuccess || mintedWithElijahSuccess || mintedFreeSuccess) {
        setInvert(true);
      } else {
        setInvert(false);
      }
    }, [mintedSuccess, mintedWithElijahSuccess, mintedFreeSuccess]);

	  useEffect(() => {
		if (priceForAddress && typeof(priceForAddress) === 'object') {
			setEthPrice((priceForAddress as Array<bigint>)[0]);
			setElijahPrice((priceForAddress as Array<bigint>)[1]);
		}
		refetchPriceForAddress();
	  }, [priceForAddress]);

  const [whichCurrency, setWhichCurrency] = useState("elijah");
  
  return (
  <div className="select-none absolute w-[680.31px] h-[907.09px] left-[calc(50%-680.31px/2+0.16px)] top-[calc(50%-907.09px/2-0.45px)]">
    <Face invert={invert} green={mintedLoading || mintedWithElijahLoading || mintedFreeLoading || approveLoading || mintedSuccess || mintedWithElijahSuccess || mintedFreeSuccess } />
    <LowerLinksSection  />
    <div className={`absolute w-[252px] h-[17px] left-[220px] top-[742px] text-center font-mono text-[15px] leading-[17px] ${invert ? "text-white" : "text-black"}`}>
      <div>{mintable ? (<span>grats! you can mint {mintStage == 1 ? 'for free' : `for ${(elijahPrice * BigInt(amount) / BigInt(1_000_000)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}mln $elijah / ${formatEther(ethPrice)} eth`}</span>) : isConnected ? (<span>you can't mint just yet.</span>) : (<span>connect your wallet to mint</span>)}</div>
      {isConnected && (((isAllowed || 0) as bigint) < elijahPrice * BigInt(amount)) && whichCurrency == 'elijah' ? (<div>you need to approve the smart contract to spend your $elijah</div>) : (<div></div>)}
      {txHash !== "" && (
								<span><a href={`https://sepolia.basescan.org/tx/${txHash}`} className={`${invert ? 'text-black' : 'text-[#00D509]'} underline`} target="_blank">view tx</a></span>
							)}
    </div>
    
    {/* ELIJAH */}
    <div className="absolute w-[312px] h-[127px] left-[190px] top-[176px]" >
    <div onClick={() => setWhichCurrency('elijah')} className={`cursor-pointer absolute w-[87px] h-[20px] left-[54px] top-0 ${invert ? "text-white" : "text-black"}`}>
    <div className={`absolute flex flex-row justify-center items-center w-[84px] h-[17px] left-0 top-[2px] text-center font-mono ${whichCurrency == 'elijah' ? 'font-bold' : ''} text-[15px] leading-[17px]`}>
    <span className="mr-[10px]">elijah</span> <span className={`h-[17px] w-[17px] border-4 rounded-full inline-block ${invert ? (whichCurrency == 'elijah' ? 'bg-white border-white' : 'bg-black border-black') : ((whichCurrency == 'elijah' ? 'bg-black border-black' : 'bg-white border-black'))}`}></span>
  </div>
  </div>

    {/* ETH */}
    <div className={`absolute w-[87px] h-[20px] left-[164px] top-0 ${invert ? "text-white" : "text-black"}`} >
      <div onClick={() => {setWhichCurrency('eth')}} className={`cursor-pointer absolute w-[84px] h-[17px] left-[27px] top-[2px] text-left font-mono ${whichCurrency == 'eth' ? 'font-bold' : ''} text-[15px] leading-[17px] `}>
        <span  className={`h-[17px] w-[17px] border-4 rounded-full inline-block ${invert ? (whichCurrency == 'eth' ? 'bg-white border-white' : 'bg-black border-white') : ((whichCurrency == 'eth' ? 'bg-black border-black' : 'bg-white border-black'))}`}></span>
        <span className={`ml-[10px]`}>eth</span>
      </div>  
    </div>
    <div onClick={() => {setAmount(amount + 1)}} className={`cursor-pointer absolute w-[36px] h-[64px] left-[276px] top-[37px] text-center font-ultra font-normal text-[50px] leading-[64px] ${invert ? "text-white" : "text-black"}`}>+</div>
      <div className={`box-border absolute w-[228px] h-[62px] left-[38px] top-[37px] border-2 ${invert ? "border-white" : "border-black"} text-center font-ultra text-[50px] leading-[64px] ${invert ? "text-white" : "text-black"}`}>
    {amount}
  </div>
  <div onClick={() => {setAmount(amount - 1)}} className={`cursor-pointer select-none absolute w-[21px] h-[64px] left-0 top-[35px] text-center font-ultra font-normal text-[50px] leading-[64px] ${invert ? "text-white" : "text-black"}`}>-</div>
    <div className={`absolute w-[207px] h-[17px] left-[53px] top-[110px] text-center font-mono font-normal text-[15px] leading-[17px] ${invert ? "text-white" : "text-black"}`}>
      total = { whichCurrency == 'elijah' ? `${(elijahPrice * BigInt(amount) / BigInt(1_000_000)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}mln $elijah` : `${formatEther(ethPrice * BigInt(amount))} ETH` }
    </div>
    </div>

    
    
    
    <div className="absolute w-[387px] h-[163.07px] left-[102px] top-[361px]">
    <Twitter />
    <Telegram />
    <div onClick={()=>openWalletSelector()} className="absolute w-[226px] h-[17px] left-0 top-[96px] text-center font-mono text-[15px] leading-[17px] text-[#0029FF]">
    {isConnected ? "manage" : "connect"} wallet
  </div>
    <SwapToElijah />
  </div>

    {isConnected && (
      <div onClick={()=>{
        if(mintStage == 1){
          mintFree();
        }
        if(whichCurrency == 'elijah'){
          if(((isAllowed || 0) as bigint) >= elijahPrice * BigInt(amount)){
            mintWithElijah();
          } else {
            approve();
          }
        }
        if(whichCurrency == 'eth'){
          mint();
        }
      }} onMouseEnter={() => setInvert(true)} onMouseLeave={() => setInvert(false)} className="cursor-pointer focus:bg-[#00D509] flex flex-row justify-center items-center p-[15px_30px] gap-2.5 absolute w-[229px] h-[94px] left-[calc(50%-229px/2+0.35px)] top-[631px] bg-[#0029FF] text-center font-ultra text-[50px] leading-[64px] text-white">
      { mintable ? (((isAllowed || 0) as bigint) >= elijahPrice * BigInt(amount)) || whichCurrency == 'eth' ? "MINT" : "ALLOW" : "WAIT" }
      </div>
    )}
    
    
    
  </div>
  );
  }


/* FACE */

// position: absolute;
// width: 611.66px;
// height: 840.22px;
// left: 35px;
// top: 36px;

const Face = ({invert, green} = defaultFace) => (
  <div className="absolute w-[611.66px] h-[840.22px] left-[35px] top-[36px]">
    <svg width="612" height="841" viewBox="0 0 612 841" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M600.695 424.67L600.405 424.04L600.195 423.38C595.914 409.53 593.735 388.05 590.975 360.85C586.035 312.18 579.275 245.53 555.635 190.71C545.734 167.75 516.885 109.14 462.865 60.8C417.735 20.41 369.415 0 319.015 0C314.155 0 309.275 0.19 304.385 0.57C227.655 6.52 171.815 47.46 138.485 80.76C97.7845 121.42 65.9945 175.2 51.2645 228.31C34.1045 290.2 22.0545 363.03 16.2745 398.04C14.4945 408.82 13.3145 415.95 12.5845 419.24L12.3245 420.39L11.8345 421.46C-5.40547 458.94 -3.59547 531.22 15.8645 582.6C25.5245 608.09 38.5245 625.47 52.4745 631.55L56.7145 633.4L58.3445 637.75C74.2545 680.1 110.855 730.48 153.845 769.23C204.635 815.01 259.245 840.22 307.595 840.22C369.525 840.22 425.565 797.43 461.675 761.53C504.525 718.93 537.435 668.4 551.035 637.22L552.545 633.75L555.855 631.96C569.595 624.52 590.125 594.88 602.725 547.38C615.315 499.99 614.565 455.27 600.695 424.67ZM345.595 518.45C356.425 518.45 364.315 526.68 364.145 537.8C364.765 547.02 356.495 556.24 345.515 556.24C334.585 556.23 326.325 546.75 326.695 536.87C327.075 526.48 335.185 518.45 345.595 518.45ZM246.335 536.94C246.815 526.51 254.735 518.46 265.165 518.45C275.755 518.44 284.655 527.3 284.125 537.73C283.515 549.66 274.375 556.49 265.205 556.15C253.225 556.52 245.925 545.76 246.335 536.94ZM183.035 405.87C172.035 405.9 164.375 397.23 164.325 387.26C164.265 374.25 175.225 367.77 183.385 368.09C194.165 368.52 202.345 376.76 202.025 387.61C201.735 398.11 193.555 405.97 183.035 405.87ZM321.345 685.75C321.065 685.72 320.785 685.75 320.505 685.75C315.475 685.75 310.445 685.75 305.415 685.75C305.415 685.72 305.415 685.69 305.415 685.65C298.985 685.65 292.555 685.84 286.145 685.59C281.195 685.4 277.875 682.55 276.155 677.9C274.535 673.53 275.505 669.56 278.405 666.11C280.915 663.13 284.285 662.11 288.145 662.15C297.365 662.24 306.585 662.17 315.805 662.17C317.765 662.17 319.745 662.38 321.665 662.14C329.565 661.16 335.215 667.64 335.325 673.7C335.425 679.45 330.725 686.66 321.345 685.75ZM378.745 641.4C376.555 641.75 374.285 641.6 372.055 641.6C349.985 641.61 327.915 641.61 305.845 641.61C283.495 641.61 261.145 641.61 238.795 641.6C236.565 641.6 234.295 641.75 232.105 641.41C226.215 640.51 222.505 635.7 222.625 629.45C222.735 623.72 226.495 619.14 232.015 618.26C233.925 617.95 235.915 618.05 237.865 618.05C282.845 618.04 327.825 618.04 372.805 618.05C374.755 618.05 376.745 617.94 378.655 618.24C384.095 619.09 388.085 623.8 388.295 629.36C388.525 635.32 384.545 640.47 378.745 641.4ZM427.505 405.9C416.435 406.02 407.955 396.41 408.905 386.57C408.205 377.15 417.435 367.79 427.555 368.11C438.385 368.45 446.495 376.53 446.285 387.46C446.085 398 438.025 405.79 427.505 405.9Z" fill={green ? "#00D509" : invert ? "black" : "white"} />
    </svg>
  </div>
);


/* Selector White */

// position: absolute;
// width: 312px;
// height: 127px;
// left: 190px;
// top: 176px;


// /* Input */

// box-sizing: border-box;

// position: absolute;
// width: 228px;
// height: 62px;
// left: 38px;
// top: 37px;

// border: 2px solid #FFFFFF;

// font-family: 'Ultra';
// font-style: normal;
// font-weight: 400;
// font-size: 50px;
// line-height: 64px;
// text-align: center;

// color: #FFFFFF;

/* 10 */

// position: absolute;
// left: 38.78%;
// right: 41.03%;
// top: 28.35%;
// bottom: 21.26%;





/* Total */

// position: absolute;
// width: 207px;
// height: 17px;
// left: 53px;
// top: 110px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */
// text-align: center;

// color: #FFFFFF;


/* Plus */

// position: absolute;
// width: 36px;
// height: 64px;
// left: 276px;
// top: 37px;

// font-family: 'Ultra';
// font-style: normal;
// font-weight: 400;
// font-size: 50px;
// line-height: 64px;

// color: #FFFFFF;


/* Minus */

// position: absolute;
// width: 21px;
// height: 64px;
// left: 0px;
// top: 35px;

// font-family: 'Ultra';
// font-style: normal;
// font-weight: 400;
// font-size: 50px;
// line-height: 64px;

// color: #FFFFFF;




/* Button EE */

// position: absolute;
// width: 87px;
// height: 20px;
// left: 54px;
// top: 0px;




/* elijah */

// position: absolute;
// width: 54px;
// height: 17px;
// left: 0px;
// top: 2px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 700;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */
// text-align: center;

// color: #FFFFFF;



/* Radio */

// box-sizing: border-box;

// position: absolute;
// width: 20px;
// height: 20px;
// left: 67px;
// top: 0px;

// background: #FFFFFF;
// border: 4px solid #FFFFFF;


/* Button E */

// position: absolute;
// width: 54px;
// height: 20px;
// left: 164px;
// top: 0px;



/* eth */

// position: absolute;
// width: 27px;
// height: 17px;
// left: 27px;
// top: 2px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */
// text-align: center;

// color: #FFFFFF;


/* Radio */

// box-sizing: border-box;

// position: absolute;
// width: 20px;
// height: 20px;
// left: 0px;
// top: 0px;

// border: 4px solid #FFFFFF;


// /* Links 2 */

// position: absolute;
// width: 589.86px;
// height: 648.09px;
// left: 46px;
// top: 208px;



// /* opensea */

// position: absolute;
// width: 63px;
// height: 17px;
// left: 534.19px;
// top: 0px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */
// text-align: center;

// color: #FF00A8;

// transform: rotate(72.21deg);


// /* blur */

// position: absolute;
// width: 36px;
// height: 17px;
// left: 48px;
// top: 50.36px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */
// text-align: center;

// color: #FF00A8;

// transform: rotate(-67.93deg);


// /* wheelpaper */

// position: absolute;
// width: 90px;
// height: 17px;
// left: 252px;
// top: 631.09px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */
// text-align: center;

// color: #FF00A8;

// transform: rotate(-0.06deg);


// /* dexscreen */

// position: absolute;
// width: 81px;
// height: 17px;
// left: 545px;
// top: 409.64px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */
// text-align: center;

// color: #FF00A8;

// transform: rotate(-69.03deg);


// /* dextools */

// position: absolute;
// width: 72px;
// height: 17px;
// left: 21.58px;
// top: 427.79px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */
// text-align: center;

// color: #FF00A8;

// transform: rotate(-107.44deg);


// /* basescan */

// position: absolute;
// width: 72px;
// height: 17px;
// left: 272.14px;
// top: -161px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */
// text-align: center;

// color: #FF00A8;

// transform: rotate(0.48deg);

const LowerLinksSection = () => (
  <div className="absolute w-[589.86px] h-[648.09px] left-[28px] top-[208px]">
    <Opensea />
    <Blur />
    <Wheelpaper />
    <Dexscreen />
    <Dextools />
    <Basescan />
  </div>
);

const Opensea = () => (
  <a href="https://opensea.io/collection/elijah-mint" target="_blank" className="absolute w-[63px] h-[17px] left-[528px] top-[48px] text-center font-mono text-[15px] leading-[17px] text-[#FF00A8] rotate-[72.21deg]">
    opensea
  </a>
);

const Blur = () => (
  <div className="absolute w-[36px] h-[17px] left-[52px] top-[50.36px] text-center font-mono text-[15px] leading-[17px] text-[#FF00A8] rotate-[-67.93deg]">
    blur
  </div>
);

const Wheelpaper = () => (
  <div className="absolute w-[90px] h-[17px] left-[272px] top-[631.09px] text-center font-mono text-[15px] leading-[17px] text-[#FF00A8] rotate-[-0.06deg]">
    wheelpaper
  </div>
);

const Dexscreen = () => (
  <div className="absolute w-[81px] h-[17px] left-[548px] top-[390px] text-center font-mono text-[15px] leading-[17px] text-[#FF00A8] rotate-[-69.03deg]">
    dexscreen
  </div>
);

const Dextools = () => (
  <div className="absolute w-[72px] h-[17px] left-[-4px] top-[390px] text-center font-mono text-[15px] leading-[17px] text-[#FF00A8] rotate-[-107.44deg]">
    dextools
  </div>
);

const Basescan = () => (
  <div className="absolute w-[72px] h-[17px] left-[280px] top-[-161px] text-center font-mono text-[15px] leading-[17px] text-[#FF00A8] rotate-[0.48deg]">
    basescan
  </div>
);


// /* Links */

// position: absolute;
// width: 387px;
// height: 163.07px;
// left: 148px;
// top: 361px;



// /* twitter */

// position: absolute;
// width: 63px;
// height: 17px;
// left: 186.57px;
// top: 63.41px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */
// text-align: center;

// color: #FF00A8;

// transform: rotate(-91.43deg);


// /* telegram */

// position: absolute;
// width: 72px;
// height: 17px;
// left: 185.3px;
// top: 163.07px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */
// text-align: center;

// color: #FF00A8;

// transform: rotate(-90.24deg);


// /* connect wallet */

// position: absolute;
// width: 126px;
// height: 17px;
// left: 0px;
// top: 96px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */

// color: #0029FF;



// /* swap to elijah */

// position: absolute;
// width: 126px;
// height: 17px;
// left: 261px;
// top: 96px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */

// color: #0029FF;


const Twitter = () => (
  <a href="https://twitter.com/elijah_mint" target="_blank" className="absolute w-[63px] h-[17px] left-[206px] top-[20px] text-center font-mono text-[15px] leading-[17px] text-[#FF00A8] rotate-[-91.43deg] peer-has-hover:text-white">
    twitter
  </a>
);

const Telegram = () => (
  <div className="hover:text-red peer absolute w-[63px] h-[17px] left-[206px] top-[120px] text-center font-mono text-[15px] leading-[17px] text-[#FF00A8] rotate-[-90.24deg]">
    telegram
  </div>
);


const SwapToElijah = () => (
  <div className="absolute w-[226px] h-[17px] left-[261px] top-[96px] text-center font-mono text-[15px] leading-[17px] text-[#0029FF]">
    swap to elijah
  </div>
);

// /* Button */

// display: flex;
// flex-direction: row;
// justify-content: center;
// align-items: center;
// padding: 15px 30px;
// gap: 10px;

// position: absolute;
// width: 229px;
// height: 94px;
// left: calc(50% - 229px/2 + 0.35px);
// top: 631px;

// background: #0029FF;


// font-family: 'Ultra';
// font-style: normal;
// font-weight: 400;
// font-size: 50px;
// line-height: 64px;
// text-align: center;

// color: #FFFFFF;

// "flex flex-row justify-center items-center p-[15px_30px] gap-2.5 absolute w-[229px] h-[94px] left-[calc(50%-229px/2+0.35px)] top-[631px] bg-[#0029FF] text-center font-ultra text-[50px] leading-[64px] text-white"



// /* Text */

// position: absolute;
// width: 252px;
// height: 17px;
// left: 220px;
// top: 742px;

// font-family: 'PT Mono';
// font-style: normal;
// font-weight: 400;
// font-size: 15px;
// line-height: 17px;
// /* identical to box height */

// color: #FFFFFF;
