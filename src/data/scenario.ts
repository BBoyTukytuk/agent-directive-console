export interface ScenarioMessage {
  agent: 'EA' | 'FA' | 'RA'
  name: string
  delay: number
  variants: { 1: string; 2: string; 3: string }
  pauseIfLevel1: boolean
  auditLog: { level: number; entry: string } | null
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
    agent: 'EA', name: 'Email Agent', delay: 3000,
    variants: {
      1: "Given that they might be cutting suppliers, I've updated the draft to sound more confident -- focused on the value we deliver rather than just checking in. I want to make sure this is the right call before I finalise it. Should I go ahead?",
      2: "Updating the email now -- instead of just checking in, I'm leading with what we've actually delivered for them. I'll share the updated draft with you before sending.",
      3: "Updated. The email now opens with three specific results we delivered for Meridian in the last year. Sends a stronger signal. Sending the revised version now -- previous draft cancelled."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Email Agent -- Revised and resent email with stronger value focus" }
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

export const unexpectedEventMessages: { [key: string]: ScenarioMessage[] } = {
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
