import { ValidationRules } from 'aurelia-validation';
import { Client } from '../helpers/client';
import { UriInput } from '../helpers/UriInput';



export class ValidationHelper {
	public urlRegex: any = /^http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$/;
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