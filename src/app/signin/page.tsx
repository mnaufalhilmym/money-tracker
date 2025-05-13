import GoogleSignInButton from "@/component/button/GoogleSignInButton";

export default function SignIn() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <div className="mx-auto w-fit font-bold text-2xl">
        <div className="flex justify-between gap-x-1">
          <span>M</span>
          <span>O</span>
          <span>N</span>
          <span>E</span>
          <span>Y</span>
        </div>
        <div className="flex justify-between gap-x-1">
          <span>T</span>
          <span>R</span>
          <span>A</span>
          <span>C</span>
          <span>K</span>
          <span>E</span>
          <span>R</span>
        </div>
      </div>

      <div className="mt-6">
        <GoogleSignInButton />
      </div>
    </div>
  );
}
