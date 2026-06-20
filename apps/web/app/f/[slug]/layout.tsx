import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form | MiraiForms",
  description: "Fill out this form built with MiraiForms.",
};

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
