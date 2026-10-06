"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import {
  categorySubjectIds,
  cleanSubjectName,
  subjectCategories,
  subjectNameKey,
} from "@/data/subject-catalog";
import type { Subject } from "@/types";
import { useStudy } from "./study-provider";

export function SubjectSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const { subjects, state, createSubject, ready } = useStudy();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const createButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const selected = subjects.find((s) => s.id === value);
  const key = subjectNameKey(query);
  const recent = state.recentSubjectIds.flatMap(
    (id) => subjects.find((s) => s.id === id) ?? [],
  );
  const matches = key
    ? subjects
        .filter((s) => subjectNameKey(`${s.name} ${s.category}`).includes(key))
        .sort(
          (a, b) =>
            Number(subjectNameKey(b.name).includes(key)) -
            Number(subjectNameKey(a.name).includes(key)),
        )
    : [];
  const groups = key
    ? [{ label: "Search results", items: matches.slice(0, 30) }]
    : [
        { label: "Recent", items: recent },
        {
          label: "Your subjects",
          items: subjects
            .filter((s) => s.isCustom && !recent.some((r) => r.id === s.id))
            .slice(-5)
            .reverse(),
        },
        {
          label: "Suggested categories",
          items: subjects.filter((s) => categorySubjectIds.has(s.id)),
        },
      ];
  const options = groups.flatMap((g) => g.items);
  const activeIndex = Math.min(active, options.length - 1);
  const existing = subjects.find(
    (s) => subjectNameKey(s.name) === subjectNameKey(name),
  );

  function show() {
    setQuery("");
    setActive(0);
    setCreating(false);
    setOpen(true);
  }
  function select(subject: Subject) {
    onChange(subject.id);
    input.current?.focus();
    setOpen(false);
  }
  function save() {
    const subject = createSubject(name, category);
    if (subject) select(subject);
  }
  function closeOnBlur(event: React.FocusEvent) {
    const target = event.relatedTarget as Node | null;
    if (target && (popup.current?.contains(target) || input.current === target))
      return;
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    // A portal keeps the menu clear of dashboard cards' clipped rounded edges.
    function position() {
      const anchor = input.current;
      const panel = popup.current;
      if (!anchor || !panel) return;
      const rect = anchor.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom - 12;
      const above = rect.top - 12;
      const useBelow = below >= 300 || below >= above;
      const viewportWidth = document.documentElement.clientWidth;
      const width = Math.min(Math.max(rect.width, 340), viewportWidth - 24);
      Object.assign(panel.style, {
        width: `${width}px`,
        left: `${Math.max(12, Math.min(rect.left, viewportWidth - width - 12))}px`,
        top: useBelow ? `${rect.bottom + 6}px` : "auto",
        bottom: useBelow ? "auto" : `${window.innerHeight - rect.top + 6}px`,
        maxHeight: `${Math.max(100, Math.min(420, useBelow ? below : above))}px`,
      });
    }
    function outside(event: PointerEvent) {
      if (
        !popup.current?.contains(event.target as Node) &&
        event.target !== input.current
      )
        setOpen(false);
    }
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    document.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open, creating]);

  useEffect(() => {
    if (open && !creating)
      document
        .getElementById(`${id}-option-${activeIndex}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, creating, id, query]);

  let optionIndex = 0;
  return (
    <div className="subject-selector">
      <label htmlFor={id}>Subject</label>
      <div className="subject-selector-input">
        <input
          ref={input}
          id={id}
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open && !creating}
          aria-controls={open && !creating ? `${id}-list` : undefined}
          aria-activedescendant={
            open && !creating && activeIndex >= 0
              ? `${id}-option-${activeIndex}`
              : undefined
          }
          placeholder="Search or select subject..."
          disabled={!ready}
          value={open ? query : (selected?.name ?? "")}
          onFocus={show}
          onClick={() => {
            if (!open) show();
          }}
          onBlur={closeOnBlur}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Tab" && open && !e.shiftKey) {
              e.preventDefault();
              createButton.current?.focus();
            } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              if (!open) {
                show();
                return;
              }
              if (options.length)
                setActive(
                  (activeIndex +
                    (e.key === "ArrowDown" ? 1 : -1) +
                    options.length) %
                    options.length,
                );
            } else if (e.key === "Enter" && open) {
              e.preventDefault();
              if (options[activeIndex]) select(options[activeIndex]);
            } else if (e.key === "Escape" && open) {
              e.preventDefault();
              setOpen(false);
            }
          }}
        />
        <ChevronDown size={15} aria-hidden="true" />
      </div>
      {open &&
        createPortal(
          <div
            ref={popup}
            className="subject-selector-popup"
            onBlur={closeOnBlur}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                input.current?.focus();
                setOpen(false);
              }
            }}
          >
            {creating ? (
              <div
                className="subject-selector-create"
                role="group"
                aria-labelledby={`${id}-create-title`}
              >
                <strong id={`${id}-create-title`}>Create a subject</strong>
                <label htmlFor={`${id}-name`}>Subject name</label>
                <input
                  id={`${id}-name`}
                  autoFocus
                  maxLength={80}
                  placeholder="e.g. Japanese N3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      save();
                    }
                  }}
                />
                <label htmlFor={`${id}-category`}>Category</label>
                <select
                  id={`${id}-category`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {subjectCategories.map((c) => (
                    <option key={c.id}>{c.name}</option>
                  ))}
                </select>
                <p role="status">
                  {existing
                    ? `“${existing.name}” already exists. You can use it below.`
                    : "Saved in your subjects for next time."}
                </p>
                <div className="subject-selector-actions">
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => {
                      input.current?.focus();
                      show();
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="button primary"
                    disabled={!cleanSubjectName(name)}
                    onClick={save}
                  >
                    {existing ? "Use existing subject" : "Create & select"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="subject-selector-hint">
                  <Search size={14} /> Search a subject, or choose a category.
                </div>
                <div
                  className="subject-selector-options"
                  role="listbox"
                  id={`${id}-list`}
                  aria-label="Subjects"
                >
                  {groups
                    .filter((g) => g.items.length)
                    .map((group) => (
                      <div
                        key={group.label}
                        role="group"
                        aria-label={group.label}
                      >
                        <div
                          className="subject-selector-heading"
                          aria-hidden="true"
                        >
                          {group.label}
                        </div>
                        {group.items.map((subject) => {
                          const index = optionIndex++;
                          return (
                            <div
                              key={subject.id}
                              id={`${id}-option-${index}`}
                              role="option"
                              aria-selected={subject.id === value}
                              className={`subject-selector-option ${index === activeIndex ? "active" : ""}`}
                              onMouseMove={() => setActive(index)}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => select(subject)}
                            >
                              <span>
                                {subject.name}
                                {key && !categorySubjectIds.has(subject.id) && (
                                  <small>{subject.category}</small>
                                )}
                              </span>
                              {subject.id === value && (
                                <Check size={15} aria-hidden="true" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  {!options.length && (
                    <p className="subject-selector-empty">
                      No matching subjects. Create your own below.
                    </p>
                  )}
                </div>
                {matches.length > 30 && (
                  <p className="subject-selector-hint">
                    Type more to narrow down {matches.length} results.
                  </p>
                )}
                <button
                  ref={createButton}
                  type="button"
                  className="subject-selector-new"
                  onKeyDown={(e) => {
                    if (e.key !== "Tab") return;
                    e.preventDefault();
                    if (e.shiftKey) input.current?.focus();
                    else {
                      const fields = Array.from(
                        input.current?.form?.elements ?? [],
                      ) as HTMLElement[];
                      fields[fields.indexOf(input.current!) + 1]?.focus();
                      setOpen(false);
                    }
                  }}
                  onClick={() => {
                    setName(cleanSubjectName(query));
                    setCategory("Other");
                    setCreating(true);
                  }}
                >
                  <Plus size={16} /> Create new subject
                </button>
              </>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
