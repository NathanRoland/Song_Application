# Song_Application

# 🎵 Song Application

A comprehensive music discovery and social platform that allows users to explore music, share their thoughts, and connect with other music lovers. Built with React frontend and Flask backend, deployed on Vercel and Render.

## 🌟 Features Overview

### 🏠 **Home Page**
- **Welcome Screen**: Beautiful landing page for new users
- **Social Feed**: View posts from friends and the community
- **Post Creation**: Create and share posts with photos
- **Real-time Updates**: Feed refreshes when new posts are created

### 🔐 **Authentication**
- **User Registration**: Create new accounts with username and password
- **Secure Login**: Authenticated access to all features
- **Account Management**: Edit profile, bio, and social links
- **Session Management**: Persistent login across browser sessions

### 🔍 **Search & Discovery**
- **Global Search**: Search across songs, artists, and users
- **Advanced Filters**: Refine search results by type
- **Search Results**: Dedicated page for displaying search results
- **Quick Access**: Search bar available in the top navigation

### 🎵 **Music Features**

#### **Songs**
- Browse and discover songs
- View detailed song information
- Link to streaming platforms

#### **Artists**
- Explore artist profiles and information
- View artist discographies
- Connect with artist pages

#### **Charts**
- **Billboard Charts**: Hot 100, Billboard 200, Global 200
- **Spotify Charts**: Top tracks and trending music
- **Apple Music Charts**: Apple Music top charts
- **Real-time Data**: Updated chart information

### 🎧 **DubFinder - Audio Recognition**
- **Single Track Analysis**: Upload audio files to identify songs
- **Setlist Analysis**: Analyze multiple tracks from DJ sets
- **Comprehensive Results**: Get detailed song information including:
  - Song title, artist, album
  - Release date and duration
  - Spotify links and cover art
  - Lyrics and MusicBrainz data
- **Multiple Formats**: Supports MP3, WAV, M4A, FLAC, and more
- **Drag & Drop**: Easy file upload interface

### 👥 **Social Features**

#### **User Profiles**
- **Personal Profiles**: Customizable user profiles with bio and links
- **Profile Pictures**: Upload and manage profile photos
- **Social Links**: Connect Instagram, Spotify, Apple Music, SoundCloud
- **User Types**: Regular users and artist accounts

#### **Friends System**
- **Friend Requests**: Send and receive friend requests
- **Friend Management**: Accept, reject, or remove friend requests
- **Friend Profiles**: View other users' profiles
- **Social Feed**: See posts from friends

#### **Posts & Sharing**
- **Create Posts**: Share thoughts, music, and photos
- **Post Interactions**: Like and comment on posts
- **Photo Uploads**: Attach images to posts
- **Post History**: View your posting history

### 📱 **Playlists**
- **Playlist Search**: Search for playlists by name
- **Playlist Discovery**: Find curated music collections
- **Future Features**: Create and manage personal playlists

## 🧭 **Navigation Structure**

### **Top Navigation Bar**
- **Home**: Return to main feed
- **Songs**: Browse music catalog
- **Artists**: Explore artist profiles
- **DubFinder**: Audio recognition tool
- **Playlists**: Discover playlists
- **Charts**: View music charts
- **Search Bar**: Global search functionality
- **User Menu**: Account settings and logout

### **User Menu Dropdown**
- **Account Settings**: Edit profile and preferences
- **Logout**: Sign out of the application
- **Profile Preview**: Quick view of user info and bio

## 🎨 **User Interface**

### **Design Features**
- **Modern UI**: Clean, responsive design
- **Dark Theme**: Professional dark navigation bar
- **Card-based Layout**: Organized content presentation
- **Interactive Elements**: Hover effects and smooth transitions
- **Mobile Responsive**: Works on all device sizes

### **Visual Elements**
- **Icons**: Emoji-based icons for intuitive navigation
- **Color Coding**: Different colors for different platforms (Spotify green, Apple Music pink)
- **Loading States**: Spinners and loading indicators
- **Error Handling**: User-friendly error messages

## 🔧 **Technical Features**

### **Frontend (React)**
- **React Router**: Client-side routing
- **Context API**: Global state management
- **Axios**: HTTP client for API calls
- **Responsive Design**: Mobile-first approach
- **Component Architecture**: Modular, reusable components

### **Backend (Flask)**
- **RESTful API**: Well-structured API endpoints
- **Database Integration**: PostgreSQL with SQLAlchemy ORM
- **File Upload**: Support for audio and image uploads
- **Authentication**: Secure user authentication
- **CORS Handling**: Cross-origin request support

### **Deployment**
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Database**: PostgreSQL on Render
- **Environment Configuration**: Separate dev/prod environments

## 🚀 **Getting Started**

### **For Users**
1. Visit the application URL
2. Create an account or log in
3. Explore the music catalog and charts
4. Try DubFinder to identify unknown songs
5. Connect with friends and share posts

### **For Developers**
1. Clone the repository
2. Set up environment variables
3. Install dependencies (`npm install` for frontend, `pip install -r requirements.txt` for backend)
4. Run the development servers
5. Access the application locally

## 📊 **Data Sources**

### **Music Data**
- **Billboard**: Official Billboard chart data
- **Spotify**: Spotify API integration
- **Apple Music**: Apple Music chart data
- **MusicBrainz**: Music metadata database
- **Audio Recognition**: Acoustic fingerprinting for song identification

### **User Data**
- **User Profiles**: Custom user information
- **Social Connections**: Friend relationships
- **Posts**: User-generated content
- **Interactions**: Likes, comments, and shares

## 🔒 **Security & Privacy**

### **Authentication**
- **Secure Login**: Password-based authentication
- **Session Management**: Secure session handling
- **CORS Protection**: Cross-origin request security

### **Data Protection**
- **User Privacy**: Personal information protection
- **Secure Uploads**: Safe file upload handling
- **Input Validation**: Server-side data validation

## 🌐 **Platform Integration**

### **Music Streaming**
- **Spotify**: Direct links to Spotify tracks and playlists
- **Apple Music**: Apple Music profile and playlist links
- **SoundCloud**: SoundCloud profile integration

### **Social Media**
- **Instagram**: Instagram profile links
- **Cross-platform Sharing**: Share music across platforms

## 📈 **Future Enhancements**

### **Planned Features**
- **Playlist Creation**: Build and share custom playlists
- **Music Recommendations**: AI-powered music suggestions
- **Live Chat**: Real-time messaging between users
- **Music Events**: Concert and event information
- **Advanced Analytics**: User listening statistics

### **Technical Improvements**
- **Real-time Updates**: WebSocket integration
- **Offline Support**: Progressive Web App features
- **Performance Optimization**: Code splitting and lazy loading
- **Advanced Search**: Elasticsearch integration

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines for more information on how to get involved.

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support, please contact us through the application or create an issue in the repository.

---

**Built with ❤️ for music lovers everywhere**
