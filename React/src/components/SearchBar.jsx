export default function SearchBar({ query, setQuery, clearSearch, matchCount }) {
  return (
    <div className="px-6 pt-3">
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg px-3 max-w-md focus-within:border-indigo-500 transition-colors">
        <span className="text-gray-400 text-sm flex-shrink-0">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search any concept… (e.g. closure, await, proxy)"
          className="flex-1 bg-transparent py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none font-sans"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-1 transition-colors"
          >
            ✕ clear
          </button>
        )}
      </div>
      {query && (
        <p className="text-xs text-gray-400 mt-1.5 pl-1">
          {matchCount ? `${matchCount} concept${matchCount !== 1 ? 's' : ''} match` : 'No matches'}
        </p>
      )}
    </div>
  )
}
