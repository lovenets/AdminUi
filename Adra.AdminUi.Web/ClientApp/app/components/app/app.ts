import { Aurelia, PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

export class App {
	router: Router;

	configureRouter(config: RouterConfiguration, router: Router) {
		config.title = 'ClientApp';
		config.map([
			{
				route: ['', 'home'],
				name: 'home',
				settings: { icon: 'home' },
				moduleId: PLATFORM.moduleName('../home/home'),
				nav: true,
				title: 'Home'
			}, {
				route: 'addclient',
				name: 'addclient',
				settings: { icon: 'education' },
				moduleId: PLATFORM.moduleName('../addclient/addclient'),
				nav: true,
				title: 'Add Client'
			}, {
				route: 'viewallclients',
				name: 'viewallclients',
				settings: { icon: 'th-list' },
				moduleId: PLATFORM.moduleName('../viewallclients/viewallclients'),
				nav: true,
				title: 'View Clients'
			}, {
				route: 'updateclient/:clientId',
				name: 'updateclient',
				href: "updateclient",
				settings: { icon: 'th-list' },
				moduleId: PLATFORM.moduleName('../updateclient/updateclient'),
				nav: false,
				title: 'View Client'
			}]);

		this.router = router;
	}
}
