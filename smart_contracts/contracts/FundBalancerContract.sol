// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./OpenZeppelin/IERC20.sol";
import "./OpenZeppelin/SafeERC20.sol";
import "./Uniswap/IQuoter.sol";
import "./Uniswap/ISwapRouter.sol";
import "./Uniswap/OracleLibrary.sol";
import "./Uniswap/IUniswapV3Factory.sol";

contract FundBalancerContract {
    using SafeERC20 for IERC20;
    address public constant uinswapV3RouterAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address public constant uinswapV3QuoterAddress = 0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6;
    address public immutable ERC20USDC;
    uint24 public immutable poolFee;
    address public owner;
    uint256 public amountOutPrice;
    uint256 public tokenSharePerFund; 
    uint256 public totalTokens;

    struct Tokens {
      string tokenName;
      address tokenAddress;
    }

    ISwapRouter uniswapRouter = ISwapRouter(uinswapV3RouterAddress);
    Tokens[] tokens; // min 3 to max 10

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    event usdcDeposited(uint256 amount, address usdcTokenAddress);
    event tokenSwapped(address from, address to, uint256 inAmount, uint256 outAmount);
    event rebalancedTokensPerShare(uint256 tokenSharePerFund, uint tokenCurrentUsdcEquivalent, uint tokenUpdatedUsdcEquivalent);
    event getTokenUSDCBalance(uint256 currentTokenUsdcBalance);
    event purchasedInitial(uint price);
    event priceUpdated(uint amountOut);

    constructor( address _usdcAddress, address _owner, uint24 _poolFee,Tokens[] memory _tokens) {
      totalTokens = _tokens.length;
      require(totalTokens >= 3 && totalTokens<=10,"out of range tokens");
      ERC20USDC = _usdcAddress;
      owner = _owner;
      poolFee = _poolFee;
      for (uint256 i = 0; i < totalTokens; i++) {
          tokens.push(Tokens({
            tokenName : _tokens[i].tokenName,
            tokenAddress: _tokens[i].tokenAddress
          }));
      }
    }

    function depositERC20USDC(uint256 _amount) external onlyOwner{
        require(IERC20(ERC20USDC).balanceOf(msg.sender) > _amount,"amount < balance");
        IERC20(ERC20USDC).transferFrom(msg.sender, address(this), _amount);
        emit usdcDeposited(_amount, ERC20USDC);
    }

    function updatePriceUniswap(address tokenIn,address tokenOut,uint256 amountIn,uint32 secondsAgo) internal returns (uint) {
        address pool = IUniswapV3Factory(0x1F98431c8aD98523631AE4a59f267346ea31F984).getPool(tokenIn,tokenOut,poolFee);
        require(pool != address(0), "pool doesn't exist");

        uint32[] memory secondsAgos = new uint32[](2);
        secondsAgos[0] = secondsAgo;
        secondsAgos[1] = 0;

        (int56[] memory tickCumulatives, ) = IUniswapV3Pool(pool).observe(secondsAgos);
        int56 tickCumulativesDelta = tickCumulatives[1] - tickCumulatives[0];
        int24 tick = int24( tickCumulativesDelta / int56( int32(secondsAgo) ) );

        if (tickCumulativesDelta < 0 && (tickCumulativesDelta % int56( int32(secondsAgo) ) != 0)) {
            tick--;
        }

        amountOutPrice = OracleLibrary.getQuoteAtTick(tick,uint128(amountIn),tokenIn,tokenOut);
        emit priceUpdated(amountOutPrice);
        return amountOutPrice;
    }

    function swapToken(address fromToken, address toToken, uint256 amountIn) internal returns(uint256){
        require(IERC20(fromToken).approve(address(uinswapV3RouterAddress), amountIn),"approve failed");
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: fromToken, // from
                tokenOut: toToken, //to
                fee: poolFee,
                recipient: address(this),//msg.sender,
                deadline: block.timestamp, // +15
                amountIn: amountIn,  // includes 18 decimals
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        uint256 amountOut = uniswapRouter.exactInputSingle(params);
        // uniswapRouter.refundETH(); // optional to call
        emit tokenSwapped(fromToken, toToken, amountIn, amountOut);
        return amountOut;
    }

    function getTokens() external view returns(Tokens[] memory){
      return tokens;
    }

    function getBalance(address tokenAddress) public view returns (uint256) {
      return IERC20(tokenAddress).balanceOf(address(this));
    }

    function purchaseInitial() internal onlyOwner{
      uint256 perTokenShare = getBalance(ERC20USDC) / totalTokens;
      require(perTokenShare >0, "perTokenShare = 0");
      for (uint256 i = 0; i < tokens.length; i++) {
        uint tokenOut = swapToken(ERC20USDC, tokens[i].tokenAddress, perTokenShare);
        emit purchasedInitial(tokenOut);
      }
    }

    function getTotalUsdcConverted() public returns(uint) {
      uint totalUsdcBalance = getBalance(ERC20USDC);
      for (uint256 i = 0; i < tokens.length; i++) {
        uint currentTokenBalance = getBalance(tokens[i].tokenAddress);
        uint currentTokenUsdcBalance = updatePriceUniswap(tokens[i].tokenAddress, ERC20USDC, currentTokenBalance, 10);
        totalUsdcBalance += currentTokenUsdcBalance;
        emit getTokenUSDCBalance(currentTokenUsdcBalance);
      }
      emit getTokenUSDCBalance(totalUsdcBalance);
      return totalUsdcBalance;
    }

    function rebalance() public onlyOwner{
        uint perShare =  getTotalUsdcConverted() / totalTokens;
        for (uint256 i = 0; i < tokens.length; i++) {
            uint currentTokenBalance = getBalance(tokens[i].tokenAddress);
            uint tokenUsdcBalance = updatePriceUniswap(tokens[i].tokenAddress, ERC20USDC, currentTokenBalance, 10);
            if(perShare > tokenUsdcBalance){
                uint swapAmount = perShare - tokenUsdcBalance;
                uint amountOut = swapToken(ERC20USDC, tokens[i].tokenAddress, swapAmount); // buy usdc, sell token
                emit rebalancedTokensPerShare(perShare, tokenUsdcBalance, amountOut);
            }
        }

        for (uint256 i = 0; i < tokens.length; i++) {
            uint currentTokenBalance = getBalance(tokens[i].tokenAddress);
            uint tokenUsdcBalance = updatePriceUniswap(tokens[i].tokenAddress, ERC20USDC, currentTokenBalance, 10);
            if(perShare < tokenUsdcBalance){
                uint swapAmount = tokenUsdcBalance - perShare;
                uint amountOut = swapToken(tokens[i].tokenAddress, ERC20USDC, swapAmount);// buy token, sell usdc
                emit rebalancedTokensPerShare(perShare, tokenUsdcBalance, amountOut);
            }
        }
    }

    // receive() external payable {}
  }