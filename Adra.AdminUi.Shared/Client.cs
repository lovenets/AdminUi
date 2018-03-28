using System;
using System.Collections.Generic;
using System.Text;

namespace SharedModels
{
    public class Client
    {
        public string ClientId { get; set; }
        public string ClientName { get; set; }
        public string ClientSecret { get; set; }
        public string GrantType { get; set; }
        public string ClientProperty { get; set; }
        public string[] AllowedScopes { get; set; }        
        public string ClientUri { get; set; }
        public string[] RedirectUrls { get; set; }
        public string FrontChannelLogoutUrl { get; set; }
        public string PostLogoutUrl { get; set; }

    }
}
