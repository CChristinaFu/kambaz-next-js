"use client";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });

  const [module, setModule] = useState({
    id: 1,
    name: "Web Development",
    description: "Learn full stack web development with React and Node.js",
    course: "CS5610",
  });

  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>

      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary me-2" href={ASSIGNMENT_API_URL}>
        Get Assignment
      </a>
      <a id="wd-retrieve-module" className="btn btn-primary" href={MODULE_API_URL}>
        Get Module
      </a>
      <hr />

      <h4>Retrieving Properties</h4>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary me-2" href={`${ASSIGNMENT_API_URL}/title`}>
        Get Title
      </a>
      <a id="wd-retrieve-module-name" className="btn btn-primary" href={`${MODULE_API_URL}/name`}>
        Get Module Name
      </a>
      <hr />

      <h4>Modifying Properties</h4>

      <label htmlFor="wd-assignment-title" className="form-label">Assignment Title</label>
      <a id="wd-update-assignment-title" className="btn btn-primary float-end" href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
        Update Title
      </a>
      <FormControl className="w-75 mb-2" id="wd-assignment-title" defaultValue={assignment.title}
        onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />

      <label htmlFor="wd-assignment-score" className="form-label">Assignment Score</label>
      <a id="wd-update-assignment-score" className="btn btn-primary float-end" href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
        Update Score
      </a>
      <FormControl className="w-75 mb-2" id="wd-assignment-score" type="number" defaultValue={assignment.score}
        onChange={(e) => setAssignment({ ...assignment, score: parseInt(e.target.value) || 0 })} />

      <div className="mb-3">
        <a id="wd-update-assignment-completed" className="btn btn-primary float-end" href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
          Update Completed
        </a>
        <input type="checkbox" id="wd-assignment-completed" className="form-check-input me-2"
          checked={assignment.completed}
          onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })} />
        <label htmlFor="wd-assignment-completed" className="form-check-label">Completed</label>
      </div>

      <label htmlFor="wd-module-name" className="form-label">Module Name</label>
      <a id="wd-update-module-name" className="btn btn-primary float-end" href={`${MODULE_API_URL}/name/${module.name}`}>
        Update Module Name
      </a>
      <FormControl className="w-75 mb-2" id="wd-module-name" defaultValue={module.name}
        onChange={(e) => setModule({ ...module, name: e.target.value })} />

      <label htmlFor="wd-module-description" className="form-label">Module Description</label>
      <a id="wd-update-module-description" className="btn btn-primary float-end" href={`${MODULE_API_URL}/description/${module.description}`}>
        Update Description
      </a>
      <FormControl className="w-75 mb-2" id="wd-module-description" defaultValue={module.description}
        onChange={(e) => setModule({ ...module, description: e.target.value })} />

      <hr />
    </div>
  );
}