"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { BsGripVertical } from "react-icons/bs";
import { FaSearch, FaPlus, FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { MdAssignment } from "react-icons/md";
import { FormControl, InputGroup, Button, ListGroup,
         ListGroupItem, Modal } from "react-bootstrap";
import GreenCheckmark from "../modules/GreenCheckmark";
import { RootState } from "../../../store";
import { deleteAssignment } from "./reducer";
import Link from "next/link";

function AssignmentControlButtons({ assignmentId, onDelete, isFaculty }:
  { assignmentId: string; onDelete: (id: string) => void; isFaculty: boolean }) {
  return (
    <div className="float-end d-flex align-items-center">
      <GreenCheckmark />
      {isFaculty && (                                     // only faculty see trash icon
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
  const isFaculty = currentUser?.role === "FACULTY";      // check role

  const [showDialog, setShowDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => { setSelectedId(id); setShowDialog(true); };
  const confirmDelete = () => {
    if (selectedId) dispatch(deleteAssignment(selectedId));
    setShowDialog(false);
  };

  return (
    <div id="wd-assignments">
      <div id="wd-assignments-controls" className="text-nowrap">
        {isFaculty && (                                   // only faculty see add buttons
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
              {isFaculty && <FaPlus className="me-2" />} {/* only faculty see + */}
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
          <ListGroup className="wd-lessons rounded-0">
            {assignments
              .filter((a: any) => a.course === cid)
              .map((assignment: any) => (
                <ListGroupItem key={assignment._id} className="wd-lesson p-3 ps-1">
                  <div className="d-flex align-items-center">
                    <BsGripVertical className="me-2 fs-3" />
                    <MdAssignment className="me-3 fs-3 text-success" />
                    <div className="flex-fill">
                      {isFaculty ? (                      // faculty can click to edit
                        <Link href={`/courses/${cid}/assignments/${assignment._id}`}
                          className="wd-assignment-link text-decoration-none text-dark fw-bold">
                          {assignment.title}
                        </Link>
                      ) : (                               // students just see the title
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

      {/* Delete confirmation dialog */}
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




















// import Link from "next/link";
// import { BsGripVertical } from "react-icons/bs";
// import { FaSearch, FaPlus } from "react-icons/fa";
// import { IoEllipsisVertical } from "react-icons/io5";
// import { MdAssignment } from "react-icons/md";
// import {
//   FormControl,
//   InputGroup,
//   Button,
//   ListGroup,
//   ListGroupItem,
// } from "react-bootstrap";
// import GreenCheckmark from "../modules/GreenCheckmark";

// function AssignmentControlButtons() {
//   return (
//     <div className="float-end">
//       <GreenCheckmark />
//       <IoEllipsisVertical className="fs-4" />
//     </div>
//   );
// }

// function AssignmentsControls() {
//   return (
//     <div id="wd-assignments-controls" className="text-nowrap">
//       <Button
//         variant="danger"
//         size="lg"
//         className="me-1 float-end"
//         id="wd-add-assignment"
//       >
//         <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
//         Assignment
//       </Button>
//       <Button
//         variant="secondary"
//         size="lg"
//         className="me-1 float-end"
//         id="wd-add-assignment-group"
//       >
//         <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
//         Group
//       </Button>
//       <InputGroup className="w-50">
//         <span className="input-group-text">
//           <FaSearch />
//         </span>
//         <FormControl
//           placeholder="Search for Assignments"
//           id="wd-search-assignment"
//         />
//       </InputGroup>
//     </div>
//   );
// }

// export default function Assignments() {
//   return (
//     <div id="wd-assignments">
//       <AssignmentsControls />
//       <br />
//       <br />
//       <br />
//       <br />
//       <ListGroup className="rounded-0" id="wd-assignment-list">
//         <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
//           <div className="wd-title p-3 ps-2 bg-secondary">
//             <BsGripVertical className="me-2 fs-3" />
//             ASSIGNMENTS
//             <AssignmentControlButtons />
//             <span className="float-end me-3">
//               <span
//                 className="border rounded-pill px-2 py-1 me-1"
//                 style={{ fontSize: "0.8rem" }}
//               >
//                 40% of Total
//               </span>
//               <FaPlus className="position-relative" style={{ bottom: "1px" }} />
//             </span>
//           </div>
//           <ListGroup className="wd-lessons rounded-0">
//             <ListGroupItem className="wd-lesson p-3 ps-1">
//               <div className="d-flex align-items-center">
//                 <BsGripVertical className="me-2 fs-3" />
//                 <MdAssignment className="me-3 fs-3 text-success" />
//                 <div className="flex-fill">
//                   <Link
//                     href="/courses/1234/assignments/123"
//                     className="wd-assignment-link text-decoration-none text-dark fw-bold"
//                   >
//                     A1 - ENV + HTML
//                   </Link>
//                   <br />
//                   <span style={{ fontSize: "0.8rem" }} className="text-muted">
//                     <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 6 at 12:00am |{" "}
//                     <b>Due</b> May 13 at 11:59pm | 100 pts
//                   </span>
//                 </div>
//                 <AssignmentControlButtons />
//               </div>
//             </ListGroupItem>
//             <ListGroupItem className="wd-lesson p-3 ps-1">
//               <div className="d-flex align-items-center">
//                 <BsGripVertical className="me-2 fs-3" />
//                 <MdAssignment className="me-3 fs-3 text-success" />
//                 <div className="flex-fill">
//                   <Link
//                     href="/courses/1234/assignments/123"
//                     className="wd-assignment-link text-decoration-none text-dark fw-bold"
//                   >
//                     A2 - CSS + BOOTSTRAP
//                   </Link>
//                   <br />
//                   <span style={{ fontSize: "0.8rem" }} className="text-muted">
//                     <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 6 at 12:00am |{" "}                    <b>Due</b> May 20 at 11:59pm | 100 pts
//                   </span>
//                 </div>
//                 <AssignmentControlButtons />
//               </div>
//             </ListGroupItem>
//             <ListGroupItem className="wd-lesson p-3 ps-1">
//               <div className="d-flex align-items-center">
//                 <BsGripVertical className="me-2 fs-3" />
//                 <MdAssignment className="me-3 fs-3 text-success" />
//                 <div className="flex-fill">
//                   <Link
//                     href="/courses/1234/assignments/123"
//                     className="wd-assignment-link text-decoration-none text-dark fw-bold"
//                   >
//                     A3 - JAVASCRIPT + REACT
//                   </Link>
//                   <br />
//                   <span style={{ fontSize: "0.8rem" }} className="text-muted">
//                     <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 6 at 12:00am |{" "}
//                     <b>Due</b> May 27 at 11:59pm | 100 pts
//                   </span>
//                 </div>
//                 <AssignmentControlButtons />
//               </div>
//             </ListGroupItem>
//             <ListGroupItem className="wd-lesson p-3 ps-1">
//               <div className="d-flex align-items-center">
//                 <BsGripVertical className="me-2 fs-3" />
//                 <MdAssignment className="me-3 fs-3 text-success" />
//                 <div className="flex-fill">
//                   <Link
//                     href="/courses/1234/assignments/123"
//                     className="wd-assignment-link text-decoration-none text-dark fw-bold"
//                   >
//                     A4 - STATE + ROUTING
//                   </Link>
//                   <br />
//                   <span style={{ fontSize: "0.8rem" }} className="text-muted">
//                     <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 6 at 12:00am |{" "}
//                     <b>Due</b> Jun 3 at 11:59pm | 100 pts
//                   </span>
//                 </div>
//                 <AssignmentControlButtons />
//               </div>
//             </ListGroupItem>
//           </ListGroup>
//         </ListGroupItem>
//       </ListGroup>
//     </div>
//   );
// }