using BusinessLogicLayer.Services.Interfaces;
using DataAccessLayer.Repositories.Interfaces;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.Models;
using SharedModels;
using System;
using System.Collections.Generic;
using System.Collections;
using System.Text;

namespace BusinessLogicLayer.Services
{
    public class ApplicationClientService : IApplicationClientService
    {
        private readonly IApplicationClientRepository _applicationClientRepository;

        public ApplicationClientService(IApplicationClientRepository applicationClientService)
        {
            _applicationClientRepository = applicationClientService;
        }

        public List<string> GetClientProperties()
        {
            var clientProperties = new List<string>();

            clientProperties.Add(Enums.ClientProperties.Balancer);
            clientProperties.Add(Enums.ClientProperties.TaskManager);
            clientProperties.Add(Enums.ClientProperties.IntegrationHub);
            clientProperties.Add(Enums.ClientProperties.Setup);
            clientProperties.Add(Enums.ClientProperties.Support);
            clientProperties.Add(Enums.ClientProperties.ScreenSteps);

            return clientProperties;
        }

        public List<SharedModels.ApiResource> GetApiResources()
        {
            var list = new List<SharedModels.ApiResource>();
            var result = _applicationClientRepository.GetApiResources();

            foreach (IdentityServer4.EntityFramework.Entities.ApiResource ar in result)
            {
                var apiResource = new SharedModels.ApiResource();
                apiResource.Id = ar.Id;
                apiResource.Name = ar.Name;
                list.Add(apiResource);
            }
            return list;
        }

        public List<SharedModels.IdentityResource> GetIdentityResources()
        {
            var list = new List<SharedModels.IdentityResource>();
            var result = _applicationClientRepository.GetIdentityResources();

            foreach (IdentityServer4.EntityFramework.Entities.IdentityResource ir in result)
            {
                var identityResource = new SharedModels.IdentityResource();
                identityResource.Id = ir.Id;
                identityResource.Name = ir.Name;
                list.Add(identityResource);
            }
            return list;
        }

        public List<string> GetGrantTypes()
        {
            var grantTypes = new List<string>();

            grantTypes.Add(Enums.GrantTypes.ClientCredentials);
            grantTypes.Add(Enums.GrantTypes.Password);
            grantTypes.Add(Enums.GrantTypes.Hybrid);

            return grantTypes;
        }
        public List<SharedModels.Client> GetClients()
        {
            var list = new List<SharedModels.Client>();
            var result = _applicationClientRepository.GetClients();

            foreach (IdentityServer4.EntityFramework.Entities.Client clientModel in result)
            {
                SharedModels.Client client = MapDaltoBll(clientModel);
                list.Add(client);
            }
            return list;
        }

        public SharedModels.Client GetClientByClientId(string clientId)
        {
            var clientModel = _applicationClientRepository.GetClientByClientId(clientId);
            SharedModels.Client client = MapDaltoBll(clientModel);
            return client;
        }

        public void AddClient(SharedModels.Client client)
        {
            IdentityServer4.EntityFramework.Entities.Client clientModel = MapBllToDal(client);
            _applicationClientRepository.AddClient(clientModel);

        }

        public void DeleteClient(string clientId)
        {
            var deleteobj = _applicationClientRepository.GetClientByClientId(clientId);
            _applicationClientRepository.DeleteClient(deleteobj);
        }

        public void UpdateClient(SharedModels.Client client)
        {
            IdentityServer4.EntityFramework.Entities.Client clientModel = MapBllToDal(client);

            var deleteobj = _applicationClientRepository.GetClientByClientId(clientModel.ClientId);
            _applicationClientRepository.DeleteClient(deleteobj);
            _applicationClientRepository.AddClient(clientModel);

        }

