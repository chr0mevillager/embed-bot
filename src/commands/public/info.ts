import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { CustomCommand } from "../../exports/types";
import * as data from "../../exports/data";
import * as profileInfo from "../../exports/profile_info";

let info: CustomCommand = {
	data: {
		name: "info",
		description: "See information about me!",
	},

	commandHelp: {
		name: "info",
		module: "general",
		keywords: [
			"info",
			"detail",
			"data",
			"general",
		],
		helpMessage: new MessageEmbed()
			.setColor("#2f3136")
			.setTitle("Info")
			.setDescription("```Get information about me!```"),
	},

	async execute(interaction) {
		data.commandUsed("info");
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("#389af0")
					.setTitle("Embeds Bot#7040")
					.setDescription("Run `/help` for help.")
					.addFields(
						{
							name: "Version",
							value: "```\n" + profileInfo.versionNumber.replaceAll(".", ".\n") + "```",
							inline: true,
						},
						{
							name: "Release Notes",
							value: "```\n" + profileInfo.releaseNotes + "```",
							inline: true,
						},
						{
							name: "Features",
							value: "```\n" + profileInfo.featureText + "```",
							inline: true,
						},
					)
			],
			components: [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setLabel("Add to Server")
							.setStyle("LINK")
							.setURL("https://discord.com/oauth2/authorize?client_id=942083941307912193&scope=bot%20applications.commands&permissions=150528"),
						// new MessageButton()
						// 	.setLabel("Support Server")
						// 	.setStyle("LINK")
						// 	.setURL("https://google.com"),
						new MessageButton()
							.setLabel("Github")
							.setStyle("LINK")
							.setURL("https://github.com/chr0mevillager/embeds-bot"),
					)
			],
			ephemeral: true,
		});
	},
};

export default info;
