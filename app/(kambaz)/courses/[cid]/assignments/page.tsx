"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { BsGripVertical } from "react-icons/bs";
import { FaSearch, FaPlus, FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { MdAssignment } from "react-icons/md";
import { FormControl, InputGroup, Button, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import GreenCheckmark from "../modules/GreenCheckmark";
import { RootState } from "../../../store";
import { setAssignments, deleteAssignment as deleteAssignmentAction } from "./reducer";
import * as client from "./client";
import Link from "next/link";

function AssignmentControlButtons({ assignmentId, onDelete, isFaculty }:
  { assignmentId: string; onDelete: (id: string) => void; isFaculty: boolean }) {
  return (
    <div className="float-end d-flex align-items-center">
      <GreenCheckmark />
      {isFaculty && (
        <FaTrash className="text-danger me-2 ms-2" style={{ cursor: "pointer" }}
          onClick={() => onDelete(assignmentId)} />
      )}
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const [showDialog, setShowDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch assignments from server on load
  const fetchAssignments = async () => {
    if (!cid) return;
    try {
      const data = await client.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [cid]);

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await client.deleteAssignment(selectedId);
      dispatch(deleteAssignmentAction(selectedId));
    } catch (error) {
      console.error(error);
    }
    setShowDialog(false);
  };

  return (
    <div id="wd-assignments">
      <div id="wd-assignments-controls" className="text-nowrap">
        {isFaculty && (
          <>
            <Button variant="danger" size="lg" className="me-1 float-end"
              id="wd-add-assignment"
              onClick={() => router.push(`/courses/${cid}/assignments/new`)}>
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
              Assignment
            </Button>
            <Button variant="secondary" size="lg" className="me-1 float-end"
              id="wd-add-assignment-group">
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
              Group
            </Button>
          </>
        )}
        <InputGroup className="w-50">
          <span className="input-group-text"><FaSearch /></span>
          <FormControl placeholder="Search for Assignments" id="wd-search-assignment" />
        </InputGroup>
      </div>
      <br /><br /><br /><br />

      <ListGroup className="rounded-0" id="wd-assignment-list">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            ASSIGNMENTS
            <div className="float-end d-flex align-items-center">
              <span className="border rounded-pill px-2 py-1 me-2" style={{ fontSize: "0.8rem" }}>
                40% of Total
              </span>
              {isFaculty && <FaPlus className="me-2" />}
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
          <ListGroup className="wd-lessons rounded-0">
            {assignments.map((assignment: any) => (
              <ListGroupItem key={assignment._id} className="wd-lesson p-3 ps-1">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  <MdAssignment className="me-3 fs-3 text-success" />
                  <div className="flex-fill">
                    {isFaculty ? (
                      <Link href={`/courses/${cid}/assignments/${assignment._id}`}
                        className="wd-assignment-link text-decoration-none text-dark fw-bold">
                        {assignment.title}
                      </Link>
                    ) : (
                      <span className="fw-bold">{assignment.title}</span>
                    )}
                    <br />
                    <span style={{ fontSize: "0.8rem" }} className="text-muted">
                      <span className="text-danger">Multiple Modules</span> |{" "}
                      <b>Not available until</b> {assignment.availableFrom} |{" "}
                      <b>Due</b> {assignment.dueDate} | {assignment.points} pts
                    </span>
                  </div>
                  <AssignmentControlButtons assignmentId={assignment._id}
                    onDelete={handleDeleteClick} isFaculty={isFaculty} />
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>

      <Modal show={showDialog} onHide={() => setShowDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this assignment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}
            id="wd-confirm-delete-assignment">Yes, Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}