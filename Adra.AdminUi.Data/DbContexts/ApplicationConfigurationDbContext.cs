using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace DataAccessLayer.DbContexts
{

    public class ApplicationConfigurationDbContext : ConfigurationDbContext, IApplicationConfigurationDbContext
    {        
        public ApplicationConfigurationDbContext(DbContextOptions<ConfigurationDbContext> options, ConfigurationStoreOptions storeOptions) : base(options, storeOptions)
        {
        }

        public DbSet<Client> GetAll()
        {            
          return Set<Client>();
        }

        public Client GetClientByID(string clientId)
        {
            return Set<Client>().Where(c => c.ClientId == clientId)
                                       .Include(c => c.ClientSecrets)
                                      .Include(c => c.Properties)
                                      .Include(c => c.AllowedGrantTypes)
                                      .Include(c => c.AllowedScopes)
                                      .Include(c => c.RedirectUris)
                                      .Include(c => c.PostLogoutRedirectUris).FirstOrDefault();
        }

       

    }
}
