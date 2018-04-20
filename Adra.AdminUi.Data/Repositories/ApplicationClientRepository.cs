using DataAccessLayer.DbContexts;
using DataAccessLayer.Repositories.Interfaces;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccessLayer.Repositories
{
    public class ApplicationClientRepository : IApplicationClientRepository
    {
        private ApplicationConfigurationDbContext _DbContext;
        public ApplicationClientRepository(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("IdentityDemo");
            var optionsBuilder = new DbContextOptionsBuilder<ConfigurationDbContext>();
            optionsBuilder.UseSqlServer(connectionString);
            var ob = new ConfigurationStoreOptions();
            
            _DbContext = new ApplicationConfigurationDbContext(optionsBuilder.Options, ob);
        }
        public IEnumerable<Client> GetClients()
        {
            var client = _DbContext.Clients
                                    .Include(c => c.ClientSecrets)
                                    .Include(c => c.Properties)
                                    .Include(c => c.AllowedGrantTypes)
                                    .Include(c => c.AllowedScopes)
                                    .Include(c => c.RedirectUris)
                                    .Include(c => c.PostLogoutRedirectUris);
            return client;
        }

        public IEnumerable<ApiResource> GetApiResources()
        {
            var apiResources = _DbContext.ApiResources;
            return apiResources;
        }

        public IEnumerable<IdentityResource> GetIdentityResources()
        {
            var identityResources = _DbContext.IdentityResources;
            return identityResources;
        }

        public void AddClient(Client client)
        {
            var identityResources = _DbContext.Add(client);
            _DbContext.SaveChanges();
        }

        public Client GetClientByClientId(string clientId)
        {
           return  _DbContext.GetClientByID(clientId);
        }
        
        public void DeleteClient(Client client)
        {
             _DbContext.Remove(client);
            _DbContext.SaveChanges();
        }

        public void UpdateClient(Client client)
        {
            var ExistingClient = _DbContext.GetClientByID(client.ClientId);
            var exclient = _DbContext.Clients.Find(ExistingClient.Id);
            _DbContext.Entry(ExistingClient).CurrentValues.SetValues(client);
            _DbContext.SaveChanges();
        }
    }
}
