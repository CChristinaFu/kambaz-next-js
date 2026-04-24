"use client";
import { useState } from "react";
import {
  ListGroupItem,
  FormControl,
  FormSelect,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { FaTrash, FaPencil } from "react-icons/fa6";

interface Props {
  question: any;
  isEditing: boolean;
  onSave: (updates: any) => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function FillInBlankEditor({
  question,
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState<any>({ ...question });

  if (!isEditing) {
    return (
      <ListGroupItem>
        <div className="d-flex justify-content-between">
          <div>
            <b>{question.title}</b>{" "}
            <span className="text-muted">
              (Fill in the Blank, {question.points} pts)
            </span>
            <br />
            <span className="text-muted">{question.question}</span>
            <br />
            <small>
              Accepted: {(question.possibleAnswers || []).join(", ") || "—"}
            </small>
          </div>
          <div>
            <Button variant="link" size="sm" onClick={onEdit}>
              <FaPencil />
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-danger"
              onClick={onDelete}
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      </ListGroupItem>
    );
  }

  const updateAnswer = (idx: number, value: string) => {
    const answers = [...(draft.possibleAnswers || [])];
    answers[idx] = value;
    setDraft({ ...draft, possibleAnswers: answers });
  };

  const addAnswer = () =>
    setDraft({
      ...draft,
      possibleAnswers: [...(draft.possibleAnswers || []), ""],
    });

  const removeAnswer = (idx: number) =>
    setDraft({
      ...draft,
      possibleAnswers: (draft.possibleAnswers || []).filter(
        (_: any, i: number) => i !== idx
      ),
    });

  return (
    <ListGroupItem>
      <Row className="mb-2">
        <Col md={4}>
          <FormControl
            value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Question Title"
          />
        </Col>
        <Col md={5}>
          <FormSelect
            value={draft.type}
            onChange={(e) => setDraft({ ...draft, type: e.target.value })}
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="FILL_IN_BLANK">Fill in the Blank</option>
          </FormSelect>
        </Col>
        <Col md={3}>
          <div className="d-flex align-items-center">
            <span className="me-2">pts:</span>
            <FormControl
              type="number"
              value={draft.points ?? 0}
              onChange={(e) =>
                setDraft({ ...draft, points: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </Col>
      </Row>

      <FormControl
        as="textarea"
        rows={3}
        className="mb-3"
        placeholder="Question text (use _____ for the blank)"
        value={draft.question || ""}
        onChange={(e) => setDraft({ ...draft, question: e.target.value })}
      />

      <b>Possible Correct Answers:</b>
      {(draft.possibleAnswers || []).map((ans: string, idx: number) => (
        <Row key={idx} className="mb-2 align-items-center">
          <Col md={10}>
            <FormControl
              placeholder="Possible answer"
              value={ans}
              onChange={(e) => updateAnswer(idx, e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button
              variant="link"
              size="sm"
              className="text-danger"
              onClick={() => removeAnswer(idx)}
            >
              <FaTrash />
            </Button>
          </Col>
        </Row>
      ))}

      <div className="text-end mb-3">
        <Button variant="link" size="sm" onClick={addAnswer}>
          + Add Another Answer
        </Button>
      </div>

      <div className="text-end">
        <Button
          variant="secondary"
          size="sm"
          className="me-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={() => onSave(draft)}>
          Update Question
        </Button>
      </div>
    </ListGroupItem>
  );
}