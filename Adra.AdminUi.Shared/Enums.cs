using System;
using System.Collections.Generic;
using System.Text;

namespace SharedModels
{
    public static class Enums
    {
        public static class ClientProperties
        {
            public static readonly string Balancer = "Balancer";
            public static readonly string TaskManager = "TaskManager";
            public static readonly string IntegrationHub = "IntegrationHub";
            public static readonly string Setup = "Setup";
            public static readonly string Support = "Support";
            public static readonly string ScreenSteps = "ScreenSteps";
        }

        public static class GrantTypes
        {
            public static readonly string Password = "password";
            public static readonly string ClientCredentials = "client credentials";
            public static readonly string Hybrid = "hybrid";
        }
    }
}
