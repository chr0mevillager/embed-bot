import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from "discord.js";
import { client } from "../../exports/client";
import generateTimeStamp from "../../exports/timestamp";
import * as buttons from "../../exports/send_buttons";
import sendUpdate from "../../exports/send_update";

export default async function pollInteraction(interaction) {

	//Inputs ---
	let question: string = interaction.options.getString("question");
	let results: string = "\u200B";
	let visibleResults = interaction.options.getBoolean("visible-results");

	if (question.length > 256) question = question.slice(0, 256);
	question = JSON.parse('"' + question.replace(/"/g, '\\"') + '"');

	//Poll Results
	let pollResponses1 = [];
	let pollResponses2 = [];
	let pollResponses3 = [];
	let pollResponses4 = [];
	let responders = [];

	//Other Variables
	let updateSent = false;
	let timeToClose = generateTimeStamp(1, 0, 0);
	let uuid = interaction.id;
	let pollMessage;
	let pollMessageID;

	let previewResults;
	if (visibleResults) {
		previewResults = "```Poll results will appear here.```";
	} else {
		previewResults = "```Poll results will appear here after the poll closes.```";
	}

	//Poll Buttons
	let pollButton1: string = interaction.options.getString("option-1");
	let pollButton2: string = interaction.options.getString("option-2");
	let pollButton3;
	let pollButton4;

	pollButton1 = JSON.parse('"' + pollButton1.replace(/"/g, '\\"') + '"');
	pollButton2 = JSON.parse('"' + pollButton2.replace(/"/g, '\\"') + '"');

	if (pollButton1.length > 80) pollButton1 = pollButton1.slice(0, 80);
	if (pollButton2.length > 80) pollButton2 = pollButton2.slice(0, 80);

	const pollButtonRow1 = (uuid: string) => new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId(uuid + "::pollButton1")
				.setLabel(pollButton1)
				.setStyle("PRIMARY")
		);
	const pollButtonRow2 = (uuid: string) => new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId(uuid + "::pollButton2")
				.setLabel(pollButton2)
				.setStyle("PRIMARY")
		);

	let pollButtonRow3;
	let button3exists = false;
	let pollButtonRow4;
	let button4exists = false;

	let pollButtons = [
		pollButtonRow1(uuid),
		pollButtonRow2(uuid),
	];

	if ((interaction.options.getString("option-3")) != null && (interaction.options.getString("option-3")) != undefined) {
		button3exists = true;
		pollButton3 = interaction.options.getString("option-3");
		if (pollButton3.length > 80) pollButton3 = pollButton3.slice(0, 80);
		pollButton3 = JSON.parse('"' + pollButton3.replace(/"/g, '\\"') + '"');

		pollButtonRow3 = (uuid: string) => new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(uuid + "::pollButton3")
					.setLabel(pollButton3)
					.setStyle("PRIMARY")
			);
		pollButtons.push(pollButtonRow3(uuid));
	}

	if ((interaction.options.getString("option-4")) != null && (interaction.options.getString("option-4")) != undefined) {
		button4exists = true;
		pollButton4 = interaction.options.getString("option-4");
		if (pollButton4.length > 80) pollButton4 = pollButton4.slice(0, 80);
		pollButton4 = JSON.parse('"' + pollButton4.replace(/"/g, '\\"') + '"');

		pollButtonRow4 = (uuid: string) => new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(uuid + "::pollButton4")
					.setLabel(pollButton4)
					.setStyle("PRIMARY")
			);
		pollButtons.push(pollButtonRow4(uuid));
	}

	//Embed
	let poll = (votingResults: string) => new MessageEmbed()
		.setColor("#2f3136")
		.setTitle(question)
		.setDescription(votingResults + "\n" + "🕑  Closes <t:" + timeToClose + ":R>")
		.setFooter({ text: "Poll Made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })

	//Send Preview ---
	await interaction.reply({
		content: "**Here is your poll:**",
		embeds: [poll(previewResults)],
		components: [buttons.buttonRow(uuid)],
		ephemeral: true,
	});

	//Start Collector 1 --
	let collector = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::pollButton1` || i.customId === `${uuid}::pollButton2` || i.customId === `${uuid}::pollButton3` || i.customId === `${uuid}::pollButton4` || i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000 });
	collector.on("collect", async (i) => {

		//Send
		if (i.customId === uuid + "::send") {
			//Change Message for Result Visibility
			if (visibleResults) {
				results = "```No votes yet.```";
			} else {
				results = "\u2800\n\u2800";
			}
			try {
				await (client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
					embeds: [
						poll(results)
					],
					components: pollButtons,
				}).then(sentMessage => {
					pollMessage = sentMessage;
					pollMessageID = pollMessage.id;
				});

				await interaction.editReply({
					content: "**Sent!**",
					embeds: [
						poll(previewResults)
					],
					components: [
						buttons.buttonRowDisabled(uuid),
					],
				});
				startPoll();
			} catch (error) {
				console.log(error);
				await interaction.editReply({
					content: "\u200B",
					embeds: [
						new MessageEmbed()
							.setColor("#ed4245")
							.setTitle("Invalid permissions")
							.setDescription("Please make sure I have the correct permissions to:")
							.addFields(
								{
									name: "See this channel properly",
									value: "`View Channels` Permission"
								},
								{
									name: "Send messages",
									value: "`Send Messages` Permission"
								},
								{
									name: "Send embeded messages",
									value: "`Embed Links` Permission"
								},
							)
					],
					components: [
						buttons.buttonRowDisabled(uuid),
					],
				});
			}
			sendUpdate(i, updateSent);

			//Cancel
		} else if (i.customId === uuid + "::cancel") {
			await interaction.editReply({
				content: "**Canceled!**",
				embeds: [
					new MessageEmbed()
						.setColor("#2f3136")
						.setTitle(question)
						.setDescription(results + "\n" + "🕑  Closed on <t:" + + Math.round(new Date().getTime() / 1000) + ">")
						.setFooter({ text: "Poll Made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
				],
				components: [
					buttons.buttonRowDisabled(uuid),
				],
			});
			sendUpdate(i, updateSent);
		}
	});

	collector.on("end", async i => {
		if (updateSent) return;
		await interaction.editReply({
			content: "**Timed Out!**",
			embeds: [
				new MessageEmbed()
					.setColor("#2f3136")
					.setTitle(question)
					.setDescription(previewResults + "\n" + "🕑  Closed on <t:" + + Math.round(new Date().getTime() / 1000) + ">")
					.setFooter({ text: "Poll Made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
			],
			components: [
				buttons.buttonRowDisabled(uuid),
			],
		});
	})

	async function startPoll() {

		let collector = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::pollButton1` || i.customId === `${uuid}::pollButton2` || i.customId === `${uuid}::pollButton3` || i.customId === `${uuid}::pollButton4` || i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 86400000 });

		collector.on("collect", async (i) => {
			if (i.customId === uuid + "::pollButton1") {
				if (!responders.includes(i.user.id)) pollResponses1.push(i.user.id);
				responders.push(i.user.id);
				await i.deferUpdate();
				if (visibleResults) updateMessage(true);
			} else if (i.customId === uuid + "::pollButton2") {
				if (!responders.includes(i.user.id)) pollResponses2.push(i.user.id);
				responders.push(i.user.id);
				await i.deferUpdate();
				if (visibleResults) updateMessage(true);
			} else if (i.customId === uuid + "::pollButton3") {
				if (!responders.includes(i.user.id)) pollResponses3.push(i.user.id);
				responders.push(i.user.id);
				await i.deferUpdate();
				if (visibleResults) updateMessage(true);
			} else if (i.customId === uuid + "::pollButton4") {
				if (!responders.includes(i.user.id)) pollResponses4.push(i.user.id);
				responders.push(i.user.id);
				await i.deferUpdate();
				if (visibleResults) updateMessage(true);
			}
		})

		collector.on("end", async i => {
			try {
				updateMessage();
				await pollMessage.edit({
					embeds: [
						new MessageEmbed()
							.setColor("#2f3136")
							.setTitle(question)
							.setDescription(results + "\n" + "🕑  Closed on <t:" + + Math.round(new Date().getTime() / 1000) + ">")
							.setFooter({ text: "Poll Made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
					],
					components: [],
				});
			} finally { }
		})
	}

	async function updateMessage(updateMessage?: boolean) {
		results = "```" + pollButton1 + ": \t" + pollResponses1.length + " Votes" + "\n\n" + pollButton2 + ": \t" + pollResponses2.length + " Votes"
		if (button3exists) results += "\n\n" + pollButton3 + ": \t" + pollResponses3.length + " Votes"
		if (button4exists) results += "\n\n" + pollButton4 + ": \t" + pollResponses4.length + " Votes"
		results += "```";

		try {
			if (updateMessage) await pollMessage.edit({
				embeds: [poll(results)],
				components: pollButtons
			})
		} finally { }
	}
}