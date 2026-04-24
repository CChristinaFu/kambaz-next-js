"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { BsGripVertical } from "react-icons/bs";
import { FaSearch, FaPlus, FaBan } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { MdAssignment, MdCheckCircle } from "react-icons/md";
import {
  FormControl,
  InputGroup,
  Button,
  ListGroup,
  ListGroupItem,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { RootState } from "../../../store";
import {
  setQuizzes,
  addQuiz,
  updateQuiz as updateQuizAction,
  deleteQuiz as deleteQuizAction,
} from "./reducer";
import * as client from "./client";

// Compute availability label based on dates
function getAvailabilityLabel(quiz: any) {
  const now = new Date();
  const available = quiz.availableDate ? new Date(quiz.availableDate) : null;
  const until = quiz.untilDate ? new Date(quiz.untilDate) : null;

  if (until && now > until) return { label: "Closed", color: "text-muted" };
  if (available && now < available) {
    return {
      label: `Not available until ${available.toLocaleDateString()}`,
      color: "text-muted",
    };
  }
  return { label: "Available", color: "text-success fw-bold" };
}

function formatDate(d: string | Date | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const isFaculty = currentUser?.role === "FACULTY";

  const [search, setSearch] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [latestScores, setLatestScores] = useState<Record<string, any>>({});

  const fetchQuizzes = async () => {
    if (!cid) return;
    try {
      const data = await client.findQuizzesForCourse(cid as string);
      dispatch(setQuizzes(data));

      // If student, fetch latest attempt per quiz for scores
      if (!isFaculty) {
        const scores: Record<string, any> = {};
        for (const quiz of data) {
          try {
            const latest = await client.findLatestAttempt(quiz._id);
            if (latest) scores[quiz._id] = latest;
          } catch {
            // no attempt yet
          }
        }
        setLatestScores(scores);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const handleCreate = async () => {
    try {
      const newQuiz = await client.createQuizForCourse(cid as string, {
        title: "Unnamed Quiz",
      });
      dispatch(addQuiz(newQuiz));
      router.push(`/courses/${cid}/quizzes/${newQuiz._id}/edit`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedQuizId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedQuizId) return;
    try {
      await client.deleteQuiz(selectedQuizId);
      dispatch(deleteQuizAction(selectedQuizId));
    } catch (err) {
      console.error(err);
    }
    setShowDeleteDialog(false);
    setSelectedQuizId(null);
  };

  const togglePublish = async (quiz: any) => {
    try {
      const updated = await client.publishQuiz(quiz._id, !quiz.published);
      dispatch(updateQuizAction(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const quizPoints = (quiz: any) =>
    (quiz.questions || []).reduce(
      (sum: number, q: any) => sum + (q.points || 0),
      0
    );

  // Filter by search, and hide unpublished from students
  const visibleQuizzes = quizzes
    .filter((q: any) => isFaculty || q.published)
    .filter((q: any) =>
      q.title?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div id="wd-quizzes">
      <div id="wd-quizzes-controls" className="text-nowrap">
        {isFaculty && (
          <Button
            variant="danger"
            size="lg"
            className="me-1 float-end"
            id="wd-add-quiz"
            onClick={handleCreate}
          >
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Quiz
          </Button>
        )}
        <InputGroup className="w-50">
          <span className="input-group-text">
            <FaSearch />
          </span>
          <FormControl
            placeholder="Search for Quiz"
            id="wd-search-quiz"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>
      <br />
      <br />
      <br />
      <br />

      <ListGroup className="rounded-0" id="wd-quiz-list">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            Assignment Quizzes
          </div>

          {visibleQuizzes.length === 0 ? (
            <div className="p-4 text-center text-muted">
              {isFaculty
                ? "No quizzes yet. Click + Quiz to create one."
                : "No quizzes available."}
            </div>
          ) : (
            <ListGroup className="wd-lessons rounded-0">
              {visibleQuizzes.map((quiz: any) => {
                const availability = getAvailabilityLabel(quiz);
                const numQuestions = quiz.questions?.length || 0;
                const points = quizPoints(quiz);
                const studentScore = latestScores[quiz._id];

                return (
                  <ListGroupItem
                    key={quiz._id}
                    className="wd-lesson p-3 ps-1"
                  >
                    <div className="d-flex align-items-center">
                      <BsGripVertical className="me-2 fs-3" />
                      <MdAssignment className="me-3 fs-3 text-success" />
                      <div className="flex-fill">
                        <Link
                          href={`/courses/${cid}/quizzes/${quiz._id}`}
                          className="wd-quiz-link text-decoration-none text-dark fw-bold"
                        >
                          {quiz.title}
                        </Link>
                        <br />
                        <span style={{ fontSize: "0.8rem" }} className="text-muted">
                          <span className={availability.color}>
                            {availability.label}
                          </span>{" "}
                          | <b>Due</b> {formatDate(quiz.dueDate)} | {points} pts |{" "}
                          {numQuestions} Question{numQuestions !== 1 ? "s" : ""}
                          {!isFaculty && studentScore && (
                            <>
                              {" "}
                              | <b>Score:</b> {studentScore.score}/
                              {studentScore.totalPoints}
                            </>
                          )}
                        </span>
                      </div>

                      {/* Publish toggle (faculty only) */}
                      {isFaculty && (
                        <span
                          onClick={() => togglePublish(quiz)}
                          style={{ cursor: "pointer" }}
                          className="me-3"
                          title={quiz.published ? "Published" : "Unpublished"}
                        >
                          {quiz.published ? (
                            <MdCheckCircle className="fs-3 text-success" />
                          ) : (
                            <FaBan className="fs-4 text-secondary" />
                          )}
                        </span>
                      )}

                      {/* Context menu (faculty only) */}
                      {isFaculty && (
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            as="span"
                            style={{ cursor: "pointer" }}
                            className="wd-quiz-menu"
                          >
                            <IoEllipsisVertical className="fs-4" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() =>
                                router.push(
                                  `/courses/${cid}/quizzes/${quiz._id}/edit`
                                )
                              }
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleDeleteClick(quiz._id)}
                              className="text-danger"
                            >
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => togglePublish(quiz)}>
                              {quiz.published ? "Unpublish" : "Publish"}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          )}
        </ListGroupItem>
      </ListGroup>

      <Modal show={showDeleteDialog} onHide={() => setShowDeleteDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this quiz?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            id="wd-confirm-delete-quiz"
          >
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}