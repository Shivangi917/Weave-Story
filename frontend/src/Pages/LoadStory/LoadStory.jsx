const LoadStory = ({ loadStories, loadRandomStory }) => (
  <div className="flex flex-col gap-3 w-full">
    <h3 className="text-xl font-semibold text-gray-700 mb-4"> Discover Stories </h3> 
    <div className="flex flex-col gap-3 w-full"> 
        <button
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg w-full"
          onClick={() => loadStories("default")}
        >
          📃 All Stories
        </button>
        <button className="px-4 py-2 bg-orange-100 hover:bg-orange-200 rounded-lg w-full" onClick={() => loadStories("trending")} > 🔥 Trending 
        </button> 
        <button className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg w-full" onClick={() => loadStories("popular")} > ⭐ Popular 
        </button> 
        <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg w-full" onClick={() => loadStories("recent")} > 🕒 Recent 
        </button>
        <button className="px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg w-full" onClick={loadStories("random")} > 🎲 Random 
        </button>
    </div>
  </div>
);

export default LoadStory;