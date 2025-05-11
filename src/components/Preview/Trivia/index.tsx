import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TriviaServices } from "@/services/trivia";
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

export function TriviaGamePlay({
  questions,
  addNewQuestion,
  contestData,
}: TriviaGamePlayProps) {
  const router = useRouter();
  let contest_id = Cookies.get("contest_id");

  if (questions.length < 1) router.push("/dashboard");

  const [currentQuestion, setCurrentQuestion] = useState<QuestionType>(
    questions[0],
  );
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [timer, setTimer] = useState<{ timeOut: number; state: boolean }>({
    state: true,
    timeOut: currentQuestion.timer,
  });
  const [proceedModal, setProceedModal] = useState<boolean>(true);
  const [didUserLoggedInOnThisPage, setDidUserLoggedInOnThisPage] =
    useState<boolean>(false);
  const [game, setGame] = useState<{ state: boolean }>({ state: true });

  useLayoutEffect(() => {
    questions.length < 1
      ? router.push("/dashboard")
      : setCurrentQuestion(questions[0]);
  }, [questions, router]);

  const displayNextQuestion = (time: number) => {
    setTimeout(() => {
      setCurrentQIndex((prev) => {
        const newIndex = prev + 1;
        return newIndex;
      });
      setTimer({ ...timer, state: false });
      setTimer({
        timeOut: questions[currentQIndex + 1]?.timer || 10000,
        state: true,
      });
      if (questions[currentQIndex + 1])
        setCurrentQuestion(questions[currentQIndex + 1]);
      // redirection to be performed when quiz is finish
      else console.log("Quiz finished");
    }, time);
  };

  // Correct and Incorrect visualization on UI depends upon the boolean returned from here.
  const handleAnswer = async (id: number, answer: string): Promise<boolean> => {
    if (contest_id) {
      let { data } = await TriviaServices.submitAnswer({
        contestId: parseInt(contest_id),
        questionId: currentQuestion.question_no,
        answer,
      });
      displayNextQuestion(1000); //=> Milliseconds delay while changing question
      if (!data.data.rewardGiven) return data.data.correct;
      else {
        router.push(`/rewards/${data.data.rewardGiven}`);
        return data.data.correct;
      }
    }
    {
      return false;
    }
  };

  const handleMissedQuestion = async (): Promise<boolean> => {
    if (contest_id) {
      let { data } = await TriviaServices.submitAnswer({
        contestId: parseInt(contest_id),
        questionId: currentQuestion.question_no,
        missed: true,
        answer: "",
      });
      displayNextQuestion(1000); //=> Milliseconds delay while changing question
      if (data.data) {
        if (!data.data.rewardGiven) return data.data.correct;
        else {
          router.push(`/rewards/${data.data.reward_id}`);
          return data.data.correct;
        }
      } else {
        Notiflix.Notify.failure(data.message);
      }
    }
    {
      return false;
    }
  };

  const handleFlipQuestion = async (currentQuestionId: number) => {
    if (contest_id) {
      let { data } = await TriviaServices.flipQuestion({
        contestId: contest_id,
        currentQuestionId: String(currentQuestionId),
      });
      let newQuestion = data.data;
      if (newQuestion) {
        addNewQuestion(newQuestion);
        Notiflix.Notify.success("Question Flipped!");
      } else Notiflix.Notify.failure("Unable to flip question at the moment!!");
      displayNextQuestion(1000);
    }
  };

  const handleGameProceed = async () => {
    if (contest_id) {
      //   let { data } = await ContentServices.preGameParticipate({
      //     game_slug: "happening-quiz",
      //     contest_id,
      //   });
      closeModal();
      setGame({ state: true });
    }
  };

  const closeModal = () => {
    setProceedModal(false);
  };

  return (
    <FormSection title="Review">
      <div className="mx-auto w-[400px] bg-[url('/images/preview/trivia/trivia_bg.png')] bg-cover">
        <>
          {game.state && (
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
                  currentQuestion={currentQuestion.question_no}
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
