let web3;
let gameContract;
let memeTokenContract;
let account;
let memeToken;


const gameContractAddress = '0x5a675C802Ec61bC25EA74FB82b453833CB86801d'; // Your game contract address
const memeTokenAddress = '0x87F59f6AABeAf3585B5ae4f8f16080cb8cCbcA3b'; // Your meme token address

// ABIs
const gameContractABI =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "endGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_memeToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "won",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			}
		],
		"name": "GameEnded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "GameStarted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "letter",
				"type": "string"
			}
		],
		"name": "guessLetter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "resetGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "word",
				"type": "string"
			}
		],
		"name": "startGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ENTRY_FEE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "gameInProgress",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "games",
		"outputs": [
			{
				"internalType": "string",
				"name": "word",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "displayedWord",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "remainingChances",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "memeToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "playerChances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "REWARD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "scores",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const memeTokenABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimInitialTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mintTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

let wordList = ["BLOCKCHAIN", "ETHEREUM", "SMARTCONTRACT", "DECENTRALIZED", "NFT", "TOKEN", "DAPP", "MINER", "GAS", "LEDGER", "DAO", "ICO", "WALLET", "BLOCKCHAIN", "BITCOIN", "NODE", "HASH", "IPFS", "CONSENSUS", "FORK", "HASHRATE"];
let currentWord = '';
let currentDisplayedWord = '';
let remainingChances = 5;

window.addEventListener('load', () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        window.ethereum.enable().then(() => {
            initializeGame();
        }).catch(err => {
            console.error("User denied account access", err);
        });
    } else {
        alert("Please install MetaMask to play the game.");
    }
});

function initializeGame() {
    gameContract = new web3.eth.Contract(gameContractABI, gameContractAddress);
    memeTokenContract = new web3.eth.Contract(memeTokenABI, memeTokenAddress);

    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('claimButton').addEventListener('click', claimTokens);
    document.getElementById('guessButton').addEventListener('click', guessLetter);
    document.getElementById('startGameButton').addEventListener('click', startNewGame);
	document.getElementById('resetGameButton').addEventListener('click', resetGame);  // Reset game button
	document.getElementById('Submit_Button').addEventListener('click', end_Game);
}

function connectWallet() {
    web3.eth.getAccounts().then(accounts => {
        if (accounts.length === 0) {
            alert("Please connect your wallet.");
        } else {
            account = accounts[0];
            document.getElementById('walletSection').style.display = 'none';
			document.getElementById('actionSection').style.display = 'block';
            checkTokenBalance();
        }
    });
}

function checkTokenBalance() {
    memeTokenContract.methods.balanceOf(account).call().then(balance => {
        if (balance === "0") {
            document.getElementById('claimButton').style.display = 'inline-block';
        } else {	
            // startNewGame();
        }
    });
}

function claimTokens() {
    memeTokenContract.methods.claimInitialTokens().send({ from: account }).then(() => {
        alert('Tokens claimed successfully!');
        // startNewGame();
    }).catch(err => {
        console.error('Error claiming tokens:', err);
    });
}

async function startNewGame() {
    document.getElementById('gameSection').style.display = 'block';
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = randomWord;
    currentDisplayedWord = getDisplayedWord(randomWord);
    remainingChances = 5;
    
    // Start game on the smart contract
    await gameContract.methods.startGame(randomWord).send({ from: account }).then(() => {
        updateGameDisplay();
        console.log('Game started');
    }).catch(err => {
        console.error('Error starting game:', err);
    });
}

function updateGameDisplay() {
    document.getElementById('wordDisplay').innerText = currentDisplayedWord;
    document.getElementById('remainingChances').innerText = `Chances left: ${remainingChances}`;
}

function getDisplayedWord(word) {
    let displayed = '';
    word = word.toUpperCase();  // Ensure the word is case-insensitive
    for (let char of word) {
        if (isVowel(char)) {
            displayed += char;
        } else {
            displayed += '_';
        }
    }
    return displayed;
}

function isVowel(char) {
    return "aeiouAEIOU".includes(char);
}

function guessLetter() {
    const letter = document.getElementById('guessInput').value.toUpperCase();
    if (!letter || letter.length !== 1) return;

    let correctGuess = false;
    let newDisplayedWord = '';
    
    // Update displayed word with the guessed letter
    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i].toUpperCase() === letter && currentDisplayedWord[i] === '_') {
            newDisplayedWord += letter;
            correctGuess = true;
        } else {
            newDisplayedWord += currentDisplayedWord[i];
        }
    }

    // Update current displayed word
    currentDisplayedWord = newDisplayedWord;

    // Decrease chances if the guess was incorrect
    if (!correctGuess) {
        remainingChances--;
    }

    updateGameDisplay(); // Ensure the UI is updated with the new word and remaining chances

    // Check if the game is won or over
    if (currentDisplayedWord === currentWord) {
        alert('You won! The word is ' + currentWord);
        end_Game();  // Trigger endGame when the player wins
    } else if (remainingChances === 0) {
        alert('Game over! The word was ' + currentWord);
        end_Game();  // Trigger endGame when the player runs out of chances
    }

    console.log('Current Word:', currentWord);
    console.log('Current Displayed Word:', currentDisplayedWord);
    console.log('Remaining Chances:', remainingChances);
}

// Reset game function
async function resetGame() {
    // Reset local game variables
    currentWord = '';
    currentDisplayedWord = '';
    remainingChances = 5;
    
    // Hide game section and reset UI elements
    document.getElementById('gameSection').style.display = 'none';
    document.getElementById('wordDisplay').innerText = '';
    document.getElementById('remainingChances').innerText = 'Chances left: 5';
    document.getElementById('guessInput').value = '';
    document.getElementById('guessButton').disabled = false;

    // Call the resetGame function in the smart contract
    try {
        await gameContract.methods.resetGame(account).send({ from: account });
        console.log('Game has been reset on the blockchain for player:', account);
    } catch (error) {
        console.error('Error resetting game on contract:', error);
    }
}


async function end_Game() {
    // Check if the game is over (either through winning or running out of chances)
    if (currentDisplayedWord === currentWord) {
        try {
            // Call the mintTokens function from the MemeCoin contract, passing the reward amount of 20 TMT
            const rewardAmount = 20 * 10**18;  // 20 TMT (in wei)
            await memeTokenContract.methods.mintTokens(rewardAmount).send({ from: account });
            alert('Game has ended. Your reward is being processed.');
        } catch (error) {
            console.error('Error ending game on contract:', error);
        }
    } else if (remainingChances === 0) {
        alert('Game cannot be ended until it is over.');
    }
}

