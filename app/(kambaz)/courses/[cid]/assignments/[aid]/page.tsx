"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { FormControl, FormLabel, Button, Row, Col } from "react-bootstrap";
import * as client from "../client";
import { addAssignment, updateAssignment } from "../reducer";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const isNew = aid === "new";

  const [assignment, setAssignment] = useState<any>({
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableFrom: "",
    availableUntil: "",
  });

  // Load the existing assignment when editing
  const fetchAssignment = async () => {
    if (isNew) return;
    try {
      const data = await client.findAssignmentById(aid as string);
      setAssignment(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [aid]);

  const handleSave = async () => {
    try {
      if (isNew) {
        const created = await client.createAssignmentForCourse(
          cid as string,
          assignment
        );
        dispatch(addAssignment(created));
      } else {
        await client.updateAssignment(assignment);
        dispatch(updateAssignment(assignment));
      }
      router.push(`/courses/${cid}/assignments`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    router.push(`/courses/${cid}/assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="container">
      <h2>{isNew ? "New Assignment" : "Edit Assignment"}</h2>
      <hr />

      <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
      <FormControl
        id="wd-name"
        className="mb-3"
        value={assignment.title || ""}
        onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />

      <FormControl
        as="textarea"
        id="wd-description"
        className="mb-3"
        rows={5}
        value={assignment.description || ""}
        onChange={(e) => setAssignment({ ...assignment, description: e.target.value })} />

      <Row className="mb-3">
        <Col md={3}>
          <FormLabel htmlFor="wd-points" className="float-md-end">
            Points
          </FormLabel>
        </Col>
        <Col md={9}>
          <FormControl
            id="wd-points"
            type="number"
            value={assignment.points ?? 100}
            onChange={(e) =>
              setAssignment({ ...assignment, points: parseInt(e.target.value) || 0 })
            } />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <FormLabel htmlFor="wd-due-date" className="float-md-end">
            Due
          </FormLabel>
        </Col>
        <Col md={9}>
          <FormControl
            id="wd-due-date"
            type="datetime-local"
            value={assignment.dueDate || ""}
            onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <FormLabel htmlFor="wd-available-from" className="float-md-end">
            Available from
          </FormLabel>
        </Col>
        <Col md={9}>
          <FormControl
            id="wd-available-from"
            type="datetime-local"
            value={assignment.availableFrom || ""}
            onChange={(e) =>
              setAssignment({ ...assignment, availableFrom: e.target.value })
            } />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <FormLabel htmlFor="wd-available-until" className="float-md-end">
            Until
          </FormLabel>
        </Col>
        <Col md={9}>
          <FormControl
            id="wd-available-until"
            type="datetime-local"
            value={assignment.availableUntil || ""}
            onChange={(e) =>
              setAssignment({ ...assignment, availableUntil: e.target.value })
            } />
        </Col>
      </Row>

      <hr />
      <div className="float-end">
        <Button variant="secondary" className="me-2" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave} id="wd-save-assignment">
          Save
        </Button>
      </div>
    </div>
  );
}