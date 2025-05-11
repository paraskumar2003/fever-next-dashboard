export function QuestionNo({ text = "" }: { text: string }) {
  return (
    <>
      <header className="w-full px-8 py-4">
        <div className="flex items-center space-x-2">
          <img
            src="/images/preview/trivia/question_icon.png?v=1"
            alt="Question Icon"
            className="w-[50px]"
          />
          <span className="text-[#6F6F6F]">{text}</span>
        </div>
      </header>
    </>
  );
}
