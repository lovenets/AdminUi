using IdentityServer4.EntityFramework.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccessLayer.Repositories.Interfaces
{
    public interface IApplicationClientRepository
    {
        IEnumerable<Client> GetClients();
        IEnumerable<ApiResource> GetApiResources();
        IEnumerable<IdentityResource> GetIdentityResources();
        void AddClient(Client client);
        Client GetClientByClientId(string clientId);
        void DeleteClient(Client client);
        
    }
}
