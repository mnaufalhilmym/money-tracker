import Button from "@/component/button/Button";
import BottomSheet from "@/component/sheet/BottomSheet";
import { clientInternalApiCall } from "@/util/fetch/fromClient";

interface Props {
  isOpen: boolean;
  close: () => void;
  afterDelete: () => void;
  category: CategoryI;
}

export default function ConfirmDeleteCategorySheet(props: Readonly<Props>) {
  async function remove() {
    await clientInternalApiCall(
      "/api/category/" + props.category.id,
      undefined,
      {
        method: "DELETE",
      }
    );

    props.close();
    props.afterDelete();
  }

  return (
    <BottomSheet isOpen={props.isOpen} close={props.close}>
      <p className="font-bold text-center text-lg">Delete Category</p>
      <p className="mt-2">
        Are you sure you want to delete{" "}
        <span className="font-bold">{props.category.name}</span> category? This
        action cannot be undone.
      </p>
      <div className="flex items-center gap-x-4 mt-2">
        <Button type="button" onClick={props.close}>
          Cancel
        </Button>
        <Button type="button" onClick={remove}>
          Delete
        </Button>
      </div>
    </BottomSheet>
  );
}
