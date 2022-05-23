import { CustomCommand } from "../exports/types";

import help from "./help";
import info from "./info";
import send from "./send";

import set from "./set";
import bot from "./bot";
import data from "./data"

/**A list of developer slash commands*/
export const developerCommands: Record<string, CustomCommand> = {
	set,
	bot,
	data,
	send,
};

/**A list of slash commands*/
export const publicCommands: Record<string, CustomCommand> = {
	help,
	info,
	send,
};