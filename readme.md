# Claire's Lair - Frontend

🦇 A React frontend for Claire's Lair - An archive of Goth & gothic bands from A to Z

## Features

- **Artist Browser**: A-Z artist listing with "The" , "A", and "An" prefix handling
- **Album Details**: Complete album information with tracklists and ratings
- **Rating System**: 1-5 star rating system for albums (In development)
- **Responsive Design**: Classic goth aesthetic that works on all devices

## Tech Stack

- **React 18** - Frontend framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with classic goth aesthetic

## Project Structure
```
frontend/
├── public/
│ ├── index.html
│ └──(images and gifs)
├── src/
│ ├── components/
│ │ ├── Layout/
│ │ │ ├── Header.js
│ │ │ └── Footer.js
│ │ ├── Artists/
│ │ │ ├── AlphabetNav.js
│ │ │ └── ArtistSection.js
│ │ └── Auth/
│ │ ├── Login.js
│ │ └── Register.js
│ ├── pages/
│ │ ├── Home.js
│ │ ├── Artists.js
│ │ ├── ArtistDetail.js
│ │ ├── Albums.js
│ │ ├── AlbumDetail.js
│ │ ├── Lists.js
│ │ └── Profile.js
│ ├── services/
│ │ └── api.js
│ ├── styles/
| | ├── Album.css
| | ├── AlbumDetails.css
| | ├── ArtistDetail.css
│ │ └── globals.css
│ ├── App.js
│ └── index.js
├── package.json
└── README.md
```
## Pages

### Home (`/`)
- Welcome page with site introduction
- Featured content sections for recently added and top racte artists (both in development)
- Site updates and news (soon)

### Artists (`/artists`)
- A-Z artist browsing with alphabetical navigation
- Handles "The" prefix for proper sorting (e.g., "The Cure" appears under "C"), same for "A" and "An" prefixes
- Paginated listing with smooth section jumping
- Click artist names to view detailed pages giving artist bio, genre, albums released and more

### Artist Detail (`/artists/:id`)
- Complete artist biography and information
- Location, formation year, and label details
- Full discography with album covers
- Links to individual album pages

### Albums (`/albums`)
- Paginated album listing (100 per page, can be updated lated to allow filtering when search is created)
- Shows album title, artist, release year, format, and ratings
- Alphabetical ordering
- Direct links to album and artist pages

### Album Detail (`/albums/:id`)
- Complete album information with cover art
- Tracklist with durations and total album length
- 1-5 star rating system with user authentication (in development)
- Artist information and navigation

### Lists (`/lists`) - *Coming Soon*
- User-created album and artist lists 
- Public and private list options
- Shareable list links

### Profile (`/profile`) - *Coming Soon*
- User profile management
- Rating history
- Personal lists and favorites

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Claire's Lair backend running on `localhost:5000`

### Installation

1. **Clone the repository**
   ```
   git clone [repository-url]
   cd claires_lair/frontend

Install dependencies


    npm install

Start the development server

    npm start

    The app will open at http://localhost:3000

Running Both Frontend and Backend

From the project root directory:

    npm run dev

This uses concurrently to run both frontend and backend simultaneously.
Available Scripts

    npm start - Run development server

    npm run build - Build for production

    npm test - Run test suite

    npm run dev - Run both frontend and backend (from root)

Environment Variables

Create a .env file in the frontend directory for configuration:
env

    REACT_APP_API_URL=http://localhost:5000/api
    REACT_APP_SITE_NAME=Claire's Lair



Browser Support

    Chrome 90+

    Firefox 88+

    Safari 14+

    Edge 90+

Contributing

    Fork the repository

    Create a feature branch (git checkout -b feature/amazing-feature)

    Commit your changes (git commit -m 'Add amazing feature')

    Push to the branch (git push origin feature/amazing-feature)

    Open a Pull Request

License
Creative commons
