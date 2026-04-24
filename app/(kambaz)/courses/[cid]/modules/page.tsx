"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import ModulesControls from "./ModulesControls";
import { RootState } from "../../../store";
import * as coursesClient from "../../client";
import {
  setModules,
  editModule,
  deleteModule as deleteModuleAction,
  updateModule as updateModuleAction,
} from "./reducer";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const dispatch = useDispatch();

  // Fetch modules from server on course change
  const fetchModules = async () => {
    if (!cid) return;
    try {
      const data = await coursesClient.findModulesForCourse(cid as string);
      dispatch(setModules(data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  // Create a new module on the server
  const onCreateModuleForCourse = async () => {
    if (!cid || !moduleName.trim()) return;
    try {
      const newModule = await coursesClient.createModuleForCourse(
        cid as string,
        { name: moduleName, course: cid }
      );
      dispatch(setModules([...modules, newModule]));
      setModuleName("");
    } catch (error) {
      console.error(error);
    }
  };

  // Delete a module on the server
  const onRemoveModule = async (moduleId: string) => {
    try {
      await coursesClient.deleteModule(moduleId);
      dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
    } catch (error) {
      console.error(error);
    }
  };

  // Update a module on the server
  const onUpdateModule = async (module: any) => {
    try {
      await coursesClient.updateModule(module);
      dispatch(
        setModules(
          modules.map((m: any) => (m._id === module._id ? module : m))
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="wd-modules">
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={onCreateModuleForCourse} />

      <br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules.map((module: any) => (
          <ListGroupItem
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {!module.editing && module.name}
              {module.editing && (
                <FormControl
                  className="w-50 d-inline-block"
                  onChange={(e) =>
                    dispatch(updateModuleAction({ ...module, name: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdateModule({ ...module, editing: false });
                    }
                  }}
                  defaultValue={module.name} />
              )}

              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={(moduleId) => onRemoveModule(moduleId)}
                editModule={(moduleId) => dispatch(editModule(moduleId))} />
            </div>

            <ListGroup className="wd-lessons rounded-0">
              {module.lessons &&
                module.lessons.map((lesson: any) => (
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