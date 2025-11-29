import React from 'react';

const Home = () => {
  return (
    <div>
      <h2>Featured Content</h2>
      <p>Welcome to Claire's Lair - your destination for all things goth music!</p>
      
      <div className="center">
        <h3>Recently Added Artists</h3>
        {/* Will connect to API later */}
        <p>Featured artists coming soon...</p>
        
        <h3>Top Rated Albums</h3>
        {/* Will connect to API later */}
        <p>Top ratings coming soon...</p>
      </div>
    </div>
  );
};

export default Home;