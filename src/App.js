import { useReducer } from "react";
import "./styles.css"
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit', 
  CHOOSE_OPERATION: 'choose-operation', 
  CLEAR: 'clear', 
  DELETE_DIGIT: 'delete-digit', 
  EVAULATE: 'evaluate'

}

// (stat,action)
function reducer(state, {type, payload}) {
  switch (type) {
    case ACTIONS.ADD_DIGIT: 
      if (state.overwrite) 
        return {
          ...state, 
          currentOperand: payload.digit, 
          overwrite: false 
        }
      if (payload.digit === "0" && state.currentOperand === "0") // make it so user cant do "00004234"
        return state 
      if (payload.digit === "." && state.currentOperand.includes(".")) // make it so user cant do "3.3.3."
        return state 
      return {
        ...state, 
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION: 
      if (state.currentOperand == null && state.previousOperand == null) // dont let user do blank + blank 
        return state
        
      if (state.currentOperand == null) {
        return {
          ...state, 
          operation: payload.operation, 

        }
      }
        
      if (state.previousOperand == null) { // "5454 + " has been typed
        return {
          // make the currentOp become the previous op 
          ...state, 
          operation : payload.operation, 
          previousOperand: state.currentOperand, 
          currentOperand: null 
        }
      }
      // case to handle "5+5+5..."
      return {
        ...state, 
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null 
      }
    
    case ACTIONS.CLEAR: 
      return {} // just return an empty state
    case ACTIONS.EVAULATE: 
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null)
        return null // we dont have enough info for the equal sign 
      return {
        ...state, 
        overwrite: true,
        previousOperand: null, 
        operation: null, 
        currentOperand: evaluate(state)
      } 
  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  // Convert to ints
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) // make sure theyre nums
    return ""
  let computation = "" 
  switch(operation) {
    case "+":
      computation = prev + current
      break;
    case "-": 
      computation = prev - current
      break; 
    case "*": 
      computation = prev * current
      break; 
    case "÷": 
      computation = prev / current
      break; 
  }
  return computation.toString() 
}

// Create the HTML body for the calculator
function App() {
  // userReducer hook [state, dispatch]
  const [{currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
  
  //var x = 20 
  var x = 20 

  return (
    <div className = "calculator-grid">
      <div className = "output">
        <div className = "previous-operand">{previousOperand} {operation } </div>
          <div className= "current-operand">{currentOperand}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button>DEL</button>
      <OperationButton operation = "÷" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation = "*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation = "+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation = "-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVAULATE})}>=</button>
    </div>
  )
}

export default App;