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
  let contest_id = Cookies.get("contest_id");

  if (questions.length < 1) {
    Notiflix.Notify.failure("No questions found");
    // router.push("/home");
    console.log(questions);
    return <></>;
  }

  const [currentQuestion, setCurrentQuestion] = useState<QuestionType>(
    questions[0],
  );
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [timer, setTimer] = useState<{ timeOut: number; state: boolean }>({
    state: true,
    timeOut:
      (formData?.game_time_level === "GAME"
        ? +formData?.game_timer!
        : +currentQuestion?.timer) * 1000,
  });
  const [game, setGame] = useState<{ state: GameState }>({
    state: GameState.PLAYING,
  });

  useLayoutEffect(() => {
    questions.length < 1
      ? router.push("/dashboard")
      : setCurrentQuestion(questions[0]);
  }, [questions, router]);

  const displayNextQuestion = (time: number) => {
    setTimeout(() => {
      setCurrentQIndex((prev) => {
        const newIndex = prev + 1;

        if (formData?.game_time_level === "QUESTION") {
          const nextQuestion = questions[newIndex];
          setTimer({
            timeOut: +nextQuestion?.timer * 1000 || 10000,
            state: true,
          });
        }

        if (questions[newIndex]) {
          setCurrentQuestion(questions[newIndex]);
        } else {
        }

        return newIndex;
      });
    }, time);
  };

  const handleAnswer = async (id: number, answer: string): Promise<boolean> => {
    // Get the selected option and check if it's correct
    const selectedOption = currentQuestion.options[id];
    const isCorrect = selectedOption?.is_correct || false;

    // Display next question after a delay for visual feedback
    displayNextQuestion(1000);

    // Check if this is the last question
    if (currentQIndex + 1 === questions.length) {
      setTimeout(() => {
        setGame({ state: GameState.ENDED });
      }, 1000);
    }

    return isCorrect; // Return actual correctness based on the option's is_correct flag
  };

  const handleMissedQuestion = async (): Promise<boolean> => {
    if (contest_id) {
      let data = {
        data: {
          correct: true,
          rewardGiven: null,
        },
      };
      displayNextQuestion(1000); //=> Milliseconds delay while changing question
      if (data.data) {
        if (!data.data.rewardGiven) return data.data.correct;
        else {
          return data.data.correct;
        }
      } else {
        Notiflix.Notify.failure("Error while missing question");
      }
    }
    {
      return false;
    }
  };

  const handleFlipQuestion = async (currentQuestionId: number) => {
    if (contest_id) {
      let data = {
        data: {
          correct: true,
          rewardGiven: null,
        },
      };
      let newQuestion = data.data;
      if (newQuestion) {
        Notiflix.Notify.success("Question Flipped!");
      } else Notiflix.Notify.failure("Unable to flip question at the moment!!");
      displayNextQuestion(1000);
    }
  };
  useEffect(() => {
    console.log(currentQuestion, questions);
  }, [currentQuestion, questions]);

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
              {/* i button */}
              <IButton />
              {/* Header Part for Question number */}
              <QuestionNo text={`Question ${currentQIndex + 1}`} />
              {/* Question Text */}
              <Question question_text={currentQuestion?.question_text} />
              {/* Countdown Timer */}
              {timer.state && (
                <Timer
                  timeToCount={timer.timeOut}
                  start={timer.state}
                  // currentQuestion={currentQuestion.question_no}
                  onEnd={() => handleMissedQuestion()}
                />
              )}
              {/* Option Selection */}
              <Options
                options={currentQuestion.options}
                onSelect={handleAnswer}
              />
              {/* Flip Footer */}
              <div className="bottom-0 left-0 flex w-full justify-center px-12 py-8">
                <Flip
                  flipCharge={100}
                  onClick={() => {
                    handleFlipQuestion(currentQuestion.question_no);
                  }}
                />
              </div>
            </>
          )}
        </>
      </div>
    </FormSection>
  );
}
