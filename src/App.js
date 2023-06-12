import { useCallback, useReducer } from 'react';
import { FiDelete } from 'react-icons/fi';
import './App.css';

function calculatorReducer(state, action) {
    const { calculation } = state;
    let lastCalculationValue = calculation.length > 0 ? calculation[calculation.length - 1] : undefined;

    switch (action.type) {
        case "addDigit": {
            if (!isNaN(+lastCalculationValue)) {
                // Verify is last pressed button is a number
                let newValue = lastCalculationValue.concat(action.digit)
                
                if (isNaN(+newValue)) {
                    break;
                }
                calculation[calculation.length - 1] = newValue;
            } else {
                calculation.push(action.digit);
            }
            
            return {
                ...state,
                calculation
            };
        } case "addOperation": {
            if(isNaN(lastCalculationValue)) {
                calculation[calculation.length - 1] = action.operation;
            } else {
                calculation.push(action.operation);
            }
            
            return {
                ...state,
                calculation
            };
        } case "calculate": {
            let calcResult = eval(calculation.join(""));
            return {
                lastCalculation: calculation,
                calculation: [calcResult.toString()]
            };
        } case "delete": {
            if (calculation.length > 0) {
                if (lastCalculationValue.length > 1) {
                    let newValue = lastCalculationValue.substring(0, lastCalculationValue.length - 1);
                    calculation[calculation.length - 1] = newValue;
                } else {
                    // remove digit or operation
                    calculation.pop();
                }
            }
            
            let { lastCalculation } = state;
            if (calculation.length === 0) {
                lastCalculation = [];
            }
            
            return {
                calculation,
                lastCalculation
            };
        } case "clear": {
            
            return {
                calculation: [],
                lastCalculation: []
            }
        } default: {
            // Do nothing 
            return {
                ...state
            }
        }
    }
}

function getDecimalSeparator() {
    const numberWithDecimalSeparator = 1.1;

    return numberWithDecimalSeparator.toLocaleString().substring(1, 2);
}

function App() {
    // const [calculation, setCalculation] = useState([4, "+", 2]); // array contendo dados do calculo exemplo [4, "+", 2] 
    
    const [calculator, dispatch]= useReducer(calculatorReducer, {
        calculation: [],
        lastCalculation: []
    });

    const display = useCallback((calculation) => {
        // Format big numbers
        let formattedCalculation = calculation.map((currentCalc) => {
            if (!isNaN(+currentCalc)) {
                let splittedCalc = currentCalc.split('.');
                let minimumFractionDigits = 0;
                
                if (splittedCalc.length > 1) {
                    minimumFractionDigits = splittedCalc[1].length;
                }

                let formattedNumber = Number(currentCalc).toLocaleString('pt-BR', {
                    minimumFractionDigits: minimumFractionDigits
                });
                if (currentCalc[currentCalc.length - 1] === ".") {
                    formattedNumber = formattedNumber + getDecimalSeparator();
                }
                return formattedNumber;
            } else {
                switch (currentCalc) {
                    case "divide": 
                        return "/"
                    case "multiply": 
                        return "*"
                    case "subtract": 
                        return "-"
                    case "add": 
                        return "+"
                    default: 
                        // Do nothing
                }
                return currentCalc;
            }
        })
        return formattedCalculation.join("");
    }, [])

    return (
        <div className="app">
            <div className="calculator">
                <div className="display col-span-4">
                    <div className="calculation">
                        {calculator.lastCalculation ? display(calculator.lastCalculation) : ""} 
                    </div>
                    {display(calculator.calculation)}
                </div>

                <button className="clear col-span-2" onClick={() => dispatch({ type: "clear" })}>AC</button>
                <button className="action-button" onClick={() => dispatch({ type: "delete" })}><FiDelete /></button>
                <button className="action-button" onClick={() => dispatch({ type: "addOperation", operation: "/" })}>÷</button>
                
                <button onClick={() => dispatch({ type: "addDigit", digit: "7" })}>7</button>
                <button onClick={() => dispatch({ type: "addDigit", digit: "8" })}>8</button>
                <button onClick={() => dispatch({ type: "addDigit", digit: "9" })}>9</button>
                <button className="action-button" onClick={() => dispatch({ type: "addOperation", operation: "*" })}>x</button>
                
                <button onClick={() => dispatch({ type: "addDigit", digit: "4" })}>4</button>
                <button onClick={() => dispatch({ type: "addDigit", digit: "5" })}>5</button>
                <button onClick={() => dispatch({ type: "addDigit", digit: "6" })}>6</button>
                <button className="action-button" onClick={() => dispatch({ type: "addOperation", operation: "-" })}>-</button>
                
                <button onClick={() => dispatch({ type: "addDigit", digit: "1" })}>1</button>
                <button onClick={() => dispatch({ type: "addDigit", digit: "2" })}>2</button>
                <button onClick={() => dispatch({ type: "addDigit", digit: "3" })}>3</button>
                <button className="action-button" onClick={() => dispatch({ type: "addOperation", operation: "+" })}>+</button>
                
                <button className="col-span-2" onClick={() => dispatch({ type: "addDigit", digit: "0" })}>0</button>
                <button onClick={() => dispatch({ type: "addDigit", digit: "." })}>.</button>
                <button className="action-button" onClick={() => dispatch({ type: "calculate" })}>=</button>
            </div>
        </div>
    );
}

export default App;
