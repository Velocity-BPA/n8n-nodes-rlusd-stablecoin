/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { RLUSDStablecoin } from '../nodes/RLUSD Stablecoin/RLUSD Stablecoin.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('RLUSDStablecoin Node', () => {
  let node: RLUSDStablecoin;

  beforeAll(() => {
    node = new RLUSDStablecoin();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('RLUSD Stablecoin');
      expect(node.description.name).toBe('rlusdstablecoin');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 4 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(4);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(4);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('AccountBalances Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key',
        baseUrl: 'https://api.xrpl.org'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBalance')
      .mockReturnValueOnce('rXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
      .mockReturnValueOnce('xrpl');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      balance: '1000.00',
      currency: 'RLUSD'
    });

    const result = await executeAccountBalancesOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.balance).toBe('1000.00');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.xrpl.org/account/rXXXXXXXXXXXXXXXXXXXXXXXXXXXX/balances',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json'
      },
      qs: { network: 'xrpl' },
      json: true
    });
  });

  it('should handle getBalance error', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBalance')
      .mockReturnValueOnce('invalid-address')
      .mockReturnValueOnce('xrpl');
    
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAccountBalancesOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid address');
  });

  it('should get account info successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountInfo')
      .mockReturnValueOnce('rXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      account: 'rXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      balance: '1000.00',
      sequence: 123
    });

    const result = await executeAccountBalancesOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.account).toBe('rXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  });

  it('should get batch balances successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBatchBalances')
      .mockReturnValueOnce('addr1,addr2,addr3')
      .mockReturnValueOnce('ethereum');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([
      { address: 'addr1', balance: '100.00' },
      { address: 'addr2', balance: '200.00' },
      { address: 'addr3', balance: '300.00' }
    ]);

    const result = await executeAccountBalancesOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toHaveLength(3);
  });

  it('should get balance history successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBalanceHistory')
      .mockReturnValueOnce('rXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
      .mockReturnValueOnce('2024-01-01T00:00:00Z')
      .mockReturnValueOnce('2024-01-31T23:59:59Z');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      history: [
        { date: '2024-01-01', balance: '1000.00' },
        { date: '2024-01-15', balance: '1200.00' }
      ]
    });

    const result = await executeAccountBalancesOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.history).toHaveLength(2);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.xrpl.org/account/rXXXXXXXXXXXXXXXXXXXXXXXXXXXX/history',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json'
      },
      qs: { 
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z'
      },
      json: true
    });
  });
});

describe('Transactions Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.xrpl.org' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('sendTokens operation', () => {
    it('should send RLUSD tokens successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendTokens')
        .mockReturnValueOnce('rSender123')
        .mockReturnValueOnce('rReceiver456')
        .mockReturnValueOnce('100')
        .mockReturnValueOnce('xrpl');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        transactionHash: '0x123',
        status: 'pending'
      });

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.transactionHash).toBe('0x123');
    });

    it('should handle send tokens error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendTokens')
        .mockReturnValueOnce('invalid-address')
        .mockReturnValueOnce('rReceiver456')
        .mockReturnValueOnce('100')
        .mockReturnValueOnce('xrpl');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Invalid address format')
      );
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('Invalid address format');
    });
  });

  describe('getTransaction operation', () => {
    it('should get transaction details successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransaction')
        .mockReturnValueOnce('0xabc123');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        hash: '0xabc123',
        status: 'confirmed',
        amount: '100'
      });

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.hash).toBe('0xabc123');
      expect(result[0].json.status).toBe('confirmed');
    });
  });

  describe('getAccountTransactions operation', () => {
    it('should get account transactions successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountTransactions')
        .mockReturnValueOnce('rAccount123')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        transactions: [
          { hash: '0x1', amount: '50' },
          { hash: '0x2', amount: '25' }
        ],
        total: 2
      });

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.transactions).toHaveLength(2);
    });
  });

  describe('estimateTransaction operation', () => {
    it('should estimate transaction fees successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('estimateTransaction')
        .mockReturnValueOnce('rSender123')
        .mockReturnValueOnce('rReceiver456')
        .mockReturnValueOnce('100')
        .mockReturnValueOnce('ethereum');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        estimatedGas: '21000',
        gasPrice: '20000000000',
        estimatedFee: '0.00042'
      });

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.estimatedGas).toBe('21000');
    });
  });

  describe('getPendingTransactions operation', () => {
    it('should get pending transactions successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPendingTransactions')
        .mockReturnValueOnce('rAccount123');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        pendingTransactions: [
          { hash: '0x1', status: 'pending' }
        ]
      });

      const result = await executeTransactionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.pendingTransactions).toHaveLength(1);
    });
  });
});

