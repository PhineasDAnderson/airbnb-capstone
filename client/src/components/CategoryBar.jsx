import React from 'react';

/**
 * CategoryBar Component:
 * Handles the horizontal list of category filters. It receives the active filter state 
 * and a setter function from App.jsx to handle global list state synchronization.
 */
function CategoryBar({ selectedCategory, setSelectedCategory }) {
  
  // I explicitly defined the categories list with Material Icon names to look professional and avoid emojis
  const categories = [
    { id: 'all', label: 'All', iconName: 'home' },
    { id: 'beach', label: 'Beachfront', iconName: 'beach_access' },
    { id: 'cabin', label: 'Cabins', iconName: 'gite' },
    { id: 'apartment', label: 'Apartments', iconName: 'apartment' },
    { id: 'villa', label: 'Villas', iconName: 'holiday_village' },
    { id: 'nature', label: 'Nature', iconName: 'nature' }
  ];

  return (
    <div className="category-bar-wrapper">
      <div className="category-scroll-container">
        {categories.map((cat) => {
          // I calculate whether the current element matches our active filter to apply conditional classes
          const isActive = selectedCategory.toLowerCase() === cat.label.toLowerCase();

          return (
            <button
              key={cat.id}
              // I conditionally append 'active' to dynamically highlight the selected category button
              className={`category-item-btn ${isActive ? 'active' : ''}`}
              // I trigger our state callback function on click, notifying App.jsx of the filter switch
              onClick={() => setSelectedCategory(cat.label)}
              type="button"
            >
              {/* I render a scalable Material Icon font layer instead of a platform-dependent emoji */}
              <span className="material-icons category-icon">{cat.iconName}</span>
              <span className="category-label">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryBar;
