import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as fs from 'fs-extra';
import { Network, Alchemy } from 'alchemy-sdk';

@Injectable()
export class BlockchainService {
  ABITOKENCONTRACT = 'src/contracts/abi/ERC20.abi';
  BINTOKENCONTRACT = 'src/contracts/bin/ERC20.bin';

  async connectContractToken(tokenAddr: string) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const connectedWallet = await wallet.connect(provider);

    const abi = fs.readFileSync(this.ABITOKENCONTRACT, 'utf8');

    const contract = new ethers.Contract(tokenAddr, abi, connectedWallet);
    return contract;
  }

  async deployToken() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const connectedWallet = await wallet.connect(provider);

    const abi = fs.readFileSync(this.ABITOKENCONTRACT, 'utf8');
    const binary = fs.readFileSync(this.BINTOKENCONTRACT, 'utf8');

    const settings = {
      apiKey: process.env.TOKEN_TX_1,
      network: Network.MATIC_MUMBAI,
    };

    const alchemy = new Alchemy(settings);

    const actualGasPrice = await alchemy.core.getGasPrice();

    const contractFactory = new ethers.ContractFactory(
      abi,
      binary,
      connectedWallet,
    );
    console.log('Deploying , please wait...');
    const contract = await contractFactory.deploy({
      gasPrice: actualGasPrice,
    });
    //await contract.deployTransaction.wait(1);
    console.log(contract.address);

    return contract.address;
  }

  async getContractName(tokenAddr: string) {
    const contract = await this.connectContractToken(tokenAddr);
    const contractName = await contract.name();
    return contractName;
  }

  async getTotalSupply(tokenAddr: string) {
    const contract = await this.connectContractToken(tokenAddr);
    const totalSupply = await contract.totalSupply();
    return ethers.utils.formatEther(totalSupply);
  }

  async getSymbol(tokenAddr: string) {
    const contract = await this.connectContractToken(tokenAddr);
    const symbol = await contract.symbol();
    return symbol;
  }

  async getDecimals(tokenAddr: string) {
    const contract = await this.connectContractToken(tokenAddr);
    const decimals = await contract.decimals();
    return decimals;
  }

  async getBalanceOf(tokenAddr: string, userAddress: string) {
    const contract = await this.connectContractToken(tokenAddr);
    const balanceOf = await contract.balanceOf(userAddress);
    return ethers.utils.formatEther(balanceOf);
  }

  async mintToken(tokenAddr: string, qtd: string) {
    const contract = await this.connectContractToken(tokenAddr);
    const amountMinted = ethers.utils.parseUnits(qtd, 'ether');
    const mint = await contract.mint(amountMinted);
    return mint.hash;
  }

  async burnToken(tokenAddr: string, qtd: string) {
    const contract = await this.connectContractToken(tokenAddr);
    const amountBurned = ethers.utils.parseUnits(qtd, 'ether');
    const mint = await contract.burn(amountBurned);
    return mint.hash;
  }

  async transferToken(tokenAddr: string, userAddress: string, qtd: string) {
    const contract = await this.connectContractToken(tokenAddr);
    const amountTransfered = ethers.utils.parseUnits(qtd, 'ether');
    const mint = await contract.transfer(userAddress, amountTransfered);
    return mint.hash;
  }
}
