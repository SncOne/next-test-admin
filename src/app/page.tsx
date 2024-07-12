"use client";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import styles from "./adminPanel.module.css";

const firebaseConfig = {
  apiKey: "AIzaSyCk_lvvum1PUtmSU3CRxgrp3yexfVlQ5iI",
  authDomain: "next-host-test.firebaseapp.com",
  projectId: "next-host-test",
  storageBucket: "next-host-test.appspot.com",
  messagingSenderId: "586141810520",
  appId: "1:586141810520:web:ce2aca61db43630afe6f2d",
  measurementId: "G-84M0XCFBJ8",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Project {
  uid: string;
  image: string;
  name: string;
  description: string;
  link: string;
}

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    const projectsCollection = collection(db, "projects");
    const projectSnapshot = await getDocs(projectsCollection);
    const projectList = projectSnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as Project[];
    return projectList;
  };

  const getProjects = async () => {
    const projectsData = await fetchProjects();
    console.log("Fetched Projects:", projectsData);
    setProjects(projectsData);
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleAddProject = async () => {
    try {
      const newProject = {
        name: name,
        image: image,
        description: description,
        link: link,
      };
      await addDoc(collection(db, "projects"), newProject);
      getProjects();
      setName("");
      setDescription("");
      setLink("");
      setImage("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      getProjects();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className={styles.adminPanel}>
        <h2>Admin Panel - Project Management</h2>
        <div className={styles.formContainer}>
          <h3>Add New Project</h3>
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Project Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <input
            type="text"
            placeholder="Project Image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <button onClick={handleAddProject}>Add Project</button>
        </div>
        <div className={styles.projectList}>
          <h3>Existing Projects</h3>
          {projects.map((project) => (
            <div key={project.uid} className={styles.projectCard}>
              <img
                src={project.image}
                alt={`Project ${project.uid} Thumbnail`}
                className={styles.projectImage}
              />
              <h4>{project.name}</h4>
              <p>{project.description}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                GitHub Link
              </a>
              <button onClick={() => handleDeleteProject(project.uid)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
