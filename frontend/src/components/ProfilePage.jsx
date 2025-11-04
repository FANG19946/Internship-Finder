import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (section, index, field, value) => {
    const updated = [...user[section]];
    updated[index][field] = value;
    setUser({ ...user, [section]: updated });
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...user[field]];
    updated[index] = value;
    setUser({ ...user, [field]: updated });
  };

  const handleAddItem = (field, template) => {
    setUser({ ...user, [field]: [...user[field], template] });
  };

  const handleSave = async () => {
    await fetch(`http://localhost:5000/api/profile/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    alert("Profile updated!");
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (!user) return <p className="p-8">No user found.</p>;

  return (
    <div className="p-8 mx-auto bg-white shadow-md rounded-md space-y-8">
      {/* PERSONAL INFO */}
      <div className="p-6 rounded border border-gray-200 shadow">
        <h1 className="text-2xl font-bold mb-4 border-b-2 border-blue-500 pb-1 text-gray-800">Personal Info</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600">Full Name</label>
            <input
              name="name"
              value={user.name || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-600">Title</label>
            <input
              name="title"
              value={user.title || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-600">Email</label>
            <input
              name="email"
              value={user.email || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-600">Phone</label>
            <input
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-600"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-600">Address</label>
            <input
              name="address"
              value={user.address || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* LINKS & SKILLS */}
      <div className="p-6 rounded border border-gray-200 shadow">
        <h1 className="text-2xl font-bold mb-4 border-b-2 border-blue-500 pb-1 text-gray-800">Links & Skills</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold mb-2 text-gray-800">Links</h2>
            {user.links?.map((link, i) => (
              <input
                key={i}
                value={link}
                onChange={(e) => handleArrayChange("links", i, e.target.value)}
                className="w-full border rounded p-2 mb-2 text-gray-600"
              />
            ))}
            <button
              onClick={() => handleAddItem("links", "")}
              className="text-white mt-1 bg-blue-600 px-3 py-1 rounded"
            >
              + Add Link
            </button>
          </div>
          <div>
            <h2 className="font-semibold mb-2 text-gray-800">Skills</h2>
            {user.skills?.map((skill, i) => (
              <input
                key={i}
                value={skill}
                onChange={(e) => handleArrayChange("skills", i, e.target.value)}
                className="w-full border rounded p-2 mb-2 text-gray-600"
              />
            ))}
            <button
              onClick={() => handleAddItem("skills", "")}
              className="text-white mt-1 bg-blue-600 px-3 py-1 rounded"
            >
              + Add Skill
            </button>
          </div>
        </div>
      </div>

      {/* EDUCATION */}
      <div className="p-6 rounded border border-gray-200 shadow">
        <h1 className="text-2xl font-bold mb-4 border-b-2 border-blue-500 pb-1 text-gray-800">Education</h1>
        {user.education?.map((edu, i) => (
          <div key={i} className="border p-3 rounded mb-4 bg-white space-y-2">
            <label className="text-gray-600">Degree</label>
            <input
              value={edu.degree}
              onChange={(e) => handleNestedChange("education", i, "degree", e.target.value)}
              className="w-full border rounded p-2 text-gray-600"
            />
            <label className="text-gray-600">Institution</label>
            <input
              value={edu.institution}
              onChange={(e) => handleNestedChange("education", i, "institution", e.target.value)}
              className="w-full border rounded p-2 text-gray-600"
            />
            <label className="text-gray-600">Graduation Year</label>
            <input
              value={edu.graduation}
              onChange={(e) => handleNestedChange("education", i, "graduation", e.target.value)}
              className="w-full border rounded p-2 text-gray-600"
            />
            <label className="text-gray-600">CGPA / Percentage</label>
            <input
              value={edu.cgpa}
              onChange={(e) => handleNestedChange("education", i, "cgpa", e.target.value)}
              className="w-full border rounded p-2 text-gray-600"
            />
          </div>
        ))}
        <button
          onClick={() =>
            handleAddItem("education", { degree: "", institution: "", graduation: "", cgpa: "" })
          }
          className="text-white mt-1 bg-blue-600 px-3 py-1 rounded"
        >
          + Add Education
        </button>
      </div>

      {/* EXPERIENCES */}
      <div className="p-6 rounded border border-gray-200 shadow">
        <h1 className="text-2xl font-bold mb-4 border-b-2 border-blue-500 pb-1 text-gray-800">Experiences</h1>
        {user.experiences?.map((exp, i) => (
          <div key={i} className="border p-3 rounded mb-4 bg-white space-y-2">
            <label className="text-gray-600">Role</label>
            <input
              value={exp.role}
              onChange={(e) => handleNestedChange("experiences", i, "role", e.target.value)}
              className="w-full border rounded p-2 text-gray-600"
            />
            <label className="text-gray-600">Company</label>
            <input
              value={exp.company}
              onChange={(e) => handleNestedChange("experiences", i, "company", e.target.value)}
              className="w-full border rounded p-2 text-gray-600"
            />
            <label className="text-gray-600">Duration</label>
            <input
              value={exp.duration}
              onChange={(e) => handleNestedChange("experiences", i, "duration", e.target.value)}
              className="w-full border rounded p-2 text-gray-600"
            />
            <label className="text-gray-600">Description</label>
            <textarea
              className="w-full border rounded p-2 text-gray-600 resize-none overflow-hidden min-h-[60px]"
              value={exp.description?.join("\n") || ""}
              onChange={(e) =>
                handleNestedChange("experiences", i, "description", e.target.value.split("\n"))
              }
            />
          </div>
        ))}
        <button
          onClick={() =>
            handleAddItem("experiences", { role: "", company: "", duration: "", description: [""] })
          }
          className="text-white mt-1 bg-blue-600 px-3 py-1 rounded"
        >
          + Add Experience
        </button>
      </div>

      {/* PROJECTS */}
      <div className="p-6 rounded border border-gray-200 shadow ">
        <h1 className="text-2xl font-bold mb-4 border-b-2 border-blue-500 pb-1 text-gray-800">Projects</h1>
        {user.projects?.map((p, i) => (
          <div key={i} className="border p-3 rounded mb-4 bg-white space-y-2">
            <label className="text-gray-600">Title</label>
            <input
              value={p.title}
              onChange={(e) => handleNestedChange("projects", i, "title", e.target.value)}
              className="w-full border rounded p-2 text-gray-600"
            />
            <label className="text-gray-600">Company / Organization</label>
            <input
              value={p.company}
              onChange={(e) => handleNestedChange("projects", i, "company", e.target.value)}
              className="w-full border rounded p-2 text-gray-600"
            />
            <label className="text-gray-600">Duration</label>
            <input
              value={p.duration}
              onChange={(e) => handleNestedChange("projects", i, "duration", e.target.value)}
              className="w-full border rounded p-2 text-gray-600"
            />
            <label className="text-gray-600">Description</label>
            <textarea
              className="w-full border rounded p-2 text-gray-600 resize-none overflow-hidden min-h-[60px]"
              value={p.description?.join("\n") || ""}
              onChange={(e) =>
                handleNestedChange("projects", i, "description", e.target.value.split("\n"))
              }
            />
          </div>
        ))}
        <button
          onClick={() =>
            handleAddItem("projects", { title: "", company: "", duration: "", description: [""] })
          }
          className="text-white mt-1 bg-blue-600 px-3 py-1 rounded"
        >
          + Add Project
        </button>
      </div>

      {/* SAVE BUTTON */}
      <div className="text-center">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
