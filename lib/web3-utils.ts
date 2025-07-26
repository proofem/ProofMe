import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletConnection {
  address: string;
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
}

export class Web3Utils {
  private static instance: Web3Utils;
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  private constructor() {}

  public static getInstance(): Web3Utils {
    if (!Web3Utils.instance) {
      Web3Utils.instance = new Web3Utils();
    }
    return Web3Utils.instance;
  }

  async connectWallet(): Promise<WalletConnection> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider and signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      
      // Get the connected address
      const address = await this.signer.getAddress();

      return {
        address,
        provider: this.provider,
        signer: this.signer
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect to MetaMask');
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      return await this.signer.signMessage(message);
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw new Error('Failed to sign message');
    }
  }

  async getCurrentAccount(): Promise<string | null> {
    if (!this.provider) {
      return null;
    }

    try {
      const accounts = await this.provider.listAccounts();
      return accounts.length > 0 ? accounts[0] : null;
    } catch (error) {
      console.error('Failed to get current account:', error);
      return null;
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const balance = await this.provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw new Error('Failed to get balance');
    }
  }

  async switchNetwork(chainId: string): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        throw new Error('Network not added to MetaMask');
      }
      throw error;
    }
  }

  // Generate a deterministic DID from wallet address
  generateDID(walletAddress: string): string {
    // Create a simple DID format: did:eth:address
    return `did:eth:${walletAddress.toLowerCase()}`;
  }

  // Verify wallet signature for authentication
  async verifySignature(
    message: string, 
    signature: string, 
    address: string
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Failed to verify signature:', error);
      return false;
    }
  }

  // Listen for account changes
  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  // Listen for network changes
  onChainChanged(callback: (chainId: string) => void): void {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  // Remove event listeners
  removeAllListeners(): void {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  }
}

// Export singleton instance
export const web3Utils = Web3Utils.getInstance();