/* eslint-disable @typescript-eslint/no-empty-function */
import { PKG_ROOT } from "../constants";
import { PackageManager } from "../utils/getPackageManager.js";
import createReactCommand from "./commands/createReact.js";
import createNextCommand from "./commands/createNext.js";
import createVueCommand from "./commands/createVue.js";
// import { createAstroCommand } from "./commands/createAstro.js";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

/**
 * The extra dependencies that we allow to select from when creating a new application.
 */
export const supportedDependencies = ["prettier", "clsx"] as const;

/**
 * The app ids that we currently support.
 */
export const supportedTemplateIds = [
  "nextjs",
  "nextjs-ts",
  "react",
  "react-ts",
  "vue",
  "vue-ts",
] as const;

export type Dependencies = typeof supportedDependencies[number];
export type TemplateId = typeof supportedTemplateIds[number];
export type Language = "ts" | "js";

/**
 * The user input that is passed to the CLI.
 */
export interface UserInput {
  // The name of the project specified by the user, either from arguments or read from stdin.
  projectName: string;

  // Additional dependencies to install specified by the user.
  dependencies: Dependencies[];

  // The package manager to use, it is the one the user used to run the CLI
  packageManager: PackageManager;

  // The directory to create the application in. Calculated based on the app name.
  projectDir: string;

  // The app config by app id.
  appConfig: AppConfig;
}

export interface AppConfig {
  templateId: TemplateId;
  displayName: string;
  dependencies?: Dependencies[];
  language: Language;
  templateDir: string;
  scaffoldingTool: string;
  copyTemplate: (userInput: UserInput) => Promise<void>;
  deleteFiles?: (userInput: UserInput) => Promise<void>;
  getCssOutputPath: (userInput: UserInput) => string;
  createInstallCommand: (userInput: UserInput) => string | Promise<void>;
}

export const NEXTJS_CONFIG: AppConfig = {
  templateId: "nextjs",
  displayName: `Next.js ${chalk.dim("(create-next-app)")}`,
  language: "js",
  templateDir: path.join(PKG_ROOT, "templates/nextjs"),
  scaffoldingTool: "create-next-app",
  copyTemplate: async ({ projectDir }) => {
    await fs.copy(
      path.join(NEXTJS_CONFIG.templateDir, "index.jsx"),
      path.join(projectDir, "pages", "index.js"),
    );
    await fs.copy(
      path.join(NEXTJS_CONFIG.templateDir, "_app.jsx"),
      path.join(projectDir, "pages", "_app.js"),
    );
  },
  deleteFiles: async ({ projectDir }) => {
    await fs.remove(path.join(projectDir, "styles/Home.module.css"));
  },
  getCssOutputPath: ({ projectDir }) => {
    return path.join(projectDir, "styles", "globals.css");
  },
  createInstallCommand: createNextCommand,
};

export const NEXTJS_TS_CONFIG: AppConfig = {
  templateId: "nextjs-ts",
  displayName: `${chalk.bold("Next.js TS")} ${chalk.dim("(create-next-app)")}`,
  language: "ts",
  templateDir: path.join(PKG_ROOT, "templates/nextjs-ts"),
  scaffoldingTool: "create-next-app",
  copyTemplate: async ({ projectDir }) => {
    await fs.copy(
      path.join(NEXTJS_TS_CONFIG.templateDir, "index.tsx"),
      path.join(projectDir, "pages", "index.tsx"),
    );
    await fs.copy(
      path.join(NEXTJS_TS_CONFIG.templateDir, "_app.tsx"),
      path.join(projectDir, "pages", "_app.tsx"),
    );
  },
  deleteFiles: async ({ projectDir }) => {
    await fs.remove(path.join(projectDir, "styles/Home.module.css"));
  },
  getCssOutputPath: ({ projectDir }) => {
    return path.join(projectDir, "styles", "globals.css");
  },
  createInstallCommand: createNextCommand,
};

