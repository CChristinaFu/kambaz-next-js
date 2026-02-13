"use client";

import { Button, Col, Row, FormLabel, FormControl, FormSelect } from "react-bootstrap";
import {FormGroup} from "react-bootstrap";

export default function AssignmentEditor(){

  return (
    <div id="wd-assignments-editor" className="pb-5">
      <form>
        <FormGroup className="mb-3">
          <FormLabel>Assignment Name</FormLabel>
          <FormControl defaultValue={1} />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormControl
            as="textarea"
            rows={8}
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

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-2">Points</Col>
          <Col md={9}>
            <FormControl defaultValue="100" />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-2">Assignment Group</Col>
          <Col md={9}>
            <FormSelect defaultValue="ASSIGNMENTS">
              <option>ASSIGNMENTS</option>
              <option>QUIZZES</option>
              <option>EXAMS</option>
              <option>PROJECT</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-2">Display Grade as</Col>
          <Col md={9}>
            <FormSelect defaultValue="Percentage">
              <option>Percentage</option>
              <option>Points</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-2">Submission Type</Col>
          <Col md={9}>
            <FormSelect defaultValue="Online">
              <option>Online</option>
              <option>On Paper</option>
              <option>External Tool</option>
              <option>No Submission</option>
            </FormSelect>

            <div className="border rounded p-3 mt-3">
              <b className="d-block mb-2">Online Entry Options</b>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="wd-text-entry" />
                <label className="form-check-label" htmlFor="wd-text-entry">Text Entry</label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="wd-url" defaultChecked />
                <label className="form-check-label" htmlFor="wd-url">Website URL</label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="wd-media" />
                <label className="form-check-label" htmlFor="wd-media">Media Recordings</label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="wd-annotation" />
                <label className="form-check-label" htmlFor="wd-annotation">Student Annotation</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="wd-file" />
                <label className="form-check-label" htmlFor="wd-file">File Uploads</label>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-2">Assign</Col>
          <Col md={9} className="border rounded p-3">
            <FormLabel className="fw-semibold">Assign to</FormLabel>
            <FormControl defaultValue="Everyone" className="mb-3" />

            <FormLabel className="fw-semibold">Due</FormLabel>
            <FormControl type="datetime-local" className="mb-3" />

            <Row>
              <Col>
                <FormLabel className="fw-semibold">Available from</FormLabel>
                <FormControl type="datetime-local" />
              </Col>
              <Col>
                <FormLabel className="fw-semibold">Until</FormLabel>
                <FormControl type="datetime-local" />
              </Col>
            </Row>
          </Col>
        </Row>

        <hr />

        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2">Cancel</Button>
          <Button variant="danger">Save</Button>
        </div>
      </form>
    </div>
  );
}
