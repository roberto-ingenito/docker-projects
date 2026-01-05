using System.Text.Json;

namespace MrWhite.Backend.Services;

public class WordService
{
    // Lista di fallback se il file non esiste
    private List<string> _words = ["Pizza", "Sushi", "Aereo", "Leone", "Chitarra", "Roma", "Sole"];

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
                var loadedWords = JsonSerializer.Deserialize<List<string>>(json);

                if (loadedWords != null && loadedWords.Count > 0)
                {
                    _words = loadedWords;
                    Console.WriteLine($"[WordService] Caricate {_words.Count} parole da {path}");
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

    public string GetRandomWord()
    {
        return _words[Random.Shared.Next(_words.Count)];
    }
}
