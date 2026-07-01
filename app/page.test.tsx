import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import HomePage from "./page";

vi.mock("sonner", () => ({ toast: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function pressUndo() {
  fireEvent.keyDown(window, { key: "z", ctrlKey: true });
}

async function submitDraw(input: HTMLElement, value: string) {
  const user = userEvent.setup();
  await user.type(input, value);
  fireEvent.submit(input.closest("form")!);
}

describe("HomePage", () => {
  test("accepts a drawn number and displays it", async () => {
    render(<HomePage />);

    const input = screen.getByPlaceholderText("Digite um número entre 1 e 75");
    await submitDraw(input, "42");

    expect(screen.getAllByText("42")).toHaveLength(2);
    expect((input as HTMLInputElement).value).toBe("");
  });

  test("rejects a number outside the 1-75 range", async () => {
    render(<HomePage />);

    const input = screen.getByPlaceholderText("Digite um número entre 1 e 75");
    await submitDraw(input, "99");

    expect(screen.getByRole("alert").textContent).toBe(
      "Digite um número entre 1 e 75.",
    );
    expect(screen.getByText("--")).toBeDefined();
  });

  test("lists drawn numbers in the recent draws history", async () => {
    render(<HomePage />);

    const input = screen.getByPlaceholderText("Digite um número entre 1 e 75");
    await submitDraw(input, "7");
    await submitDraw(input, "23");

    expect(screen.getAllByText("07")).toHaveLength(1);
    expect(screen.getAllByText("23")).toHaveLength(2);
  });

  test("undoes the last drawn number on Ctrl+Z and shows a toast", async () => {
    render(<HomePage />);

    const input = screen.getByPlaceholderText("Digite um número entre 1 e 75");
    await submitDraw(input, "42");

    pressUndo();

    expect(screen.queryAllByText("42")).toHaveLength(0);
    expect(toast).toHaveBeenCalled();
  });

  test("restores the previous number as the current draw after undo", async () => {
    render(<HomePage />);

    const input = screen.getByPlaceholderText("Digite um número entre 1 e 75");
    await submitDraw(input, "7");
    await submitDraw(input, "23");

    pressUndo();

    expect(screen.getAllByText("07")).toHaveLength(2);
  });

  test("shows the empty placeholder after undoing the only drawn number", async () => {
    render(<HomePage />);

    const input = screen.getByPlaceholderText("Digite um número entre 1 e 75");
    await submitDraw(input, "42");

    pressUndo();

    expect(screen.getByText("--")).toBeDefined();
  });

  test("undoes multiple draws with repeated presses, one per press", async () => {
    render(<HomePage />);

    const input = screen.getByPlaceholderText("Digite um número entre 1 e 75");
    await submitDraw(input, "1");
    await submitDraw(input, "2");
    await submitDraw(input, "3");

    pressUndo();
    pressUndo();
    pressUndo();

    expect(screen.getByText("--")).toBeDefined();
    expect(toast).toHaveBeenCalledTimes(3);
  });

  test("does nothing when undoing with no draw history", () => {
    render(<HomePage />);

    pressUndo();

    expect(screen.getByText("--")).toBeDefined();
    expect(toast).not.toHaveBeenCalled();
  });
});
