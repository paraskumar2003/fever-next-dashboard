import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Notiflix from "notiflix";
import { Flip } from "./Flip";
import { Options } from "./Options";
import { Timer } from "./Timer";
import { QuestionNo } from "./QuestionNo";
import { IButton } from "./IButton";
import { Question } from "./Question";
import { TriviaGamePlayProps, Question as QuestionType } from "./types";
import FormSection from "@/components/FormSection";

enum GameState {
  PLAYING = "playing",
  ENDED = "ended",
}

export function TriviaGamePlay({
  questions,
  onPublish,
  formData,
}: TriviaGamePlayProps) {
  const router = useRouter();
  const contest_id = Cookies.get("contest_id");

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType>(
    questions[0] || ({} as QuestionType),
  );
  const [timer, setTimer] = useState<{
    timeOut: number;
    state: boolean;
    shift?: number;
  }>({
    state: true,
    timeOut:
      formData?.game_time_level === "GAME"
        ? +formData?.game_timer!
        : +questions[0]?.timer * 1000 || 100000,
  });
  const [game, setGame] = useState<{ state: GameState }>({
    state: GameState.PLAYING,
  });

  // Redirect if no questions
  useLayoutEffect(() => {
    if (questions.length < 1) {
      router.push("/dashboard");
    } else {
      setCurrentQuestion(questions[0]);
    }
  }, [questions, router]);

  useEffect(() => {
    console.log(currentQuestion, questions);
  }, [currentQuestion, questions]);

  // Return empty screen AFTER all hooks
  if (questions.length < 1) {
    Notiflix.Notify.failure("No questions found");
    return <></>;
  }

  const displayNextQuestion = (time: number) => {
    setTimeout(() => {
      setCurrentQIndex((prev) => {
        const newIndex = prev + 1;

        if (formData?.game_time_level === "QUESTION") {
          const nextQuestion = questions[newIndex];
          setTimer((prev) => ({
            ...prev,
            state: false,
          }));

          setTimeout(() => {
            setTimer((prev) => ({
              ...prev,
              timeOut: +nextQuestion?.timer * 1000 || 10000,
              state: true,
              shift: (prev?.shift || 0) + 1,
            }));
          }, 10); // delay can be small, just enough to defer batching
        }

        if (questions[newIndex]) {
          setCurrentQuestion(questions[newIndex]);
        } else {
          setGame({ state: GameState.ENDED });
        }

        return newIndex;
      });
    }, time);
  };

  const handleAnswer = async (id: number, answer: string): Promise<boolean> => {
    const selectedOption = currentQuestion.options[id];
    const isCorrect = selectedOption?.is_correct || false;

    displayNextQuestion(1000);
    if (currentQIndex + 1 === questions.length) {
      setTimeout(() => {
        setGame({ state: GameState.ENDED });
      }, 1000);
    }
    return isCorrect;
  };

  const handleMissedQuestion = async (): Promise<boolean> => {
    if (contest_id) {
      const data = {
        data: {
          correct: true,
          rewardGiven: null,
        },
      };
      setTimer({
        timeOut: 1 * 1000 || 10000,
        state: false,
      });
      displayNextQuestion(1000);
      return data.data.correct;
    }
    return false;
  };

  const handleFlipQuestion = async (currentQuestionId: number) => {
    if (contest_id) {
      const data = {
        data: {
          correct: true,
          rewardGiven: null,
        },
      };
      const newQuestion = data.data;
      if (newQuestion) {
        Notiflix.Notify.success("Question Flipped!");
      } else {
        Notiflix.Notify.failure("Unable to flip question at the moment!!");
      }
      displayNextQuestion(1000);
    }
  };

  return (
    <FormSection title="Preview" onSave={onPublish} saveButtonText="Publish">
      <div className="mx-auto w-[400px] bg-[url('/images/preview/trivia/trivia_bg.png')] bg-cover">
        <>
          {game.state === GameState.ENDED && (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <h2 className="mb-2 text-2xl font-medium">Game Ended</h2>
              <p className="text-gray-600">Thank you for playing!</p>
            </div>
          )}
          {game.state === GameState.PLAYING && (
            <>
              <IButton />
              <QuestionNo text={`Question ${currentQIndex + 1}`} />
              <Question question_text={currentQuestion?.question_text} />
              {timer.state && (
                <Timer
                  timeToCount={timer.timeOut}
                  start={timer.state}
                  onEnd={() => handleMissedQuestion()}
                  shift={timer?.shift || 0}
                />
              )}
              <Options
                options={currentQuestion.options}
                onSelect={handleAnswer}
              />
              {/* <div className="bottom-0 left-0 flex w-full justify-center px-12 py-8">
                <Flip
                  flipCharge={100}
                  onClick={() => {
                    handleFlipQuestion(currentQuestion.question_no);
                  }}
                />
              </div> */}
            </>
          )}
        </>
      </div>
    </FormSection>
  );
}
