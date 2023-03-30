namespace backend.Utilities
{
    class AppEnvironment {
        public static string GetConnectionString() {
            var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
            var dbName = Environment.GetEnvironmentVariable("DB_NAME");
            var dbUser = Environment.GetEnvironmentVariable("DB_USER");
            var dbPass = Environment.GetEnvironmentVariable("DB_PASS");

            string connectionString = $"Server={dbHost};Database={dbName};User Id={dbUser};Password={dbPass};Integrated Security=False;MultipleActiveResultSets=True;TrustServerCertificate=True";

            return connectionString;
        }
    }
}