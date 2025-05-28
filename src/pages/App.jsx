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
      // Modifiquei a URL para incluir mais informações
      const url = `${BASE_URL}/complexSearch?query=${encodeURIComponent(query)}&number=5&addRecipeInformation=true&fillIngredients=true&instructions=true&apiKey=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

      const data = await response.json();

      const uniqueRecipes = data.results?.filter((recipe, index, self) =>
        index === self.findIndex(r => r.id === recipe.id)
      ) || [];

      setRecipes(uniqueRecipes);
      console.log("Dados completos das receitas:", uniqueRecipes);

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

  // Função para verificar se há conteúdo HTML válido
  const hasContent = (htmlString) => {
    if (!htmlString) return false;
    const stripped = htmlString.replace(/<[^>]+>/g, '').trim();
    return stripped.length > 0;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Recipe Finder</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by recipe name or ingredients"
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '8px 15px' }}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div style={{ color: 'red', margin: '10px 0' }}>Error: {error}</div>}

      {isLoading ? (
        <div>Loading recipes...</div>
      ) : (
        <div>
          {recipes.length > 0 ? (
            <div>
              <h2>Found {recipes.length} recipes</h2>
              {recipes.map((recipe) => (
                <div 
                  key={`${recipe.id}-${recipe.title}`} 
                  style={{ 
                    marginBottom: '30px', 
                    padding: '15px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px' 
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>{recipe.title}</h3>
                  
                  {recipe.image && (
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      style={{ width: '200px', borderRadius: '4px' }} 
                    />
                  )}
                  
                  {recipe.summary && hasContent(recipe.summary) && (
                    <div style={{ margin: '15px 0' }}>
                      <h4>Description:</h4>
                      <div 
                        dangerouslySetInnerHTML={{ __html: recipe.summary }} 
                        style={{ lineHeight: '1.5' }}
                      />
                    </div>
                  )}
                  
                  {recipe.extendedIngredients?.length > 0 && (
                    <div style={{ margin: '15px 0' }}>
                      <h4>Ingredients:</h4>
                      <ul style={{ 
                        columns: '2', 
                        listStyle: 'none', 
                        paddingLeft: '0',
                        lineHeight: '1.8'
                      }}>
                        {recipe.extendedIngredients.map((ingredient, index) => (
                          <li key={`ing-${recipe.id}-${index}`}>
                            • {ingredient.original}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {recipe.instructions && hasContent(recipe.instructions) && (
                    <div style={{ margin: '15px 0' }}>
                      <h4>Instructions:</h4>
                      <div 
                        dangerouslySetInnerHTML={{ __html: recipe.instructions }} 
                        style={{ lineHeight: '1.5' }}
                      />
                    </div>
                  )}
                  
                  {(!recipe.extendedIngredients?.length && !recipe.instructions) && (
                    <div style={{ margin: '15px 0', color: '#666' }}>
                      No detailed information available for this recipe.
                    </div>
                  )}
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