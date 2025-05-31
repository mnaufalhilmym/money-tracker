export default function Footer() {
  return (
    <div className="text-center text-xs">
      <p>
        Money Tracker{" "}
        {process.env.NEXT_PUBLIC_VERSION
          ? `v${process.env.NEXT_PUBLIC_VERSION}`
          : ""}{" "}
        created by{" "}
        <a href="https://hilmy.dev" className="underline">
          Hilmy
        </a>
      </p>
      <p>
        Your data is stored anonymously — we have no way of identifying you.
      </p>
      <a href="https://l.hilmy.dev/sc_money_tracker" className="underline">
        Source code available here
      </a>
    </div>
  );
}
