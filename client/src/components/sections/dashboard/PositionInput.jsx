import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

function PositionInput({ label, value, setValue }) {
  return (
    <Field className={"w-full flex justify-between items-center gap-2"}>
      <Label className="text-sm/6 w-20 font-medium text-black text-nowrap ">
        {label}
      </Label>

      <Input
        className={clsx(
          "block w-full rounded-lg border py-1.5 px-3 text-sm/6 text-black",
          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
        )}
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </Field>
  );
}

export default PositionInput;
