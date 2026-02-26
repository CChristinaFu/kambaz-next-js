import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperators from "./TernaryOperators";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FilterFunction from "./FilterFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import JsonStringify from "./JsonStringify"
import House from "./House";
import Spreading from "./Spreader";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import Classes from "./Classes";
import Styles from "./Styles";
import ClientComponentDemo from "./ClientComponent";
import ServerComponentDemo from "./ServerComponentDemo";
import Add from "./Add";
import Square from "./Square"
import PathParameters from "./PathParameters";
import TodoItem from "./todos/TodoItem";
import TodoList from "./todos/TodoList";
export default function Lab3() {
  console.log('Hello World!');
  return(
    
    <div id="wd-lab3">
      <h3>Lab 3</h3>
      <VariablesAndConstants/>
      <VariableTypes/>
      <BooleanVariables/>
      <IfElse/>
      <TernaryOperators/>
      <ConditionalOutputIfElse/>
      <ConditionalOutputInline/>
      <LegacyFunctions/>
      <ArrowFunctions/>
      <ImpliedReturn/>
      <TemplateLiterals/>
      <SimpleArrays/>
      <ForLoops/>
      <MapFunction/>
      <FindFunction/>
      <FindIndex/>
      <FilterFunction/>
      <JsonStringify/>
      <House/>
      <Spreading/>
      <Destructing/>
      <FunctionDestructing/>
      <DestructingImports/>
      <Classes/>
      <Styles/>
      <ClientComponentDemo/>
      <ServerComponentDemo/>
      <Add a={3} b={4} />
      <h4>Square of 4</h4>
      <Square>4</Square>
      <hr />
      <PathParameters/>
      <hr></hr>
      <TodoItem/>
      <TodoList/>
    </div>
  );
}
