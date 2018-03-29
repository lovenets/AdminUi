import { ValidationRules } from 'aurelia-validation';
import { Client } from '../helpers/client';



export class ValidationHelper {
	public urlRegex: any = /^(http:\/.|https:\/.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?$/;

	public setupValidation(client:Client) {
		ValidationRules
			.ensure('clientId').required()
			.ensure('clientName').required()
			.ensure('grantType').required()
			.ensure('clientUri').required().matches(this.urlRegex)
			.ensure('redirectUrl').matches(this.urlRegex)
			.ensure('frontChannelLogoutUrl').matches(this.urlRegex)
			.ensure('postLogoutUrl').matches(this.urlRegex)
			.on(client);
	}
}