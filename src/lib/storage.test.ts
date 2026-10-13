import { describe, expect, test, vi } from "vitest";
import { readStored, writeStored } from "./storage.ts";

describe("readStored", () => {
  test("returns the stored value", () => {
    localStorage.setItem("key", JSON.stringify({ a: 1 }));

    expect(readStored("key", {})).toEqual({ a: 1 });
  });

  test("falls back when the value is missing, malformed or the wrong type", () => {
    expect(readStored("missing", 5)).toBe(5);

    localStorage.setItem("bad", "{not json");
    expect(readStored("bad", 5)).toBe(5);

    localStorage.setItem("text", JSON.stringify("hello"));
    expect(readStored("text", 5)).toBe(5);
  });
});

describe("writeStored", () => {
  test("stores JSON", () => {
    writeStored("key", [1, 2]);

    expect(localStorage.getItem("key")).toBe("[1,2]");
  });

  test("ignores storage that refuses writes", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota");
      });

    expect(() => writeStored("key", 1)).not.toThrow();
    setItem.mockRestore();
  });
});
