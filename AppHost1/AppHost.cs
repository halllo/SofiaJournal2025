var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.SofiaJournal2025_Backend>("SofiaJournal2025-Backend");

builder.AddNpmApp("SofiaJournal2025-Frontend", "../sofia-journal-2025-ui")
    .WithUrl("http://localhost:4200");

builder.Build().Run();
