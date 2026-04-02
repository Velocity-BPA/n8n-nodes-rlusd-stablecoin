/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-rlusdstablecoin/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class RLUSDStablecoin implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'RLUSD Stablecoin',
    name: 'rlusdstablecoin',
    icon: 'file:rlusdstablecoin.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the RLUSD Stablecoin API',
    defaults: {
      name: 'RLUSD Stablecoin',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'rlusdstablecoinApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'AccountBalances',
            value: 'accountBalances',
          },
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'TokenInfo',
            value: 'tokenInfo',
          },
          {
            name: 'NetworkStatus',
            value: 'networkStatus',
          }
        ],
        default: 'accountBalances',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['accountBalances'] } },
  options: [
    { name: 'Get Balance', value: 'getBalance', description: 'Get RLUSD balance for specific address', action: 'Get RLUSD balance' },
    { name: 'Get Account Info', value: 'getAccountInfo', description: 'Get detailed account information including RLUSD holdings', action: 'Get account info' },
    { name: 'Get Batch Balances', value: 'getBatchBalances', description: 'Get balances for multiple addresses', action: 'Get batch balances' },
    { name: 'Get Balance History', value: 'getBalanceHistory', description: 'Get historical balance changes', action: 'Get balance history' }
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transactions'] } },
  options: [
    { name: 'Send Tokens', value: 'sendTokens', description: 'Send RLUSD tokens to another address', action: 'Send RLUSD tokens' },
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction details by hash', action: 'Get transaction details' },
    { name: 'Get Account Transactions', value: 'getAccountTransactions', description: 'Get transaction history for address', action: 'Get account transaction history' },
    { name: 'Estimate Transaction', value: 'estimateTransaction', description: 'Estimate transaction fees and gas', action: 'Estimate transaction cost' },
    { name: 'Get Pending Transactions', value: 'getPendingTransactions', description: 'Get pending transactions for address', action: 'Get pending transactions' }
  ],
  default: 'sendTokens',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['tokenInfo'] } },
	options: [
		{ name: 'Get Token Info', value: 'getTokenInfo', description: 'Get RLUSD token contract information and metadata', action: 'Get token info' },
		{ name: 'Get Total Supply', value: 'getTotalSupply', description: 'Get total RLUSD supply across networks', action: 'Get total supply' },
		{ name: 'Get Token Holders', value: 'getTokenHolders', description: 'Get list of token holders and distribution', action: 'Get token holders' },
		{ name: 'Get Token Stats', value: 'getTokenStats', description: 'Get token statistics including volume and market data', action: 'Get token stats' }
	],
	default: 'getTokenInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['networkStatus'] } },
  options: [
    { name: 'Get Network Status', value: 'getNetworkStatus', description: 'Get current network status and health', action: 'Get network status' },
    { name: 'Get Latest Block', value: 'getLatestBlock', description: 'Get latest block information', action: 'Get latest block' },
    { name: 'Get Network Fees', value: 'getNetworkFees', description: 'Get current network transaction fees', action: 'Get network fees' },
    { name: 'Get Validators', value: 'getValidators', description: 'Get network validator information for XRPL', action: 'Get validators' },
  ],
  default: 'getNetworkStatus',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['accountBalances'], operation: ['getBalance', 'getAccountInfo', 'getBalanceHistory'] } },
  default: '',
  placeholder: 'rXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  description: 'The account address to query'
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  options: [
    { name: 'XRPL', value: 'xrpl' },
    { name: 'Ethereum', value: 'ethereum' }
  ],
  required: true,
  displayOptions: { show: { resource: ['accountBalances'], operation: ['getBalance', 'getBatchBalances'] } },
  default: 'xrpl',
  description: 'The network to query'
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['accountBalances'], operation: ['getBatchBalances'] } },
  default: '',
  placeholder: 'address1,address2,address3',
  description: 'Comma-separated list of addresses to query'
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  required: false,
  displayOptions: { show: { resource: ['accountBalances'], operation: ['getBalanceHistory'] } },
  default: '',
  description: 'Start date for balance history (optional)'
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  required: false,
  displayOptions: { show: { resource: ['accountBalances'], operation: ['getBalanceHistory'] } },
  default: '',
  description: 'End date for balance history (optional)'
},
{
  displayName: 'From Address',
  name: 'fromAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transactions'], operation: ['sendTokens', 'estimateTransaction'] } },
  default: '',
  description: 'The address to send tokens from',
},
{
  displayName: 'To Address',
  name: 'toAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transactions'], operation: ['sendTokens', 'estimateTransaction'] } },
  default: '',
  description: 'The address to send tokens to',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transactions'], operation: ['sendTokens', 'estimateTransaction'] } },
  default: '',
  description: 'The amount of RLUSD tokens to send',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['transactions'], operation: ['sendTokens', 'estimateTransaction'] } },
  options: [
    { name: 'XRPL', value: 'xrpl' },
    { name: 'Ethereum', value: 'ethereum' }
  ],
  default: 'xrpl',
  description: 'The blockchain network to use',
},
{
  displayName: 'Transaction Hash',
  name: 'transactionHash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transactions'], operation: ['getTransaction'] } },
  default: '',
  description: 'The hash of the transaction to retrieve',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transactions'], operation: ['getAccountTransactions', 'getPendingTransactions'] } },
  default: '',
  description: 'The account address to query',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['transactions'], operation: ['getAccountTransactions'] } },
  default: 20,
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['transactions'], operation: ['getAccountTransactions'] } },
  default: 0,
  description: 'Number of transactions to skip for pagination',
},
{
	displayName: 'Network',
	name: 'network',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['tokenInfo'],
			operation: ['getTokenInfo', 'getTotalSupply']
		}
	},
	options: [
		{ name: 'XRPL', value: 'xrpl' },
		{ name: 'Ethereum', value: 'ethereum' }
	],
	default: 'xrpl',
	description: 'The network to query for token information',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['tokenInfo'],
			operation: ['getTokenHolders']
		}
	},
	default: 100,
	description: 'Maximum number of token holders to return',
	typeOptions: {
		minValue: 1,
		maxValue: 1000
	}
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['tokenInfo'],
			operation: ['getTokenHolders']
		}
	},
	default: 0,
	description: 'Number of records to skip for pagination',
	typeOptions: {
		minValue: 0
	}
},
{
	displayName: 'Timeframe',
	name: 'timeframe',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['tokenInfo'],
			operation: ['getTokenStats']
		}
	},
	options: [
		{ name: '24 Hours', value: '24h' },
		{ name: '7 Days', value: '7d' },
		{ name: '30 Days', value: '30d' },
		{ name: '1 Year', value: '1y' }
	],
	default: '24h',
	description: 'Time period for statistics calculation',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['networkStatus'],
      operation: ['getNetworkStatus', 'getLatestBlock', 'getNetworkFees']
    }
  },
  options: [
    { name: 'XRPL', value: 'xrpl' },
    { name: 'Ethereum', value: 'ethereum' },
  ],
  default: 'xrpl',
  description: 'The blockchain network to query',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'accountBalances':
        return [await executeAccountBalancesOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'tokenInfo':
        return [await executeTokenInfoOperations.call(this, items)];
      case 'networkStatus':
        return [await executeNetworkStatusOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountBalancesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rlusdstablecoinApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          
          const baseUrl = network === 'xrpl' ? 'https://api.xrpl.org' : 'https://api.ethereum.org/v1';
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/account/${address}/balances`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            qs: { network },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAccountInfo': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `https://api.xrpl.org/account/${address}/info`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getBatchBalances': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          
          const baseUrl = network === 'xrpl' ? 'https://api.xrpl.org' : 'https://api.ethereum.org/v1';
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/accounts/batch/balances`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            qs: { 
              addresses: addresses,
              network 
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getBalanceHistory': {
          const address = this.getNodeParameter('address', i) as string;
          const startDate = this.getNodeParameter('startDate', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;
          
          const queryParams: any = {};
          if (startDate) queryParams.startDate = startDate;
          if (endDate) queryParams.endDate = endDate;
          
          const options: any = {
            method: 'GET',
            url: `https://api.xrpl.org/account/${address}/history`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            qs: queryParams,
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({
        json: result,
        pairedItem: { item: i }
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeTransactionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rlusdstablecoinApi') as any;
  
  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'sendTokens': {
          const fromAddress = this.getNodeParameter('fromAddress', i) as string;
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          
          const baseUrl = network === 'xrpl' ? 'https://api.xrpl.org' : 'https://api.ethereum.org/v1';
          
          const options: any = {
            method: 'POST',
            url: `${baseUrl}/transactions/send`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              fromAddress,
              toAddress,
              amount,
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getTransaction': {
          const transactionHash = this.getNodeParameter('transactionHash', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `https://api.xrpl.org/transactions/${transactionHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAccountTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          
          const options: any = {
            method: 'GET',
            url: `https://api.xrpl.org/account/${address}/transactions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'estimateTransaction': {
          const fromAddress = this.getNodeParameter('fromAddress', i) as string;
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          
          const baseUrl = network === 'xrpl' ? 'https://api.xrpl.org' : 'https://api.ethereum.org/v1';
          
          const options: any = {
            method: 'POST',
            url: `${baseUrl}/transactions/estimate`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              fromAddress,
              toAddress,
              amount,
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getPendingTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `https://api.xrpl.org/transactions/pending`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs: {
              address,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeTokenInfoOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('rlusdstablecoinApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getTokenInfo': {
					const network = this.getNodeParameter('network', i) as string;
					const baseUrl = network === 'xrpl' ? 'https://api.xrpl.org' : 'https://api.ethereum.org/v1';
					
					const options: any = {
						method: 'GET',
						url: `${baseUrl}/token/info`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						qs: { network },
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTotalSupply': {
					const network = this.getNodeParameter('network', i) as string;
					const baseUrl = network === 'xrpl' ? 'https://api.xrpl.org' : 'https://api.ethereum.org/v1';
					
					const options: any = {
						method: 'GET',
						url: `${baseUrl}/token/supply`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						qs: { network },
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTokenHolders': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl || 'https://api.xrpl.org'}/token/holders`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						qs: { limit, offset },
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTokenStats': {
					const timeframe = this.getNodeParameter('timeframe', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl || 'https://api.xrpl.org'}/token/stats`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json'
						},
						qs: { timeframe },
						json: true
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i }
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i }
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeNetworkStatusOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('rlusdstablecoinApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getNetworkStatus': {
          const network = this.getNodeParameter('network', i) as string;
          const baseUrl = network === 'ethereum' ? 'https://api.ethereum.org/v1' : 'https://api.xrpl.org';
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/network/status`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLatestBlock': {
          const network = this.getNodeParameter('network', i) as string;
          const baseUrl = network === 'ethereum' ? 'https://api.ethereum.org/v1' : 'https://api.xrpl.org';
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/network/blocks/latest`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNetworkFees': {
          const network = this.getNodeParameter('network', i) as string;
          const baseUrl = network === 'ethereum' ? 'https://api.ethereum.org/v1' : 'https://api.xrpl.org';
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/network/fees`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getValidators': {
          const options: any = {
            method: 'GET',
            url: 'https://api.xrpl.org/network/validators',
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