        private IdentityServer4.EntityFramework.Entities.Client MapBllToDal(SharedModels.Client client)
        {
            IdentityServer4.Models.Client clientModelIds4 = new IdentityServer4.Models.Client();

            clientModelIds4.ClientName = client.ClientName;
            clientModelIds4.ClientUri = client.ClientUri;
            clientModelIds4.ClientId = client.ClientId;
            clientModelIds4.FrontChannelLogoutUri = client.FrontChannelLogoutUrl;

            if (client.ClientSecret != null)
            {
                IdentityServer4.Models.Secret secret = new IdentityServer4.Models.Secret(client.ClientSecret.Sha256());
                secret.Type = "SharedSecret";
                clientModelIds4.ClientSecrets = new List<IdentityServer4.Models.Secret>();
                clientModelIds4.ClientSecrets.Add(secret);
            }
            

            clientModelIds4.AllowedGrantTypes = new List<string>();
            client.GrantType = client.GrantType.Replace(" ", "_");
            clientModelIds4.AllowedGrantTypes.Add(client.GrantType);

            if (client.ClientProperty != null)
            {
                string key = "ApplicationType";
                clientModelIds4.Properties = new Dictionary<string, string>();
                clientModelIds4.Properties.Add(key, client.ClientProperty);
            }

            clientModelIds4.AllowedScopes = new List<string>();
            foreach (string scope in client.AllowedScopes)
            {
                var replacedScope = scope.Replace(" ", "_");
                clientModelIds4.AllowedScopes.Add(replacedScope);
            }

            clientModelIds4.RedirectUris = new List<string>();
            foreach (string redirctUri in client.RedirectUrls)
            {
                clientModelIds4.RedirectUris.Add(redirctUri);
            }
            
            clientModelIds4.PostLogoutRedirectUris = new List<string>();
            clientModelIds4.PostLogoutRedirectUris.Add(client.PostLogoutUrl);

            return clientModelIds4.ToEntity();
        }

        private SharedModels.Client MapDaltoBll(IdentityServer4.EntityFramework.Entities.Client clientModel)
        {
            IdentityServer4.Models.Client clientModelIds4 = new IdentityServer4.Models.Client();
            clientModelIds4 = clientModel.ToModel();

            SharedModels.Client client = new SharedModels.Client();
            client.ClientId = clientModelIds4.ClientId;
            client.ClientName = clientModelIds4.ClientName;
            client.ClientUri = clientModelIds4.ClientUri;
            client.FrontChannelLogoutUrl = clientModelIds4.FrontChannelLogoutUri;

            if (clientModelIds4.ClientSecrets.Count > 0)
            {
                foreach (IdentityServer4.Models.Secret secret in clientModelIds4.ClientSecrets)
                {
                    client.ClientSecret = secret.Value;
                }
            }

            if (clientModelIds4.AllowedGrantTypes.Count > 0)
            {
                foreach (string grantType in clientModelIds4.AllowedGrantTypes)
                {
                    client.GrantType = grantType;
                }
            }

            if (clientModelIds4.Properties.Count > 0)
            {
                foreach (var property in clientModelIds4.Properties)
                {
                    client.ClientProperty = property.Value;
                }
            }

            if (clientModelIds4.RedirectUris.Count > 0)
            {
                client.RedirectUrls = new string[clientModel.RedirectUris.Count];
                int i = 0;
                foreach (string uri in clientModelIds4.RedirectUris)
                {
                    client.RedirectUrls[i] = uri;
                    i++;
                }
            }

            if (clientModelIds4.PostLogoutRedirectUris.Count > 0)
            {
                foreach (string uri in clientModelIds4.PostLogoutRedirectUris)
                {
                    client.PostLogoutUrl = uri;
                }
            }

            if (clientModelIds4.AllowedScopes.Count > 0)
            {
                client.AllowedScopes = new string[clientModel.AllowedScopes.Count];
                int i = 0;
                foreach (string scope in clientModelIds4.AllowedScopes)
                {
                    client.AllowedScopes[i] = scope;
                    i++;
                }
            }
            return client;
        }

    }
}
