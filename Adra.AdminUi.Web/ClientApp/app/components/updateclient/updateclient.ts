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

	constructor(httpClient: HttpClient, router: Router, clientHelper: ClientHelper, controllerFactory: ValidationControllerFactory, validator: Validator, validationHelper: ValidationHelper) {
		this.httpClient = httpClient;
		this.clientHelper = clientHelper;
		this.router = router;
		this.validationHelper = validationHelper;
		this.validator = validator;
		this.controller = controllerFactory.createForCurrentScope(validator);

		this.controller.validateTrigger = validateTrigger.changeOrBlur;
		this.controller.subscribe(event => this.validateWhole());

	}

	private validateWhole() {		
		this.validator.validateObject(this.client)
			.then(results => this.errors = results);
		this.canSave = this.isAllvalid(this.errors);	

		//console.log(this.controller.errors);
		
	}
	private isAllvalid(errors: any) {
		//console.log(errors);
		for (var error in errors)
			if (!errors[error].valid) return false;
		return true;
	}

	activate(params: { clientId: string; }) {
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
					}
				});
		}
	}
}
