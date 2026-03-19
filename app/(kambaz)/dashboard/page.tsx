
"use client";
import { useState } from "react";
import Link from "next/link";
import * as db from "../database";
import { Row, Col, Card, CardImg, CardBody, CardTitle,
         CardText, Button, FormControl } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../courses/reducer";
import { enroll, unenroll } from "../enrollments/reducer";
import { RootState } from "../store";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const isFaculty = currentUser?.role === "FACULTY";

  // toggle between showing all courses or only enrolled courses
  const [showAllCourses, setShowAllCourses] = useState(false);

  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description",
  });

  // check if current user is enrolled in a course
  const isEnrolled = (courseId: string) =>
    enrollments.some(
      (e: any) => e.user === currentUser?._id && e.course === courseId
    );

  // filter courses based on toggle
  const visibleCourses = showAllCourses
    ? courses
    : courses.filter((c) => currentUser && isEnrolled(c._id));

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard
        {/* Enrollments toggle button */}
        <Button variant="primary" className="float-end"
          onClick={() => setShowAllCourses(!showAllCourses)}
          id="wd-enrollments-btn">
          {showAllCourses ? "My Enrollments" : "Enrollments"}
        </Button>
      </h1>
      <hr />

      {/* Only faculty see the add/update form */}
      {isFaculty && (
        <>
          <h5>New Course
            <button type="button" className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => dispatch(addNewCourse(course))}> Add </button>
            <button type="button" className="btn btn-warning float-end me-2"
              onClick={() => dispatch(updateCourse(course))}
              id="wd-update-course-click"> Update </button>
          </h5>
          <br />
          <FormControl value={course.name} className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })} />
          <FormControl value={course.description} rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value })} />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        Published Courses ({visibleCourses.length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {visibleCourses.map((c) => (
            <Col key={c._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link href={
                    // only navigate if enrolled, otherwise stay on dashboard
                    isEnrolled(c._id) ? `/courses/${c._id}/home` : "/dashboard"
                  }
                  className="wd-dashboard-course-link text-decoration-none text-dark">
                  <CardImg src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {c.name}
                    </CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}>
                      {c.description}
                    </CardText>

                    {/* Go button - only if enrolled */}
                    {isEnrolled(c._id) && (
                      <Button variant="primary" className="me-2">Go</Button>
                    )}

                    {/* Enroll / Unenroll toggle */}
                    {!isFaculty && (
                      isEnrolled(c._id) ? (
                        <button type="button" className="btn btn-danger"
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(unenroll({ userId: currentUser._id, courseId: c._id }));
                          }}
                          id="wd-unenroll-btn">
                          Unenroll
                        </button>
                      ) : (
                        <button type="button" className="btn btn-success"
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(enroll({ userId: currentUser._id, courseId: c._id }));
                          }}
                          id="wd-enroll-btn">
                          Enroll
                        </button>
                      )
                    )}

                    {/* Faculty controls */}
                    {isFaculty && (
                      <>
                        <button type="button"
                          onClick={(e) => { e.preventDefault(); dispatch(deleteCourse(c._id)); }}
                          className="btn btn-danger float-end" id="wd-delete-course-click">
                          Delete
                        </button>
                        <button type="button" id="wd-edit-course-click"
                          onClick={(e) => { e.preventDefault(); setCourse(c); }}
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

// "use client"
// import { useState } from "react";
// import Link from "next/link";
// import * as db from "../database";
//  import {
//   Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button, FormControl
// } from "react-bootstrap";
// import { v4 as uuidv4 } from "uuid";
// import { useDispatch, useSelector } from "react-redux";
// import { addNewCourse, deleteCourse,   updateCourse, setCourses } from "../courses/reducer";
// import { RootState } from "../store";


// export default function Dashboard() {
//   const { courses } = useSelector((state: RootState) => state.coursesReducer);
//   const { currentUser } = useSelector((state: RootState) => state.accountReducer);
//   const { enrollments } = db;
//   const dispatch = useDispatch();
//   const [course, setCourse] = useState<any>({
//     _id: "0", name: "New Course", number: "New Number",
//     startDate: "2023-09-10", endDate: "2023-12-15",
//     image: "/images/reactjs.jpg", description: "New Description"
//   });


//  return (
//   <div id="wd-dashboard">
//    <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
//    <h5>New Course
//           <button className="btn btn-primary float-end"
//                   id="wd-add-new-course-click"
//                   onClick={() => dispatch(addNewCourse(course))} > Add </button>
//           <button className="btn btn-warning float-end me-2"
//                 onClick={() => dispatch(updateCourse(course))} id="wd-update-course-click">
//           Update </button>

//       </h5>
//       <br />
//       <FormControl value={course.name} className="mb-2" onChange={(e) => setCourse({ ...course, name: e.target.value }) } />
//       <FormControl value={course.description} rows={3} onChange={(e) => setCourse({ ...course, description: e.target.value }) } />
 
//       <hr />

//    <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
//    <div id="wd-dashboard-courses">
//     <Row xs={1} md={5} className="g-4">
//      {courses.filter((course) =>
//       enrollments.some(
//         (enrollment) =>
//           enrollment.user === currentUser._id &&
//           enrollment.course === course._id
//          ))
//      .map((course) => (
//      <Col key ={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
//       <Card>
//        <Link href={`/courses/${course._id}/home`}
//         className="wd-dashboard-course-link text-decoration-none text-dark" >
//         <CardImg src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
//         <CardBody className="card-body">
//          <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
//           {course.name} </CardTitle>
//          <CardText className="wd-dashboard-course-description overflow-hidden" style={{height:"100px"}}>
//           {course.description} </CardText>
//          <Button variant="primary"> Go </Button>
//          <button onClick={(event) => {
//                       event.preventDefault();
//                       dispatch(deleteCourse(course._id));
//                     }} className="btn btn-danger float-end"
//                     id="wd-delete-course-click">
//                     Delete
//             </button>
//           <button id="wd-edit-course-click"
//             onClick={(event) => {
//               event.preventDefault();
//               setCourse(course);
//             }}
//             className="btn btn-warning me-2 float-end" >
//             Edit
//           </button>

//         </CardBody>
//        </Link>
//       </Card>
//      </Col>
//     ))}
//    </Row>
//   </div>
//  </div>);}




// "use client"
// import { useState } from "react";
// import Link from "next/link";
// import * as db from "../database";
// import { v4 as uuidv4 } from "uuid";

// import {
//   Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button, FormControl
// } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../courses/reducer";
// import { RootState } from "../store";

// export default function Dashboard() {
//   const { courses } = useSelector((state: RootState) => state.coursesReducer);
//   const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
//   const { enrollments } = db;
//   const dispatch = useDispatch();
//   const [course, setCourse] = useState<any>({
//     _id: "0", name: "New Course", number: "New Number",
//     startDate: "2023-09-10", endDate: "2023-12-15",
//     image: "/images/reactjs.jpg", description: "New Description"
//   });

//   return (
//     <div id="wd-dashboard">
//       <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
//       <h5>New Course
//           <button className="btn btn-primary float-end"
//                   id="wd-add-new-course-click"
//                   onClick={() => dispatch(addNewCourse(course))} > Add </button>
//           <button className="btn btn-warning float-end me-2"
//                 onClick={() => dispatch(updateCourse(course))} id="wd-update-course-click">
//           Update </button>
//       </h5><br />
//       <FormControl value={course.name} className="mb-2"
//              onChange={(e) => setCourse({ ...course, name: e.target.value }) } />
//       <FormControl value={course.description} rows={3}
//              onChange={(e) => setCourse({ ...course, description: e.target.value }) } />
//       <hr />

//       <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />

//       <div id="wd-dashboard-courses">
//         <Row xs={1} md={5} className="g-4">
//           {courses.filter((course) =>
//           enrollments.some(
//             (enrollment) =>
//               enrollment.user === currentUser._id &&
//               enrollment.course === course._id
//             ))
//             .map((course)=>(
//             <Col key={course._id} className="wd-dashboard-course" style={{width:"300px"}}>
//               <Card>
//                 <Link href={`/courses/${course._id}/home`}
//                   className="wd-dashboard-course-link text-decoration-none text-dark" >
//                   <CardImg src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
//                   <CardBody className="card-body">
//                   <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
//                     {course.name} </CardTitle>
//                   <CardText className="wd-dashboard-course-description overflow-hidden" style={{height:"100px"}}>
//                     {course.description} </CardText>
//                   <Button variant="primary"> Go </Button>
                  
//                   <button onClick={(event) => {
//                       event.preventDefault();
//                       dispatch(deleteCourse(course._id));
//                     }} className="btn btn-danger float-end"
//                     id="wd-delete-course-click">
//                     Delete
//                   </button>

//                   <button id="wd-edit-course-click"
//                     onClick={(event) => {
//                       event.preventDefault();
//                       setCourse(course);
//                     }}
//                     className="btn btn-warning me-2 float-end" >
//                     Edit
//                   </button>

//                   </CardBody>
//                 </Link>
//               </Card>
//             </Col>
//           ))}
//           </Row>
//       </div>
//     </div>
//   );
// }

{/* <Row xs={1} md={5} className="g-4">

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/1234/home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1234 React JS
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}>
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/0002/home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS0002 Web Dev
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/0003/home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS0003 Fundies 1
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/0004/home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS0004 Fundies 2
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/0005/home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS0005 OOD
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/0006/home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS0006 Algorithms and Data Structures
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/courses/0007/home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160} />
                <CardBody>
                  <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS0007 Discrete Structures
                  </CardTitle>
                  <CardText
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer
                  </CardText>
                  <Button variant="primary">Go</Button>
                </CardBody>
              </Link>
            </Card>
          </Col>

        </Row> */}