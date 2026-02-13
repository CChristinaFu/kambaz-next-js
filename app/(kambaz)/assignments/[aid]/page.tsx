import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <Form>
        <FormGroup className="mb-3">
          <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
          <FormControl id="wd-name" defaultValue="A1 - ENV + HTML" />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel htmlFor="wd-description">Description</FormLabel>
          <FormControl
            as="textarea"
            rows={6}
            id="wd-description"
            defaultValue={
              "The assignment is available online.\nSubmit a link to the landing page of your Web application.\nThe landing page should include the following:\n- Your full name\n- A link to each lab\n- A link to Kambaz\n- A link to your GitHub repository"
            }
          />
        </FormGroup>

        <Row className="mb-3">
          <Col md={4}>
            <FormGroup>
              <FormLabel htmlFor="wd-points">Points</FormLabel>
              <FormControl id="wd-points" type="number" defaultValue={100} />
            </FormGroup>
          </Col>
          <Col md={8}>
            <FormGroup>
              <FormLabel htmlFor="wd-group">Assignment Group</FormLabel>
              <FormControl id="wd-group" defaultValue="ASSIGNMENTS" />
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <FormGroup>
              <FormLabel htmlFor="wd-display-grade-as">Display Grade As</FormLabel>
              <FormControl id="wd-display-grade-as" defaultValue="Percentage" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <FormLabel htmlFor="wd-submission-type">Submission Type</FormLabel>
              <FormControl id="wd-submission-type" defaultValue="Online" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <FormLabel htmlFor="wd-assign-to">Assign To</FormLabel>
              <FormControl id="wd-assign-to" defaultValue="Everyone" />
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <FormGroup>
              <FormLabel htmlFor="wd-due-date">Due</FormLabel>
              <FormControl id="wd-due-date" type="date" defaultValue="2026-02-20" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <FormLabel htmlFor="wd-available-from">Available From</FormLabel>
              <FormControl id="wd-available-from" type="date" defaultValue="2026-02-15" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <FormLabel htmlFor="wd-available-until">Until</FormLabel>
              <FormControl id="wd-available-until" type="date" defaultValue="2026-02-21" />
            </FormGroup>
          </Col>
        </Row>

        <div className="float-end">
          <Button variant="secondary" className="me-2">
            Cancel
          </Button>
          <Button variant="danger">Save</Button>
        </div>

        <div className="clearfix"></div>
      </Form>
    </div>
  );
}
