"use client";
import { useState } from "react";
import {
  ListGroupItem,
  FormControl,
  FormSelect,
  Button,
  Row,
  Col,
  FormCheck,
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

export default function TrueFalseEditor({
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
              (True/False, {question.points} pts)
            </span>
            <br />
            <span className="text-muted">{question.question}</span>
            <br />
            <small>Answer: {question.correctAnswer ? "True" : "False"}</small>
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
        placeholder="Question text"
        value={draft.question || ""}
        onChange={(e) => setDraft({ ...draft, question: e.target.value })}
      />

      <b>Answer:</b>
      <div className="mt-2">
        <FormCheck
          type="radio"
          label="True"
          checked={draft.correctAnswer === true}
          onChange={() => setDraft({ ...draft, correctAnswer: true })}
        />
        <FormCheck
          type="radio"
          label="False"
          checked={draft.correctAnswer === false}
          onChange={() => setDraft({ ...draft, correctAnswer: false })}
        />
      </div>

      <div className="text-end mt-3">
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