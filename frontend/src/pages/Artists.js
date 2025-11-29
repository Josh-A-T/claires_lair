import React, { useState, useEffect } from 'react';
import { artistsAPI } from '../services/api.js';
import AlphabetNav from '../components/Artists/AlphabetNav.js';
import ArtistSection from '../components/Artists/ArtistSection.js';

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLetter, setActiveLetter] = useState('0-10');

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setLoading(true);
      const response = await artistsAPI.getAll(1, 1000);
      setArtists(response.data);
    } catch (err) {
      setError('Failed to load artists');
      console.error('Error loading artists:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSortingKey = (name) => {
    const cleanedName = name.trim();
    
    if (cleanedName.toLowerCase().startsWith('the ')) {
      return cleanedName.substring(4).trim();
    }
    
    if (cleanedName.toLowerCase().startsWith('a ')) {
      return cleanedName.substring(2).trim();
    }
    
    if (cleanedName.toLowerCase().startsWith('an ')) {
      return cleanedName.substring(3).trim();
    }
    
    return cleanedName;
  };

  const getDisplayName = (name) => {
    return name.trim();
  };

  const getGroupingLetter = (name) => {
    const sortingKey = getSortingKey(name);
    let firstChar = sortingKey.charAt(0).toUpperCase();
    
    
    if (/[0-9]/.test(firstChar)) {
      firstChar = '0-10';
    } else if (!/[A-Z]/.test(firstChar)) {
      firstChar = '0-10';
    }
    
    return firstChar;
  };

  const groupedArtists = artists.reduce((groups, artist) => {
    const letter = getGroupingLetter(artist.name);
    
    if (!groups[letter]) {
      groups[letter] = [];
    }
    
    groups[letter].push({
      ...artist,
      displayName: getDisplayName(artist.name),
      sortingKey: getSortingKey(artist.name)
    });
    
    return groups;
  }, {});

  const sortedGroups = Object.keys(groupedArtists).sort((a, b) => {
    if (a === '0-10') return -1;
    if (b === '0-10') return 1;
    return a.localeCompare(b);
  });

  sortedGroups.forEach(letter => {
    groupedArtists[letter].sort((a, b) => 
      a.sortingKey.localeCompare(b.sortingKey)
    );
  });

  if (loading) {
    return (
      <div className="center">
        <div className="loading-text">Loading artists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h2>Bands Lists (0–10 & A–Z)</h2>
      <p>Jump to a section:</p>
      
      <AlphabetNav 
        activeLetter={activeLetter} 
        onLetterClick={setActiveLetter} 
      />

      <hr />

      {sortedGroups.map(letter => (
        <ArtistSection
          key={letter}
          letter={letter}
          artists={groupedArtists[letter]}
          isActive={activeLetter === letter}
        />
      ))}
    </div>
  );
};

export default Artists;