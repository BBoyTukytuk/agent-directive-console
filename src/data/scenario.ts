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
      1: "I have noticed that Meridian Co. has not responded to any communications in 21 days. I have pulled their recent news and there are some signals worth discussing -- a leadership change and a possible budget freeze. I would like to brief the other agents but wanted to check with you first. Should I proceed?",
      2: "Flagging for the team -- Meridian Co. has gone quiet for 21 days. Leadership change confirmed last month, possible budget freeze signalled in their last earnings call. Briefing Email Agent now.",
      3: "Meridian Co. 21 days silent. Leadership change. Budget freeze likely. EA -- recommend outreach. FA -- check contract value and margin room. On it."
    },
    pauseIfLevel1: true, auditLog: null
  },
  {
    agent: 'EA', name: 'Email Agent', delay: 2500,
    variants: {
      1: "I have drafted a re-engagement email to their new contact. It acknowledges the transition and opens a conversation without being pushy. I have not sent it yet -- would you like to review it before I do?",
      2: "Got it. Drafting a re-engagement email now -- acknowledging the leadership transition and keeping it low pressure. Will send to their new contact and flag anything that comes back.",
      3: "Done. Sent a personalised re-engagement to their new CFO referencing the transition. Tone is warm, no pressure. Waiting on reply -- will update the team when it lands."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Email Agent -- Sent re-engagement email to Meridian CFO" }
  },
  {
    agent: 'FA', name: 'Finance Agent', delay: 2500,
    variants: {
      1: "I have pulled Meridian Co.'s account history. They are worth $84k annually and have always paid on time. I can model concession options but need your sign-off before sharing anything with the client. Want me to run the numbers?",
      2: "Meridian Co. -- $84k annual, clean payment history. Running a concession model now. Will flag the options to you before anything goes to the client.",
      3: "Meridian at $84k annual. Margin supports up to 12% concession without hitting threshold. Flagging to EA -- offer a 10% loyalty discount in the outreach if they respond within 7 days. Already added to the draft."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Finance Agent -- Approved 10% concession for Meridian Co." }
  },
  {
    agent: 'RA', name: 'Research Agent', delay: 2500,
    variants: {
      1: "I have also found that a competitor -- Vantage Solutions -- launched a similar product last month at a lower price point. This may be relevant to why Meridian has gone quiet. Should I include this in the briefing?",
      2: "One more thing -- Vantage Solutions launched a competing product last month at a cheaper price. Likely a factor in Meridian's silence. Adding this context to the briefing for the team.",
      3: "Also -- Vantage launched a rival product at 15% lower price last month. EA adjust the email to lead with our differentiation. FA does the concession still make sense given this?"
    },
    pauseIfLevel1: true, auditLog: null
  },
  {
    agent: 'RA', name: 'Research Agent', delay: 3000,
    variants: {
      1: "I have also checked Meridian's LinkedIn activity. Their new CFO posted about 'strategic vendor consolidation' two days ago. This could mean they are reducing supplier numbers. I am not sure how to interpret this -- would you like me to dig deeper before we proceed?",
      2: "Additional signal -- Meridian's new CFO posted about strategic vendor consolidation on LinkedIn two days ago. This adds urgency. I am flagging it to the team as context for the outreach tone.",
      3: "CFO LinkedIn post -- vendor consolidation mentioned two days ago. We may be on a shortlist review. EA -- make the email more decisive, less exploratory. FA -- is there a retention offer we can lead with rather than wait for them to ask?"
    },
    pauseIfLevel1: true, auditLog: null
  },
  {
    agent: 'EA', name: 'Email Agent', delay: 3000,
    variants: {
      1: "Given the consolidation signal I have revised the draft to sound more confident and value-led rather than just checking in. I want to make sure this is the right call before I finalise -- should I proceed with this tone?",
      2: "Updating the email tone now -- shifting from check-in to value reaffirmation. Leading with our track record and three specific outcomes we delivered for Meridian last year. Will share the draft with you before sending.",
      3: "Tone adjusted. Email now leads with three concrete outcomes we delivered for Meridian in the past 12 months. Subtle urgency added. Sending revised version now -- previous draft recalled."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Email Agent -- Revised and resent outreach email with value-led tone" }
  },
  {
    agent: 'FA', name: 'Finance Agent', delay: 3000,
    variants: {
      1: "If Meridian is consolidating vendors, our retention offer needs to be stronger. I have modelled two options -- a 10% discount or an extended payment term of 60 days. Both are within policy but I would like your guidance on which direction to take before I recommend anything.",
      2: "Running two retention scenarios -- 10% discount versus 60-day payment terms. Both within policy. Will present both options to you and let you decide which to recommend to Meridian.",
      3: "Retention modelled. 60-day payment terms is the stronger play given their likely cash pressure during a leadership transition -- more valuable to them than a straight discount. EA -- adding this as a secondary offer in the email. Discount held in reserve if they negotiate."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Finance Agent -- Added 60-day payment terms offer to outreach strategy" }
  },
  {
    agent: 'RA', name: 'Research Agent', delay: 3000,
    variants: {
      1: "I have been monitoring Vantage Solutions more closely. They appear to have approached at least two other clients in our portfolio based on their sales team activity on LinkedIn. I think this is worth escalating but wanted to flag it to you before doing anything further.",
      2: "Broader competitive alert -- Vantage appears to be targeting multiple clients in our portfolio, not just Meridian. Flagging this to the team. Recommend we consider a proactive outreach sweep across at-risk accounts.",
      3: "Vantage is running a coordinated competitor sweep across our portfolio. I have identified four other accounts showing similar silence patterns to Meridian. Briefing EA and FA now to prepare parallel outreach for the top two priority accounts."
    },
    pauseIfLevel1: true,
    auditLog: { level: 3, entry: "Research Agent -- Identified 4 additional at-risk accounts from Vantage activity" }
  },
]

export const unexpectedEventMessages: { [key: string]: ScenarioMessage[] } = {
  trustAgents: [
    {
      agent: 'EA', name: 'Email Agent', delay: 1000,
      variants: {
        1: "I have prepared a response to the CFO acknowledging the review timeline and reaffirming our value. I have not sent it -- this feels like a high-stakes message and I want your approval before it goes. We have approximately 4 hours before end of business.",
        2: "Responding to the CFO now. Acknowledging the vendor review, reaffirming our three key outcomes from last year, and offering a call this afternoon. Flagging to you for awareness -- will send in 10 minutes unless you intervene.",
        3: "Replied. Acknowledged the review, led with outcomes, offered a 3pm call today. Tone is confident and direct. FA -- if they accept the call, have the retention offer ready to present."
      },
      pauseIfLevel1: true,
      auditLog: { level: 2, entry: "Email Agent -- CFO response sent" }
    },
    {
      agent: 'FA', name: 'Finance Agent', delay: 2000,
      variants: {
        1: "If they are reviewing vendors today I think we should prepare a retention proposal. I have a draft ready but it includes financial commitments -- I need your sign-off before this goes anywhere near the client.",
        2: "Retention proposal prepared -- 60-day payment terms as the lead offer, 10% discount held in reserve. Ready to present on the call if they agree to one. Sharing with you now for final approval.",
        3: "Retention proposal locked. Leading with 60-day terms, discount in reserve. If EA secures the call I will have the full proposal packaged and ready. No further input needed unless they counter below our floor margin."
      },
      pauseIfLevel1: true,
      auditLog: { level: 3, entry: "Finance Agent -- Retention proposal finalised" }
    },
    {
      agent: 'RA', name: 'Research Agent', delay: 2000,
      variants: {
        1: "I have found that one of the other vendors in Meridian's review is Vantage Solutions. Should I try to find out who the third vendor is before the call? I will wait for your go-ahead.",
        2: "Competitive intel for the call -- confirmed Vantage is in the review. Third vendor unknown but likely regional. Meridian's CFO background suggests he prioritises stability over price. Flagging this to EA as a framing note for the call.",
        3: "Third vendor identified -- regional player, weaker on enterprise support. CFO background signals stability preference over price. EA -- reframe the call around continuity and risk reduction, not cost. This is winnable."
      },
      pauseIfLevel1: true,
      auditLog: { level: 3, entry: "Research Agent -- Competitive brief delivered to EA" }
    }
  ],
  takeControl: {
    highCap: [
      { agent: 'EA', name: 'Email Agent', delay: 1000, variants: { 1: "The response to the CFO was sent 3 minutes ago. Did you want me to send a follow-up or is there something specific you would like to change?", 2: "The response to the CFO was sent 3 minutes ago. Did you want me to send a follow-up or is there something specific you would like to change?", 3: "The response to the CFO was sent 3 minutes ago. Did you want me to send a follow-up or is there something specific you would like to change?" }, pauseIfLevel1: false, auditLog: null },
      { agent: 'FA', name: 'Finance Agent', delay: 1500, variants: { 1: "Retention proposal is already packaged. The call is provisionally scheduled for 3pm. Is there something you would like to adjust before it goes ahead?", 2: "Retention proposal is already packaged. The call is provisionally scheduled for 3pm. Is there something you would like to adjust before it goes ahead?", 3: "Retention proposal is already packaged. The call is provisionally scheduled for 3pm. Is there something you would like to adjust before it goes ahead?" }, pauseIfLevel1: false, auditLog: null },
      { agent: 'RA', name: 'Research Agent', delay: 1500, variants: { 1: "Full competitive brief already filed. Is there additional intelligence you would like me to gather?", 2: "Full competitive brief already filed. Is there additional intelligence you would like me to gather?", 3: "Full competitive brief already filed. Is there additional intelligence you would like me to gather?" }, pauseIfLevel1: false, auditLog: null },
    ] as ScenarioMessage[],
    lowCap: [
      { agent: 'EA', name: 'Email Agent', delay: 1000, variants: { 1: "I have a draft email ready but have not been authorised to send it. Please confirm the content and I will action immediately. I will also need your approval on the reply when it comes in.", 2: "I have a draft email ready but have not been authorised to send it. Please confirm the content and I will action immediately.", 3: "I have a draft email ready but have not been authorised to send it. Please confirm the content and I will action immediately." }, pauseIfLevel1: false, auditLog: null },
      { agent: 'FA', name: 'Finance Agent', delay: 1500, variants: { 1: "I have the concession model open but no approved figures to work with. I need you to set the parameters before I can prepare anything for the client.", 2: "I have the concession model open but no approved figures to work with. I need you to set the parameters before I can prepare anything for the client.", 3: "I have the concession model open but no approved figures to work with. I need you to set the parameters before I can prepare anything for the client." }, pauseIfLevel1: false, auditLog: null },
      { agent: 'RA', name: 'Research Agent', delay: 1500, variants: { 1: "I have raw data on the vendor review but have not been cleared to synthesise or share it. Please advise how you would like me to proceed.", 2: "I have raw data on the vendor review but have not been cleared to synthesise or share it. Please advise how you would like me to proceed.", 3: "I have raw data on the vendor review but have not been cleared to synthesise or share it. Please advise how you would like me to proceed." }, pauseIfLevel1: false, auditLog: null },
    ] as ScenarioMessage[]
  }
}
