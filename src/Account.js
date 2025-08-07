import { useUser } from "./userContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

function Account() {
  const { user, setUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        bio: user.bio || "",
        pfp_path: user.pfp_path || "",
        fav_artist: user.fav_artist || "",
        insta_link: user.insta_link || "",
        spotify_link: user.spotify_link || "",
        apple_music_link: user.apple_music_link || "",
        soundcloud_link: user.soundcloud_link || "",
      });
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const response = await axios.post(`${BASE_URL}/account`, {
        name: user.name,
        id: user.id,
      });
      if (response.data) {
        setUser({
          name: user.name,
          id: user.id,
          bio: response.data.bio,
          pfp_path: response.data.pfp_path,
          fav_artist: response.data.fav_artist,
          friend_amount: response.data.friend_amount,
          following_amount: response.data.following_amount,
          insta_link: response.data.insta_link,
          spotify_link: response.data.spotify_link,
          apple_music_link: response.data.apple_music_link,
          soundcloud_link: response.data.soundcloud_link,
        });
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  if (!user) {
    return <h1>No user data found!</h1>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      bio: user.bio || "",
      pfp_path: user.pfp_path || "",
      fav_artist: user.fav_artist || "",
      insta_link: user.insta_link || "",
      spotify_link: user.spotify_link || "",
      apple_music_link: user.apple_music_link || "",
      soundcloud_link: user.soundcloud_link || "",
    });
  };

  const handleSave = async () => {
    try {
      await axios.post(`${BASE_URL}/account/edit`, {
        name: user.name,
        ...form,
      });
      setUser({ ...user, ...form });
      setEditMode(false);
    } catch (error) {
      alert("Failed to save changes.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: 12, padding: 32, maxWidth: 500, width: "100%", background: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {form.pfp_path ? (
            <img src={form.pfp_path} alt="Profile" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", marginBottom: 16 }} />
          ) : (
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#eee", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>No Image</div>
          )}
          <h2 style={{ marginBottom: 8 }}>{user.name || "N/A"}</h2>
          <table style={{ width: "100%", marginTop: 16, marginBottom: 16, fontSize: 16 }}>
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold", padding: 4 }}>Bio:</td>
                <td style={{ padding: 4 }}>
                  {editMode ? (
                    <textarea name="bio" value={form.bio} onChange={handleChange} style={{ width: "100%", minHeight: 40 }} />
                  ) : (
                    user.bio || "N/A"
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: 4 }}>Profile Pic URL:</td>
                <td style={{ padding: 4 }}>
                  {editMode ? (
                    <input name="pfp_path" value={form.pfp_path} onChange={handleChange} style={{ width: "100%" }} />
                  ) : (
                    user.pfp_path || "N/A"
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: 4 }}>Favorite Artist:</td>
                <td style={{ padding: 4 }}>
                  {editMode ? (
                    <input name="fav_artist" value={form.fav_artist} onChange={handleChange} style={{ width: "100%" }} />
                  ) : (
                    user.fav_artist || "N/A"
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: 4 }}>Instagram:</td>
                <td style={{ padding: 4 }}>
                  {editMode ? (
                    <input name="insta_link" value={form.insta_link} onChange={handleChange} style={{ width: "100%" }} />
                  ) : (
                    user.insta_link ? <a href={user.insta_link} target="_blank" rel="noopener noreferrer">{user.insta_link}</a> : "N/A"
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: 4 }}>Spotify:</td>
                <td style={{ padding: 4 }}>
                  {editMode ? (
                    <input name="spotify_link" value={form.spotify_link} onChange={handleChange} style={{ width: "100%" }} />
                  ) : (
                    user.spotify_link ? <a href={user.spotify_link} target="_blank" rel="noopener noreferrer">{user.spotify_link}</a> : "N/A"
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: 4 }}>Apple Music:</td>
                <td style={{ padding: 4 }}>
                  {editMode ? (
                    <input name="apple_music_link" value={form.apple_music_link} onChange={handleChange} style={{ width: "100%" }} />
                  ) : (
                    user.apple_music_link ? <a href={user.apple_music_link} target="_blank" rel="noopener noreferrer">{user.apple_music_link}</a> : "N/A"
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: 4 }}>SoundCloud:</td>
                <td style={{ padding: 4 }}>
                  {editMode ? (
                    <input name="soundcloud_link" value={form.soundcloud_link} onChange={handleChange} style={{ width: "100%" }} />
                  ) : (
                    user.soundcloud_link ? <a href={user.soundcloud_link} target="_blank" rel="noopener noreferrer">{user.soundcloud_link}</a> : "N/A"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {editMode ? (
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleSave} style={{ padding: "8px 24px", borderRadius: 6, background: "#222", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>Save</button>
              <button onClick={handleCancel} style={{ padding: "8px 24px", borderRadius: 6, background: "#eee", color: "#222", border: "none", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            </div>
          ) : (
            <button onClick={handleEdit} style={{ padding: "8px 24px", borderRadius: 6, background: "#222", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>Edit Account</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;

