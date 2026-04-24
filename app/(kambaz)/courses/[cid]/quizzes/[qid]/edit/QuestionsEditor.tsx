"use client";
import { useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import * as client from "../../client";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import FillInBlankEditor from "./FillInBlankEditor";

export default function QuestionsEditor({
  quiz,
  onQuizUpdate,
}: {
  quiz: any;
  onQuizUpdate: (quiz: any) => void;
}) {
  const questions = quiz.questions || [];
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());

  const totalPoints = questions.reduce(
    (sum: number, q: any) => sum + (q.points || 0),
    0
  );

  const addQuestion = async () => {
    const newQuestion = {
      _id: uuidv4(),
      title: "New Question",
      type: "MULTIPLE_CHOICE",
      points: 1,
      question: "",
      choices: [
        { text: "Option 1", correct: true },
        { text: "Option 2", correct: false },
      ],
      correctAnswer: true,
      possibleAnswers: [],
    };
    // Save to server, then update local state
    const saved = await client.addQuestion(quiz._id, newQuestion);
    onQuizUpdate({
      ...quiz,
      questions: [...questions, saved],
    });
    // Auto-open editor for new question
    setEditingIds(new Set([...editingIds, saved._id]));
  };

  const saveQuestion = async (questionId: string, updates: any) => {
    const saved = await client.updateQuestion(quiz._id, questionId, updates);
    onQuizUpdate({
      ...quiz,
      questions: questions.map((q: any) =>
        q._id === questionId ? { ...q, ...updates } : q
      ),
    });
    setEditingIds((prev) => {
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
  };

  const removeQuestion = async (questionId: string) => {
    await client.deleteQuestion(quiz._id, questionId);
    onQuizUpdate({
      ...quiz,
      questions: questions.filter((q: any) => q._id !== questionId),
    });
  };

  const startEditing = (questionId: string) =>
    setEditingIds(new Set([...editingIds, questionId]));

  const cancelEditing = (questionId: string) =>
    setEditingIds((prev) => {
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between mb-3">
        <span>
          <b>Points:</b> {totalPoints}
        </span>
      </div>

      {questions.length === 0 ? (
        <div className="p-4 text-center text-muted">
          No questions yet. Click + New Question to add one.
        </div>
      ) : (
        <ListGroup className="mb-3">
          {questions.map((q: any) => {
            const isEditing = editingIds.has(q._id);
            const commonProps = {
              question: q,
              isEditing,
              onSave: (updates: any) => saveQuestion(q._id, updates),
              onCancel: () => cancelEditing(q._id),
              onEdit: () => startEditing(q._id),
              onDelete: () => removeQuestion(q._id),
            };
            if (q.type === "TRUE_FALSE")
              return <TrueFalseEditor key={q._id} {...commonProps} />;
            if (q.type === "FILL_IN_BLANK")
              return <FillInBlankEditor key={q._id} {...commonProps} />;
            return <MultipleChoiceEditor key={q._id} {...commonProps} />;
          })}
        </ListGroup>
      )}

      <div className="text-center">
        <Button variant="outline-secondary" onClick={addQuestion}>
          <FaPlus className="me-2" />
          New Question
        </Button>
      </div>
    </div>
  );
}