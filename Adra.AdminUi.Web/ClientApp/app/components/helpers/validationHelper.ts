import { ValidationRules } from 'aurelia-validation';
import { Client } from '../helpers/client';
import { UriInput } from '../helpers/UriInput';



export class ValidationHelper {
	public urlRegex: any = /^(http:\/.|https:\/.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?$/;
	public client = new Client();
	public clientName: string = "";
	public clientId: string = "";
	public grantType: string = "";
	public clientUri: string = "";
	public frontChannelLogoutUri: string = "";
	public postLogoutUri: string = "";


	public setupValidation() {
		
		ValidationRules
			.ensure('clientId').required()
			.ensure('clientName').required()
			.ensure('grantType').required()
			.ensure('clientUri').required().matches(this.urlRegex)
			.ensure('redirectUrl').matches(this.urlRegex)
			.ensure('frontChannelLogoutUrl').matches(this.urlRegex)
			.ensure('postLogoutUrl').matches(this.urlRegex)
			.on(Client);

		ValidationRules
			.ensure('uri').matches(this.urlRegex)
			.on(UriInput)

		ValidationRules
			.ensure('clientId').required().withMessage("Client Id is required")
			.ensure('clientName').required().withMessage("Client Name is required")
			.ensure('grantType').required().withMessage("Client Name is required")
			.ensure('clientUri').required().matches(this.urlRegex)
			.ensure('frontChannelLogoutUri').matches(this.urlRegex)
			.ensure('postLogoutUri').matches(this.urlRegex)
			.on(this)
	}
}