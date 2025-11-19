var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.SofiaJournal2025_Backend>("SofiaJournal2025-Backend");

builder.Build().Run();
