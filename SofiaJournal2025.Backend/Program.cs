using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

int nextId = 1;
List<JournalEntry> journalEntries = [];

app.MapGet("/journalentries", () =>
{
    return journalEntries;
});

app.MapGet("/journalentries/{id}", (int id) =>
{
    var journalEntry = journalEntries.FirstOrDefault(j => j.Id == id);
    return journalEntry == null ? Results.NotFound() : Results.Ok(journalEntry);
});

app.MapPost("/journalentries", (NewJournalEntry newEntry) =>
{
    var newJournalEntry = new JournalEntry(nextId++, newEntry.Content);
    journalEntries.Add(newJournalEntry);
    return Results.Accepted($"/journalentries/{newJournalEntry.Id}", newJournalEntry);
});

app.Run();

record NewJournalEntry(string Content);
record JournalEntry(int Id, string Content);