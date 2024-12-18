    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.23;

    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

    contract GuessTheWord {
        IERC20 public memeToken;
        address public owner;

        mapping(address => uint256) public scores;
        mapping(address => bool) public gameInProgress;
        mapping(address => uint256) public playerChances;

        uint256 public constant ENTRY_FEE = 10 * 10**18;  // 10 TMT to start
        uint256 public constant REWARD = 20 * 10**18;    // 20 TMT reward for correct word

        event GameStarted(address indexed player);
        event GameEnded(address indexed player, bool won, uint256 reward);

        struct Game {
            string word;
            string displayedWord;
            uint8 remainingChances;
        }

        mapping(address => Game) public games;

        constructor(address _memeToken) {
            memeToken = IERC20(_memeToken);
            owner = msg.sender;
        }

        function startGame(string calldata word) external {
            require(!gameInProgress[msg.sender], "Game already started");
            require(memeToken.balanceOf(msg.sender) >= ENTRY_FEE, "Insufficient tokens to start");
            require(memeToken.allowance(msg.sender, address(this)) >= ENTRY_FEE, "Approve tokens first");

            // Deduct the entry fee
            memeToken.transferFrom(msg.sender, address(this), ENTRY_FEE);

            gameInProgress[msg.sender] = true;
            games[msg.sender].word = word;
            games[msg.sender].remainingChances = 5;
            games[msg.sender].displayedWord = getDisplayedWord(word);

            emit GameStarted(msg.sender);
        }

        function guessLetter(string calldata letter) external {
            require(gameInProgress[msg.sender], "Game not started");
            require(games[msg.sender].remainingChances > 0, "No chances left");

            string memory word = games[msg.sender].word;
            string memory currentDisplayedWord = games[msg.sender].displayedWord;

            // Check if the guessed letter is in the word
            bytes memory wordBytes = bytes(word);
            bytes memory currentDisplayedBytes = bytes(currentDisplayedWord);
            bool correctGuess = false;

            for (uint256 i = 0; i < wordBytes.length; i++) {
                if (wordBytes[i] == bytes(letter)[0] && currentDisplayedBytes[i] == "_") {
                    currentDisplayedBytes[i] = bytes(letter)[0];
                    correctGuess = true;
                }
            }

            // Update the displayed word and remaining chances
            games[msg.sender].displayedWord = string(currentDisplayedBytes);

            if (!correctGuess) {
                games[msg.sender].remainingChances--;
            }

            // Check if the game should end
            if (games[msg.sender].remainingChances == 0 || keccak256(bytes(currentDisplayedBytes)) == keccak256(bytes(word))) {
                endGame(msg.sender);
            }
        }

        function endGame(address player) public {
            require(gameInProgress[player], "No game in progress");

            Game memory game = games[player];
            bool won = keccak256(bytes(game.displayedWord)) == keccak256(bytes(game.word));

            if (won) {
                // Player wins
                memeToken.transfer(player, REWARD);
                emit GameEnded(player, true, REWARD);
            } else {
                // Player loses
                emit GameEnded(player, false, 0);
            }

            // Reset the game state
            resetGame(player);
        }

        function getDisplayedWord(string memory word) internal pure returns (string memory) {
            bytes memory displayed = new bytes(bytes(word).length);
            for (uint256 i = 0; i < bytes(word).length; i++) {
                if (isVowel(bytes(word)[i])) {
                    displayed[i] = bytes(word)[i];
                } else {
                    displayed[i] = "_";
                }
            }
            return string(displayed);
        }

        function isVowel(bytes1 char) internal pure returns (bool) {
            return char == "a" || char == "e" || char == "i" || char == "o" || char == "u" ||
                char == "A" || char == "E" || char == "I" || char == "O" || char == "U";
        }

        function resetGame(address player) public {
            delete games[player];
            gameInProgress[player] = false;
        }
    }
