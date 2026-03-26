import { useState } from "react";

const defaultSkill = { name: "", level: "Beginner", tags: [] };

const SkillInput = ({ label, value, onChange }) => {
  const [tagInput, setTagInput] = useState("");

  const addSkill = () => {
    onChange([...(value || []), { ...defaultSkill }]);
  };

  const updateSkill = (index, key, nextValue) => {
    const copy = [...value];
    copy[index] = { ...copy[index], [key]: nextValue };
    onChange(copy);
  };

  const removeSkill = (index) => {
    const copy = [...value];
    copy.splice(index, 1);
    onChange(copy);
  };

  const addTag = (index) => {
    const tag = tagInput.trim();
    if (!tag) return;
    const copy = [...value];
    copy[index].tags = [...(copy[index].tags || []), tag];
    onChange(copy);
    setTagInput("");
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{label}</h5>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={addSkill}>
            Add Skill
          </button>
        </div>

        {(value || []).map((skill, index) => (
          <div key={`${label}-${index}`} className="border rounded p-3 mb-3 bg-light-subtle">
            <div className="row g-2">
              <div className="col-md-5">
                <input
                  className="form-control"
                  placeholder="Skill name"
                  value={skill.name}
                  onChange={(e) => updateSkill(index, "name", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={skill.level}
                  onChange={(e) => updateSkill(index, "level", e.target.value)}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
              <div className="col-md-3 d-grid">
                <button type="button" className="btn btn-outline-danger" onClick={() => removeSkill(index)}>
                  Remove
                </button>
              </div>
              <div className="col-12 d-flex gap-2">
                <input
                  className="form-control"
                  placeholder="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <button type="button" className="btn btn-outline-secondary" onClick={() => addTag(index)}>
                  Add Tag
                </button>
              </div>
              <div className="col-12">
                <small className="text-muted">Tags: {(skill.tags || []).join(", ") || "None"}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillInput;
