import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { AddTask } from "@/components/dashboard/overview";
import { StudyProvider } from "@/components/dashboard/study-provider";
import { STUDY_STORAGE_KEY } from "@/utils/study-storage";
import type { StudyState } from "@/types";

function setup() {
  const onClose = vi.fn();
  render(
    <StudyProvider>
      <AddTask onClose={onClose} />
    </StudyProvider>,
  );
  return {
    onClose,
    input: screen.getByRole("combobox", {
      name: "Subject",
    }) as HTMLInputElement,
  };
}
it("searches case-insensitively, selects with arrows/Enter and Escape leaves the choice intact", () => {
  const { input, onClose } = setup();
  fireEvent.focus(input);
  expect(screen.queryByRole("group", { name: "Recent" })).toBeNull();
  fireEvent.change(input, { target: { value: "pYtHoN" } });
  expect(
    screen
      .getAllByRole("option")
      .some((e) => e.textContent?.includes("Python")),
  ).toBe(true);
  fireEvent.keyDown(input, { key: "ArrowDown" });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(input.value).toBe("Python");
  expect(input.getAttribute("aria-expanded")).toBe("false");
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.click(input);
  fireEvent.change(input, { target: { value: "English" } });
  fireEvent.keyDown(input, { key: "Escape" });
  expect(input.value).toBe("Python");
  fireEvent.change(
    screen.getByRole("textbox", { name: "What will you study?" }),
    { target: { value: "Read Python" } },
  );
  fireEvent.click(screen.getByRole("button", { name: "Add to today" }));
  const saved: StudyState = JSON.parse(
    localStorage.getItem(STUDY_STORAGE_KEY)!,
  );
  expect(
    saved.subjects.find((s) => s.id === saved.tasks.at(-1)?.subjectId)?.name,
  ).toBe("Python");
  expect(onClose).toHaveBeenCalledOnce();
});

it("creates and selects a custom subject, then reuses its normalized name", () => {
  const { input } = setup();
  fireEvent.focus(input);
  fireEvent.click(screen.getByRole("button", { name: "Create new subject" }));
  expect(
    (
      screen.getByRole("button", {
        name: "Create & select",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
  fireEvent.change(screen.getByRole("textbox", { name: "Subject name" }), {
    target: { value: "  Japanese   N3  " },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Category" }), {
    target: { value: "Languages" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Create & select" }));
  expect(input.value).toBe("Japanese N3");
  fireEvent.click(input);
  fireEvent.click(screen.getByRole("button", { name: "Create new subject" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Subject name" }), {
    target: { value: "japanese n3" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Use existing subject" }));
  const saved: StudyState = JSON.parse(
    localStorage.getItem(STUDY_STORAGE_KEY)!,
  );
  expect(saved.subjects.filter((s) => s.name === "Japanese N3")).toHaveLength(
    1,
  );
  expect(input.value).toBe("Japanese N3");
});

it("offers creation for no results and makes the footer reachable by keyboard", () => {
  const { input } = setup();
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "A completely new topic" } });
  expect(
    screen.getByText("No matching subjects. Create your own below."),
  ).toBeTruthy();
  fireEvent.keyDown(input, { key: "Tab" });
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: "Create new subject" }),
  );
  fireEvent.keyDown(document.activeElement!, { key: "Tab" });
  expect(document.activeElement).toBe(
    screen.getByRole("spinbutton", { name: "Minutes" }),
  );
  expect(input.getAttribute("aria-expanded")).toBe("false");
});
