
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Diagnostics.Metrics;

var builder = WebApplication.CreateBuilder(args);

OpenTelemetryExtensions.ConfigureOpenTelemetry(builder);

builder.Services.AddHealthChecks()
	.AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();

    // All health checks must pass for app to be considered ready to accept traffic after starting
	app.MapHealthChecks("/health");

	// Only health checks tagged with the "live" tag must pass for app to be considered alive
	app.MapHealthChecks("/alive", new HealthCheckOptions
	{
		Predicate = r => r.Tags.Contains("live")
	});
}

//app.UseHttpsRedirection(); to not break the angular proxy on local

int nextId = 1;
List<JournalEntry> journalEntries = [];

var meter = new Meter("SofiaJournal2025.Journal", "1.0.0");
var journalEntriesAddedCounter = meter.CreateCounter<int>("journal_entries_added");

app.MapGet("/journalentries", () =>
{
    return journalEntries;
});

app.MapGet("/journalentries/{id}", (int id) =>
{
    var journalEntry = journalEntries.FirstOrDefault(j => j.Id == id);
    return journalEntry == null ? Results.NotFound() : Results.Ok(journalEntry);
});

app.MapPost("/journalentries", (NewJournalEntry newEntry, [FromServices] ILogger<Program> logger) =>
{
    var newJournalEntry = new JournalEntry(nextId++, newEntry.Content);
    journalEntries.Add(newJournalEntry);

    logger.LogInformation("Added new journal entry with ID {JournalEntryId}", newJournalEntry.Id);
    
    journalEntriesAddedCounter.Add(1);
    return Results.Accepted($"/journalentries/{newJournalEntry.Id}", newJournalEntry);
});

app.Run();

record NewJournalEntry(string Content);
record JournalEntry(int Id, string Content);
