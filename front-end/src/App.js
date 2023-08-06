import { useEffect, useState } from 'react';
import './App.css';
// import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import Select from "react-select";

const contractAddress = "0xA6c10111663b538Cdbb7122a41CaD98B1A7B9ff2";
const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"T","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"currentTokenUsdcBalance","type":"uint256"}],"name":"getTokenUSDCBalance","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"a","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"b","type":"uint256"}],"name":"priceFromUniswap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"priceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"purchasedInitial","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenSharePerFund","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokenCurrentUsdcEquivalent","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokenUpdatedUsdcEquivalent","type":"uint256"}],"name":"rebalancedTokensPerShare","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"inAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"outAmount","type":"uint256"}],"name":"tokenSwapped","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"noOfTokens","type":"uint256"}],"name":"tokensAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"usdcTokenAddress","type":"address"}],"name":"usdcDeposited","type":"event"},{"inputs":[],"name":"ERC20USDC","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"tokenName","type":"string"},{"internalType":"address","name":"tokenAddress","type":"address"}],"internalType":"struct PortfolioFundBalancer.Tokens[]","name":"_tokens","type":"tuple[]"}],"name":"addTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"depositERC20USDC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokens","outputs":[{"components":[{"internalType":"string","name":"tokenName","type":"string"},{"internalType":"address","name":"tokenAddress","type":"address"}],"internalType":"struct PortfolioFundBalancer.Tokens[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalUsdcConverted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolFee","outputs":[{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"purchaseInitial","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rebalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"fromToken","type":"address"},{"internalType":"address","name":"toToken","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"}],"name":"swapToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uinswapV3QuoterAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uinswapV3RouterAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint32","name":"secondsAgo","type":"uint32"}],"name":"updatePriceUniswap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
const ERC20abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "initSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }];

const optionList = [
  { value: "mETH",label: "mETH", tokenName: "mETH", tokenAddress: "0x7a161337F3e4c6e97959d7b0EB78B212d7F039dC", tokenPrice: 0, tokenBalance: 0},
  { value: "mBTC", label: "mBTC", tokenName: "mBTC", tokenAddress: "0xC02Ff87AefC1B884E3d7733082F38EDaA2e17597", tokenPrice: 0, tokenBalance: 0},
  { value: "mDAI", label: "mDAI", tokenName: "mDAI", tokenAddress: "0x2310F0b0da426F9B8cF8279aD8CE8aEb5EB09DC6", tokenPrice: 0, tokenBalance: 0},
  { value: "mUSDC", label: "mUSDC", tokenName: "mUSDC", tokenAddress: '', tokenPrice: 0, tokenBalance: 0},
  { value: "ATOM", label: "ATOM", tokenName: "ATOM", tokenAddress: '', tokenPrice: 0, tokenBalance: 0},
  { value: "WZX", label: "WZX", tokenName: "WZX", tokenAddress: '', tokenPrice: 0, tokenBalance: 0},
  { value: "BNB", label: "BNB", tokenName: "BNB", tokenAddress: '', tokenPrice: 0, tokenBalance: 0},
  { value: "SUSHI", label: "SUSHI", tokenName: "SUSHI", tokenAddress: '', tokenPrice: 0, tokenBalance: 0},
  { value: "LINK", label: "LINK", tokenName: "LINK", tokenAddress: '', tokenPrice: 0, tokenBalance: 0},
  { value: "UNI", label: "UNI", tokenName: "UNI", tokenAddress: '', tokenPrice: 0, tokenBalance: 0},

];

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const [tokenAddress, setTokenAddress] = useState();
  const [rewardProportion, setRewardProportion] = useState();

  const [depositTokenAddress, setDepositTokenAddress] = useState();
  const [depositAmount, setDepositAmount] = useState();

  const [withdrawalTokenAddress, setWithdrawalTokenAddress] = useState();
  const [withdrawalAmount, setWithdrawalAmount] = useState();

  const [walletAddress, setWallet] = useState("");

  const [selectedOptions, setSelectedOptions] = useState();

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const AddTokensHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const FundBalancerContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let addLPTokenTxn = await FundBalancerContract.addTokens(selectedOptions);

        console.log("Mining... please wait");
        await addLPTokenTxn.wait();

        console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${addLPTokenTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const InitialDepositHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const FundBalancerContract = new ethers.Contract(contractAddress, abi, signer);

        const ERC20Contract = new ethers.Contract(depositTokenAddress, ERC20abi, signer);

        console.log("Fund Balancer Contract Address: ", FundBalancerContract.address);

        console.log("Initialize Approval");
        let erc20AllowanceTxn = await ERC20Contract.approve(FundBalancerContract.address, depositAmount);

        console.log("Mining... please wait");
        await erc20AllowanceTxn.wait();

        console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${erc20AllowanceTxn.hash}`);

        console.log("Initialize Deposit");
        let initialDepositTxn = await FundBalancerContract.depositERC20USDC(depositAmount);

        console.log("Mining... please wait");
        await initialDepositTxn.wait();

        console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${initialDepositTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const InitialBalancingHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const FundBalancerContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Fund Balancer Contract Address: ", FundBalancerContract.address);

        console.log("Initialize Deposit");
        let initialBalancingTxn = await FundBalancerContract.purchaseInitial();

        console.log("Mining... please wait");
        await initialBalancingTxn.wait();

        console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${initialBalancingTxn.hash}`);

        // console.log("Initialize payment");
        // let getRewardTxn = await FarmContract.getReward();

        // console.log("Mining... please wait");
        // await getRewardTxn.wait();

        // console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${getRewardTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const ReBalanceHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const FundBalancerContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let rebalacingTxn = await FundBalancerContract.rebalance();

        console.log("Mining... please wait");
        await rebalacingTxn.wait();

        console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${rebalacingTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const handleSelect = (data) => {
    console.log("Selected Tokens", data);
    setSelectedOptions(data);
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
    )
  }

  const InteractionPage = () => {
    return (
      <div>

        <h2>Choose your Tokens</h2>
        <div className="dropdown-container">
          <Select
            options={optionList}
            placeholder="Select Tokens"
            value={selectedOptions}
            onChange={handleSelect}
            isSearchable={true}
            isMulti
          />
        </div>
        <p></p>
        <button onClick={AddTokensHandler} className='cta-button mint-nft-button'>
            Create Fund
          </button>

          <p>====================================</p>


        <div>
          <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
              Initial Deposit
            </Typography>
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
              <div className="mb-4 flex flex-col gap-6">
                <Input size="lg" placeholder='Enter Amount' value={rewardProportion} onChange={e => setRewardProportion(e.target.value)} /> <br />
              </div>
            </form>
          </Card>

          <button onClick={InitialDepositHandler} className='cta-button mint-nft-button'>
            Deposit
          </button>
          <p></p>
        </div>

        <p>====================================</p>

        <div>

          <button onClick={InitialBalancingHandler} className='cta-button mint-nft-button'>
            Initial Balancing
          </button>
          <p></p>
        </div>

        <p>====================================</p>

        <div>

          <button onClick={ReBalanceHandler} className='cta-button mint-nft-button'>
            Rebalance
          </button>
          <p></p>
        </div>

      </div>


    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>Xalts: Funds Balancer  </h1> <br />
      <p>{currentAccount ? "Connected account :" + currentAccount : ""}</p>
      <div>
        {currentAccount ? InteractionPage() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;
