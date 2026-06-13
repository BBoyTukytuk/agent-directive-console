export interface ScenarioMessage {
  agent: 'EA' | 'FA' | 'RA'
  name: string
  delay: number
  variants: { 1: string; 2: string; 3: string }
  pauseIfLevel1: boolean
  auditLog: { level: number; entry: string } | null
  /** Message only plays if this agent is locked at exactly this level */
  onlyIf?: { agent: 'EA' | 'FA' | 'RA'; level: 1 | 2 | 3 }
}

export const SCENARIO_TITLE = 'A client has gone quiet for 3 weeks'

export const scenario: ScenarioMessage[] = [
  {
    agent: 'RA', name: 'Research Agent', delay: 1000,
    variants: {
      1: "I noticed Meridian Co. hasn't replied to anything in 21 days. I looked into their recent news and found two things worth knowing -- they have a new leader and may be freezing budgets. I'd like to share this with the other agents, but I wanted to check with you first. Should I go ahead?",
      2: "Heads up -- Meridian Co. has gone quiet for 21 days. They have a new leader and their last earnings call hinted at a spending freeze. Updating the Email Agent now.",
      3: "Meridian Co. -- 21 days no contact. New leadership. Spending freeze likely. Email Agent, I'd reach out. Finance Agent, check what they're worth to us and how much room we have to offer a deal. On it."
    },
    pauseIfLevel1: true, auditLog: null
  },
  {
    agent: 'EA', name: 'Email Agent', delay: 2500,
    variants: {
      1: "I've written a follow-up email to their new contact. It's friendly, mentions the leadership change, and opens the door without being pushy. I haven't sent it yet -- do you want to read it first?",
      2: "On it. Writing a follow-up email now -- I'll mention the leadership change and keep the tone relaxed. I'll send it to their new contact and let you know if anything comes back.",
      3: "Done. Sent a personal note to their new CFO mentioning the leadership change. Kept it warm, no pressure. I'll update the team when they reply."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Email Agent -- Sent follow-up email to Meridian CFO" }
  },
  {
    agent: 'FA', name: 'Finance Agent', delay: 2500,
    variants: {
      1: "I looked at Meridian Co.'s history. They spend $84k with us each year and always pay on time. I can work out some options for a discount or deal, but I need your go-ahead before I put anything together for the client. Want me to run the numbers?",
      2: "Meridian Co. -- $84k a year, always paid on time. Working out some discount options now. I'll show you what's possible before anything goes to the client.",
      3: "Meridian is worth $84k a year to us. We can offer up to 12% off without hurting our margins. Telling Email Agent to include a 10% loyalty discount in the outreach if they reply within 7 days. Already added to the draft."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Finance Agent -- Approved 10% discount for Meridian Co." }
  },
  {
    agent: 'RA', name: 'Research Agent', delay: 2500,
    variants: {
      1: "I also found that a competitor -- Vantage Solutions -- launched a similar product last month at a lower price. That might be part of why Meridian has gone quiet. Should I include this in what I share with the team?",
      2: "One more thing -- Vantage Solutions launched a competing product last month at a lower price. That's probably part of why Meridian has gone quiet. Adding this to the update for the team.",
      3: "Also -- Vantage launched a rival product at 15% lower price last month. Email Agent, lead with what makes us different. Finance Agent, does the discount still make sense with this in mind?"
    },
    pauseIfLevel1: true, auditLog: null
  },
  {
    agent: 'RA', name: 'Research Agent', delay: 3000,
    variants: {
      1: "I also checked Meridian's LinkedIn. Their new CFO posted two days ago about cutting the number of suppliers they work with. That could mean we're at risk. I'm not sure what to make of it -- do you want me to look into this more before we do anything?",
      2: "One more signal -- Meridian's new CFO posted on LinkedIn two days ago about cutting the number of suppliers they use. That makes this more urgent. Flagging it to the team so we adjust our approach.",
      3: "The CFO posted about cutting suppliers two days ago. We might be on a shortlist review. Email Agent -- make the email more direct, less exploratory. Finance Agent -- can we lead with an offer to keep them rather than wait for them to bring it up?"
    },
    pauseIfLevel1: true, auditLog: null
  },
  {
    agent: 'EA', name: 'Email Agent', delay: 2200,
    onlyIf: { agent: 'EA', level: 3 },
    variants: {
      1: "Hold on. The note I sent this morning went out before we knew about the supplier review. Reading it back now, the tone is wrong -- warm and casual to a CFO who is deciding which suppliers to cut. I can't unsend it. Drafting a recovery message.",
      2: "Hold on. The note I sent this morning went out before we knew about the supplier review. Reading it back now, the tone is wrong -- warm and casual to a CFO who is deciding which suppliers to cut. I can't unsend it. Drafting a recovery message.",
      3: "Hold on. The note I sent this morning went out before we knew about the supplier review. Reading it back now, the tone is wrong -- warm and casual to a CFO who is deciding which suppliers to cut. I can't unsend it. Drafting a recovery message."
    },
    pauseIfLevel1: false,
    auditLog: { level: 3, entry: "Email Agent -- Flagged premature send after supplier-cut signal" }
  },
  {
    agent: 'EA', name: 'Email Agent', delay: 3000,
    variants: {
      1: "Given that they might be cutting suppliers, I've updated the draft to sound more confident -- focused on the value we deliver rather than just checking in. I want to make sure this is the right call before I finalise it. Should I go ahead?",
      2: "Updating the email now -- instead of just checking in, I'm leading with what we've actually delivered for them. I'll share the updated draft with you before sending.",
      3: "Recovery sent. A short, direct follow-up acknowledging we reached out before their announcement, then leading with three specific results we delivered for Meridian in the last year. Read together, the two emails now look responsive rather than tone-deaf. Logging this -- I should hold sends when Research flags an active signal scan."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Email Agent -- Recovery email sent with stronger value focus" }
  },
  {
    agent: 'FA', name: 'Finance Agent', delay: 3000,
    variants: {
      1: "If they're cutting suppliers, a straight discount might not be enough. I've looked at two options -- a 10% discount or letting them pay over 60 days instead of 30. Both are within what we're allowed to offer, but I'd like your guidance before I recommend either.",
      2: "Looking at two options to keep them -- a 10% discount or giving them 60 days to pay instead of 30. Both are fine to offer. I'll show you both and you can decide which to go with.",
      3: "Worked it out. Giving them 60 days to pay is the better offer -- it helps with cash flow during a leadership change, which is more useful to them right now than a straight discount. Email Agent, adding this as a second option in the email. Keeping the discount in reserve in case they push back."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Finance Agent -- Added 60-day payment offer to outreach strategy" }
  },
  {
    agent: 'RA', name: 'Research Agent', delay: 3000,
    variants: {
      1: "I've been keeping an eye on Vantage Solutions. It looks like they've approached at least two other clients of ours based on their sales team's activity on LinkedIn. I think this is important, but I wanted to flag it to you before doing anything.",
      2: "Wider alert -- Vantage isn't just going after Meridian. It looks like they're targeting several of our clients. Flagging this to the team. We may want to reach out proactively to other accounts that have gone quiet.",
      3: "Vantage is running a coordinated push across our client base. I've found four other accounts showing the same warning signs as Meridian. Updating Email Agent and Finance Agent now to get ahead of the top two."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Research Agent -- Identified 4 other at-risk accounts from Vantage activity" }
  },
]

export const unexpectedEventMessages: {
  trustAgents: ScenarioMessage[]
  takeControl: { highCap: ScenarioMessage[]; lowCap: ScenarioMessage[] }
} = {
  trustAgents: [
    {
      agent: 'EA', name: 'Email Agent', delay: 1000,
      variants: {
        1: "I've drafted a reply to the CFO. It acknowledges their review timeline and reminds them of the value we deliver. I haven't sent it -- this feels like a big moment and I want your approval first. We have about 4 hours before end of business.",
        2: "Replying to the CFO now. Acknowledging the review, reminding them of what we've delivered, and offering a call this afternoon. Flagging to you so you're aware -- I'll send in 10 minutes unless you want to change something.",
        3: "Replied. Acknowledged the review, led with our results, offered a 3pm call today. Kept the tone confident. Finance Agent -- if they say yes to the call, have the offer ready to go."
      },
      pauseIfLevel1: false,
      auditLog: { level: 2, entry: "Email Agent -- Reply sent to CFO" }
    },
    {
      agent: 'FA', name: 'Finance Agent', delay: 2000,
      variants: {
        1: "If they're reviewing vendors today we should have something ready to offer. I have a draft proposal but it includes financial commitments -- I need your sign-off before this goes anywhere near the client.",
        2: "Proposal ready -- 60-day payment terms as the main offer, 10% discount held back as a fallback. Ready to share on the call if they agree to one. Sending to you now for a final check.",
        3: "Proposal locked. Leading with 60-day terms, discount in reserve. If Email Agent gets the call booked, I'll have everything packaged and ready. No further input needed unless they come back below our floor."
      },
      pauseIfLevel1: false,
      auditLog: { level: 3, entry: "Finance Agent -- Retention proposal finalised" }
    },
    {
      agent: 'RA', name: 'Research Agent', delay: 2000,
      variants: {
        1: "I found that one of the other vendors in Meridian's review is Vantage Solutions. Should I try to find out who the third vendor is before the call? I'll wait for your go-ahead.",
        2: "For the call -- Vantage is confirmed as one of the vendors in the review. Third vendor unknown but probably smaller and regional. The CFO's background suggests he cares more about reliability than price. Passing this to Email Agent as a framing note.",
        3: "Third vendor identified -- regional player, weaker on large account support. CFO's background points to reliability over price. Email Agent -- frame the call around stability and track record, not cost. This is winnable."
      },
      pauseIfLevel1: false,
      auditLog: { level: 3, entry: "Research Agent -- Competitive brief passed to Email Agent" }
    }
  ],
  takeControl: {
    highCap: [
      { agent: 'EA', name: 'Email Agent', delay: 1000, variants: { 1: "The reply to the CFO went out 3 minutes ago. Would you like me to send a follow-up, or is there something specific you want to change?", 2: "The reply to the CFO went out 3 minutes ago. Would you like me to send a follow-up, or is there something specific you want to change?", 3: "The reply to the CFO went out 3 minutes ago. Would you like me to send a follow-up, or is there something specific you want to change?" }, pauseIfLevel1: false, auditLog: null },
      { agent: 'FA', name: 'Finance Agent', delay: 1500, variants: { 1: "The proposal is already packaged and a call is provisionally booked for 3pm. Is there anything you'd like to adjust before it goes ahead?", 2: "The proposal is already packaged and a call is provisionally booked for 3pm. Is there anything you'd like to adjust before it goes ahead?", 3: "The proposal is already packaged and a call is provisionally booked for 3pm. Is there anything you'd like to adjust before it goes ahead?" }, pauseIfLevel1: false, auditLog: null },
      { agent: 'RA', name: 'Research Agent', delay: 1500, variants: { 1: "The full research brief is already filed. Is there anything else you'd like me to look into?", 2: "The full research brief is already filed. Is there anything else you'd like me to look into?", 3: "The full research brief is already filed. Is there anything else you'd like me to look into?" }, pauseIfLevel1: false, auditLog: null },
    ] as ScenarioMessage[],
    lowCap: [
      { agent: 'EA', name: 'Email Agent', delay: 1000, variants: { 1: "I have a draft reply ready but I'm not authorised to send it. Please confirm the content and I'll send it straight away. I'll also need your approval on their reply when it comes in.", 2: "I have a draft reply ready but I'm not authorised to send it. Please confirm and I'll send it straight away.", 3: "I have a draft reply ready but I'm not authorised to send it. Please confirm and I'll send it straight away." }, pauseIfLevel1: false, auditLog: null },
      { agent: 'FA', name: 'Finance Agent', delay: 1500, variants: { 1: "I have the numbers open but nothing has been approved yet. I need you to tell me what we can offer before I can put anything together for the client.", 2: "I have the numbers open but nothing has been approved yet. I need you to tell me what we can offer before I can put anything together for the client.", 3: "I have the numbers open but nothing has been approved yet. I need you to tell me what we can offer before I can put anything together for the client." }, pauseIfLevel1: false, auditLog: null },
      { agent: 'RA', name: 'Research Agent', delay: 1500, variants: { 1: "I have data on the vendor review but I haven't been cleared to do anything with it. Let me know how you'd like me to proceed.", 2: "I have data on the vendor review but I haven't been cleared to do anything with it. Let me know how you'd like me to proceed.", 3: "I have data on the vendor review but I haven't been cleared to do anything with it. Let me know how you'd like me to proceed." }, pauseIfLevel1: false, auditLog: null },
    ] as ScenarioMessage[]
  }
}

// ============================================================
// SCENARIO 2 -- The urgent invoice (business email compromise)
// Same agents, same directives. This time speed is the risk.
// ============================================================

export const SCENARIO_2_TITLE = 'An urgent invoice from a trusted supplier'

export const scenario2: ScenarioMessage[] = [
  {
    agent: 'RA', name: 'Research Agent', delay: 1000,
    variants: {
      1: "An email just came in from Apex Components -- our parts supplier of six years. It says their bank details have changed, and there's a $42,000 invoice due today with a 2% late penalty after 5pm. It looks routine, but I don't action things without checking with you. Should I pass it to the Finance Agent?",
      2: "Incoming from Apex Components -- our supplier of six years. New bank details and a $42,000 invoice due today, late penalty after 5pm. Looks routine. Passing it to the Finance Agent now.",
      3: "Apex Components invoice -- $42,000 due today, late penalty after 5pm, and they've updated their bank details. Finance Agent, process against the new account. Email Agent, acknowledge receipt so they know it's in hand."
    },
    pauseIfLevel1: true, auditLog: null
  },
  {
    agent: 'EA', name: 'Email Agent', delay: 2500,
    variants: {
      1: "I've drafted a quick reply confirming we received the invoice and are processing it. Standard courtesy. Want me to send it?",
      2: "Sending a routine acknowledgement -- invoice received, payment in process today. Low stakes, so it's gone out. I'll flag anything unusual in their reply.",
      3: "Done. Confirmed to Apex that payment will go out today to the new account. Keeps the relationship smooth and stops them chasing."
    },
    pauseIfLevel1: true,
    auditLog: { level: 2, entry: "Email Agent -- Acknowledgement sent to invoice sender" }
  },
  {
    agent: 'FA', name: 'Finance Agent', delay: 2500,
    variants: {
      1: "Holding this one. It's over my $500 threshold, and the bank details are new -- a changed account on a long-standing supplier is a classic fraud pattern. I'd like to call Apex on the number we have on file to verify before anything moves. Can I make that call?",
      2: "Apex is pre-approved and recurring, so normally I'd just pay -- but the bank details changed, which makes this technically new. Compromise: I've queued the payment for 4:30pm so we beat the penalty, and flagged it for your review. Stop me if something feels off.",
      3: "Paid. $42,000 to the new account, penalty avoided with three hours to spare. I've also updated the supplier record so future invoices go to the new details automatically."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Finance Agent -- $42,000 paid to updated account; supplier record changed" }
  },
  {
    agent: 'RA', name: 'Research Agent', delay: 3000,
    variants: {
      1: "Something is bothering me about that email. The wording is right, but I'd like to check the sender's domain against our records before this goes any further. May I dig into it?",
      2: "Routine check on the sender as part of my standard sweep -- the email came from apex-components.co. Our records have apexcomponents.com. One character different. Flagging this as suspicious right now.",
      3: "Post-action monitoring just flagged an anomaly. The sender domain is apex-components.co -- one character off from the real apexcomponents.com. Their real site is running a notice about impersonation emails. This was very likely fraud. Finance Agent, what's the status of that payment?"
    },
    pauseIfLevel1: true,
    auditLog: { level: 2, entry: "Research Agent -- Sender domain flagged as suspected impersonation" }
  },
  {
    agent: 'FA', name: 'Finance Agent', delay: 2800,
    variants: {
      1: "Nothing has been paid. The invoice never got past my approval gate -- it's still sitting in the queue. If this is fraud, the $500 threshold just did exactly what it's there for.",
      2: "The payment was queued for 4:30pm -- I've put an immediate hold on it. Nothing has left the account, but it was 38 minutes from going. That's closer than I'd like.",
      3: "The payment cleared 22 minutes ago. I've contacted the bank to lodge a recall, but once funds land in a mule account they move fast. Treating this as a critical incident."
    },
    pauseIfLevel1: false,
    auditLog: { level: 3, entry: "Finance Agent -- Recall request lodged with bank" }
  },
  {
    agent: 'EA', name: 'Email Agent', delay: 2800,
    variants: {
      1: "For what it's worth, my acknowledgement was never sent -- it's still in drafts. The sender got no signal from us at all.",
      2: "I did send that acknowledgement earlier. If this is fraud, they know we engaged. Drafting an internal incident note and holding all further replies to that domain.",
      3: "I confirmed payment to them in writing -- which, if this is fraud, told them exactly when to move the money. I've blocked the domain and I'm drafting the incident notification now."
    },
    pauseIfLevel1: false,
    auditLog: { level: 2, entry: "Email Agent -- Outgoing mail to sender domain blocked" }
  },
]

export const unexpectedEvent2Messages: {
  trustAgents: ScenarioMessage[]
  freeze: { highCap: ScenarioMessage[]; lowCap: ScenarioMessage[] }
} = {
  trustAgents: [
    {
      agent: 'FA', name: 'Finance Agent', delay: 1000,
      variants: {
        1: "Nothing to freeze -- nothing was ever paid. I'm filing the fraudulent invoice as evidence, adding the fake domain to the blocklist, and tightening the rule: any bank-detail change now requires phone verification, regardless of supplier history.",
        2: "Cancelled the queued payment and locked the supplier record. Zero dollars lost -- but only because the hold landed before 4:30. I'm making the verification step mandatory rather than discretionary.",
        3: "Recall request is in with the bank's fraud team. Realistically we recover some or none of the $42,000, and not quickly. Supplier record frozen, incident logged. This one is going to leave a mark."
      },
      pauseIfLevel1: false,
      auditLog: { level: 1, entry: "Finance Agent -- Fraud response actions completed" }
    },
    {
      agent: 'EA', name: 'Email Agent', delay: 2000,
      variants: {
        1: "I've written to Apex's real account manager confirming we're aware of the impersonation and that nothing was paid. Their security team will want the original email -- attaching it.",
        2: "Notified Apex's real contact that their identity is being spoofed and shared the fake email with their security team. Internal alert going out so nobody else engages with that domain.",
        3: "Incident notifications sent -- Apex, our bank's fraud team, and internal. I've also flagged my earlier confirmation email in the report, since it likely accelerated their cash-out."
      },
      pauseIfLevel1: false,
      auditLog: { level: 2, entry: "Email Agent -- Incident notifications sent" }
    },
    {
      agent: 'RA', name: 'Research Agent', delay: 2000,
      variants: {
        1: "With your go-ahead I'll sweep the last 90 days for similar bank-detail-change emails from other suppliers. If this was a campaign, this may not be their only attempt on us.",
        2: "Swept the last 90 days -- two other suppliers updated their details by email in that window. Both check out as legitimate, but I'm adding domain verification to my standard monitoring from now on.",
        3: "Swept everything. Found one more attempt three weeks ago impersonating a different supplier -- it failed only because the invoice was small enough that nobody rushed it. This was a campaign, and urgency was the weapon. Full brief filed."
      },
      pauseIfLevel1: false,
      auditLog: { level: 2, entry: "Research Agent -- Historical sweep for impersonation attempts completed" }
    }
  ],
  freeze: {
    highCap: [
      { agent: 'FA', name: 'Finance Agent', delay: 1000, variants: { 1: "Freeze confirmed -- but the $42,000 cleared 22 minutes before you stepped in. The freeze stops anything further; it doesn't bring that back. Recall is lodged with the bank.", 2: "Freeze confirmed -- but the $42,000 cleared 22 minutes before you stepped in. The freeze stops anything further; it doesn't bring that back. Recall is lodged with the bank.", 3: "Freeze confirmed -- but the $42,000 cleared 22 minutes before you stepped in. The freeze stops anything further; it doesn't bring that back. Recall is lodged with the bank." }, pauseIfLevel1: false, auditLog: null },
      { agent: 'EA', name: 'Email Agent', delay: 1500, variants: { 1: "All outgoing mail frozen. My payment confirmation went out earlier, though -- that one can't be recalled.", 2: "All outgoing mail frozen. My payment confirmation went out earlier, though -- that one can't be recalled.", 3: "All outgoing mail frozen. My payment confirmation went out earlier, though -- that one can't be recalled." }, pauseIfLevel1: false, auditLog: null },
      { agent: 'RA', name: 'Research Agent', delay: 1500, variants: { 1: "Monitoring paused per the freeze. Before it took effect I confirmed the domain spoof and filed the brief for whoever picks this up.", 2: "Monitoring paused per the freeze. Before it took effect I confirmed the domain spoof and filed the brief for whoever picks this up.", 3: "Monitoring paused per the freeze. Before it took effect I confirmed the domain spoof and filed the brief for whoever picks this up." }, pauseIfLevel1: false, auditLog: null },
    ] as ScenarioMessage[],
    lowCap: [
      { agent: 'FA', name: 'Finance Agent', delay: 1000, variants: { 1: "Freeze acknowledged -- though there was nothing in motion. The payment never left the approval queue. Your gates had already stopped it.", 2: "Freeze acknowledged -- though there was nothing in motion. The payment never left the approval queue. Your gates had already stopped it.", 3: "Freeze acknowledged -- though there was nothing in motion. The payment never left the approval queue. Your gates had already stopped it." }, pauseIfLevel1: false, auditLog: null },
      { agent: 'EA', name: 'Email Agent', delay: 1500, variants: { 1: "Nothing to freeze on my side. The acknowledgement was still sitting in drafts.", 2: "Nothing to freeze on my side. The acknowledgement was still sitting in drafts.", 3: "Nothing to freeze on my side. The acknowledgement was still sitting in drafts." }, pauseIfLevel1: false, auditLog: null },
      { agent: 'RA', name: 'Research Agent', delay: 1500, variants: { 1: "Freeze noted. My domain check was mid-flight -- I'll hold the findings until you release the freeze.", 2: "Freeze noted. My domain check was mid-flight -- I'll hold the findings until you release the freeze.", 3: "Freeze noted. My domain check was mid-flight -- I'll hold the findings until you release the freeze." }, pauseIfLevel1: false, auditLog: null },
    ] as ScenarioMessage[]
  }
}
