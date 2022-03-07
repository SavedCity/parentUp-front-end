import { useParams } from "react-router-dom";

export default function Child() {
  let { childId } = useParams();
  console.log(childId);
  return <div>I am {childId}</div>;
}
