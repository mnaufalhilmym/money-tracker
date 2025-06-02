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
      <p>Your data is stored anonymously — we have no way of identifying you</p>
      <a href="https://l.hilmy.dev/sc_money_tracker" className="underline">
        Source code available here
      </a>
      {!!process.env.NEXT_PUBLIC_BUILD_TIME && (
        <p>
          Build time:{" "}
          {new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString(
            undefined,
            {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZoneName: "short",
            }
          )}
        </p>
      )}
    </div>
  );
}
