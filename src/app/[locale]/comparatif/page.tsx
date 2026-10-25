import ComparePage, { compareMetadata, type ComparePageProps } from "@/components/ComparePage";

export async function generateMetadata(props: ComparePageProps) {
  return compareMetadata(props);
}

export default function Page(props: ComparePageProps) {
  return <ComparePage {...props} />;
}
