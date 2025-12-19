import { useRef, useCallback, useState, useMemo } from 'react';
import { Examples } from './Examples';

export type GameConfig = {
  addition: boolean;
  subtraction: boolean;
  multiplication: boolean;
  upperBound: number;
};

export const Game: React.FC = () => {
  const main = useRef<HTMLElement>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [rounds, setRounds] = useState<number>(10);
  const [addition, setAddition] = useState<boolean>(false);
  const [subtraction, setSubtraction] = useState<boolean>(false);
  const [multiplication, setMultiplication] = useState<boolean>(false);
  const [upperBound, setUpperBound] = useState<number>(100);

  const canStart = useMemo(() => addition || subtraction || multiplication, [addition, subtraction, multiplication]);

  const startGame = useCallback(() => {
    if (!canStart) return;
    const config: GameConfig = {
      addition,
      subtraction,
      multiplication,
      upperBound,
    };
    main.current?.requestFullscreen().then(() => setGameConfig(config));
  }, [addition, subtraction, multiplication, upperBound, canStart]);

  return (
    <main ref={main}>
      {gameConfig ? (
        <Examples rounds={rounds} gameConfig={gameConfig} done={() => document.exitFullscreen().finally(() => setGameConfig(null))} />
      ) : (
        <>
          <section>
            {rounds} Beispiele
            <span style={{ display: 'flex', gap: '1vw', justifyContent: 'center' }}>
              <button onClick={() => setRounds((prev) => prev + 1)}>+</button>
              <button onClick={() => setRounds((prev) => prev - 1)} disabled={rounds <= 2}>-</button>
            </span>
          </section>
          <section>
            <div style={{ fontSize: '4vmin', marginBottom: '2vmin' }}>Rechenarten:</div>
            <div style={{ display: 'flex', gap: '3vmin', justifyContent: 'center', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1vmin', fontSize: '4vmin' }}>
                <input
                  type="checkbox"
                  checked={addition}
                  onChange={(e) => setAddition(e.target.checked)}
                  style={{ width: '4vmin', height: '4vmin' }}
                />
                Addition (+)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1vmin', fontSize: '4vmin' }}>
                <input
                  type="checkbox"
                  checked={subtraction}
                  onChange={(e) => setSubtraction(e.target.checked)}
                  style={{ width: '4vmin', height: '4vmin' }}
                />
                Subtraktion (-)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1vmin', fontSize: '4vmin' }}>
                <input
                  type="checkbox"
                  checked={multiplication}
                  onChange={(e) => setMultiplication(e.target.checked)}
                  style={{ width: '4vmin', height: '4vmin' }}
                />
                Multiplikation (×)
              </label>
            </div>
          </section>
          <section>
            <div style={{ fontSize: '4vmin', marginBottom: '2vmin' }}>Zahlenbereich bis:</div>
            <div style={{ display: 'flex', gap: '1vw', justifyContent: 'center', alignItems: 'center' }}>
              <button onClick={() => setUpperBound((prev) => Math.max(10, prev - 10))}>-10</button>
              <span style={{ fontSize: '6vmin', minWidth: '20vmin' }}>{upperBound}</span>
              <button onClick={() => setUpperBound((prev) => Math.min(100000, prev + 10))}>+10</button>
            </div>
            <div style={{ display: 'flex', gap: '1vw', justifyContent: 'center', alignItems: 'center', marginTop: '2vmin' }}>
              <button onClick={() => setUpperBound(10)}>10</button>
              <button onClick={() => setUpperBound(20)}>20</button>
              <button onClick={() => setUpperBound(100)}>100</button>
              <button onClick={() => setUpperBound(1000)}>1000</button>
              <button onClick={() => setUpperBound(10000)}>10000</button>
              <button onClick={() => setUpperBound(100000)}>100000</button>
            </div>
          </section>
          <section>
            <button
              onClick={startGame}
              disabled={!canStart}
              style={{ fontSize: '5vmin', padding: '3vmin 6vmin' }}
            >
              Spiel starten
            </button>
          </section>
        </>
      )}
    </main>
  );
};
