import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore | MiraiForms",
  description: "Explore public forms and intelligent templates.",
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
