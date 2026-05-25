"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  Zap,
  History,
  Settings,
  Moon,
  Sun,
  FileText,
  Share2,
  Download,
  Plus,
  SearchCheck,
} from "lucide-react";
import { useTheme } from "next-themes";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />

          {/* Command Dialog */}
          <motion.div
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: -20 }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Command
              className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl"
              shouldFilter={true}
            >
              <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-4">
                <Search className="mr-3 h-5 w-5 text-gray-400" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Type a command or search..."
                  className="flex h-14 w-full bg-transparent text-base outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
                <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-2 font-mono text-xs font-medium text-gray-600 dark:text-gray-400 sm:flex">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-gray-500">
                  No results found.
                </Command.Empty>

                {/* Navigation */}
                <Command.Group
                  heading="Navigation"
                  className="mb-2 px-2 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400"
                >
                  <CommandItem
                    icon={Home}
                    onSelect={() => runCommand(() => router.push("/"))}
                  >
                    Home
                  </CommandItem>
                  <CommandItem
                    icon={Zap}
                    onSelect={() => runCommand(() => router.push("/dashboard"))}
                  >
                    Generate Architecture
                  </CommandItem>
                  <CommandItem
                    icon={SearchCheck}
                    onSelect={() => runCommand(() => router.push("/review"))}
                  >
                    Review Architecture
                  </CommandItem>
                  <CommandItem
                    icon={History}
                    onSelect={() => runCommand(() => router.push("/history"))}
                  >
                    History
                  </CommandItem>
                </Command.Group>

                {/* Quick Actions */}
                <Command.Group
                  heading="Quick Actions"
                  className="mb-2 px-2 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400"
                >
                  <CommandItem
                    icon={Plus}
                    onSelect={() =>
                      runCommand(() => router.push("/dashboard?new=true"))
                    }
                  >
                    New Architecture
                  </CommandItem>
                  <CommandItem
                    icon={FileText}
                    onSelect={() =>
                      runCommand(() => {
                        const event = new CustomEvent("open-templates");
                        window.dispatchEvent(event);
                      })
                    }
                  >
                    Browse Templates
                  </CommandItem>
                  <CommandItem
                    icon={Share2}
                    onSelect={() =>
                      runCommand(() => {
                        const event = new CustomEvent("share-architecture");
                        window.dispatchEvent(event);
                      })
                    }
                  >
                    Share Current Architecture
                  </CommandItem>
                  <CommandItem
                    icon={Download}
                    onSelect={() =>
                      runCommand(() => {
                        const event = new CustomEvent("export-architecture");
                        window.dispatchEvent(event);
                      })
                    }
                  >
                    Export Architecture
                  </CommandItem>
                </Command.Group>

                {/* Settings */}
                <Command.Group
                  heading="Settings"
                  className="mb-2 px-2 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400"
                >
                  <CommandItem
                    icon={theme === "dark" ? Sun : Moon}
                    onSelect={() =>
                      runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))
                    }
                  >
                    Toggle Theme
                  </CommandItem>
                </Command.Group>
              </Command.List>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-3 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      ↑↓
                    </kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      ↵
                    </kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    ⌘K
                  </kbd>
                  to open
                </span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface CommandItemProps {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onSelect: () => void;
  shortcut?: string;
}

function CommandItem({ icon: Icon, children, onSelect, shortcut }: CommandItemProps) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
    >
      <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <span className="flex-1">{children}</span>
      {shortcut && (
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-xs font-medium text-gray-600 dark:text-gray-400 sm:flex">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}
