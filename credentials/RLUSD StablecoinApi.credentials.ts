import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RLUSDStablecoinApi implements ICredentialType {
	name = 'rlusdStablecoinApi';
	displayName = 'RLUSD Stablecoin API';
	documentationUrl = 'https://docs.velocity-bpa.com/rlusd-stablecoin';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key for blockchain data provider authentication',
		},
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{
					name: 'XRPL',
					value: 'xrpl',
				},
				{
					name: 'Ethereum',
					value: 'ethereum',
				},
			],
			default: 'xrpl',
			description: 'The blockchain network to connect to',
		},
		{
			displayName: 'API Base URL',
			name: 'apiBaseUrl',
			type: 'string',
			default: 'https://api.xrpl.org',
			description: 'Base URL for the API endpoint',
		},
	];
}