export const REACT_CONFIG: AppConfig = {
  templateId: "react",
  displayName: `React ${chalk.dim("(create-vite)")}`,
  language: "js",
  templateDir: path.join(PKG_ROOT, "templates/react"),
  scaffoldingTool: "create-vite",
  copyTemplate: async ({ projectDir }) => {
    await fs.copy(
      path.join(REACT_CONFIG.templateDir, "App.jsx"),
      path.join(projectDir, "src/App.jsx"),
    );

    await fs.copy(
      path.join(REACT_CONFIG.templateDir, "main.jsx"),
      path.join(projectDir, "src/main.jsx"),
    );
  },
  getCssOutputPath: ({ projectDir }) => {
    return path.join(projectDir, "src/index.css");
  },
  deleteFiles: async ({ projectDir }) => {
    await fs.remove(path.join(projectDir, "src/app.css"));
  },
  createInstallCommand: createReactCommand,
};

export const REACT_TS_CONFIG: AppConfig = {
  templateId: "react-ts",
  displayName: `React ${chalk.dim("(TypeScript, create-vite)")}`,
  language: "js",
  templateDir: path.join(PKG_ROOT, "templates/react-ts"),
  scaffoldingTool: "create-vite",
  copyTemplate: async ({ projectDir }) => {
    await fs.copy(
      path.join(REACT_TS_CONFIG.templateDir, "App.tsx"),
      path.join(projectDir, "src/App.tsx"),
    );

    await fs.copy(
      path.join(REACT_TS_CONFIG.templateDir, "main.tsx"),
      path.join(projectDir, "src/main.tsx"),
    );
  },
  getCssOutputPath: ({ projectDir }) => {
    return path.join(projectDir, "src/index.css");
  },
  deleteFiles: async ({ projectDir }) => {
    await fs.remove(path.join(projectDir, "src/app.css"));
  },
  createInstallCommand: createReactCommand,
};

export const VUE_CONFIG: AppConfig = {
  templateId: "vue",
  displayName: `Vue ${chalk.dim("(create-vite)")}`,
  language: "js",
  templateDir: path.join(PKG_ROOT, "templates/vue"),
  scaffoldingTool: "create-vite",
  copyTemplate: async ({ projectDir }) => {
    await fs.copy(
      path.join(VUE_CONFIG.templateDir, "App.vue"),
      path.join(projectDir, "src/App.vue"),
    );
    await fs.copy(
      path.join(VUE_CONFIG.templateDir, "main.js"),
      path.join(projectDir, "src", "main.js"),
    );
  },
  getCssOutputPath: ({ projectDir }) => {
    return path.join(projectDir, "src/index.css");
  },
  deleteFiles: async ({ projectDir }) => {
    await fs.remove(path.join(projectDir, "src/style.css"));
  },
  createInstallCommand: createVueCommand,
};

export const VUE_TS_CONFIG: AppConfig = {
  templateId: "vue-ts",
  displayName: `Vue ${chalk.dim("(TypeScript, create-vite)")}`,
  language: "js",
  templateDir: path.join(PKG_ROOT, "templates/vue-ts"),
  scaffoldingTool: "create-vite",
  copyTemplate: async ({ projectDir }) => {
    await fs.copy(
      path.join(VUE_TS_CONFIG.templateDir, "App.vue"),
      path.join(projectDir, "src/App.vue"),
    );
    await fs.copy(
      path.join(VUE_TS_CONFIG.templateDir, "main.ts"),
      path.join(projectDir, "src", "main.ts"),
    );
  },
  getCssOutputPath: ({ projectDir }) => {
    return path.join(projectDir, "src/index.css");
  },
  deleteFiles: async ({ projectDir }) => {
    await fs.remove(path.join(projectDir, "src/style.css"));
  },
  createInstallCommand: createVueCommand,
};

export const CONFIG_BY_ID: Record<string, AppConfig> = {
  nextjs: NEXTJS_CONFIG,
  "nextjs-ts": NEXTJS_TS_CONFIG,
  react: REACT_CONFIG,
  "react-ts": REACT_TS_CONFIG,
  vue: VUE_CONFIG,
  "vue-ts": VUE_TS_CONFIG,
};

export const getConfig = (configId: string) => CONFIG_BY_ID[configId];
