"use client";

import { Button, Col, Form, FormControl, FormGroup, FormLabel, FormSelect, Row } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="pb-5">
      <Form>
        {/* Assignment Name */}
        <FormGroup className="mb-3">
          <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
          <FormControl id="wd-name" defaultValue="A1 - ENV + HTML" />
        </FormGroup>

        {/* Description */}
        <FormGroup className="mb-3">
          <FormControl
            as="textarea"
            rows={8}
            id="wd-description"
            defaultValue={`The assignment is available online.

Submit a link to the landing page of your Web application running on Netlify.

The landing page should include the following:
- Your full name and section
- Links to each of the lab assignments
- Link to the Kambaz application
- Links to all relevant source code repositories

The Kambaz application should include a link to navigate back to the landing page.`}
          />
        </FormGroup>

        {/* Points */}
        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-2">
            <FormLabel htmlFor="wd-points">Points</FormLabel>
          </Col>
          <Col md={9}>
            <FormControl id="wd-points" type="number" defaultValue={100} min={0} step={1} />
          </Col>
        </Row>

        {/* Assignment Group */}
        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-2">
            <FormLabel htmlFor="wd-assignment-group">Assignment Group</FormLabel>
          </Col>
          <Col md={9}>
            <FormSelect id="wd-assignment-group" defaultValue="ASSIGNMENTS">
              <option>ASSIGNMENTS</option>
              <option>QUIZZES</option>
              <option>EXAMS</option>
              <option>PROJECT</option>
            </FormSelect>
          </Col>
        </Row>

        {/* Display Grade As */}
        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-2">
            <FormLabel htmlFor="wd-display-grade-as">Display Grade as</FormLabel>
          </Col>
          <Col md={9}>
            <FormSelect id="wd-display-grade-as" defaultValue="Percentage">
              <option>Percentage</option>
              <option>Points</option>
            </FormSelect>
          </Col>
        </Row>

        {/* Submission Type + Online Entry Options */}
        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-2">
            <FormLabel htmlFor="wd-submission-type">Submission Type</FormLabel>
          </Col>
          <Col md={9}>
            <FormSelect id="wd-submission-type" defaultValue="Online">
              <option>Online</option>
              <option>On Paper</option>
              <option>External Tool</option>
              <option>No Submission</option>
            </FormSelect>

            <div className="border rounded p-3 mt-3">
              <b className="d-block mb-2">Online Entry Options</b>

              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="wd-text-entry" />
                <label className="form-check-label" htmlFor="wd-text-entry">
                  Text Entry
                </label>
              </div>

              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="wd-url" defaultChecked />
                <label className="form-check-label" htmlFor="wd-url">
                  Website URL
                </label>
              </div>

              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="wd-media" />
                <label className="form-check-label" htmlFor="wd-media">
                  Media Recordings
                </label>
              </div>

              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="wd-annotation" />
                <label className="form-check-label" htmlFor="wd-annotation">
                  Student Annotation
                </label>
              </div>

              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="wd-file" />
                <label className="form-check-label" htmlFor="wd-file">
                  File Uploads
                </label>
              </div>
            </div>
          </Col>
        </Row>

        {/* Assign block */}
        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-2">
            <FormLabel>Assign</FormLabel>
          </Col>
          <Col md={9} className="border rounded p-3">
            <FormLabel htmlFor="wd-assign-to" className="fw-semibold">
              Assign to
            </FormLabel>
            <FormControl id="wd-assign-to" defaultValue="Everyone" className="mb-3" />

            <FormLabel htmlFor="wd-due-date" className="fw-semibold">
              Due
            </FormLabel>
            <FormControl id="wd-due-date" type="datetime-local" className="mb-3" />

            <Row>
              <Col>
                <FormLabel htmlFor="wd-available-from" className="fw-semibold">
                  Available from
                </FormLabel>
                <FormControl id="wd-available-from" type="datetime-local" />
              </Col>
              <Col>
                <FormLabel htmlFor="wd-available-until" className="fw-semibold">
                  Until
                </FormLabel>
                <FormControl id="wd-available-until" type="datetime-local" />
              </Col>
            </Row>
          </Col>
        </Row>

        <hr />

        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2">
            Cancel
          </Button>
          <Button variant="danger">Save</Button>
        </div>
      </Form>
    </div>
  );
}