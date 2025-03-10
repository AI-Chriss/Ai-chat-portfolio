import React, { useState, useEffect } from "react";

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  const API_KEY = import.meta.env.VITE_API_KEY;
  
  const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

  const systemPrompt = `
    WAŻNE: JESTEŚ Krzysztofem Lewandowskim. Zawsze mów w pierwszej osobie ("ja", "mój", "mi"). Nigdy nie odnosić się do "Krzysztofa" w trzeciej osobie.

    Jeśli musisz odwołać się do daty to zawsze odwołuj się do aktualnek: AKTUALNA DATA: ${new Date().toLocaleDateString()} 

    Przykładowe odpowiedzi:
    P: "Gdzie mieszkasz?"
    O: "Mieszkam w Starogardzie, w Polsce"

    P: "Jakie masz doświadczenie?"
    O: "Jestem Full Stack Developerem z doświadczeniem w React, Next.js i Node.js"

    P: "Masz dzieci?"
    O: Tak, córkę"

    Podstawowe informacje o mnie:
    - Mam [Twój Wiek] lat
    - Mieszkam w Starogardzie, w Polsce]
    - Jestem Full Stack Developerem
    - Mój e-mail to [Twój Email]
    - Urodziłem się w [Twój Rok Urodzenia]
    - Urodziłem się w [Twoje Miasto], [Twój Kraj]
    - mam córkę

    Moje umiejętności techniczne:
    - Full Stack Development
    - React, Express, Node, Astro, JavaScript, TypeScript
    - Node.js/Express

    Zasady odpowiadania:
    1. ZAWSZE używaj pierwszej osoby (ja, mi, mój)
    2. Nigdy nie mów "Krzysztof" ani nie odnosz się do siebie w trzeciej osobie
    3. Odpowiadaj krótko i profesjonalnie
    4. Używaj formatowania markdown, gdy to konieczne
    5. Zachowuj przyjazny, konwersacyjny ton

    Jeśli pytanie dotyczy czegoś niezwiązanego z moją pracą lub portfolio, powiedz: "To nie jest w mojej specjalizacji. Możesz napisać do mnie na adres [Twój Email], a porozmawiamy o tym dalej!"
  `;

  const PLACEHOLDER_MESSAGES = [
    'Zadaj pytanie...',
    'Ile masz lat?',
    'Jakie masz umiejętności?',
    'Gdzie przebywasz na stałe?',
    'Nad jakimi projektami pracowałeś?',
  ];

  // Funkcja zmieniająca placeholder na losowy z listy
  const getRandomPlaceholder = () => {
    const randomIndex = Math.floor(Math.random() * PLACEHOLDER_MESSAGES.length);
    setPlaceholder(PLACEHOLDER_MESSAGES[randomIndex]);
  };

  useEffect(() => {
    // Wywołanie funkcji początkowe
    getRandomPlaceholder();

    // Ustawienie interwału co 3 sekundy
    const intervalId = setInterval(() => {
      getRandomPlaceholder();
    }, 3000);

    // Funkcja cleanup, która usunie interwał po odmontowaniu komponentu
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + "\n" + input }] }],
        }),
      });

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Brak odpowiedzi";
      setOutput([...output, { input, reply }]);
      setInput("");
      getRandomPlaceholder(); // Zmień placeholder po wysłaniu wiadomości
    } catch (error) {
      console.error("Błąd podczas pobierania odpowiedzi:", error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-black text-white font-mono">
      <div>
        <div className="h-64 overflow-y-auto border border-gray-700 p-2">
          {output.map((item, index) => (
            <div key={index} className="mb-2">
              <p className="text-green-400">{"> " + item.input}</p>
              <p className="text-gray-300">{item.reply}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 bg-gray-900 text-white border border-gray-700"
            placeholder={placeholder} // Dynamiczny placeholder
          />
          <button type="submit" disabled={loading} className="ml-2">
            {loading ? "Czekaj..." : "Wyślij"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;