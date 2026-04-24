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

export default function MultipleChoiceEditor({
  question,
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState<any>({ ...question });

  // When not editing, show a preview card
  if (!isEditing) {
    return (
      <ListGroupItem>
        <div className="d-flex justify-content-between">
          <div>
            <b>{question.title}</b>{" "}
            <span className="text-muted">
              ({question.type.replace(/_/g, " ")}, {question.points} pts)
            </span>
            <br />
            <span className="text-muted">{question.question}</span>
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

  // Editing mode
  const updateChoice = (idx: number, field: string, value: any) => {
    const choices = [...(draft.choices || [])];
    if (field === "correct") {
      // Radio behavior — only one correct
      choices.forEach((c, i) => (c.correct = i === idx));
    } else {
      choices[idx] = { ...choices[idx], [field]: value };
    }
    setDraft({ ...draft, choices });
  };

  const addChoice = () => {
    setDraft({
      ...draft,
      choices: [...(draft.choices || []), { text: "", correct: false }],
    });
  };

  const removeChoice = (idx: number) => {
    setDraft({
      ...draft,
      choices: (draft.choices || []).filter(
        (_: any, i: number) => i !== idx
      ),
    });
  };

  const handleTypeChange = (newType: string) => {
    setDraft({ ...draft, type: newType });
  };

  // If type changed, tell parent so the right editor renders on next save
  const handleSave = () => {
    onSave(draft);
  };

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
            onChange={(e) => handleTypeChange(e.target.value)}
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

      <b>Answers:</b>
      {(draft.choices || []).map((c: any, idx: number) => (
        <Row key={idx} className="mb-2 align-items-center">
          <Col md={1}>
            <FormCheck
              type="radio"
              checked={!!c.correct}
              onChange={() => updateChoice(idx, "correct", true)}
            />
          </Col>
          <Col md={9}>
            <FormControl
              placeholder={
                c.correct ? "Correct Answer" : "Possible Answer"
              }
              value={c.text || ""}
              onChange={(e) => updateChoice(idx, "text", e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button
              variant="link"
              size="sm"
              className="text-danger"
              onClick={() => removeChoice(idx)}
            >
              <FaTrash />
            </Button>
          </Col>
        </Row>
      ))}

      <div className="text-end mb-3">
        <Button variant="link" size="sm" onClick={addChoice}>
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
        <Button variant="danger" size="sm" onClick={handleSave}>
          Update Question
        </Button>
      </div>
    </ListGroupItem>
  );
}