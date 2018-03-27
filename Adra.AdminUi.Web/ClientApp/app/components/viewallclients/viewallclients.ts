import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Client } from '../helpers/client';


//let httpClient = new HttpClient();
@inject(HttpClient, Router)
export class ViewAllClients {
	public httpClient: HttpClient;
	public router: Router;
	public clients: Array<Client> = [];

	constructor(httpClient: HttpClient, router: Router) {
		this.httpClient = httpClient;
		this.router = router;


		this.getAllClients();
	}

	public getAllClients() {
		this.httpClient.fetch('api/client/getClients')
			.then(result => result.json())
			.then(data => {
				this.clients = data;
			});
	}

	public onSelectContact(event: UIEvent, client: Client) {
		this.router.navigateToRoute('updateclient', { clientId: client.clientId })
	}

}
