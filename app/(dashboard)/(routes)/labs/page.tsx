import { redirect } from "next/navigation";

type Props = {};

const LabsPage = (props: Props) => {
  redirect("/coming-soon");
};

export default LabsPage;
