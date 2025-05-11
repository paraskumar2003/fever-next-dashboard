export function OptionStatusIcon({
  state,
}: {
  state?: "correct" | "incorrect";
}) {
  return state ? (
    <div>
      <img
        src={
          state === "incorrect"
            ? "/assets/incorrect_icon.png?v=1"
            : "/assets/incorrect_icon.png?v=1"
        }
        alt=""
        className="h-[20px] w-[20px]"
      />
    </div>
  ) : (
    <></>
  );
}
