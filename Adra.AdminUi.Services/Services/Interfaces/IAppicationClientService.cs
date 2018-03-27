using SharedModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessLogicLayer.Services.Interfaces
{
    public interface IApplicationClientService
    {
        List<Client> GetClients();
        List<string> GetClientProperties();
        List<string> GetGrantTypes();
        List<ApiResource> GetApiResources();
        List<IdentityResource> GetIdentityResources();
        void AddClient(Client client);
        Client GetClientByClientId(string clientId);
        void UpdateClient(Client client);
        void DeleteClient(string clientId);
    }
}
