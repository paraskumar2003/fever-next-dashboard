export function Question({ question_text = "" }: { question_text: string }) {
  return (
    <section className="w-full px-8 pb-12">
      <h1 className="text-2xl font-medium text-black">{question_text}</h1>
    </section>
  );
}
