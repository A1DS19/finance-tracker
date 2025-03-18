import { createFileRoute } from "@tanstack/react-router";
import cover from "../assets/TanStack Start Course Cover.webp";
import { ChartColumnBigIcon } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/tanstack-start";
import { Button } from "components/ui/button";
import { Link } from "@tanstack/react-router";
import { SignIn, SignInButton, SignUpButton } from "@clerk/clerk-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-[400px] h-[calc(100vh-80px)] flex items-center justify-center relative">
      <img
        src={cover}
        className="absolute top-0 left-0 object-cover  object-center size-full opacity-50"
      />

      <div className="flex flex-col text-center relative z-10">
        <h1 className="text-5xl font-bold flex gap-1 items-center">
          <ChartColumnBigIcon size={60} className="text-lime-500" /> Tantracker
        </h1>
        <p className="text-2xl">Track your finances</p>
        <div>
          <SignedIn>
            <Button asChild size="lg">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </SignedIn>

          <SignedOut>
            <div className="flex gap-2 items-center justify-center">
              <Button
                asChild
                size="lg"
                className="bg-lime-600 hover:bg-lime-700"
              >
                <SignInButton />
              </Button>

              <Button asChild size="lg">
                <SignUpButton />
              </Button>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
