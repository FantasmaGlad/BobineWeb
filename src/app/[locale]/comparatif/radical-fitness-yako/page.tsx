import ComparePage, { compareMetadata, type ComparePageProps } from "@/components/ComparePage";

export async function generateMetadata(props: ComparePageProps) {
  return compareMetadata(props, "radical-fitness-yako");
}

export default function Page(props: ComparePageProps) {
  return <ComparePage {...props} slug="radical-fitness-yako" />;
}