describe('TokenInfo Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://api.xrpl.org' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { 
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn() 
			},
		};
	});

	describe('getTokenInfo operation', () => {
		it('should successfully get token info for XRPL network', async () => {
			const expectedResult = { 
				contractAddress: '0x123',
				name: 'RLUSD',
				symbol: 'RLUSD',
				decimals: 18
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTokenInfo')
				.mockReturnValueOnce('xrpl');
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResult);

			const result = await executeTokenInfoOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.xrpl.org/token/info',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json'
				},
				qs: { network: 'xrpl' },
				json: true
			});

			expect(result).toEqual([{
				json: expectedResult,
				pairedItem: { item: 0 }
			}]);
		});

		it('should handle API errors gracefully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTokenInfo')
				.mockReturnValueOnce('ethereum');
			
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTokenInfoOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result).toEqual([{
				json: { error: 'API Error' },
				pairedItem: { item: 0 }
			}]);
		});
	});

	describe('getTotalSupply operation', () => {
		it('should successfully get total supply', async () => {
			const expectedResult = { totalSupply: '1000000000000000000000000' };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTotalSupply')
				.mockReturnValueOnce('ethereum');
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResult);

			const result = await executeTokenInfoOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result).toEqual([{
				json: expectedResult,
				pairedItem: { item: 0 }
			}]);
		});
	});

	describe('getTokenHolders operation', () => {
		it('should successfully get token holders with pagination', async () => {
			const expectedResult = { 
				holders: [
					{ address: '0x123', balance: '1000' },
					{ address: '0x456', balance: '2000' }
				],
				total: 100
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTokenHolders')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(10);
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResult);

			const result = await executeTokenInfoOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.xrpl.org/token/holders',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json'
				},
				qs: { limit: 50, offset: 10 },
				json: true
			});

			expect(result).toEqual([{
				json: expectedResult,
				pairedItem: { item: 0 }
			}]);
		});
	});

	describe('getTokenStats operation', () => {
		it('should successfully get token statistics', async () => {
			const expectedResult = { 
				volume24h: '5000000',
				marketCap: '1000000000',
				priceChange24h: '0.0001'
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTokenStats')
				.mockReturnValueOnce('7d');
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResult);

			const result = await executeTokenInfoOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.xrpl.org/token/stats',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json'
				},
				qs: { timeframe: '7d' },
				json: true
			});

			expect(result).toEqual([{
				json: expectedResult,
				pairedItem: { item: 0 }
			}]);
		});
	});
});

describe('NetworkStatus Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.xrpl.org' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getNetworkStatus', () => {
    it('should get network status successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getNetworkStatus')
        .mockReturnValueOnce('xrpl');
      
      const mockResponse = { 
        status: 'healthy',
        block_height: 12345,
        network_id: 'xrpl-mainnet'
      };
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkStatusOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.xrpl.org/network/status',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle network status error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getNetworkStatus')
        .mockReturnValueOnce('ethereum');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      
      const error = new Error('Network unavailable');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeNetworkStatusOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual({ error: 'Network unavailable' });
    });
  });

  describe('getLatestBlock', () => {
    it('should get latest block successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLatestBlock')
        .mockReturnValueOnce('xrpl');
      
      const mockResponse = { 
        block_number: 67890,
        block_hash: '0xabc123',
        timestamp: '2023-12-01T00:00:00Z'
      };
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkStatusOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.xrpl.org/network/blocks/latest',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle latest block error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLatestBlock')
        .mockReturnValueOnce('ethereum');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      
      const error = new Error('Block not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeNetworkStatusOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual({ error: 'Block not found' });
    });
  });

  describe('getNetworkFees', () => {
    it('should get network fees successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getNetworkFees')
        .mockReturnValueOnce('ethereum');
      
      const mockResponse = { 
        base_fee: '20',
        priority_fee: '2',
        gas_price: '22'
      };
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkStatusOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.ethereum.org/v1/network/fees',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle network fees error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getNetworkFees')
        .mockReturnValueOnce('xrpl');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      
      const error = new Error('Fee estimation failed');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeNetworkStatusOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual({ error: 'Fee estimation failed' });
    });
  });

  describe('getValidators', () => {
    it('should get validators successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getValidators');
      
      const mockResponse = { 
        validators: [
          { address: 'rValidator1', stake: '1000000' },
          { address: 'rValidator2', stake: '2000000' }
        ]
      };
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNetworkStatusOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.xrpl.org/network/validators',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle validators error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getValidators');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      
      const error = new Error('Validators not available');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeNetworkStatusOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual({ error: 'Validators not available' });
    });
  });
});
});
