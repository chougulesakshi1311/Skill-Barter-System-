import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import SkillInput from "../components/SkillInput";

const ProfilePage = () => {
  const { user, refreshMe } = useAuth();
  const [form, setForm] = useState({
    name: "",
    bio: "",
    location: "",
    profilePicture: "",
    skillsOffered: [],
    skillsWanted: [],
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      bio: user.bio || "",
      location: user.location || "",
      profilePicture: user.profilePicture || "",
      skillsOffered: user.skillsOffered || [],
      skillsWanted: user.skillsWanted || [],
    });
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await api.patch("/users/me", form);
    await refreshMe();
    alert("Profile updated");
  };

  return (
    <div>
      <h2 className="mb-3">My Profile</h2>
      <form onSubmit={onSubmit} className="d-grid gap-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input
                  className="form-control"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="col-12">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <div className="col-12">
                <label className="form-label">Profile Picture URL</label>
                <input
                  className="form-control"
                  value={form.profilePicture}
                  onChange={(e) => setForm({ ...form, profilePicture: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <SkillInput
              label="Skills Offered"
              value={form.skillsOffered}
              onChange={(skillsOffered) => setForm({ ...form, skillsOffered })}
            />
          </div>
          <div className="col-12 col-lg-6">
            <SkillInput
              label="Skills Wanted"
              value={form.skillsWanted}
              onChange={(skillsWanted) => setForm({ ...form, skillsWanted })}
            />
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-primary">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
