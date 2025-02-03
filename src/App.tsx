import React from 'react';
import { BathroomCard } from './components/ui/BathroomCard';

function App() {
  return (
    <div>
      <h1>Bathroom Finder</h1>
      <BathroomCard 
        name="Test Bathroom" 
        description="Test Description" 
      />
    </div>
  );
}

export default App;