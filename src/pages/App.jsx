import { useState } from 'react';

const App = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = '337a69af9d21459fa429d498d3a94fbc';
  const BASE_URL = 'https://api.spoonacular.com/recipes';

  const searchRecipes = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      // Search for recipes with details included
      const url = `${BASE_URL}/complexSearch?query=${encodeURIComponent(query)}&number=5&addRecipeInformation=true&apiKey=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

      const data = await response.json();

      // Filter out duplicate recipes
      const uniqueRecipes = data.results?.filter((recipe, index, self) =>
        index === self.findIndex(r => r.id === recipe.id)
      ) || [];

      setRecipes(uniqueRecipes);
      console.log("Found recipes:", uniqueRecipes);

    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRecipes();
  };

  return (
    <div>
      <h1>Recipe Finder</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by recipe name or ingredients"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div>Error: {error}</div>}

      {isLoading ? (
        <div>Loading recipes...</div>
      ) : (
        <div>
          {recipes.length > 0 ? (
            <div>
              <h2>Found {recipes.length} recipes</h2>
              {recipes.map((recipe) => (
                <div key={`${recipe.id}-${recipe.title}`} style={{ marginBottom: '20px' }}>
                  <h3>{recipe.title}</h3>
                  {recipe.image && (
                    <img src={recipe.image} alt={recipe.title} width="200" />
                  )}
                  {recipe.summary && (
                    <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
                  )}
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            query && !isLoading && <div>No recipes found. Try a different search.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;