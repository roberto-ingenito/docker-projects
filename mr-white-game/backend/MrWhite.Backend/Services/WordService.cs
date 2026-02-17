using System.Text.Json;

namespace MrWhite.Backend.Services;

public class CategoryData
{
    public List<string> Hints { get; set; } = [];
    public List<string> Words { get; set; } = [];
}

public class WordService
{
    private readonly JsonSerializerOptions options = new() { PropertyNameCaseInsensitive = true };

    // Lista di fallback se il file non esiste
    private Dictionary<string, CategoryData> _categories = new()
    {
        {
            "emozioni",
            new CategoryData
            {
                Hints = ["sentimento", "cuore", "animo", "stato d'animo", "sensazione"],
                Words =
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
                ],
            }
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
                var loadedCategories = JsonSerializer.Deserialize<Dictionary<string, CategoryData>>(json, options);

                if (loadedCategories != null && loadedCategories.Count > 0)
                {
                    _categories = loadedCategories;
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

    public List<string> Categories() => [.. _categories.Keys];

    public (string word, string category) GetRandomWord(List<string> categories)
    {
        // Determiniamo quali categorie usare
        // Se la lista in ingresso è vuota o nulla, usiamo tutte le chiavi del dizionario
        var targetCategories =
            (categories == null || !categories.Intersect(_categories.Keys).Any())
                ? _categories.Keys.ToList()
                : [.. categories.Intersect(_categories.Keys)];

        // Raccogliamo tutte le parole possibili dalle categorie filtrate
        var allPossibleWords = targetCategories.SelectMany(category => _categories[category].Words.Select(word => (word, category))).ToList();

        // Gestione caso dizionario vuoto o nessuna corrispondenza
        if (allPossibleWords.Count == 0)
            return ("WORD-ERROR", "CATEGORY-ERROR");

        // Selezione casuale
        return allPossibleWords[Random.Shared.Next(allPossibleWords.Count)];
    }

    public string GetRandomHint(string category)
    {
        // Controlla se la categoria esiste
        if (!_categories.TryGetValue(category, out var categoryData))
        {
            return "HINT-ERROR"; // Hint generico di fallback
        }

        // Controlla se ci sono hints disponibili
        if (categoryData.Hints.Count == 0)
        {
            return "HINT-ERROR"; // Hint generico di fallback
        }

        // Restituisce un hint casuale dalla categoria
        return categoryData.Hints[Random.Shared.Next(categoryData.Hints.Count)];
    }
}
