/*
Database schema for the Internship Finder and Resume Generator Application.
*/

CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  contact TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS education (
  edu_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  institute TEXT NOT NULL,
  degree TEXT NOT NULL,
  grade_type TEXT,
  grade_value TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT
);

CREATE TABLE IF NOT EXISTS experience (
  exp_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  summary TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  project_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  project_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_skills (
  ps_id INTEGER PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  UNIQUE(project_id, skill)
);

CREATE TABLE IF NOT EXISTS user_skills (
  skill_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  UNIQUE(user_id, skill)
);

CREATE TABLE IF NOT EXISTS achievement (
  ach_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS links (
  link_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  UNIQUE(user_id, label)
);