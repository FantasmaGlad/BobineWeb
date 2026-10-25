import ComparePage, { compareMetadata, type ComparePageProps } from "@/components/ComparePage";

export async function generateMetadata(props: ComparePageProps) {
  return compareMetadata(props, "wexer-fitness-on-demand");
}

export default function Page(props: ComparePageProps) {
  return <ComparePage {...props} slug="wexer-fitness-on-demand" />;
}
