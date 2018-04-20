import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';

@inject(HttpClient)
export class ClientHelper {
	public httpClient: HttpClient;
	public clientProperties: Array<string> = [];
	public grantTypes: Array<string> = [];
	public apiResources: Array<any> = [];	
	public identityResources: Array<any> = [];
	public urlRegex: any = /^(http:\/.|https:\/.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?$/;

	constructor(httpClient: HttpClient) {
		this.httpClient = httpClient;

		this.getClientProperties();
		this.getGrantTypes();
		this.getApiResource();
		this.getIdentityResource();
	}

	public async getClientProperties() {
		await this.httpClient.fetch('api/client/getclientproperties')
			.then(result => result.json())
			.then(data => {				
				this.clientProperties = data;
			});
	}

	public async getGrantTypes() {
		await this.httpClient.fetch('api/client/getgranttypes')
			.then(result => result.json())
			.then(data => {
				this.grantTypes = data;
			});
	}

	public async getApiResource() {
		await this.httpClient.fetch('api/client/getapiresources')
			.then(result => result.json())
			.then(data => {
				for (let apiResource of data) {
					apiResource.name = apiResource.name.replace(/_/g, " "); // to replace all occurences
				}
				this.apiResources = data;
			});
	}

	public async getIdentityResource() {
		await this.httpClient.fetch('api/client/getidentityresources')
			.then(result => result.json())
			.then(data => {
				for (let identityResource of data) {
					identityResource.name = identityResource.name.replace(/_/g, " "); // to replace all occurences
					if (identityResource.name == "openid") {
						identityResource.disabled = true;
					} else {
						identityResource.disabled = false;
					}
				}
				this.identityResources = data;
			});
	}
}
