"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Button,
  Form,
  FormCheck,
  FormControl,
  ListGroup,
  ListGroupItem,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

import { RootState } from "../../../../../store";
import * as client from "../../client";

function gradeAnswer(question: any, answer: any): boolean {
  if (question.type === "MULTIPLE_CHOICE") {
    const idx = answer?.selectedChoice;
    if (typeof idx !== "number") return false;
    return !!question.choices?.[idx]?.correct;
  }
  if (question.type === "TRUE_FALSE") {
    return answer?.selectedBoolean === question.correctAnswer;
  }
  if (question.type === "FILL_IN_BLANK") {
    const typed = (answer?.typedAnswer || "").trim().toLowerCase();
    if (!typed) return false;
    return (question.possibleAnswers || []).some(
      (a: string) => a.trim().toLowerCase() === typed
    );
  }
  return false;
}

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewMode = searchParams.get("review") === "true";

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const isFaculty = currentUser?.role === "FACULTY";

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // answers keyed by questionId
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submittedResult, setSubmittedResult] = useState<any>(null);
  const [reviewAttempt, setReviewAttempt] = useState<any>(null);

  const fetchQuizAndAttempt = async () => {
    try {
      const q = await client.findQuizById(qid as string);
      setQuiz(q);

      if (reviewMode && !isFaculty) {
        const attempts = await client.findAttemptsForQuiz(qid as string);
        if (attempts.length > 0) {
          const latest = attempts[0];
          setReviewAttempt(latest);
          // Pre-fill answers from the attempt
          const preFilled: Record<string, any> = {};
          (latest.answers || []).forEach((a: any) => {
            preFilled[a.questionId] = a;
          });
          setAnswers(preFilled);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizAndAttempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qid, reviewMode]);

  const updateAnswer = (questionId: string, patch: any) => {
    if (reviewAttempt || submittedResult) return; // locked after submission
    setAnswers({
      ...answers,
      [questionId]: { ...answers[questionId], questionId, ...patch },
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Grade locally
    const totalPoints = (quiz.questions || []).reduce(
      (sum: number, q: any) => sum + (q.points || 0),
      0
    );
    let earned = 0;
    const gradedAnswers = (quiz.questions || []).map((q: any) => {
      const a = answers[q._id] || { questionId: q._id };
      const correct = gradeAnswer(q, a);
      if (correct) earned += q.points || 0;
      return { ...a, questionId: q._id, correct };
    });

    if (isFaculty) {
      // Faculty preview — show results locally, don't persist
      setSubmittedResult({
        score: earned,
        totalPoints,
        answers: gradedAnswers,
      });
      return;
    }

    // Student — persist attempt
    try {
      const saved = await client.submitAttempt(qid as string, {
        score: earned,
        totalPoints,
        answers: gradedAnswers,
      });
      setSubmittedResult(saved);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!quiz) return <div className="p-4">Quiz not found.</div>;

  const result = submittedResult || reviewAttempt;
  const showCorrectness = !!result;
  const locked = !!result;

  // When showing results, answers map pulls from result.answers
  const displayedAnswers: Record<string, any> = result
    ? result.answers.reduce((acc: any, a: any) => {
        acc[a.questionId] = a;
        return acc;
      }, {})
    : answers;

  return (
    <div id="wd-quiz-preview" className="container p-4">
      {isFaculty && !result && (
        <Alert variant="warning">
          <b>Preview mode.</b> This is how students see the quiz. Your answers
          are not saved.
          <Button
            variant="link"
            className="float-end"
            onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}
          >
            <FaPencil className="me-1" />
            Keep Editing This Quiz
          </Button>
        </Alert>
      )}

      {reviewMode && result && (
        <Alert variant="info">
          <b>Reviewing your last attempt.</b> Score: {result.score} /{" "}
          {result.totalPoints}
        </Alert>
      )}

      <h2>{quiz.title}</h2>
      {quiz.description && <p className="text-muted">{quiz.description}</p>}
      <hr />

      <ListGroup>
        {(quiz.questions || []).map((q: any, idx: number) => {
          const a = displayedAnswers[q._id] || {};
          const isCorrect = a.correct;
          let borderClass = "";
          if (showCorrectness) {
            borderClass = isCorrect ? "border-success" : "border-danger";
          }

          return (
            <ListGroupItem
              key={q._id}
              className={`mb-3 ${borderClass}`}
              style={{ borderWidth: showCorrectness ? 2 : 1 }}
            >
              <div className="d-flex justify-content-between">
                <h5>
                  Question {idx + 1}: {q.title}
                </h5>
                <span>
                  {showCorrectness &&
                    (isCorrect ? (
                      <FaCheck className="text-success me-2" />
                    ) : (
                      <FaTimes className="text-danger me-2" />
                    ))}
                  {q.points} pts
                </span>
              </div>
              <p>{q.question}</p>

              {/* MULTIPLE CHOICE */}
              {q.type === "MULTIPLE_CHOICE" && (
                <Form>
                  {(q.choices || []).map((c: any, cidx: number) => {
                    const isSelected = a.selectedChoice === cidx;
                    const highlight = showCorrectness
                      ? c.correct
                        ? "text-success fw-bold"
                        : isSelected
                        ? "text-danger"
                        : ""
                      : "";
                    return (
                      <FormCheck
                        key={cidx}
                        type="radio"
                        name={`q-${q._id}`}
                        label={<span className={highlight}>{c.text}</span>}
                        checked={isSelected}
                        disabled={locked}
                        onChange={() =>
                          updateAnswer(q._id, { selectedChoice: cidx })
                        }
                      />
                    );
                  })}
                </Form>
              )}

              {/* TRUE/FALSE */}
              {q.type === "TRUE_FALSE" && (
                <Form>
                  {[true, false].map((val) => {
                    const isSelected = a.selectedBoolean === val;
                    const highlight = showCorrectness
                      ? val === q.correctAnswer
                        ? "text-success fw-bold"
                        : isSelected
                        ? "text-danger"
                        : ""
                      : "";
                    return (
                      <FormCheck
                        key={String(val)}
                        type="radio"
                        name={`q-${q._id}`}
                        label={
                          <span className={highlight}>
                            {val ? "True" : "False"}
                          </span>
                        }
                        checked={isSelected}
                        disabled={locked}
                        onChange={() =>
                          updateAnswer(q._id, { selectedBoolean: val })
                        }
                      />
                    );
                  })}
                </Form>
              )}

              {/* FILL IN BLANK */}
              {q.type === "FILL_IN_BLANK" && (
                <div>
                  <FormControl
                    value={a.typedAnswer || ""}
                    disabled={locked}
                    placeholder="Your answer"
                    onChange={(e) =>
                      updateAnswer(q._id, { typedAnswer: e.target.value })
                    }
                  />
                  {showCorrectness && (
                    <small className="text-muted">
                      Accepted: {(q.possibleAnswers || []).join(", ")}
                    </small>
                  )}
                </div>
              )}
            </ListGroupItem>
          );
        })}
      </ListGroup>

      <hr />
      <div className="text-end">
        {!locked && (
          <>
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => router.push(`/courses/${cid}/quizzes`)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleSubmit}>
              Submit Quiz
            </Button>
          </>
        )}
        {locked && (
          <>
            <span className="me-3">
              <b>Score:</b> {result.score} / {result.totalPoints}
            </span>
            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/courses/${cid}/quizzes/${qid}`)
              }
            >
              Back to Quiz
            </Button>
          </>
        )}
      </div>
    </div>
  );
}