import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Client } from '../helpers/client';
import { ClientHelper } from '../helpers/clienthelper';
import { DialogService } from 'aurelia-dialog';
import { UriInput } from '../helpers/UriInput';
import { ValidationControllerFactory, ValidationRules, ValidationController, Validator, validateTrigger } from 'aurelia-validation';

@inject(HttpClient, Router, ClientHelper,  ValidationControllerFactory, Validator)
export class UpdateClient {
	public httpClient: HttpClient;
	public router: Router;
	public clientHelper: ClientHelper;
	public validator: Validator;
	public canSave: boolean;
	public controller: ValidationController;	
	public client: Client = new Client();

	public clientName: string = "";
	public clientId: string = "";
	public clientSecret: string = "";
	public grantType: string = "";
	public clientProperty: string = "";
	public clientUri: string = "";
	public redirectUrl: string = "";
	public frontChannelLogoutUrl: string = "";
	public postLogoutUrl: string = "";
	public selectedIdentityResources: Array<number> = [];
	public selectedApiResources: Array<number> = [];
	public allowedScopes: Array<number> = [];
	public redirectUrls: Array<string> = [];
	public redirectUriArray: Array<UriInput> = [];


	constructor(httpClient: HttpClient, router: Router, clientHelper: ClientHelper, controllerFactory: ValidationControllerFactory, validator: Validator) {
		this.httpClient = httpClient;
		this.clientHelper = clientHelper;
		this.router = router;
		this.validator = validator;
		this.controller = controllerFactory.createForCurrentScope(validator);

		//this.controller = controllerFactory.createForCurrentScope();
		ValidationRules
			.ensure('clientId').required()
			.ensure('clientName').required()
			.ensure('grantType').required()
			.ensure('clientUri').required().matches(this.clientHelper.urlRegex)
			.ensure('redirectUrl').matches(this.clientHelper.urlRegex)
			.ensure('frontChannelLogoutUrl').matches(this.clientHelper.urlRegex)
			.ensure('postLogoutUrl').matches(this.clientHelper.urlRegex)
			.on(this.client);

		this.canSave = false;
		this.controller.validateTrigger = validateTrigger.changeOrBlur;
		this.controller.subscribe(event => this.validateWhole());

		
	}

	private validateWhole() {
		this.validator.validateObject(this.client)
			.then(results => this.canSave = results.every(result => result.valid));
	}

	activate(params: { clientId: string; }) {
		var client = { ClientId: params.clientId };
		this.httpClient.fetch('api/client/getclientbyclientid',
			{
				method: "POST",
				body: JSON.stringify(client),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(result => result.json())
			.then(data => {
				if (data.allowedScopes) {
					for (let scope of data.allowedScopes) {
						scope = scope.replace(/_/g, " "); // to replace all occurences		
						for (let ir of this.clientHelper.identityResources) {
							if (ir.name == scope) {
								this.selectedIdentityResources.push(scope);
							}
						}

						for (let ap of this.clientHelper.apiResources) {
							if (ap.name == scope) {
								this.selectedApiResources.push(scope);
							}
						}
					}
				}
				if (data.redirectUrls) {
					var i = 1;
					for (let redirecturi of data.redirectUrls) {
						this.redirectUriArray.push(new UriInput(i, redirecturi));
						i++;
					}
				} else {
					this.redirectUriArray.push(new UriInput(0, ""));
				}
				this.client = data;
				console.log(this.client);				
			});
	}
	public resetController() {
		if (this.controller.errors) {
			this.controller.reset();
		}
	}

	public addRedirectInput() {
		var id = this.redirectUriArray.length + 1;
		this.redirectUriArray.push(new UriInput(id, ""));
	}

	public update() {
		for (let resource of this.selectedIdentityResources) {
			this.allowedScopes.push(resource);
		}
		for (let resource of this.selectedApiResources) {
			this.allowedScopes.push(resource);
		}
		
		for (let uriInput of this.redirectUriArray) {
			if (uriInput.uri != "") {
				this.redirectUrls.push(uriInput.uri);
			}
		}
		console.log(this.redirectUriArray);

		var client = { ClientId: this.client.clientId, ClientName: this.client.clientName, ClientSecret: this.client.clientSecret, GrantType: this.client.grantType, ClientProperty: this.client.clientProperty, AllowedScopes: this.allowedScopes, ClientUri: this.client.clientUri, RedirectUrls: this.redirectUrls, FrontChannelLogoutUrl: this.client.frontChannelLogoutUrl, PostLogoutUrl: this.client.postLogoutUrl };

		this.httpClient.fetch('api/client/updateclient',
			{
				method: "POST",
				body: JSON.stringify(client),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(result => result.json())
			.then(data => {
				if (data == "ok") {
					alert("Client Successfully Updated.");
					this.router.navigateToRoute('viewallclients')
				}
			});
	}

	public delete(clientId: string) {
		var retVal = confirm("Are you sure you need to delete this client ?");
		if (retVal == true) {
			var client = { ClientId: this.client.clientId};

			this.httpClient.fetch('api/client/deleteclient',
				{
					method: "POST",
					body: JSON.stringify(client),
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.then(result => result.json())
				.then(data => {
					if (data == "ok") {
						alert("Client Successfully Deleted.");
						this.router.navigateToRoute('viewallclients')
					}					
				});
		}
	}
}
