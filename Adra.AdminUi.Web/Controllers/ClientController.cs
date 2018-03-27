using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using BusinessLogicLayer.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SharedModels;

namespace ClientApp.Controllers
{
    [Produces("application/json")]
    [Route("api/Client")]
    public class ClientController : Controller
    {
        private readonly IApplicationClientService _applicationClientService;

        public ClientController(IApplicationClientService applicationClientService)
        {
            _applicationClientService = applicationClientService;
        }

        [HttpGet]
        [Route("getClients")]
        public List<Client> GetClients()
        {
            return _applicationClientService.GetClients();
        }

        [HttpGet]
        [Route("getclientproperties")]
        public List<string> GetClientProperties()
        {
            return _applicationClientService.GetClientProperties();
        }

        [HttpGet]
        [Route("getapiresources")]
        public List<ApiResource> GetApiResource()
        {
            return _applicationClientService.GetApiResources();
        }

        [HttpGet]
        [Route("getidentityresources")]
        public List<IdentityResource> GetIdentityResources()
        {
            return _applicationClientService.GetIdentityResources();
        }

        [HttpGet]
        [Route("getgranttypes")]
        public List<string> GetGrantTypes()
        {
            return _applicationClientService.GetGrantTypes();
        }



        [HttpPost]
        [Route("addclient")]
        public string AddClient([FromBody]Client client)
        {
            _applicationClientService.AddClient(client);
            return "ok";
        }

        [HttpPost]
        [Route("getclientbyclientid")]
        public Client GetClientByClientId([FromBody]Client client)
        {
            

            return _applicationClientService.GetClientByClientId(client.ClientId);
        }

        [HttpPost]
        [Route("updateclient")]
        public string UpdateClient([FromBody]Client client)
        {
            _applicationClientService.UpdateClient(client);
            return "ok";
        }

        [HttpPost]
        [Route("deleteclient")]
        public string DeleteClient([FromBody]Client client)
        {
            _applicationClientService.DeleteClient(client.ClientId);
            return "ok";
        }
    }
}