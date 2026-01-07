using System.Text.Json;

namespace MrWhite.Backend.Services;

public class WordService
{
    // Lista di fallback se il file non esiste
    private Dictionary<string, List<string>> _words = new()
    {
        {
            "emozioni",
            [
                "gioia",
                "tristezza",
                "rabbia",
                "paura",
                "sorpresa",
                "disgusto",
                "amore",
                "odio",
                "felicità",
                "nostalgia",
                "ansia",
                "serenità",
                "entusiasmo",
                "noia",
                "vergogna",
                "orgoglio",
                "invidia",
                "gelosia",
                "gratitudine",
                "rimpianto",
            ]
        },
    };

    public WordService()
    {
        LoadWords();
    }

    private void LoadWords()
    {
        // Cerca il file nella directory di esecuzione
        var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "words.json");

        if (File.Exists(path))
        {
            try
            {
                string json = File.ReadAllText(path);
                var loadedWords = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(json);

                if (loadedWords != null && loadedWords.Count > 0)
                {
                    _words = loadedWords;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[WordService] Errore leggendo words.json: {ex.Message}. Uso la lista di default.");
            }
        }
        else
        {
            Console.WriteLine($"[WordService] File {path} non trovato. Uso la lista di default.");
        }
    }

    public List<string> Categories() => [.. _words.Keys];

    public string GetRandomWord(List<string> categories)
    {
        // Determiniamo quali categorie usare
        // Se la lista in ingresso è vuota o nulla, usiamo tutte le chiavi del dizionario
        var targetCategories = (categories == null || !categories.Intersect(_words.Keys).Any()) ? _words.Keys : categories.Intersect(_words.Keys);

        // Raccogliamo tutte le parole possibili dalle categorie filtrate
        var allPossibleWords = targetCategories.SelectMany(category => _words[category]).ToList();

        // Gestione caso dizionario vuoto o nessuna corrispondenza
        if (allPossibleWords.Count == 0)
            return "Pizza";

        // Selezione casuale
        return allPossibleWords[Random.Shared.Next(allPossibleWords.Count)];
    }
}
