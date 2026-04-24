"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Table, Spinner } from "react-bootstrap";
import { FaPencil } from "react-icons/fa6";
import { RootState } from "../../../../store";
import * as client from "../client";

function formatDate(d: string | Date | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function yesNo(b: any) {
  return b ? "Yes" : "No";
}

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const isFaculty = currentUser?.role === "FACULTY";

  const [quiz, setQuiz] = useState<any>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuiz = async () => {
    try {
      const data = await client.findQuizById(qid as string);
      setQuiz(data);

      if (!isFaculty) {
        try {
          const attempts = await client.findAttemptsForQuiz(qid as string);
          setAttemptCount(attempts.length);
          if (attempts.length > 0) setLatestAttempt(attempts[0]);
        } catch {
          // no attempts yet
        }
      }
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

  const totalPoints = (quiz.questions || []).reduce(
    (sum: number, q: any) => sum + (q.points || 0),
    0
  );
  const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
  const canTake = attemptCount < maxAttempts;

  // ---------- STUDENT VIEW ----------
  if (!isFaculty) {
    if (!quiz.published) {
      return <div className="p-4">This quiz is not yet available.</div>;
    }
    return (
      <div id="wd-quiz-details-student" className="container p-4">
        <h2>{quiz.title}</h2>
        <hr />
        <p>{quiz.description || "No description."}</p>

        <Table borderless size="sm" style={{ maxWidth: 500 }}>
          <tbody>
            <tr>
              <td>
                <b>Points</b>
              </td>
              <td>{totalPoints}</td>
            </tr>
            <tr>
              <td>
                <b>Questions</b>
              </td>
              <td>{quiz.questions?.length || 0}</td>
            </tr>
            <tr>
              <td>
                <b>Time Limit</b>
              </td>
              <td>{quiz.timeLimit} Minutes</td>
            </tr>
            <tr>
              <td>
                <b>Due</b>
              </td>
              <td>{formatDate(quiz.dueDate)}</td>
            </tr>
            <tr>
              <td>
                <b>Available From</b>
              </td>
              <td>{formatDate(quiz.availableDate)}</td>
            </tr>
            <tr>
              <td>
                <b>Until</b>
              </td>
              <td>{formatDate(quiz.untilDate)}</td>
            </tr>
            <tr>
              <td>
                <b>Attempts</b>
              </td>
              <td>
                {attemptCount} / {maxAttempts}
              </td>
            </tr>
            {latestAttempt && (
              <tr>
                <td>
                  <b>Last Score</b>
                </td>
                <td>
                  {latestAttempt.score} / {latestAttempt.totalPoints}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <hr />
        <Button
          variant="danger"
          disabled={!canTake}
          onClick={() =>
            router.push(`/courses/${cid}/quizzes/${qid}/preview`)
          }
        >
          {canTake ? "Start Quiz" : "No Attempts Remaining"}
        </Button>{" "}
        {latestAttempt && (
          <Button
            variant="secondary"
            onClick={() =>
              router.push(`/courses/${cid}/quizzes/${qid}/preview?review=true`)
            }
          >
            Review Last Attempt
          </Button>
        )}
      </div>
    );
  }

  // ---------- FACULTY VIEW ----------
  return (
    <div id="wd-quiz-details" className="container p-4">
      <div className="text-end mb-3">
        <Button
          variant="outline-secondary"
          className="me-2"
          onClick={() =>
            router.push(`/courses/${cid}/quizzes/${qid}/preview`)
          }
        >
          Preview
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}
        >
          <FaPencil className="me-2" />
          Edit
        </Button>
      </div>

      <h2>{quiz.title}</h2>
      <hr />

      <Table borderless>
        <tbody>
          <Row label="Quiz Type" value={quiz.quizType?.replace(/_/g, " ")} />
          <Row label="Points" value={totalPoints} />
          <Row label="Assignment Group" value={quiz.assignmentGroup} />
          <Row label="Shuffle Answers" value={yesNo(quiz.shuffleAnswers)} />
          <Row label="Time Limit" value={`${quiz.timeLimit} Minutes`} />
          <Row
            label="Multiple Attempts"
            value={yesNo(quiz.multipleAttempts)}
          />
          {quiz.multipleAttempts && (
            <Row label="How Many Attempts" value={quiz.howManyAttempts} />
          )}
          <Row label="Show Correct Answers" value={quiz.showCorrectAnswers} />
          <Row label="Access Code" value={quiz.accessCode || "—"} />
          <Row
            label="One Question at a Time"
            value={yesNo(quiz.oneQuestionAtATime)}
          />
          <Row label="Webcam Required" value={yesNo(quiz.webcamRequired)} />
          <Row
            label="Lock Questions After Answering"
            value={yesNo(quiz.lockQuestionsAfterAnswering)}
          />
        </tbody>
      </Table>

      <hr />
      <Table>
        <thead>
          <tr>
            <th>Due</th>
            <th>For</th>
            <th>Available from</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatDate(quiz.dueDate)}</td>
            <td>Everyone</td>
            <td>{formatDate(quiz.availableDate)}</td>
            <td>{formatDate(quiz.untilDate)}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <tr>
      <td className="text-end" style={{ width: "40%" }}>
        <b>{label}</b>
      </td>
      <td>{value}</td>
    </tr>
  );
}