"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Tabs,
  Tab,
  Form,
  Row,
  Col,
  Button,
  FormControl,
  FormLabel,
  FormCheck,
  FormSelect,
  Spinner,
} from "react-bootstrap";
import * as client from "../../client";
import { updateQuiz as updateQuizAction } from "../../reducer";
import QuestionsEditor from "./QuestionsEditor";

// Convert ISO date to the "YYYY-MM-DDTHH:mm" format datetime-local inputs expect
function toInputDate(d: any) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("details");

  const fetchQuiz = async () => {
    try {
      const data = await client.findQuizById(qid as string);
      setQuiz(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qid]);

  const totalPoints = (quiz?.questions || []).reduce(
    (sum: number, q: any) => sum + (q.points || 0),
    0
  );

  const saveQuiz = async (published?: boolean) => {
    try {
      const payload = { ...quiz };
      if (typeof published === "boolean") payload.published = published;
      const updated = await client.updateQuiz(payload);
      dispatch(updateQuizAction(updated));
      return updated;
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    await saveQuiz();
    router.push(`/courses/${cid}/quizzes/${qid}`);
  };

  const handleSaveAndPublish = async () => {
    await saveQuiz(true);
    router.push(`/courses/${cid}/quizzes`);
  };

  const handleCancel = () => {
    router.push(`/courses/${cid}/quizzes`);
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!quiz) {
    return <div className="p-4">Quiz not found.</div>;
  }

  const update = (field: string, value: any) =>
    setQuiz({ ...quiz, [field]: value });

  return (
    <div id="wd-quiz-editor" className="container p-4">
      <div className="d-flex justify-content-end mb-3">
        <span className="me-3">
          <b>Points:</b> {totalPoints}
        </span>
        <span>
          {quiz.published ? (
            <span className="text-success">● Published</span>
          ) : (
            <span className="text-muted">○ Not Published</span>
          )}
        </span>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "details")}
        className="mb-3"
      >
        <Tab eventKey="details" title="Details">
          <Form>
            <FormLabel>Title</FormLabel>
            <FormControl
              className="mb-3"
              value={quiz.title || ""}
              onChange={(e) => update("title", e.target.value)}
            />

            <FormLabel>Quiz Instructions</FormLabel>
            <FormControl
              as="textarea"
              rows={5}
              className="mb-3"
              value={quiz.description || ""}
              onChange={(e) => update("description", e.target.value)}
            />

            <Row className="mb-3">
              <Col md={3}>
                <FormLabel className="float-md-end">Quiz Type</FormLabel>
              </Col>
              <Col md={9}>
                <FormSelect
                  value={quiz.quizType || "GRADED_QUIZ"}
                  onChange={(e) => update("quizType", e.target.value)}
                >
                  <option value="GRADED_QUIZ">Graded Quiz</option>
                  <option value="PRACTICE_QUIZ">Practice Quiz</option>
                  <option value="GRADED_SURVEY">Graded Survey</option>
                  <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                </FormSelect>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <FormLabel className="float-md-end">Assignment Group</FormLabel>
              </Col>
              <Col md={9}>
                <FormSelect
                  value={quiz.assignmentGroup || "QUIZZES"}
                  onChange={(e) => update("assignmentGroup", e.target.value)}
                >
                  <option value="QUIZZES">Quizzes</option>
                  <option value="EXAMS">Exams</option>
                  <option value="ASSIGNMENTS">Assignments</option>
                  <option value="PROJECT">Project</option>
                </FormSelect>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <FormLabel className="float-md-end">Options</FormLabel>
              </Col>
              <Col md={9}>
                <FormCheck
                  type="checkbox"
                  label="Shuffle Answers"
                  checked={!!quiz.shuffleAnswers}
                  onChange={(e) => update("shuffleAnswers", e.target.checked)}
                />
                <div className="d-flex align-items-center mt-2">
                  <span className="me-2">Time Limit</span>
                  <FormControl
                    type="number"
                    style={{ width: 100 }}
                    value={quiz.timeLimit ?? 20}
                    onChange={(e) =>
                      update("timeLimit", parseInt(e.target.value) || 0)
                    }
                  />
                  <span className="ms-2">Minutes</span>
                </div>
                <FormCheck
                  className="mt-2"
                  type="checkbox"
                  label="Allow Multiple Attempts"
                  checked={!!quiz.multipleAttempts}
                  onChange={(e) =>
                    update("multipleAttempts", e.target.checked)
                  }
                />
                {quiz.multipleAttempts && (
                  <div className="d-flex align-items-center mt-2">
                    <span className="me-2">How Many Attempts</span>
                    <FormControl
                      type="number"
                      style={{ width: 100 }}
                      min={1}
                      value={quiz.howManyAttempts ?? 1}
                      onChange={(e) =>
                        update(
                          "howManyAttempts",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                )}
                <FormCheck
                  className="mt-2"
                  type="checkbox"
                  label="One Question at a Time"
                  checked={!!quiz.oneQuestionAtATime}
                  onChange={(e) =>
                    update("oneQuestionAtATime", e.target.checked)
                  }
                />
                <FormCheck
                  className="mt-2"
                  type="checkbox"
                  label="Webcam Required"
                  checked={!!quiz.webcamRequired}
                  onChange={(e) => update("webcamRequired", e.target.checked)}
                />
                <FormCheck
                  className="mt-2"
                  type="checkbox"
                  label="Lock Questions After Answering"
                  checked={!!quiz.lockQuestionsAfterAnswering}
                  onChange={(e) =>
                    update("lockQuestionsAfterAnswering", e.target.checked)
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <FormLabel className="float-md-end">
                  Show Correct Answers
                </FormLabel>
              </Col>
              <Col md={9}>
                <FormSelect
                  value={quiz.showCorrectAnswers || "Immediately"}
                  onChange={(e) =>
                    update("showCorrectAnswers", e.target.value)
                  }
                >
                  <option value="Immediately">Immediately</option>
                  <option value="AfterDueDate">After Due Date</option>
                  <option value="Never">Never</option>
                </FormSelect>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <FormLabel className="float-md-end">Access Code</FormLabel>
              </Col>
              <Col md={9}>
                <FormControl
                  value={quiz.accessCode || ""}
                  onChange={(e) => update("accessCode", e.target.value)}
                />
              </Col>
            </Row>

            <hr />

            <Row className="mb-3">
              <Col md={3}>
                <FormLabel className="float-md-end">Due</FormLabel>
              </Col>
              <Col md={9}>
                <FormControl
                  type="datetime-local"
                  value={toInputDate(quiz.dueDate)}
                  onChange={(e) => update("dueDate", e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <FormLabel className="float-md-end">Available From</FormLabel>
              </Col>
              <Col md={9}>
                <FormControl
                  type="datetime-local"
                  value={toInputDate(quiz.availableDate)}
                  onChange={(e) => update("availableDate", e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <FormLabel className="float-md-end">Until</FormLabel>
              </Col>
              <Col md={9}>
                <FormControl
                  type="datetime-local"
                  value={toInputDate(quiz.untilDate)}
                  onChange={(e) => update("untilDate", e.target.value)}
                />
              </Col>
            </Row>
          </Form>
        </Tab>

        <Tab eventKey="questions" title="Questions">
          <QuestionsEditor
            quiz={quiz}
            onQuizUpdate={setQuiz}
          />
        </Tab>
      </Tabs>

      <hr />
      <div className="float-end">
        <Button
          variant="secondary"
          className="me-2"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="outline-danger"
          className="me-2"
          onClick={handleSaveAndPublish}
        >
          Save &amp; Publish
        </Button>
        <Button variant="danger" onClick={handleSave} id="wd-save-quiz">
          Save
        </Button>
      </div>
    </div>
  );
}