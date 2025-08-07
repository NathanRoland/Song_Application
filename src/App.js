import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Home from "./Home";
import Signup from "./Signup";
import Login from "./Login";
import Search from "./Search";
import User from "./User";
import Songs from "./Songs";
import Artists from "./Artists";
import Playlists from "./Playlists";
import Hot100Chart from "./Hot100Chart";
import Billboard200Chart from "./Billboard200Chart";
import Global200Chart from "./Global200Chart";
import Charts from "./Charts";
import SpotifyCharts from "./SpotifyCharts";
import DisplayArtist from "./DisplayArtist";
import DisplaySong from "./DisplaySong";
import DisplayRelease from "./DisplayRelease";
import DubFinder from "./DubFinder";
import DubFinderSetlist from "./DubFinderSetlist";
import AppleMusicCharts from "./AppleMusicCharts";
import UserAccount from "./UserAccount";
import ViewOtherAccount from "./ViewOtherAccount";
import PostView from "./PostView";
import SearchResults from "./SearchResults";
import { UserProvider } from "./userContext";
import TopBar from "./TopBar";

function Layout() {
  return (
    <>
      <TopBar />
      <div style={{ marginTop: 80 }}>
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<UserAccount />} />
            <Route path="/search" element={<Search />} />
            <Route path="/user" element={<User />} />
            <Route path="/user/:userId" element={<ViewOtherAccount />} />
            <Route path="/post/:postId" element={<PostView />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/charts/billboard/hot-100" element={<Hot100Chart />} />
            <Route path="/charts/billboard/200" element={<Billboard200Chart />} />
            <Route path="/charts/billboard/global-200" element={<Global200Chart />} />
            <Route path="/charts/spotify" element={<SpotifyCharts />} />
            <Route path="/charts/applemusic" element={<AppleMusicCharts />} />
            <Route path="/artist/:id" element={<DisplayArtist />} />
            <Route path="/song/info/:id" element={<DisplaySong />} />
            <Route path="/release/info/:id" element={<DisplayRelease />} />
            <Route path="/dubfinder" element={<DubFinder />} />
            <Route path="/dubfinder/setlist" element={<DubFinderSetlist />} />
            <Route path="/search-results" element={<SearchResults />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
