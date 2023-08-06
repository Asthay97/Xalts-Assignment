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

const contractAddress = "0x9aDD576F857b105C6015c0B2f35CD91FdcB3e666";
const abi = [{ "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "uint256", "name": "_rewardPerBlock", "type": "uint256" }, { "internalType": "address", "name": "_factoryContract", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "_lpToken", "type": "address" }, { "internalType": "uint256", "name": "_lpRewardProportion", "type": "uint256" }], "name": "addLPToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balances", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_lpToken", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "depositLP", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "factoryContract", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_lpToken", "type": "address" }], "name": "getLPBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isLPToken", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lastUpdateBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lpBalances", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lpRewardProportions", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "lpTokenList", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "rewardPerBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_lpToken", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdrawLP", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
const ERC20abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "initSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }];

const optionList = [
  { value: "mETH",label: "mETH", tokenName: "mETH", tokenAddress: '', tokenPrice: 0, tokenBalance: 0},
  { value: "mBTC", label: "mBTC", tokenName: "mBTC", tokenAddress: '', tokenPrice: 0, tokenBalance: 0},
  { value: "mDAI", label: "mDAI", tokenName: "mDAI", tokenAddress: '', tokenPrice: 0, tokenBalance: 0},
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