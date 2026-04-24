"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button, FormControl,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../courses/reducer";
import * as enrollmentsClient from "../enrollments/client";
import { setEnrollments } from "../enrollments/reducer";
import { RootState } from "../store";
import * as client from "../courses/client";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  const [showAllCourses, setShowAllCourses] = useState(false);
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description",
  });

  const fetchCourses = async () => {
    try {
      if (showAllCourses) {
        const allCourses = await client.fetchAllCourses();
        dispatch(setCourses(allCourses));
      } else {
        const myCourses = await client.findMyCourses();
        dispatch(setCourses(myCourses));
      }
      const myEnrollments = await enrollmentsClient.findMyEnrollments();
      dispatch(setEnrollments(myEnrollments));
    } catch (error) {
      console.error(error);
    }
  };

  const onEnroll = async (courseId: string) => {
    await enrollmentsClient.enrollInCourse(courseId);
    const myEnrollments = await enrollmentsClient.findMyEnrollments();
    dispatch(setEnrollments(myEnrollments));
  };

  const onUnenroll = async (courseId: string) => {
    await enrollmentsClient.unenrollFromCourse(courseId);
    const myEnrollments = await enrollmentsClient.findMyEnrollments();
    dispatch(setEnrollments(myEnrollments));
  };

  useEffect(() => {
    fetchCourses();
  }, [currentUser, showAllCourses]);

  // Server-backed CRUD handlers
  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((c: any) => c._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c: any) => (c._id === course._id ? course : c))
      )
    );
  };

  // Enrollment check (unchanged from your version)
  const isEnrolled = (courseId: string) =>
    enrollments.some(
      (e: any) => e.user === currentUser?._id && e.course === courseId
    );

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard
        <Button
          variant="primary"
          className="float-end"
          onClick={() => setShowAllCourses(!showAllCourses)}
          id="wd-enrollments-btn">
          {showAllCourses ? "My Enrollments" : "Enrollments"}
        </Button>
      </h1>
      <hr />

      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              type="button"
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse}>
              Add
            </button>
            <button
              type="button"
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}
              id="wd-update-course-click">
              Update
            </button>
          </h5>
          <br />
          <FormControl
            as="textarea"
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })} />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            } />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        Published Courses ({courses.length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((c: any) => (
            <Col
              key={c._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}>
              <Card>
                <Link
                  href={
                    isEnrolled(c._id) ? `/courses/${c._id}/home` : "/dashboard"
                  }
                  className="wd-dashboard-course-link text-decoration-none text-dark">
                  <CardImg
                    src="/images/reactjs.jpg"
                    variant="top"
                    width="100%"
                    height={160} />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {c.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}>
                      {c.description}
                    </CardText>

                    {isEnrolled(c._id) && (
                      <Button variant="primary" className="me-2">Go</Button>
                    )}

                    {!isFaculty &&
                      (isEnrolled(c._id) ? (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={(e) => { e.preventDefault(); onUnenroll(c._id); }}
                          id="wd-unenroll-btn">
                          Unenroll
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={(e) => { e.preventDefault(); onEnroll(c._id); }}
                          id="wd-enroll-btn">
                          Enroll
                        </button>
                      ))}

                    {isFaculty && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            onDeleteCourse(c._id);
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click">
                          Delete
                        </button>
                        <button
                          type="button"
                          id="wd-edit-course-click"
                          onClick={(e) => {
                            e.preventDefault();
                            setCourse(c);
                          }}
                          className="btn btn-warning me-2 float-end">
                          Edit
                        </button>
                      </>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}