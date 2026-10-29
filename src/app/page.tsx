import { redirect } from "next/navigation";

// /portfolio, /evidence, /marathon and all existing API routes remain unchanged.
export default function Home() {
  redirect('/experience.html');
}
