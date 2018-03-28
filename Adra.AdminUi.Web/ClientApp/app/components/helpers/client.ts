export class Client {
	public clientId: string = "";
	public clientName: string = "";
	public clientSecret: string = "";
	public grantType: string = "";
	public clientProperty: string = "";
	public clientUri: string = "";
	public redirectUrls: Array<string> = [];
	public frontChannelLogoutUrl: string = "";
	public postLogoutUrl: string = "";
	public allowedScopes: Array<string> = [];
}