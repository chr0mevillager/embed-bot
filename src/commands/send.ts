import { MessageEmbed } from "discord.js";
import { CustomCommand } from "../exports/types";
import messageInteraction from "./send/message"
import pollInteraction from "./send/poll";
import * as giveaway from "./send/giveaway";

let send: CustomCommand = {
	data: {
		name: "send",
		description: "Send an embeded message!",
		options: [
			{
				name: "message",
				description: "Send a fancy message!",
				type: 1,
				options: [
					{
						name: "title",
						description: "What would you like the message to be titled? (≤ 256 characters)",
						type: 3,
						required: true,
					},
					{
						name: "description",
						description: "What would you like the description to be? (≤ 4000 characters)",
						type: 3,
						required: true,
					},
					{
						name: "ping-group",
						description: "Who would you like to ping with this message? (Role || User)",
						type: 9,
						required: false,
					},
					{
						name: "image",
						description: "What would you like the image to be? (Link)",
						type: 3,
						required: false,
					},
				]
			},
			{
				name: "poll",
				description: "Send a poll!",
				type: 1,
				options: [
					{
						name: "question",
						description: "What would you like the message to be titled? (≤ 256 characters)",
						type: 3,
						required: true,
					},
					{
						name: "live-results",
						description: "Should users be able to see the total number of votes during the poll?",
						type: "BOOLEAN",
						required: true,
					},
					{
						name: "option-1",
						description: "What should the first option be? (≤ 80 characters)",
						type: 3,
						required: true,

					},
					{
						name: "option-2",
						description: "What should the second option be? (≤ 80 characters)",
						type: 3,
						required: true,
					},
					{
						name: "option-3",
						description: "What should the third option be? (≤ 80 characters)",
						type: 3,
						required: false,
					},
					{
						name: "option-4",
						description: "What should the fourth option be? (≤ 80 characters)",
						type: 3,
						required: false,
					},
					{
						name: "ping-group",
						description: "Who would you like to ping with this message? (Role || User)",
						type: 9,
						required: false,
					},
				]
			},
			{
				name: "giveaway",
				description: "Send a giveaway!",
				type: 1,
				options: [
					{
						name: "item",
						description: "What would you like to give away? (≤ 200 characters)",
						type: 3,
						required: true,
					},
					{
						name: "number-of-winners",
						description: "How many users should win the poll? (≤ 100 characters)",
						type: "INTEGER",
						minValue: 1,
						maxValue: 100,
						required: true,
					},
					{
						name: "ping-group",
						description: "Who would you like to ping with this message? (Role || User)",
						type: 9,
						required: false,
					},
					{
						name: "required-input",
						description: "What (if any) details must the winners provide? (≤ 80 characters)",
						type: 3,
						required: false,
					}
				]
			},
		],
	},

	async modalExecute(interaction) {
		const [command, id, data] = (interaction.customId).split("::");
		if (data == "giveawayEnter") {
			giveaway.modalInteraction(interaction);
		}
	},

	async execute(interaction) {
		if (!interaction.channel) {
			await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle("This command can only be used in servers!")
						.setDescription("")
						.setColor("#ff6c08")
				],
				ephemeral: true,
			});
			return;
		}

		if (interaction.options.getSubcommand() === "message") {
			messageInteraction(interaction);
		} else if (interaction.options.getSubcommand() === "poll") {
			pollInteraction(interaction);
		} else if (interaction.options.getSubcommand() === "giveaway") {
			giveaway.giveawayInteraction(interaction);
		}
	},
};

export default send;