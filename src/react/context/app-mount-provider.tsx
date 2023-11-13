import { App, Component } from "obsidian";

import { ComponentChildren, createContext } from "preact";
import { useContext } from "preact/hooks";
import { Database } from "~/index/database";
import { dbHTMLEntry } from "~/main";

interface ContextProps {
  app: App;
  component: Component;
  sourcePath: string;
  db: Database<dbHTMLEntry>;
  children: ComponentChildren;
}

const MountContext = createContext<ContextProps | null>(null);

export const useAppMount = () => {
  const value = useContext(MountContext);
  if (value === null) {
    throw new Error("useAppMount() called without a <AppMountProvider /> in the tree.");
  }
  return value;
};

export default function AppMountProvider(props: ContextProps) {
  return (
    <MountContext.Provider value={{ ...props }}>{props.children}</MountContext.Provider>
  );
}
