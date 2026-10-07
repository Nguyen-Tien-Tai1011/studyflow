"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

const choices = [
  { value: "light", label: "Sáng", icon: Sun },
  { value: "dark", label: "Tối", icon: Moon },
  { value: "system", label: "Theo hệ thống", icon: Monitor },
] as const;

export function ThemeChoices({
  onSelect,
  autofocus = false,
}: {
  onSelect?: () => void;
  autofocus?: boolean;
}) {
  const { preference, setTheme, ready } = useTheme();
  const name = useId();
  return (
    <fieldset className="theme-choices">
      <legend className="sr-only">Chế độ giao diện</legend>
      {choices.map(({ value, label, icon: Icon }) => (
        <label key={value} className="theme-choice">
          <input
            type="radio"
            name={name}
            value={value}
            checked={preference === value}
            disabled={!ready}
            autoFocus={autofocus && preference === value}
            onChange={() => {
              setTheme(value);
              onSelect?.();
            }}
          />
          <Icon size={18} aria-hidden="true" />
          <span>{label}</span>
          <Check size={16} className="theme-check" aria-hidden="true" />
        </label>
      ))}
    </fieldset>
  );
}

export function ThemeSwitcher() {
  const { preference, ready } = useTheme();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const choice = choices.find((item) => item.value === preference)!;
  const Icon = choice.icon;
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return (
    <div
      className="theme-switcher"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}
    >
      <button
        ref={trigger}
        className="icon-button theme-trigger"
        type="button"
        aria-label={`Đổi giao diện: ${ready ? choice.label : "Theo hệ thống"}`}
        title="Đổi giao diện"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        disabled={!ready}
        onClick={() => setOpen(!open)}
      >
        <Icon size={20} aria-hidden="true" />
      </button>
      {open && (
        <div id={id} className="theme-popover">
          <strong>Giao diện</strong>
          <ThemeChoices
            autofocus
            onSelect={() => {
              setOpen(false);
              trigger.current?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}
