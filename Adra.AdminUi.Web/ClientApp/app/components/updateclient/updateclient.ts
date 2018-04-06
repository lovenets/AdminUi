import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Client } from '../helpers/client';
import { ClientHelper } from '../helpers/clienthelper';
import { DialogService } from 'aurelia-dialog';
import { UriInput } from '../helpers/UriInput';
import { ValidationHelper } from '../helpers/validationHelper';
import { ValidationControllerFactory, ValidationRules, ValidationController, Validator, validateTrigger } from 'aurelia-validation';

@inject(HttpClient, Router, ClientHelper, ValidationControllerFactory, Validator, ValidationHelper)
export class UpdateClient {
	httpClient: HttpClient;
	router: Router;
	clientHelper: ClientHelper;
	validator: Validator;
	validationHelper: ValidationHelper;
	canSave: boolean = false;
	controller: ValidationController;
	client: Client = new Client();
	selectedIdentityResources: Array<number> = [];
	selectedApiResources: Array<number> = [];
	allowedScopes: Array<number> = [];
	redirectUrls: Array<string> = [];
	redirectUriArray: Array<UriInput> = [];
	errors: any;	
	public name: string;
	public active: boolean = false;

	constructor(httpClient: HttpClient, router: Router, clientHelper: ClientHelper, controllerFactory: ValidationControllerFactory, validator: Validator, validationHelper: ValidationHelper) {
		this.httpClient = httpClient;
		this.clientHelper = clientHelper;
		this.router = router;
		this.validationHelper = validationHelper;
		this.validator = validator;
		this.controller = controllerFactory.createForCurrentScope(validator);		

		this.canSave = false;
		this.controller.validateTrigger = validateTrigger.changeOrBlur;
		this.controller.subscribe(event => this.validateWhole());
		
	}

	private validateWhole() {
		let errorCount = this.controller.errors.length;
		if (errorCount == 0) {
			this.canSave = true;
		} else {
			this.canSave = false;
		}		
	}

	activate(params: { clientId: string; }) {
		this.active = true;

		var client = { ClientId: params.clientId };
		this.validationHelper.setupValidation(); 	// get validation rules from validationhelper
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
				this.validationHelper.clientId = data.clientId;
				this.validationHelper.clientName = data.clientName;
				this.validationHelper.grantType = data.grantType;
				this.validationHelper.clientUri = data.clientUri;
				this.validationHelper.frontChannelLogoutUri = data.frontChannelLogoutUrl;
				this.validationHelper.postLogoutUri = data.postLogoutUrl;
				this.active = false;
			});
	}	

	public addRedirectInput() {
		var id = this.redirectUriArray.length + 1;
		this.redirectUriArray.push(new UriInput(id, ""));
	}

	public removeRedirectInput(uriInput: UriInput) {
		this.redirectUriArray = this.redirectUriArray.filter(obj => obj !== uriInput);
		console.log(this.redirectUriArray);
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

		var client = { ClientId: this.validationHelper.clientId, ClientName: this.validationHelper.clientName, ClientSecret: this.client.clientSecret, GrantType: this.client.grantType, ClientProperty: this.client.clientProperty, AllowedScopes: this.allowedScopes, ClientUri: this.validationHelper.clientUri, RedirectUrls: this.redirectUrls, FrontChannelLogoutUrl: this.validationHelper.frontChannelLogoutUri, PostLogoutUrl: this.validationHelper.postLogoutUri };

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
				} else {
					alert("Update failed");
					this.router.navigateToRoute('viewallclients')
				}
			});
	}

	public delete(clientId: string) {
		var retVal = confirm("Are you sure you need to delete this client ?");
		if (retVal == true) {
			var client = { ClientId: this.client.clientId };

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
					} else {
						alert("Delete failed");
						this.router.navigateToRoute('viewallclients')
					}
				});
		}
	}
}
