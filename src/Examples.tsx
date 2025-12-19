import { useCallback, useReducer, useState } from 'react';
import { Answers } from './Answers';
import { getRandomInt, getRandomIntExcept } from './randomNumberUtil';
import { GameConfig } from './Game';

export const minValue = 1;

type ExampleState = {
  a: number;
  b: number;
  operation: "+" | "-" | "×";
  options: number[];
  answer: number;
};

export const Examples: React.FC<{ rounds: number; gameConfig: GameConfig; done: () => void }> = ({ rounds, gameConfig, done }) => {
  const calculateExample = useCallback(
    (state: ExampleState) => {
      const { addition, subtraction, multiplication, upperBound } = gameConfig;
      
      // Select operation based on enabled types
      const availableOperations: Array<"+" | "-" | "×"> = [];
      if (addition) availableOperations.push('+');
      if (subtraction) availableOperations.push('-');
      if (multiplication) availableOperations.push('×');
      
      // Safeguard: should not happen as button is disabled when no operations selected
      if (availableOperations.length === 0) {
        availableOperations.push('+');
      }
      
      const randomIndex = getRandomInt(0, availableOperations.length - 1);
      state.operation = availableOperations[randomIndex];

      // Generate numbers based on operation
      if (state.operation === '×') {
        // For multiplication, use smaller numbers (1-10) to keep results reasonable
        // Ensure at least 5 as max to provide variety
        const maxMultiplier = Math.max(5, Math.min(10, Math.floor(Math.sqrt(upperBound))));
        state.a = getRandomIntExcept(1, maxMultiplier, [state.a]);
        state.b = getRandomIntExcept(1, maxMultiplier, [state.b]);
      } else if (state.operation === '+') {
        // For addition, ensure result is at least 2 and at most upperBound
        state.a = getRandomIntExcept(minValue, upperBound - 1, [state.a]);
        state.b = getRandomIntExcept(minValue, upperBound - state.a, [state.b]);
      } else {
        // For subtraction, ensure result is at least 0
        // a must be large enough to allow for meaningful subtraction (b >= 1)
        const minA = Math.max(Math.floor(upperBound / 2), 2);
        state.a = getRandomIntExcept(minA, upperBound, [state.a]);
        state.b = getRandomIntExcept(1, state.a, [state.b]);
      }
      
      // Calculate correct answer
      const correct = state.operation === '+' ? state.a + state.b : state.operation === '-' ? state.a - state.b : state.a * state.b;
      
      // Determine answer range based on operation
      const minAnswer = state.operation === '+' ? 2 : state.operation === '-' ? 0 : 1;
      const maxAnswer = upperBound;
      
      // Generate answer options
      const answers: number[] = [];
      for (let i = 0; i < 5; i++) {
        answers.push(getRandomIntExcept(minAnswer, maxAnswer, [...answers, correct]));
      }
      answers.splice(getRandomInt(0, 5), 0, correct);
      state.options = answers;
      state.answer = correct;
      return { ...state };
    },
    [gameConfig]
  );

  const [{ a, b, operation, options, answer }, dispatch] = useReducer(
    calculateExample,
    {
      a: 1,
      b: 2,
      operation: "+",
      options: [],
      answer: 0,
    } as ExampleState,
    (arg) => calculateExample(arg)
  );
  const [completed, setCompleted] = useState<number>(0);

  const solved = () => {
    setCompleted((completed) => completed + 1);
    if (completed + 1 >= rounds) {
      setTimeout(done, 500);
    } else {
      dispatch();
    }
  };

  return (
    <>
      <h1>
        {a} {operation} {b} =
      </h1>
      <Answers correct={answer} answers={options} success={solved} />
      <div className="progress">
        <div className="progress-bar" style={{ width: `${(completed / rounds) * 100}%` }}></div>
      </div>
    </>
  );
};
