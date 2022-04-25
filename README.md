# Lottery dApp

In this article we will create a Lottery dApp using **Razor Network** Random Number Manager contract.

## How the Lottery dApp works?

- In lottery dApp every participant will contribute 0.1 ether to the pool.
- Only 5 participants can participate in a single pool.
- Only a single pool can be active at a time.
- As soon as max participants count(5) is reached no one can contribute to the pool. But any one can declare the winner.
- Winner would be selected randomly based on Random number generated by Razor Network [RandomNoManager](https://github.com/razor-network/contracts/blob/master/contracts/randomNumber/RandomNoManager.sol) contract.

## Why use third party Random Number Manager contract?

Solidity contracts are deterministic. One cannot truly generate random numbers. Pseudo-random number can be generated based on `block.timestamp`. But this can be exploited by the miners by confirming block at a specified time which increases their chances of winning the lottery.

Due to which, one solution is to use an Oracle to get a random number (which cannot be predicted). Every epoch (1 epoch = 30min) a random number would be generated by the oracle. In this dApp we would be using **[getGenericRandomNumberOfLastEpoch()](https://github.com/razor-network/contracts/blob/master/contracts/randomNumber/RandomNoManager.sol#L58)** function \***\*of the **RandomNoManager\*\* contract.

## Let’s get started-

Let’s start by generating a boilerplate for the setup. Before moving ahead make sure you have [Node.js](https://nodejs.org/) and [npm](https://npmjs.com/) in your machine.

In this dApp we would be using [hardhat](https://hardhat.org/) to generate boilerplate and for testing and deploying contracts.

```bash
mkdir lottery-dapp
cd lottery-dapp
npx hardhat node
```

Choose `Create a basic sample project` when prompted and select yes for the rest of the options. You would end up with **contracts**, **scripts** and **test** directory and many other utility files required for the project.

## Interface for RandomNoManager contract

In the **contracts** directory you can delete `Greeter.sol`. Create a directory in **contracts** called **interface**. Inside **interface** directory create a file called **IRandomNoManager.sol**.

In this file we will create the interface for the function which we will be using to generate a random number from **RandomNoManager** contract.

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IRandomNoManager {
    function getGenericRandomNumberOfLastEpoch()
        external
        view
        returns (uint256);
}
```

In the above code we have created an interface for function `getGenericRandomNumberOfLastEpoch()` which returns uint256. This function is all we require from **RandomNoManager** contract to achieve our goal.

## Calling one smart contract function from another

Before starting lottery contract let’s understand how we can call one smart contract from another smart contract through the interface. Consider this example:

Contract **A** has function **test** which returns a state variable **testNum.**

**A.sol**

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract A {
    uint256 public testNum = 100;

    function test() public view returns (uint256) {
        return testNum;
    }
}
```

Now contract **B**, wants to call **test()** function of contract **A**. To do this we need **test** function _interface_ and its contract address (contract address of A). Interface for **A** would look something like this:

**IA.sol** (interface/IA.sol)

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IA {
    function test() external view returns (uint256);
}
```

**B.sol**

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interface/IA.sol";

contract B {
    IA A;

    constructor(address _A) {
        A = IA(_A);
    }

    function getTestFromA() public view returns (uint256) {
        return A.test();
    }
}
```

Here in contract **B** we pass address of A using constructor and instantiate the instance of contract A by passing in address of **A** using **`IA(_A)`.**

In `getTestFromA()` function we call **A**’s test function using `A.test()`

## Lottery contract 💰

For lottery contract we have 3 functions:

1. **contribute** (Called by anyone once per pool to take part in lottery pool)
2. **declareWinner** (Called by anyone to declare winner when max participants limit is reached)
3. **receive** (Built in function required to allow smart contract to receive ether)

We need some state variables as well to manage state of the contract.

1. `contributionAmount` - Amount to be payed to contribute to the pool
2. `MAX_PARTICIPANTS` - Number of participants allowed in the pool
3. `EPOCH_LENGTH` - Used for epoch calculation
4. `poolCounter` - To keep track of the current active pool
5. `poolParticipantCounter` - Counter to keep track of number of participants in the current pool

Mappings:

1. `(uint256 => address[]) poolParticipants` - Pool to participant address
2. `(uint256 => mapping(address => bool)) poolRecords` - To check and keep track of which participants are in a pool.
3. `(uint256 => bool) epoches` - To keep track of pool winners declared in an epoch
4. `(uint256 => address) winners` - Tracks winner addresses

Now let’s have a look at what the final contract looks like:

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interface/IRandomNoManager.sol";

contract Lottery {
    uint256 public contributionAmount = 0.1 ether;
    uint8 public constant MAX_PARTICIPANTS = 5;
    uint16 public constant EPOCH_LENGTH = 1800;
    uint256 public poolCounter = 1;
    uint8 public poolParticipantCounter = 0;

    mapping(uint256 => address[]) poolParticipants;
    mapping(uint256 => mapping(address => bool)) poolRecords;
    mapping(uint256 => bool) epoches;
    mapping(uint256 => address) winners;

    IRandomNoManager public randomNoManager;

    event WinnerDeclared(address indexed winner, uint256 pool);

    constructor(address _randomNoManager) {
        randomNoManager = IRandomNoManager(_randomNoManager);
    }

    function contribute() public payable {
        require(
            !poolRecords[poolCounter][msg.sender],
            "Already contributed to pool"
        );
        require(
            poolParticipantCounter != MAX_PARTICIPANTS,
            "Pool reached max participants"
        );
        require(
            msg.value == contributionAmount,
            "Requires 0.1 ether to contribute"
        );

        poolParticipants[poolCounter].push(msg.sender);
        poolRecords[poolCounter][msg.sender] = true;
        poolParticipantCounter++;
    }

    function declareWinner() public {
        require(
            poolParticipantCounter == MAX_PARTICIPANTS,
            "Max participants limit not reached"
        );
        uint32 epoch = (uint32(block.timestamp) / (EPOCH_LENGTH));
        require(!epoches[epoch], "Winner already declared for current epoch");

        uint256 index = randomNoManager.getGenericRandomNumberOfLastEpoch() %
            MAX_PARTICIPANTS;
        address winner = poolParticipants[poolCounter][index];
        bool sent = payable(winner).send(contributionAmount * MAX_PARTICIPANTS);
        require(sent, "Failed to send reward");

        emit WinnerDeclared(winner, poolCounter);

        winners[poolCounter] = winner;
        poolCounter++;
        poolParticipantCounter = 0;
        epoches[epoch] = true;
    }

    receive() external payable {}
}
```

c**ontribute()**

In contribute function, we check for 3 requirements:

1. If the participant has already participated in the current pool
2. If the max limit for participants has been reached
3. If the amount sent by participant is equal to `contributionAmount`

If all the above requirements are meet then

- Add participant address in `poolParticipants` mapping
- Mark `poolRecords` as true for the participant address of current pool
- Increment `poolParticipantCounter`

**declareWinner()**

In declareWinner, we check for 2 requirements

1. If the `poolParticipantCounter` is equal to `MAX_PARTICIPANTS`
2. If the winner for the current epoch has already been declared. Only 1 pool winner can be declared per epoch.

Now here comes the interesting part of the lottery contract, we get a random number from

`getGenericRandomNumberOfLastEpoch`of **RandomNoManager** contract. The random number will from any range. But we need the random number from range `0` to `MAX_PARTICIPANTS - 1` which can be used as an index of poolParticipants.

To get a random number within this limit we can do the following, `randomNumber % MAX_PARTICIPANTS`, this will provide us with required result(a random number limited to `MAX_PARTICIPANTS`). Based on the index we will transfer the entire pool amount to the winner and emit an event which can be used by any dapp frontend if required.

Lastly we will update the state variables:

1. Store winner of the current pool
2. Increment `poolCounter`
3. Reset `poolParticipantCounter`
4. Mark current epoch in `epoches` to true.

This functionality can be scaled to allow a vast number of users that can participate in the lottery.

In conclusion, the function `getGenericRandomNumberOfLastEpoch`

from **Razor Contracts** can be used for a large number of use cases where a reliable source of randomness is key to achieve the intended functionality/result of a decentralised application.

## Deployed contract addresses (Skale)

Lottery contract address - `0x13E651a51D91547AEEb0b23b4FdDC9281f907AeF`
RandomNoManager address - `0x4e4CF6039637B208D1f68872eA947d917086AaE1`
