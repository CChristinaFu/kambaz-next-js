"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import ModulesControls from "./ModulesControls";
import * as db from "../../../database";
import { v4 as uuidv4 } from "uuid";
import { FormControl } from "react-bootstrap";
import { addModule, editModule, updateModule, deleteModule }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";


export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: RootState) => state.modulesReducer)
  const dispatch = useDispatch();

  return (
    <div className="wd-modules">
      <ModulesControls moduleName={moduleName} setModuleName={setModuleName}
        addModule={() => {
          dispatch(addModule({ name: moduleName, course: cid }));
          setModuleName("");
        }} />

      <br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
            <ListGroupItem key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                {!module.editing && module.name}
                { module.editing && (
                  <FormControl className="w-50 d-inline-block"
                        onChange={(e) => dispatch(updateModule({ ...module, name: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            dispatch(updateModule({ ...module, editing: false }));
                          }
                        }}
                        defaultValue={module.name}/>
                )}

                <ModuleControlButtons moduleId={module._id}
                  deleteModule={(moduleId) => {
                    dispatch(deleteModule(moduleId));
                  }}
                  editModule={(moduleId) => dispatch(editModule(moduleId))} />
              </div>  

              <ListGroup className="wd-lessons rounded-0">
                {module.lessons && module.lessons.map((lesson: any) => (
                  <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" />
                    {lesson.name}
                    <LessonControlButtons />
                  </ListGroupItem>
                ))}
              </ListGroup>
            </ListGroupItem>
          ))}
      </ListGroup>
    </div>
  );
}
// import { ListGroup, ListGroupItem } from "react-bootstrap"
// import { BsGripVertical } from "react-icons/bs";
// import ModuleControlButtons from "./ModuleControlButtons";
// import LessonControlButtons from "./LessonControlButtons";
// import ModulesControls from "./ModulesControls";
// export default function Modules() {
//   return (
//     <div>
//     <ModulesControls /><br /><br /><br /><br />
//     <ListGroup className="rounded-0" id="wd-modules">
//           <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
//             <div className="wd-title p-3 ps-2 bg-secondary">
//               <BsGripVertical className="me-2 fs-3" />
//               Week 1
//               <ModuleControlButtons />
//             </div>

//             <ListGroup className="wd-lessons rounded-0">
//               <ListGroupItem className="wd-lesson p-3 ps-1">
//                 <BsGripVertical className="me-2 fs-3" />
//                 LEARNING OBJECTIVES
//                 <LessonControlButtons />
//               </ListGroupItem>

//               <ListGroupItem className="wd-lesson p-3 ps-1">
//                 <BsGripVertical className="me-2 fs-3" />
//                 Introduction to the course
//                 <LessonControlButtons />
//               </ListGroupItem>

//               <ListGroupItem className="wd-lesson p-3 ps-1">
//                 <BsGripVertical className="me-2 fs-3" />
//                 Learn what is Web Development
//                 <LessonControlButtons />
//               </ListGroupItem>
//             </ListGroup>
//           </ListGroupItem>

//           <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
//             <div className="wd-title p-3 ps-2 bg-secondary">
//               <BsGripVertical className="me-2 fs-3" />
//               Week 2
//               <ModuleControlButtons />
//             </div>

//             <ListGroup className="wd-lessons rounded-0">
//               <ListGroupItem className="wd-lesson p-3 ps-1">
//                 <BsGripVertical className="me-2 fs-3" />
//                 LESSON 1
//                 <LessonControlButtons />
//               </ListGroupItem>

//               <ListGroupItem className="wd-lesson p-3 ps-1">
//                 <BsGripVertical className="me-2 fs-3" />
//                 LESSON 2
//                 <LessonControlButtons />
//               </ListGroupItem>
//             </ListGroup>
//           </ListGroupItem>
//         </ListGroup>
//     </div>
// );}