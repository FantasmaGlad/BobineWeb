import cli from "@/content/reference/cli.json";
import api from "@/content/reference/api.json";

export interface CliArgument {
  name: string;
  help: string;
  positional: boolean;
  choices: string[] | null;
  repeat: boolean;
  flag: boolean;
}

export interface CliAction {
  name: string;
  help: string;
  arguments: CliArgument[];
}

export interface CliCommand extends CliAction {
  actions: CliAction[];
}

export interface ApiField {
  name: string;
  type: string;
  required: boolean;
  choices: string[] | null;
}

export interface ApiRoute {
  method: string;
  path: string;
  summary: string;
  path_parameters: ApiField[];
  query: ApiField[];
  body: { format: string; fields: ApiField[] } | null;
}

export interface ApiGroup {
  name: string;
  routes: ApiRoute[];
}

export const CLI = cli as { options: CliArgument[]; exit_codes: { code: number; meaning: string }[]; commands: CliCommand[] };
export const API = api as { errors: { codes: Record<string, string> }; groups: ApiGroup[] };

function placeholder(argument: CliArgument): string {
  const value = argument.choices ? argument.choices.join("|") : argument.name.replace(/^-+/, "").toUpperCase();
  return argument.repeat ? `${value}...` : value;
}

export function usage(words: string[], args: CliArgument[]): string {
  const parts = args.map((argument) => {
    if (argument.positional) return `<${placeholder(argument)}>`;
    return argument.flag ? `[${argument.name}]` : `[${argument.name} ${placeholder(argument)}]`;
  });
  return ["bobine", ...words, ...parts].join(" ");
}

export function anchor(...parts: string[]): string {
  return parts.join("-").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
