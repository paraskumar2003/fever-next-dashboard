export function Flip({
  flipCharge = 0,
  onClick,
}: {
  onClick?: Function;
  flipCharge?: number;
}) {
  return (
    <>
      <button
        onClick={() => onClick?.()}
        className="justify-content flex items-center rounded-3xl border border-solid border-white bg-[#d9d9d977] p-2 px-4 "
      >
        <span className="text-white">Flip It &nbsp;</span>
        <span
          className="text-white
        "
        >
          | &nbsp;
        </span>
        <span className="flex items-center">
          <img
            src="/images/preview/trivia/coin.png?v=1"
            alt=""
            className="w-[25px]"
          />
          <span className="text-lg font-medium text-white">
            &nbsp;{flipCharge}
          </span>
        </span>
      </button>
    </>
  );
}
