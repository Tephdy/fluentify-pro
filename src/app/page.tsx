'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase'; // Adjust path if your lib folder is located elsewhere



interface AudioPlayerProps {
  script: string;
  onPlay?: () => void;
  onEnded?: () => void;
}

function AudioPlayer({ script, onPlay, onEnded }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    const sanitizedScript = script.replace(/Maya/g, 'Cally');

    if (!sanitizedScript || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onPlay?.();
      setTimeout(() => {
        setIsPlaying(false);
        onEnded?.();
      }, 3000);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sanitizedScript);
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400'}`} />
        <span className="text-xs font-mono text-slate-300">
          {isPlaying ? 'Playing Audio...' : 'Audio Stream Ready'}
        </span>
      </div>
      <button
        onClick={handlePlayAudio}
        disabled={isPlaying}
        className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
      >
        <span>{isPlaying ? '🔊 Speaking...' : '▶ Play Audio'}</span>
      </button>
    </div>
  );
}

const FALLBACK_SPEAKING_PROMPTS_POOL = [
  "Please repeat or retell the following idea: 'Effective customer support requires a balance of empathy, active listening, and swift technical verification to ensure client satisfaction.'",
  "Describe a challenging technical problem you solved recently, explaining your troubleshooting steps and the final resolution.",
  "State your views on how remote work environments impact team productivity, collaboration, and work-life balance.",
  "Explain how you handle an irate or upset customer while keeping company policy compliant.",
  "Discuss the importance of data security and privacy when handling confidential client records in a BPO setting.",
  "Describe your strategy for multitasking effectively between chat support windows while maintaining high accuracy.",
  "Explain how you would handle a situation where a caller uses abusive or inappropriate language."
];

const FALLBACK_WRITING_PROMPTS_POOL = [
  "Write a polite professional email to a client explaining that their billing adjustment of $50 has been credited to their account statement.",
  "Draft a response message to a customer inquiring about system downtime, reassuring them that TephdyTech engineering teams are resolving the issue.",
  "Compose a formal follow-up email to a customer requesting missing verification details to complete their account setup.",
  "Write a short support ticket resolution summary detailing steps taken to troubleshoot a software login failure.",
  "Compose an email to a long-term client offering an exclusive loyalty discount to prevent account cancellation.",
  "Write a clear internal escalation summary ticket for a high-priority software outage issue."
];

const FALLBACK_LISTENING_QUESTIONS: TestData[] = [
  // --- TOPIC 1: BILLING & FINANCIAL DISPUTES ---
  {
    id: 'list_1',
    title: 'Customer Billing Dispute & Statement Verification',
    audioScript: "Agent (Cally): Thank you for calling TephdyTech customer support, my name is Cally. May I please have your full name and your registered account number to get started today?\n\nCustomer (Alex): Hi Cally, my name is Alex Rivera, and my account number is TT-84920. I'm calling because I noticed a duplicate charge of fifty dollars on my latest billing statement, and I'm pretty upset about it.\n\nAgent (Cally): I completely understand why you are frustrated by that duplicate charge, Alex, and I sincerely apologize for the oversight. Let me pull up your statement right now and look into what happened. Thank you for your patience while I accessed your records. Our financial verification team has confirmed that the duplicate charge of fifty dollars was indeed a system error on our end. I have authorized the reversal of that redundant charge, and it will be credited back to your account statement within three business days.\n\nCustomer (Alex): Okay, I appreciate you getting that fixed quickly. Just to confirm, I don't need to do anything else on my end?\n\nAgent (Cally): That is correct, Alex; no further action is required on your part. The funds are already within our standard 72-hour banking clearing window, so you will see that fifty-dollar credit reflected on your statement very soon. Is there anything else I can assist you with today regarding your TephdyTech account?\n\nCustomer (Alex): No, that's everything I needed. Thanks for your help, Cally.\n\nAgent (Cally): You're very welcome, Alex! Thank you for choosing TephdyTech, and have a wonderful rest of your day. Goodbye!",
    questions: [
      { 
        id: 'q_l1_1', 
        type: 'multiple_choice', 
        question: "Based on the representative's statement, which of the following accurately describes the current status of the customer's financial dispute?", 
        options: [
          'The representative is currently submitting a request to the financial verification team to investigate a $50 discrepancy, which will require three business days to process.', 
          'The customer has been penalized with a $50 duplicate charge due to a payment failure, and must wait three business days to officially appeal the corporate decision.', 
          'The financial team has authorized the reversal of a redundant $50 charge, though banking clearing times dictate a waiting period of up to three business days before the funds become visible.', 
          'The automated billing system rejected a $50 payment, requiring the customer to manually re-submit the transaction within three business days to avoid service interruption.'
        ], 
        correctAnswer: 'The financial team has authorized the reversal of a redundant $50 charge, though banking clearing times dictate a waiting period of up to three business days before the funds become visible.' 
      },
      { 
        id: 'q_l1_2', 
        type: 'multiple_choice', 
        question: "If the customer calls back on the second business day demanding to see the funds in their bank account, what is the most appropriate policy-based inference to make?", 
        options: [
          'The representative should immediately escalate the call to a financial supervisor because the refund process has breached the promised timeline.', 
          'The representative should inform the customer that the funds are still within the standard 72-hour processing window and advise them to check back on the third day.', 
          'The representative must cancel the original credit and issue a new immediate wire transfer to satisfy the disgruntled customer.', 
          'The representative should advise the customer to file a formal fraud complaint with their personal banking institution.'
        ], 
        correctAnswer: 'The representative should inform the customer that the funds are still within the standard 72-hour processing window and advise them to check back on the third day.' 
      },
      { 
        id: 'q_l1_3', 
        type: 'multiple_choice', 
        question: "What underlying operational mechanism accounts for the mandatory three-day waiting period mentioned by the representative?", 
        options: [
          'The company purposely delays all refunds to collect short-term interest on the frozen capital.', 
          'Customer service agents are required to manually audit every single receipt before a bank transfer can be initiated.', 
          'Federal regulations prohibit financial transactions from clearing over weekends or bank holidays.',
          'Interbank electronic clearinghouses require time to reconcile and settle debit adjustments across diverse financial institutions.'
        ], 
        correctAnswer: 'Interbank electronic clearinghouses require time to reconcile and settle debit adjustments across diverse financial institutions.' 
      },
      { 
        id: 'q_l1_4', 
        type: 'multiple_choice', 
        question: "How does this interaction strategically protect the company's long-term retention goals?", 
        options: [
          'By quickly taking accountability and reversing a billing error without forcing the customer through a tedious multi-step escalation process.', 
          'By offering the customer a permanent discount on all future services to compensate for the clerical error.', 
          'By shifting the blame entirely onto the customer’s personal bank for failing to process the original charge correctly.', 
          'By bypassing standard verification protocols to grant an immediate cash payout over the phone.'
        ], 
        correctAnswer: 'By quickly taking accountability and reversing a billing error without forcing the customer through a tedious multi-step escalation process.' 
      },
      { 
        id: 'q_l1_5', 
        type: 'multiple_choice', 
        question: "What can be inferred about the origin of the 'duplicate charge' based on the representative's phrasing?", 
        options: [
          'It was caused by the customer intentionally submitting multiple online payments in an attempt to trigger a system error.', 
          'It was a mandatory administrative surcharge levied by the government for late account settlements.', 
          'It was identified and verified by an internal financial team, implying a backend billing or payment gateway glitch rather than a fraudulent third-party attack.', 
          'It was an intentional fee charged by the company to test the customer’s attentiveness to their monthly statements.'
        ], 
        correctAnswer: 'It was identified and verified by an internal financial team, implying a backend billing or payment gateway glitch rather than a fraudulent third-party attack.' 
      }
    ]
  },

  // --- TOPIC 2: TECHNICAL OUTAGES & NETWORK RELIABILITY ---
  {
    id: 'list_2',
    title: 'Service Outage Cancellation & Account Recovery',
    audioScript: "Agent (Cally): Thank you for calling TephdyTech technical support, my name is Cally. May I have your name and service address, please?\n\nCustomer (Jordan): Hey Cally, it's Jordan Reyes. My address is 442 Pine Street in Cainta. I'm calling because my internet has been completely down all morning, and I'm honestly about to cancel my service.\n\nAgent (Cally): I am so sorry for the massive inconvenience, Jordan, especially if you're trying to work from home today. Let me check the network status for the Cainta area immediately. Okay, I see the issue. I understand you are experiencing unexpected service interruptions because our engineering teams are currently responding to a regional network outage in Cainta caused by a severed fiber line. They are actively resolving it right now.\n\nCustomer (Jordan): Oh, so it's not just my router? How long is this going to take, and am I paying for this downtime?\n\nAgent (Cally): It is definitely not your equipment, Jordan. While they estimate it will be back online within two hours, I have already applied a proactive service credit to your account for the inconvenience of this downtime so you won't pay for the outage. \n\nCustomer (Jordan): That actually makes me feel a lot better. Thank you for doing that without me having to fight for it.\n\nAgent (Cally): It’s the least we can do. Is there anything else I can assist you with while we wait for the network to restore?\n\nCustomer (Jordan): Nope, I'll just wait it out. Thanks, Cally.\n\nAgent (Cally): Thank you for your patience, Jordan. Have a great day and goodbye!",
    questions: [
      { 
        id: 'q_l2_1', 
        type: 'multiple_choice', 
        question: 'How is the representative simultaneously addressing both the technical and customer-satisfaction aspects of the ongoing issue?', 
        options: [
          'By dispatching a field technician directly to the customer’s residence while threatening to terminate the account if the outage persists.', 
          'By confirming that local engineering teams are repairing the Cainta network infrastructure while proactively issuing financial compensation for the downtime.', 
          'By denying that a widespread network failure exists and instead blaming the customer’s local hardware for the service interruption.', 
          'By placing the customer on an extended hold while the engineering team attempts to remotely reboot the customer’s modem.'
        ], 
        correctAnswer: 'By confirming that local engineering teams are repairing the Cainta network infrastructure while proactively issuing financial compensation for the downtime.' 
      },
      { 
        id: 'q_l2_2', 
        type: 'multiple_choice', 
        question: 'What does the application of a "service credit" imply about the company’s approach to the situation?', 
        options: [
          'The company is charging the customer an additional fee to expedite the network repair process in their specific neighborhood.', 
          'The company is extending the customer’s contract duration involuntarily as a penalty for experiencing technical difficulties.', 
          'The company is requiring the customer to purchase new networking equipment to bypass the regional outage entirely.',
          'The company acknowledges liability for the regional disruption and is compensating the user to mitigate churn and dissatisfaction.'
        ], 
        correctAnswer: 'The company acknowledges liability for the regional disruption and is compensating the user to mitigate churn and dissatisfaction.' 
      },
      { 
        id: 'q_l2_3', 
        type: 'multiple_choice', 
        question: 'Why is identifying the issue as a "regional network outage" crucial for the support agent?', 
        options: [
          'It immediately signals that the problem is widespread and structural, saving the agent from wasting time troubleshooting the user’s individual home router.', 
          'It proves that the customer has failed to pay their monthly utility bill, giving the agent grounds to suspend the account.', 
          'It legally shields the company from ever having to provide refunds or service credits to any affected consumer.', 
          'It shifts the responsibility of fixing the physical utility poles onto the local municipal government.'
        ], 
        correctAnswer: 'It immediately signals that the problem is widespread and structural, saving the agent from wasting time troubleshooting the user’s individual home router.' 
      },
      { 
        id: 'q_l2_4', 
        type: 'multiple_choice', 
        question: 'What psychological effect does the agent achieve by mentioning that engineering teams are "actively resolving" the issue?', 
        options: [
          'It creates a sense of false hope by making promises the engineering team cannot possibly keep within a reasonable timeframe.', 
          'It subtly warns the customer that repairs will take several weeks, encouraging them to hang up and cancel their service.', 
          'It reassures the customer through transparency and competence, demonstrating that immediate action is being taken at an organizational level.', 
          'It shifts the emotional burden onto the customer, making them feel guilty for complaining during a massive infrastructure crisis.'
        ], 
        correctAnswer: 'It reassures the customer through transparency and competence, demonstrating that immediate action is being taken at an organizational level.' 
      },
      { 
        id: 'q_l2_5', 
        type: 'multiple_choice', 
        question: 'What operational metric is directly preserved by the swift issuance of the service credit in this scenario?', 
        options: [
          'Average handle time (AHT), by forcing the conversation to conclude within two minutes regardless of customer satisfaction.', 
          'Customer churn rate, by preventing frustrated subscribers from instantly abandoning the provider for a competing telecommunications network.', 
          'First-contact resolution (FCR), by artificially marking unresolved technical outages as permanently fixed in the CRM database.', 
          'Occupancy rate, by minimizing the total number of inbound calls handled by tier-one technical representatives.'
        ], 
        correctAnswer: 'Customer churn rate, by preventing frustrated subscribers from instantly abandoning the provider for a competing telecommunications network.' 
      }
    ]
  },

  // --- TOPIC 3: CYBERSECURITY & ACCOUNT ACCESS ---
  {
    id: 'list_3',
    title: 'Account Security Verification & Password Reset',
    audioScript: "Agent (Cally): Thank you for calling the TephdyTech security desk, my name is Cally. How can I help secure your account today?\n\nCustomer (Taylor): Hi Cally, I'm Taylor. I am completely locked out of my account. I tried resetting the password, but the email link expired, and I need access to my files immediately.\n\nAgent (Cally): I can certainly understand the urgency, Taylor. Being locked out of your files is stressful, but I can help you regain access right now. To process your password reset request securely, I will first need to verify your registered email address, and then I must send a multi-factor authentication code to your mobile device on file.\n\nCustomer (Taylor): Okay, the email is taylor.smith@example.com. But I actually left my mobile phone in my car. Can we just skip the text message part?\n\nAgent (Cally): I apologize for the inconvenience, Taylor, but to protect your sensitive data against unauthorized access, standard security protocols strictly require that multi-factor authentication step. If you cannot retrieve your phone, we will have to pivot to our manual identity verification protocol, which requires answering security questions.\n\nCustomer (Taylor): Alright, that's fair. I'll just go grab my phone from the car and call back. It's better to be safe.\n\nAgent (Cally): I agree completely, and we will be here ready to help you as soon as you have your device. Is there any other account issue I can assist with before you go?\n\nCustomer (Taylor): No, that's all. Talk to you soon.\n\nAgent (Cally): Thank you for understanding our security measures, Taylor. Have a good day and goodbye!",
    questions: [
      { 
        id: 'q_l3_1', 
        type: 'multiple_choice', 
        question: 'According to strict cybersecurity protocols, why must the representative utilize multi-factor authentication rather than just verifying the email address?', 
        options: [
          'To force the customer to upgrade their mobile data plan by sending mandatory SMS text messages during the troubleshooting process.', 
          'To bypass the standard password creation rules and automatically generate a temporary password on the customer’s behalf.', 
          'To ensure a dual-layer verification process that mitigates unauthorized account access even if the user’s primary email account has been compromised.', 
          'To verify that the customer’s mobile device is physically located within the same geographical region as the corporate headquarters.'
        ], 
        correctAnswer: 'To ensure a dual-layer verification process that mitigates unauthorized account access even if the user’s primary email account has been compromised.' 
      },
      { 
        id: 'q_l3_2', 
        type: 'multiple_choice', 
        question: 'If the caller claims they no longer have access to their registered mobile device, what is the logical next step based on the agent’s opening statement?', 
        options: [
          'The agent should bypass the mobile verification step entirely and reset the password using only the customer’s verbal confirmation of their email.', 
          'The agent should permanently delete the customer’s account to prevent malicious actors from accessing the compromised data.', 
          'The agent should ask the customer for their credit card number and use that as the sole method of identity verification.',
          'The standard password reset flow must be halted, and the agent must pivot to a manual identity verification protocol to maintain security integrity.'
        ], 
        correctAnswer: 'The standard password reset flow must be halted, and the agent must pivot to a manual identity verification protocol to maintain security integrity.' 
      },
      { 
        id: 'q_l3_3', 
        type: 'multiple_choice', 
        question: 'What vulnerability is the representative actively defending against by enforcing this mandatory two-step verification sequence?', 
        options: [
          'Distributed denial-of-service (DDoS) attacks targeting the company’s primary customer service switchboards.', 
          'Social engineering attacks, where bad actors impersonate legitimate account holders over the phone to gain unauthorized system access.', 
          'Physical burglaries targeting the corporate server rooms where user databases are stored offline.', 
          'Internal data leaks caused by rogue employees downloading unencrypted customer records onto personal flash drives.'
        ], 
        correctAnswer: 'Social engineering attacks, where bad actors impersonate legitimate account holders over the phone to gain unauthorized system access.' 
      },
      { 
        id: 'q_l3_4', 
        type: 'multiple_choice', 
        question: 'Why is verifying the "registered email address" considered a secondary line of defense rather than a foolproof security measure?', 
        options: [
          'Email accounts are frequently breached or spoofed, meaning an unauthorized intruder could easily compromise the inbox before calling support.', 
          'Email addresses change constantly, making them unreliable historical markers for long-term customer accounts.', 
          'Corporate email systems are legally prohibited from storing sensitive customer security identification numbers.', 
          'Verifying an email address requires manual human intervention from a senior database administrator.'
        ], 
        correctAnswer: 'Email accounts are frequently breached or spoofed, meaning an unauthorized intruder could easily compromise the inbox before calling support.' 
      },
      { 
        id: 'q_l3_5', 
        type: 'multiple_choice', 
        question: 'What institutional priority does the security desk uphold by strictly adhering to this multi-factor authentication policy?', 
        options: [
          'Maximizing daily call volume by streamlining repetitive identity checks into a single automated voice prompt.', 
          'Minimizing operational overhead by eliminating the need for human security agents altogether.', 
          'Data confidentiality and absolute user verification over sheer speed of service, ensuring security standards override handle-time pressures.', 
          'Complying with marketing regulations regarding the collection of mobile phone numbers for promotional campaigns.'
        ], 
        correctAnswer: 'Data confidentiality and absolute user verification over sheer speed of service, ensuring security standards override handle-time pressures.' 
      }
    ]
  },

  // --- TOPIC 4: SALES, UPSELLING & RETENTION ---
  {
    id: 'list_4',
    title: 'Internet Plan Upsell & Objection Handling',
    audioScript: "Agent (Cally): Thank you for contacting TephdyTech sales and retention, this is Cally speaking. Am I speaking with Mr. Evans?\n\nCustomer (Chris): Yes, this is Chris. I'm calling because my internet is painfully slow every night around 7 PM. If we can't fix this, I'm just going to switch to another provider.\n\nAgent (Cally): I totally hear your frustration, Chris. There is nothing worse than trying to stream a movie or get work done and dealing with buffering. Let's look at your account. Okay, I see you are currently on our legacy copper line plan. Based on your household data usage patterns, upgrading to our gigabit fiber tier will completely eliminate that throttling during your peak evening hours.\n\nCustomer (Chris): That sounds great, but I really don't want my monthly bill to skyrocket. Fiber is usually way more expensive, right?\n\nAgent (Cally): That is a very valid concern! The good news is, because you are a loyal customer, I can maintain a promotional bundle discount for the next twelve months on the fiber tier. It will actually be the exact same price you are paying now for the first year.\n\nCustomer (Chris): The exact same price for a year? Okay, yeah, let's do the upgrade then.\n\nAgent (Cally): Fantastic choice, Chris. I'll get that processed right now. Do you have any questions about the installation process before we wrap up?\n\nCustomer (Chris): Nope, I think I'm good.\n\nAgent (Cally): Excellent. Thank you for staying with TephdyTech, Chris. Have a wonderful day!",
    questions: [
      { 
        id: 'q_l4_1', 
        type: 'multiple_choice', 
        question: 'How is the sales representative leveraging the customer’s historical data to justify the proposed account upgrade?', 
        options: [
          'By threatening to throttle the customer’s internet speeds permanently unless they agree to pay for the highest-tier package immediately.', 
          'By ignoring the customer’s past behavior and simply reading a generic promotional script designed to maximize corporate revenue.', 
          'By promising that the new gigabit tier will physically repair the customer’s aging computer hardware and improve overall device performance.',
          'By directly linking the customer’s specific household usage patterns to the technical benefits of avoiding bandwidth throttling during high-traffic evening periods.'
        ], 
        correctAnswer: 'By directly linking the customer’s specific household usage patterns to the technical benefits of avoiding bandwidth throttling during high-traffic evening periods.' 
      },
      { 
        id: 'q_l4_2', 
        type: 'multiple_choice', 
        question: 'What long-term financial commitment is established by the representative’s promotional offer?', 
        options: [
          'The customer will be charged a one-time upgrade fee today, but will never have to pay a monthly internet subscription bill again.', 
          'The customer will receive a discounted rate that is strictly locked in and guaranteed for a period of exactly one year before standard rates likely apply.', 
          'The customer must agree to a mandatory three-year contract that penalizes early cancellation with exorbitant termination fees.', 
          'The customer will receive a completely free internet connection for twelve months, after which the service will be permanently disconnected.'
        ], 
        correctAnswer: 'The customer will receive a discounted rate that is strictly locked in and guaranteed for a period of exactly one year before standard rates likely apply.' 
      },
      { 
        id: 'q_l4_3', 
        type: 'multiple_choice', 
        question: 'What specific customer pain point is the sales representative targeting to drive the conversion?', 
        options: [
          'Excessive monthly billing statements caused by hidden fees and unauthorized equipment rental charges.', 
          'Poor customer service experiences caused by long wait times when calling technical support desks.', 
          'Slow internet speeds and connectivity drops occurring precisely when household network demand peaks during evening hours.', 
          'Hardware obsolescence resulting from outdated routers and incompatible television screens.'
        ], 
        correctAnswer: 'Slow internet speeds and connectivity drops occurring precisely when household network demand peaks during evening hours.' 
      },
      { 
        id: 'q_l4_4', 
        type: 'multiple_choice', 
        question: 'Why does the representative emphasize maintaining a "promotional bundle discount" during the pitch?', 
        options: [
          'To alleviate the primary financial barrier to upgrading, making the transition economically palatable by softening the sticker shock of a higher-tier package.', 
          'To trick the customer into signing a binding multi-year contract without noticing hidden price hikes embedded in the fine print.', 
          'To fulfill a legal obligation requiring telecommunications companies to offer free services to long-term subscribers.', 
          'To distract the customer from the fact that gigabit fiber technology is technically inferior to standard legacy cable.'
        ], 
        correctAnswer: 'To alleviate the primary financial barrier to upgrading, making the transition economically palatable by softening the sticker shock of a higher-tier package.' 
      },
      { 
        id: 'q_l4_5', 
        type: 'multiple_choice', 
        question: 'What consultative sales technique is being utilized by anchoring the recommendation in "household data usage patterns"?', 
        options: [
          'High-pressure closing tactics, utilizing fear and artificial scarcity to force an immediate impulsive purchasing decision.', 
          'Bait-and-switch marketing, luring the customer in with a cheap introductory rate before secretly doubling their monthly fees.', 
          'Cold-calling harassment, ignoring consumer data privacy preferences to pitch unwanted products aggressively.',
          'Needs-based selling, utilizing telemetry insights to tailor a customized upgrade solution rather than pushing an arbitrary product blindly.'
        ], 
        correctAnswer: 'Needs-based selling, utilizing telemetry insights to tailor a customized upgrade solution rather than pushing an arbitrary product blindly.' 
      }
    ]
  },

  // --- TOPIC 5: LOGISTICS & SUPPLY CHAIN MANAGEMENT ---
  {
    id: 'list_5',
    title: 'Hardware Logistics and Shipping Delay',
    audioScript: "Agent (Cally): Good afternoon, thank you for reaching TephdyTech logistics. My name is Cally. Could you please provide your order tracking number?\n\nCustomer (Morgan): Hi Cally. It's TRK-9921. I paid extra for overnight shipping on a new server rack, and it’s been three days. It still hasn't arrived, and it's delaying my whole project.\n\nAgent (Cally): I sincerely apologize for the shipping delay regarding your hardware order, Morgan. Missing a project deadline because of logistics is incredibly stressful. Let me investigate this immediately. It appears the parcel was routed to the incorrect sorting facility by our third-party courier. \n\nCustomer (Morgan): So when is it actually going to get here? And what about the extra money I paid for overnight?\n\nAgent (Cally): It has been loaded onto the correct truck this morning and will arrive by 5 PM today. To compensate for the inconvenience and the failure to meet our overnight promise, I have completely waived your expedited shipping fee, so that will refund to your card. I have also issued a twenty percent store voucher to your email for your next order.\n\nCustomer (Morgan): Wow, okay. I appreciate you taking care of the refund without me having to ask. Thank you.\n\nAgent (Cally): It is absolutely our responsibility to make it right. Is there anything else I can check for you regarding this delivery, Morgan?\n\nCustomer (Morgan): No, that covers it. I'll watch for the delivery truck. \n\nAgent (Cally): Perfect. We appreciate your business at TephdyTech. Have a great day and goodbye!",
    questions: [
      { 
        id: 'q_l5_1', 
        type: 'multiple_choice', 
        question: 'Which of the following best categorizes the customer service strategy employed by the logistics representative in this scenario?', 
        options: [
          'Defensive deflection, wherein the representative blames the third-party courier service for the delay to avoid corporate accountability.', 
          'Proactive de-escalation through immediate financial restitution, combining a direct refund for failed services with an incentive for future business.', 
          'Aggressive upselling, where the agent uses the delay as leverage to force the customer into purchasing a more expensive hardware model.', 
          'Passive acknowledgment, offering only a verbal apology without any tangible resolution or financial compensation for the logistical failure.'
        ], 
        correctAnswer: 'Proactive de-escalation through immediate financial restitution, combining a direct refund for failed services with an incentive for future business.' 
      },
      { 
        id: 'q_l5_2', 
        type: 'multiple_choice', 
        question: 'What is the dual financial impact of the compensation offered to the customer?', 
        options: [
          'The customer is charged a penalty fee for complaining about the delay, while the company earns a twenty percent commission on the original order.', 
          'The customer receives a full cash refund for the entire hardware purchase, resulting in a total loss of revenue for the logistics department.', 
          'The customer is refunded for a service that was not fulfilled on time, while also receiving a discount that encourages continued brand loyalty and future spending.', 
          'The customer is forced to return the hardware immediately upon delivery in exchange for a meager twenty percent partial refund.'
        ], 
        correctAnswer: 'The customer is refunded for a service that was not fulfilled on time, while also receiving a discount that encourages continued brand loyalty and future spending.' 
      },
      { 
        id: 'q_l5_3', 
        type: 'multiple_choice', 
        question: 'Why is waiving the "expedited shipping fee" a highly appropriate targeted remedy for this specific complaint?', 
        options: [
          'It permanently eliminates shipping charges for all future orders placed by the customer, regardless of item size or weight.', 
          'It forces the courier company to pay a heavy corporate fine for failing to deliver the parcel on the scheduled calendar date.', 
          'It magically accelerates the physical transit of the hardware package through the postal network using high-speed transport.',
          'It directly refunds the exact monetary premium paid for a delivery speed standard that the company failed to successfully execute.'
        ], 
        correctAnswer: 'It directly refunds the exact monetary premium paid for a delivery speed standard that the company failed to successfully execute.' 
      },
      { 
        id: 'q_l5_4', 
        type: 'multiple_choice', 
        question: 'What business objective does issuing a "store voucher" accomplish beyond simply resolving the immediate shipping complaint?', 
        options: [
          'It acts as a customer retention tool that incentivizes the consumer to reinvest within the brand ecosystem rather than migrating to a competitor.', 
          'It creates an accounting liability that the corporation can write off as a tax deduction at the end of the fiscal year.', 
          'It forces the customer to spend more money immediately in order to activate the promotional discount code.', 
          'It legally releases the logistics company from any future obligation to deliver hardware items on time.'
        ], 
        correctAnswer: 'It acts as a customer retention tool that incentivizes the consumer to reinvest within the brand ecosystem rather than migrating to a competitor.' 
      },
      { 
        id: 'q_l5_5', 
        type: 'multiple_choice', 
        question: 'What tone does the representative establish in the opening sentence of the audio script?', 
        options: [
          'Dismissive, robotic, and bureaucratic, shifting all blame onto automated shipping algorithms.', 
          'Empathetic, accountable, and professional, immediately establishing an ownership mindset regarding the service failure.', 
          'Defensive, aggressive, and impatient, signaling to the customer that complaints are unwelcome.', 
          'Overly cheerful and casual, minimizing the severity of the hardware shipping delay.'
        ], 
        correctAnswer: 'Empathetic, accountable, and professional, immediately establishing an ownership mindset regarding the service failure.' 
      }
    ]
  },

  // --- TOPIC 6: SOFTWARE TROUBLESHOOTING & IT SUPPORT ---
  {
    id: 'list_6',
    title: 'Software Installation Error Troubleshooting',
    audioScript: "Agent (Cally): Thank you for reaching TephdyTech IT desk. This is Cally speaking. How can I assist you with your software today?\n\nCustomer (Sam): Hi Cally, I'm Sam. I'm trying to install the new architecture suite I just bought, but every single time it hits eighty percent, the window just closes and spits out an error code.\n\nAgent (Cally): I can definitely help with that, Sam. It is incredibly frustrating when an installation fails right at the finish line. Let's get this resolved. Because it is crashing exactly at eighty percent, it is likely a security permissions conflict. Please disable your third-party antivirus temporarily, restart the installer as an administrator, and let me know if the error code persists.\n\nCustomer (Sam): Okay, let me try that. Disabling the antivirus now... right-clicking, run as administrator. Oh, wow. It just shot past eighty percent and finished installing. Do I turn the antivirus back on now?\n\nAgent (Cally): Yes, please re-enable your antivirus immediately to keep your system protected. The installer just needed temporary system privileges to write those final registry files without being blocked.\n\nCustomer (Sam): That makes perfect sense. Thanks for the quick fix.\n\nAgent (Cally): You're very welcome! Is there any other software issue I can troubleshoot for you today?\n\nCustomer (Sam): Nope, I'm ready to get to work. Bye!\n\nAgent (Cally): Happy to hear it, Sam. Have a wonderful day and goodbye!",
    questions: [
      { 
        id: 'q_l6_1', 
        type: 'multiple_choice', 
        question: 'Based on the agent’s technical instructions, what is the most likely root cause of the installation failure at the eighty percent mark?', 
        options: [
          'The customer’s computer has experienced a catastrophic hardware failure, meaning the hard drive must be physically replaced before proceeding.', 
          'The software license key has expired, causing the installation wizard to artificially halt the process just before completion to demand payment.', 
          'An external security protocol or permissions conflict is blocking the software from writing critical files to the system directory during the final stages of setup.', 
          'The customer’s internet connection dropped precisely at the eighty percent mark, permanently corrupting the downloaded installation package.'
        ], 
        correctAnswer: 'An external security protocol or permissions conflict is blocking the software from writing critical files to the system directory during the final stages of setup.' 
      },
      { 
        id: 'q_l6_2', 
        type: 'multiple_choice', 
        question: 'Why does the representative instruct the user to "restart the installer as an administrator"?', 
        options: [
          'To grant the executable file the elevated system privileges required to bypass standard user restrictions and finalize core registry modifications.', 
          'To completely erase the computer’s operating system and install a brand new server environment tailored for administrative users.', 
          'To force the computer to reboot in Safe Mode so that the agent can remotely take control of the desktop environment.', 
          'To change the user’s main account password and lock out any other individuals who might be using the same local network.'
        ], 
        correctAnswer: 'To grant the executable file the elevated system privileges required to bypass standard user restrictions and finalize core registry modifications.' 
      },
      { 
        id: 'q_l6_3', 
        type: 'multiple_choice', 
        question: 'Why is disabling third-party antivirus software framed as a "temporary" troubleshooting step rather than a permanent solution?', 
        options: [
          'Antivirus programs automatically reactivate themselves every ten minutes regardless of user input.', 
          'The software being installed contains a harmless virus that the antivirus would detect and quarantine if left running.', 
          'Third-party antivirus applications are legally required to shut down during software updates.',
          'Leaving security software permanently disabled leaves the computer vulnerable to malware, so it must be reactivated immediately after installation concludes.'
        ], 
        correctAnswer: 'Leaving security software permanently disabled leaves the computer vulnerable to malware, so it must be reactivated immediately after installation concludes.' 
      },
      { 
        id: 'q_l6_4', 
        type: 'multiple_choice', 
        question: 'What troubleshooting methodology is the IT support representative systematically executing in this script?', 
        options: [
          'Executing a complete factory wipe of the operating system to clear out deep-seated registry corruptions.', 
          'Eliminating common environmental interference factors (security software and permission blocks) to isolate and resolve the installation bottleneck.', 
          'Guiding the customer through a complex manual coding process to rewrite the software’s installation script line by line.', 
          'Forcing the customer to purchase a vastly more expensive enterprise software tier to bypass installation bugs.'
        ], 
        correctAnswer: 'Eliminating common environmental interference factors (security software and permission blocks) to isolate and resolve the installation bottleneck.' 
      },
      { 
        id: 'q_l6_5', 
        type: 'multiple_choice', 
        question: 'What does the phrase "let me know if the error code persists" indicate about the agent’s diagnostic process?', 
        options: [
          'It proves that the agent has no idea how to fix the problem and is simply guessing random solutions.', 
          'It serves as a polite closing statement designed to terminate the call immediately without resolving the issue.', 
          'It establishes an iterative troubleshooting loop, confirming that the initial fix is a hypothesis requiring verification before escalating to advanced tiers.', 
          'It requires the customer to submit a written essay detailing the computer’s technical specifications.'
        ], 
        correctAnswer: 'It establishes an iterative troubleshooting loop, confirming that the initial fix is a hypothesis requiring verification before escalating to advanced tiers.' 
      }
    ]
  },

  // --- TOPIC 7: WARRANTIES, REPAIRS & REPLACEMENTS ---
  {
    id: 'list_7',
    title: 'Appliance Warranty Replacement Claim',
    audioScript: "Agent (Cally): Welcome to TephdyTech Appliances, Cally speaking. How can I help you with your home appliances today?\n\nCustomer (Jamie): Hi Cally, I'm Jamie. I bought a smart microwave from you guys six months ago, and yesterday it just stopped heating food. The screen works, but the food is ice cold.\n\nAgent (Cally): Oh, I am so sorry to hear that, Jamie! It is incredibly inconvenient when an appliance stops working out of nowhere. Let me check your serial number. Okay, I see it here. Since your smart microwave is still within its one-year manufacturer warranty, and the heating element failed through no fault of your own, we will just dispatch a brand-new replacement unit to your address by Friday.\n\nCustomer (Jamie): Oh, really? You don't need to send someone out to try and fix it first?\n\nAgent (Cally): No, for this specific heating element defect on a unit this new, it is much faster and safer to just issue a full replacement. You can dispose of the broken unit at your local recycling center.\n\nCustomer (Jamie): That is amazingly easy. Thank you so much.\n\nAgent (Cally): It's my pleasure, Jamie! We want our appliances working perfectly for you. Is there anything else I can help you with today?\n\nCustomer (Jamie): That's it. Have a great day!\n\nAgent (Cally): You too, Jamie. Thanks for calling TephdyTech. Goodbye!",
    questions: [
      { 
        id: 'q_l7_1', 
        type: 'multiple_choice', 
        question: 'What are the two critical conditional factors that allowed the representative to authorize a full replacement unit?', 
        options: [
          'The customer purchased an extended third-party insurance policy, and agreed to pay a high deductible fee to expedite the shipping process.', 
          'The microwave is an outdated model that the company is trying to liquidate, and the customer threatened to leave a negative review online.', 
          'The customer proved that the microwave arrived shattered in the original packaging, and the delivery driver admitted fault at the time of drop-off.',
          'The appliance is currently inside the active warranty period, and the malfunction was caused by an internal hardware defect rather than user negligence or accidental damage.'
        ], 
        correctAnswer: 'The appliance is currently inside the active warranty period, and the malfunction was caused by an internal hardware defect rather than user negligence or accidental damage.' 
      },
      { 
        id: 'q_l7_2', 
        type: 'multiple_choice', 
        question: 'What is the implied consequence if the failure had been deemed the "fault of your own" (e.g., physical damage by the user)?', 
        options: [
          'The company would still be legally mandated to provide a free replacement, but they would delay the shipment by several weeks as a penalty.', 
          'The standard manufacturer warranty would be voided for that specific incident, requiring the customer to pay out-of-pocket for repairs or a replacement.', 
          'The representative would be forced to escalate the call to local law enforcement to investigate the customer for insurance fraud.', 
          'The customer would be permanently banned from purchasing any future appliances from the brand’s online marketplace.'
        ], 
        correctAnswer: 'The standard manufacturer warranty would be voided for that specific incident, requiring the customer to pay out-of-pocket for repairs or a replacement.' 
      },
      { 
        id: 'q_l7_3', 
        type: 'multiple_choice', 
        question: 'Why is the specific mention of the "heating element failing" relevant to warranty adjudication?', 
        options: [
          'It identifies a core internal component failure that falls squarely under standard manufacturing defect protections.', 
          'It proves that the customer was using the microwave incorrectly to cook unauthorized chemical substances.', 
          'It releases the company from liability because heating elements are explicitly excluded from warranty terms.', 
          'It requires the customer to dismantle the appliance and mail the broken part back to the factory.'
        ], 
        correctAnswer: 'It identifies a core internal component failure that falls squarely under standard manufacturing defect protections.' 
      },
      { 
        id: 'q_l7_4', 
        type: 'multiple_choice', 
        question: 'What operational standard does dispatching a replacement unit "by Friday" uphold?', 
        options: [
          'A strict corporate policy against issuing refunds under any circumstances.', 
          'An automated logistical schedule that ignores customer delivery preferences entirely.', 
          'Fast and efficient turnaround times for warranty claims, minimizing customer inconvenience caused by appliance downtime.', 
          'A legal requirement to replace all broken appliances within twenty-four hours.'
        ], 
        correctAnswer: 'Fast and efficient turnaround times for warranty claims, minimizing customer inconvenience caused by appliance downtime.' 
      },
      { 
        id: 'q_l7_5', 
        type: 'multiple_choice', 
        question: 'What underlying trust-building objective is achieved during this warranty interaction?', 
        options: [
          'Convincing the customer to purchase an expensive extended warranty protection plan for future appliances.', 
          'Shifting the financial burden of manufacturing defects onto third-party insurance providers.', 
          'Discouraging the customer from ever purchasing brand-name appliances again.',
          'Demonstrating corporate integrity by honoring warranty commitments without forcing the customer through burdensome bureaucratic hurdles.'
        ], 
        correctAnswer: 'Demonstrating corporate integrity by honoring warranty commitments without forcing the customer through burdensome bureaucratic hurdles.' 
      }
    ]
  },

  // --- TOPIC 8: FINANCIAL SECURITY & FRAUD PREVENTION ---
  {
    id: 'list_8',
    title: 'Credit Card Fraud Alert Verification',
    audioScript: "Agent (Cally): Thank you for calling TephdyTech financial security. This is Cally. I see you are calling about an automated fraud alert on your account?\n\nCustomer (Casey): Yes, hi Cally. I'm Casey. My card was just declined at the grocery store, and I got a text message about some weird charge. What is going on?\n\nAgent (Cally): I know it is stressful to have a card declined at checkout, Casey, but I am glad you called immediately so we can secure your funds. We proactively blocked a suspicious transaction of two hundred dollars originating from a foreign IP address earlier today. To protect you, I have completely frozen your current card to prevent further charges, and I will issue a new card to your home address immediately.\n\nCustomer (Casey): Oh wow, a foreign IP? No, I definitely did not make a two-hundred-dollar purchase today. Am I going to lose that money?\n\nAgent (Cally): Absolutely not. Because our security system caught the anomaly and blocked it, no money actually left your account. You are completely secure.\n\nCustomer (Casey): That is such a relief. When will the new card arrive?\n\nAgent (Cally): It has been expedited and will arrive in 24 to 48 hours. Is there anything else I can clarify regarding this security block today, Casey?\n\nCustomer (Casey): No, you explained it perfectly. Thanks for keeping my account safe.\n\nAgent (Cally): It is our top priority. Have a secure and wonderful day. Goodbye!",
    questions: [
      { 
        id: 'q_l8_1', 
        type: 'multiple_choice', 
        question: 'Why did the financial security system preemptively block the $200 transaction rather than allowing it to process?', 
        options: [
          'The customer’s bank account was completely overdrawn, and the automated system lacked the required funds to approve the purchase.', 
          'The transaction triggered geographic anomaly alerts by originating from a foreign IP address, suggesting the card details were compromised by an overseas entity.', 
          'The transaction exceeded the customer’s daily spending limit of fifty dollars, forcing the security team to intervene and freeze the credit line.', 
          'The foreign merchant was manually blacklisted by the government, rendering all transactions to that specific country illegal under international law.'
        ], 
        correctAnswer: 'The transaction triggered geographic anomaly alerts by originating from a foreign IP address, suggesting the card details were compromised by an overseas entity.' 
      },
      { 
        id: 'q_l8_2', 
        type: 'multiple_choice', 
        question: 'By freezing the current card and issuing a new one, what operational security protocol is the representative enforcing?', 
        options: [
          'Punishing the customer for traveling internationally without notifying the bank by severely restricting their access to liquid capital.', 
          'Initiating a lengthy legal investigation that requires the customer to remain entirely without financial resources for several consecutive weeks.', 
          'Terminating the compromised primary account number (PAN) to halt ongoing fraudulent activity while rapidly restoring the customer’s purchasing ability via new credentials.', 
          'Transferring the customer’s debt to a third-party collection agency because the fraudulent charge was ultimately deemed their personal responsibility.'
        ], 
        correctAnswer: 'Terminating the compromised primary account number (PAN) to halt ongoing fraudulent activity while rapidly restoring the customer’s purchasing ability via new credentials.' 
      },
      { 
        id: 'q_l8_3', 
        type: 'multiple_choice', 
        question: 'What specific indicator flagged the transaction as "suspicious" to the automated security algorithms?', 
        options: [
          'The unusually small amount of two hundred dollars compared to the customer’s typical multi-thousand dollar purchases.', 
          'The time of day the transaction occurred, which fell outside standard banking operating hours.', 
          'The fact that the merchant was a registered domestic retailer operating within the customer’s home city.',
          'The geographic disconnect between the cardholder’s normal spending habits and the foreign IP address originating the charge.'
        ], 
        correctAnswer: 'The geographic disconnect between the cardholder’s normal spending habits and the foreign IP address originating the charge.' 
      },
      { 
        id: 'q_l8_4', 
        type: 'multiple_choice', 
        question: 'Why is immediate card freezing a necessary defensive measure in digital financial fraud management?', 
        options: [
          'Fraudulent actors often execute rapid automated micro-transactions or massive drain attempts once card details are acquired, making speed essential to limit financial exposure.', 
          'Banks are legally mandated to freeze accounts whenever a customer makes an online purchase outside their home zip code.', 
          'Freezing cards prevents the customer from accidentally spending more money than they currently possess in their checking account.', 
          'It forces the customer to visit a physical bank branch to verify their identity before they are allowed to purchase groceries.'
        ], 
        correctAnswer: 'Fraudulent actors often execute rapid automated micro-transactions or massive drain attempts once card details are acquired, making speed essential to limit financial exposure.' 
      },
      { 
        id: 'q_l8_5', 
        type: 'multiple_choice', 
        question: 'How does this fraud prevention interaction ultimately impact customer trust in the financial institution?', 
        options: [
          'It erodes trust by inconveniencing the customer and forcing them to wait for a replacement plastic card to arrive in the mail.', 
          'It reinforces confidence by demonstrating that proactive protective monitoring systems are actively guarding the consumer’s assets against malicious actors.', 
          'It causes panic by making the customer believe their entire bank account has been permanently wiped out by hackers.', 
          'It has no impact on trust, as customers view automated security blocks as an annoying nuisance rather than a safety feature.'
        ], 
        correctAnswer: 'It reinforces confidence by demonstrating that proactive protective monitoring systems are actively guarding the consumer’s assets against malicious actors.' 
      }
    ]
  },

  // --- TOPIC 9: HOSPITALITY & TRAVEL MANAGEMENT ---
  {
    id: 'list_9',
    title: 'Hotel Reservation Modification Request',
    audioScript: "Agent (Cally): Welcome to TephdyTech Hospitality, my name is Cally. Do you have a confirmation number for your upcoming stay?\n\nCustomer (Riley): Hi Cally, I'm Riley. My confirmation is H-3882. I'm calling because I booked a standard room, but it's our tenth anniversary, and I was wondering if we could possibly upgrade to something nicer with a view?\n\nAgent (Cally): Happy early anniversary, Riley! That is a wonderful milestone, and we would love to help you celebrate. Let me review our inventory for your dates. Great news! I have successfully upgraded your standard room to a deluxe ocean-view suite for your upcoming anniversary trip. The additional fifty-dollar nightly rate has been charged to your card on file, so you don't need to do a thing.\n\nCustomer (Riley): Oh, that is perfect! Fifty dollars a night is totally worth it for the ocean view. Thank you!\n\nAgent (Cally): It really is a beautiful suite, and I've also put a note in for the concierge to send up a complimentary bottle of champagne when you arrive.\n\nCustomer (Riley): Wow, you guys are amazing. I can't wait.\n\nAgent (Cally): We are looking forward to hosting you! Is there anything else I can add to your reservation today, Riley?\n\nCustomer (Riley): No, you've done plenty. Thanks so much.\n\nAgent (Cally): It's my pleasure. Safe travels, and goodbye!",
    questions: [
      { 
        id: 'q_l9_1', 
        type: 'multiple_choice', 
        question: 'Which statement accurately describes the financial arrangement of the room upgrade processed by the agent?', 
        options: [
          'The guest is receiving a complimentary room upgrade in celebration of their anniversary, completely free of any hidden administrative surcharges.', 
          'The guest is being penalized with a fifty-dollar flat fee because they requested a last-minute modification to an otherwise non-refundable booking.', 
          'The guest is receiving a premium accommodation upgrade, but must incur a recurring ancillary charge of fifty dollars for each night of their stay.', 
          'The guest is required to pay a one-time fifty-dollar deposit that will be fully refunded upon checkout assuming no damage occurs to the suite.'
        ], 
        correctAnswer: 'The guest is receiving a premium accommodation upgrade, but must incur a recurring ancillary charge of fifty dollars for each night of their stay.' 
      },
      { 
        id: 'q_l9_2', 
        type: 'multiple_choice', 
        question: 'From a hospitality management perspective, how did the agent streamline the transaction for the guest?', 
        options: [
          'By utilizing the pre-authorized payment method already attached to the reservation profile, thereby eliminating the need for the guest to provide new billing details verbally.', 
          'By overriding the hotel’s standard pricing algorithm and manually discounting the ocean-view suite to match the price of a standard room.', 
          'By transferring the reservation to a completely different hotel property that offered cheaper rates for anniversary celebrations.', 
          'By demanding that the guest wire the funds immediately through a third-party application to secure the upgraded accommodation.'
        ], 
        correctAnswer: 'By utilizing the pre-authorized payment method already attached to the reservation profile, thereby eliminating the need for the guest to provide new billing details verbally.' 
      },
      { 
        id: 'q_l9_3', 
        type: 'multiple_choice', 
        question: 'What emotional hook does the representative acknowledge by mentioning the "anniversary trip"?', 
        options: [
          'A mandatory corporate policy requiring guests to declare their marital status upon check-in for tax reporting purposes.', 
          'An excuse to offer a massive, unauthorized discount on luxury room upgrades without managerial approval.', 
          'A legal requirement to report special occasions to local tourism boards for statistical analysis.',
          'Milestone personal celebrations, allowing the agent to tailor the hospitality experience to be more memorable and emotionally resonant.'
        ], 
        correctAnswer: 'Milestone personal celebrations, allowing the agent to tailor the hospitality experience to be more memorable and emotionally resonant.' 
      },
      { 
        id: 'q_l9_4', 
        type: 'multiple_choice', 
        question: 'What is the operational distinction between a "standard room" and a "deluxe ocean-view suite" in inventory management?', 
        options: [
          'Suites are temporary pop-up rooms constructed in hotel hallways during peak holiday seasons to accommodate overflow guests.', 
          'Suites command higher nightly yields and possess superior environmental amenities, representing premium tier inventory within the hotel’s asset structure.', 
          'Standard rooms and suites are priced identically, but suites are restricted exclusively to corporate business travelers.', 
          'Standard rooms feature ocean views, whereas suites are windowless interior spaces located in the basement level.'
        ], 
        correctAnswer: 'Suites command higher nightly yields and possess superior environmental amenities, representing premium tier inventory within the hotel’s asset structure.' 
      },
      { 
        id: 'q_l9_5', 
        type: 'multiple_choice', 
        question: 'Why is securing payment via the "card on file" a critical security and compliance practice in call center environments?', 
        options: [
          'It allows agents to charge customer credit cards unlimited amounts of money without obtaining verbal consent.', 
          'It guarantees that the credit card will never be declined, even if the customer’s bank account is completely empty.', 
          'It prevents agents from verbally hearing, typing, or storing sensitive primary account numbers (PAN), maintaining strict PCI-DSS compliance and data privacy.', 
          'It eliminates the need for hotels to verify guest identification upon physical arrival at the front desk.'
        ], 
        correctAnswer: 'It prevents agents from verbally hearing, typing, or storing sensitive primary account numbers (PAN), maintaining strict PCI-DSS compliance and data privacy.' 
      }
    ]
  },

  // --- TOPIC 10: AVIATION, TRAVEL DISRUPTIONS & FORCE MAJEURE ---
  {
    id: 'list_10',
    title: 'Airline Flight Cancellation and Rebooking',
    audioScript: "Agent (Cally): Thank you for calling TephdyTech Airlines. This is Cally. I see you are calling from the airport regarding flight 402?\n\nCustomer (Avery): Yes, Cally, I'm Avery. I'm standing at the gate right now and the board just changed to canceled! What am I supposed to do? I have to get to Manila.\n\nAgent (Cally): Oh, Avery, I know how incredibly exhausting and stressful it is to have your travel plans completely derailed at the last minute. Let me pull up your itinerary. Unfortunately, your evening flight to Manila has indeed been grounded due to severe thunderstorms crossing the flight path. It is entirely a safety protocol.\n\nCustomer (Avery): Weather? Seriously? So am I just sleeping on the floor of the terminal tonight?\n\nAgent (Cally): Absolutely not. I have already rebooked you on the earliest morning departure tomorrow at 6:00 AM, and because of the severe delay, I have secured a complimentary airport hotel voucher for you for tonight. The voucher has been sent to your email.\n\nCustomer (Avery): A hotel voucher? Okay, wow. That actually takes a lot of the sting out of this. I just check my email for the details?\n\nAgent (Cally): Yes, the email contains the hotel name and the shuttle instructions. You will have a real bed to sleep in tonight. Is there anything else I can clarify about your new itinerary before you head to the hotel?\n\nCustomer (Avery): No, I have the email open right now. Thank you so much for fixing this.\n\nAgent (Cally): My pleasure, Avery. Get some rest, and have a safe flight tomorrow morning. Goodbye!",
    questions: [
      { 
        id: 'q_l10_1', 
        type: 'multiple_choice', 
        question: 'How is the airline representative mitigating the passenger’s immediate logistical burden caused by the weather cancellation?', 
        options: [
          'By offering a full monetary refund so the passenger can independently book a completely different airline without relying on corporate support.', 
          'By upgrading the passenger to a first-class seat on a later flight to apologize for the mechanical failure that grounded the original aircraft.', 
          'By advising the passenger to sleep in the airport terminal, as weather-related delays legally absolve the airline of providing any hospitality services.',
          'By proactively securing alternative travel arrangements for the next day while absorbing the financial cost of overnight accommodations for the stranded passenger.'
        ], 
        correctAnswer: 'By proactively securing alternative travel arrangements for the next day while absorbing the financial cost of overnight accommodations for the stranded passenger.' 
      },
      { 
        id: 'q_l10_2', 
        type: 'multiple_choice', 
        question: 'What does the term "grounded" imply in the context of this specific aviation scenario?', 
        options: [
          'The flight crew has abandoned the aircraft due to a sudden labor strike, leaving the airline with no personnel to operate the vehicle.', 
          'The aircraft is strictly prohibited from taking off due to unsafe atmospheric conditions, prioritizing passenger safety over schedule adherence.', 
          'The airplane has suffered catastrophic engine failure on the tarmac and must be dismantled for scrap metal immediately.', 
          'The destination airport has permanently closed its runways to all commercial traffic due to an ongoing geopolitical crisis.'
        ], 
        correctAnswer: 'The aircraft is strictly prohibited from taking off due to unsafe atmospheric conditions, prioritizing passenger safety over schedule adherence.' 
      },
      { 
        id: 'q_l10_3', 
        type: 'multiple_choice', 
        question: 'Why are severe thunderstorms classified as an uncontrollable variable (force majeure) in airline scheduling?', 
        options: [
          'Airlines intentionally manufacture artificial storms to justify canceling unprofitable flights and saving on fuel costs.', 
          'Municipal governments prohibit commercial airplanes from flying whenever it rains or snows within a fifty-mile radius.', 
          'Atmospheric weather phenomena occur naturally and present immediate, life-threatening dangers to flight safety that human operational protocols cannot override.', 
          'Pilots legally possess the right to refuse to work whenever they observe dark clouds forming on the horizon.'
        ], 
        correctAnswer: 'Atmospheric weather phenomena occur naturally and present immediate, life-threatening dangers to flight safety that human operational protocols cannot override.' 
      },
      { 
        id: 'q_l10_4', 
        type: 'multiple_choice', 
        question: 'What customer service excellence standard is demonstrated by providing a "complimentary airport hotel voucher"?', 
        options: [
          'Taking complete operational responsibility for traveler welfare during external disruptions, turning a frustrating experience into a managed, supportive solution.', 
          'Covering up airline scheduling mistakes by falsely blaming weather conditions for mechanical maintenance failures.', 
          'Bribing stranded passengers with free lodging to prevent them from filing formal safety complaints with aviation regulators.', 
          'Forcing passengers to pay for their own hotel rooms and promising to mail a reimbursement check several months later.'
        ], 
        correctAnswer: 'Taking complete operational responsibility for traveler welfare during external disruptions, turning a frustrating experience into a managed, supportive solution.' 
      },
      { 
        id: 'q_l10_5', 
        type: 'multiple_choice', 
        question: 'What can be inferred about the agent’s systematic approach to rebooking the passenger on the "earliest morning departure"?', 
        options: [
          'The agent is purposefully placing the passenger on an overcrowded, undesirable flight to punish them for complaining about the weather delay.', 
          'The agent lacks access to flight scheduling tools and is blindly assigning random departure times without checking seat availability.', 
          'The agent is booking the passenger on a competitor airline because TephdyTech Airlines has completely run out of functional airplanes.',
          'The agent is prioritizing schedule recovery, inserting the displaced passenger into the first available inventory slot to minimize total transit delays.'
        ], 
        correctAnswer: 'The agent is prioritizing schedule recovery, inserting the displaced passenger into the first available inventory slot to minimize total transit delays.' 
      }
    ]
  }
];

// 50 TRULY UNIQUE HANDCRAFTED READING PASSAGES & QUESTIONS POOL
const FALLBACK_READING_QUESTIONS: TestData[] = [
  {
    id: 'read_1',
    title: 'First-Contact Resolution and Operational Benchmarks',
    passage: `In modern business process outsourcing (BPO) environments, first-contact resolution (FCR) is widely regarded as the paramount benchmark of operational excellence and customer satisfaction. When customer support agents successfully resolve a client's inquiry or technical malfunction during the initial interaction, operational overhead costs decrease significantly while client loyalty metrics rise proportionally. Achieving high FCR requires comprehensive initial training programs, intuitive knowledge base access, and empowered decision-making authority at the frontline agent level without unnecessary supervisory escalation bottlenecks.\n\nHowever, speed must never compromise absolute accuracy. Representatives must carefully balance strict average handle-time (AHT) constraints with thorough account verification protocols and comprehensive root-cause troubleshooting. Rushing through complex technical support issues often leads to repeat contacts, which frustratingly increases queue congestion, degrades overall service quality scores, and damages long-term brand equity across competitive markets.\n\nConsequently, management teams must calibrate performance metrics carefully to reward quality, precision, and thoroughness over mere transactional velocity. By fostering a culture that prioritizes first-time resolution over rushed call termination, organizations build resilient customer relationships, reduce repeat contact rates, and optimize overall operational profitability in an increasingly competitive industry landscape.`,
    questions: [
      { id: 'rq_1_1', type: 'multiple_choice', question: 'According to the passage, what is the primary organizational benefit of achieving high first-contact resolution (FCR)?', options: ['Agent shift durations are automatically extended to accommodate increased call volumes.', 'Operational overhead costs decrease significantly while client loyalty metrics rise proportionally.', 'The need for comprehensive initial training programs is entirely eliminated.', 'Supervisory staff members are permanently replaced by automated conversational bots.'], correctAnswer: 'Operational overhead costs decrease significantly while client loyalty metrics rise proportionally.' },
      { id: 'rq_1_2', type: 'multiple_choice', question: 'What specific organizational elements are required to successfully achieve high FCR rates?', options: ['Strict script compliance and mandatory supervisory approval for every single customer request.', 'Restricting customer access to digital self-service channels exclusively.', 'Comprehensive initial training programs, intuitive knowledge base access, and empowered decision-making authority at the frontline level.', 'Eliminating all account verification protocols to ensure conversations conclude within seconds.'], correctAnswer: 'Comprehensive initial training programs, intuitive knowledge base access, and empowered decision-making authority at the frontline level.' },
      { id: 'rq_1_3', type: 'multiple_choice', question: 'Why does rushing through complex technical support issues ultimately harm the business?', options: ['It leads to repeat contacts, which frustrates customers, increases queue congestion, and degrades service quality scores.', 'It guarantees that the agent will receive an immediate promotion to executive management.', 'It permanently reduces the company’s monthly utility and internet bandwidth bills.', 'It forces regulatory compliance auditors to issue heavy financial penalties.'], correctAnswer: 'It leads to repeat contacts, which frustrates customers, increases queue congestion, and degrades service quality scores.' },
      { id: 'rq_1_4', type: 'multiple_choice', question: 'How should management teams calibrate performance metrics according to the passage?', options: ['To penalize agents who spend more than sixty seconds on any given call.', 'To reward quality and precision over mere transactional velocity.', 'To prioritize speed above all else, regardless of accuracy or repeat contacts.', 'To eliminate performance tracking entirely in favor of self-regulated evaluation.'], correctAnswer: 'To reward quality and precision over mere transactional velocity.' },
      { id: 'rq_1_5', type: 'multiple_choice', question: 'What tension exists between operating speed and service quality in BPO environments?', options: ['Speed and accuracy are completely identical concepts with no operational trade-offs.', 'Thorough account verification always accelerates the call resolution process by eliminating conversation.', 'Speed must never compromise absolute accuracy, requiring agents to balance handle-time constraints with thorough account verification.', 'Handle-time constraints are legally prohibited by international privacy regulations.'], correctAnswer: 'Speed must never compromise absolute accuracy, requiring agents to balance handle-time constraints with thorough account verification.' }
    ]
  },
  {
    id: 'read_2',
    title: 'De-escalation Techniques for Irate Callers',
    passage: `Handling irate or emotionally distressed customers is one of the most demanding responsibilities for customer service representatives in high-volume call centers. When a caller demands immediate supervisor intervention due to persistent billing errors, unexpected account freezes, or prolonged service outages, agents must rely on structured de-escalation methodologies rather than defensive reactions. The foundational step involves active, uninterrupted acknowledgment, allowing the customer to articulate their frustration and vent their grievances fully without interruption.\n\nOnce the peak emotional intensity subsides, representatives should transition to calm, measured phrasing, validate the specific inconvenience experienced, and take complete ownership of problem resolution. Arguing with a client, shifting blame to third-party partners, or hiding behind rigid, unyielding company policies invariably escalates tensions further and destroys brand trust. Effective de-escalation transforms adversarial friction into collaborative problem-solving.\n\nMastering these emotional de-escalation skills requires emotional intelligence, patience, and professional resilience. Agents who maintain composure under pressure prevent minor service disputes from turning into permanent customer churn, thereby safeguarding the company's long-term retention goals and public reputation.`,
    questions: [
      { id: 'rq_2_1', type: 'multiple_choice', question: 'What is the foundational step an agent should take when dealing with an irate customer?', options: ['Active, uninterrupted acknowledgment, allowing the customer to vent grievances fully.', 'Transferring the call to a senior executive without warning.', 'Explaining why company policies cannot be modified under any circumstances.', 'Placing the caller on indefinite hold to reduce queue metrics.'], correctAnswer: 'Active, uninterrupted acknowledgment, allowing the customer to vent grievances fully.' },
      { id: 'rq_2_2', type: 'multiple_choice', question: 'What behavior will invariably escalate tensions further during a customer dispute?', options: ['Taking complete ownership of the problem resolution process.', 'Validating the specific inconvenience experienced by the caller.', 'Arguing with a client, shifting blame, or hiding behind rigid company policies.', 'Using calm, measured phrasing and offering realistic timelines.'], correctAnswer: 'Arguing with a client, shifting blame, or hiding behind rigid company policies.' },
      { id: 'rq_2_3', type: 'multiple_choice', question: 'When should an agent transition to problem-solving language during an irate call?', options: ['Immediately before hanging up on the customer.', 'Once the peak emotional intensity subsides.', 'Before the customer has finished explaining their initial problem.', 'Only after a supervisor forces them to take over the interaction.'], correctAnswer: 'Once the peak emotional intensity subsides.' },
      { id: 'rq_2_4', type: 'multiple_choice', question: 'What is the ultimate goal of structured de-escalation techniques?', options: ['To punish the customer for using aggressive language.', 'To reduce the total number of incoming calls handled per shift.', 'To transform adversarial friction into collaborative problem-solving.', 'To ensure the customer is permanently banned from calling back.'], correctAnswer: 'To transform adversarial friction into collaborative problem-solving.' },
      { id: 'rq_2_5', type: 'multiple_choice', question: 'Why is taking ownership of problem resolution emphasized during difficult calls?', options: ['It reassures the client and prevents further erosion of brand trust.', 'It forces the agent to pay financial restitutions out of their own salary.', 'It legally binds the company to provide free services for life.', 'It eliminates the requirement to document the interaction in the CRM.'], correctAnswer: 'It reassures the client and prevents further erosion of brand trust.' }
    ]
  },
  {
    id: 'read_3',
    title: 'Remote Work Cybersecurity and PII Protection',
    passage: `The rapid transition toward remote work models in the global outsourcing industry has introduced unique, complex challenges regarding cybersecurity, network security, and confidential data protection. Customer service representatives operating outside traditional office facilities frequently handle sensitive personally identifiable information (PII), confidential credit card numbers, proprietary corporate data, and protected healthcare records. Consequently, strict, uncompromising compliance with global privacy regulations such as the General Data Protection Regulation (GDPR) and the Health Insurance Portability and Accountability Act (HIPAA) is completely non-negotiable across all operational tiers.\n\nTo mitigate severe data breach risks, remote agents must utilize encrypted Virtual Private Networks (VPNs), mandatory multi-factor authentication (MFA) protocols, and secure, isolated clean-desk environments. Furthermore, unauthorized recording devices, personal smartphones near workstations, and unencrypted messaging channels are strictly prohibited. Violating these security controls compromises corporate integrity and exposes organizations to catastrophic regulatory penalties.\n\nMaintaining rigorous digital hygiene in home offices requires ongoing employee vigilance and technological enforcement. By adhering strictly to encrypted channels and clean-desk mandates, remote teams ensure that sensitive client data remains impenetrable to malicious cyber actors.`,
    questions: [
      { id: 'rq_3_1', type: 'multiple_choice', question: 'What type of sensitive data do customer service representatives frequently handle in modern workflows?', options: ['Public marketing brochures and press releases.', 'Personally identifiable information (PII), financial records, and healthcare data.', 'Internal software source code repositories.', 'Company cafeteria menus and holiday schedules.'], correctAnswer: 'Personally identifiable information (PII), financial records, and healthcare data.' },
      { id: 'rq_3_2', type: 'multiple_choice', question: 'Which regulatory frameworks are explicitly cited as non-negotiable compliance standards?', options: ['GDPR and HIPAA.', 'OSHA and local municipal zoning codes.', 'ISO 9001 and local building safety ordinances.', 'FCC telemarketing broadcast guidelines.'], correctAnswer: 'GDPR and HIPAA.' },
      { id: 'rq_3_3', type: 'multiple_choice', question: 'Which security tools are mandatory for remote agents to mitigate data breach risks?', options: ['Public unsecured Wi-Fi hotspots and shared family computers.', 'Personal unencrypted USB flash drives.', 'Encrypted VPNs and multi-factor authentication (MFA) protocols.', 'Open-source peer-to-peer file sharing applications.'], correctAnswer: 'Encrypted VPNs and multi-factor authentication (MFA) protocols.' },
      { id: 'rq_3_4', type: 'multiple_choice', question: 'What specific restriction is placed on personal electronic devices at remote workstations?', options: ['Unauthorized recording devices and smartphones near workstations are strictly prohibited.', 'Agents are required to stream their personal social media feeds during shifts.', 'Employees must use personal tablets for customer database queries.', 'All personal laptops must be connected directly to the corporate mainframe.'], correctAnswer: 'Unauthorized recording devices and smartphones near workstations are strictly prohibited.' },
      { id: 'rq_3_5', type: 'multiple_choice', question: 'What is the consequence of violating established remote cybersecurity controls?', options: ['Instantaneous promotion to senior security auditor.', 'Catastrophic regulatory penalties and compromised corporate integrity.', 'Temporary suspension of monthly internet utility bills.', 'Automatic waiver of customer privacy rights.'], correctAnswer: 'Catastrophic regulatory penalties and compromised corporate integrity.' }
    ]
  },
  {
    id: 'read_4',
    title: 'Omnichannel CX Integration and CRM Synchronization',
    passage: `Modern consumers expect seamless, continuous interactions across multiple communication channels, including inbound voice calls, live web chat widgets, support email threads, and official social media messaging platforms. Omnichannel customer experience (CX) integration ensures that a customer's historical inquiry data travels with them fluidly, regardless of whether they transition from an automated self-service chatbot to a live human representative midway through their issue resolution journey.\n\nMaintaining absolute consistency across these diverse digital platforms requires robust, centralized CRM databases and unified ticketing systems. If an agent lacks real-time visibility into a customer's prior email correspondence or chat history, the client is repeatedly forced to restate their problem from scratch. This friction degrades customer satisfaction scores, inflates handling times, and drives unnecessary customer churn across competitive markets.\n\nDeploying an integrated omnichannel framework transforms disparate customer touchpoints into a unified ecosystem. This strategic alignment empowers support teams to deliver contextual, personalized assistance while eliminating operational inefficiencies.`,
    questions: [
      { id: 'rq_4_1', type: 'multiple_choice', question: 'What does omnichannel CX integration primarily ensure for the end consumer?', options: ['Their interaction history travels with them fluidly across different communication channels.', 'They are permanently restricted from interacting with human representatives.', 'All voice calls are automatically converted into public social media posts.', 'They never have to authenticate their account credentials.'], correctAnswer: 'Their interaction history travels with them fluidly across different communication channels.' },
      { id: 'rq_4_2', type: 'multiple_choice', question: 'What technological infrastructure is required to maintain consistency across diverse platforms?', options: ['Decoupled spreadsheets managed manually by individual agents.', 'Centralized CRM databases and unified ticketing systems.', 'Isolated local hard drives on each agent workstation.', 'Publicly accessible cloud storage folders.'], correctAnswer: 'Centralized CRM databases and unified ticketing systems.' },
      { id: 'rq_4_3', type: 'multiple_choice', question: 'What negative outcome occurs when an agent lacks visibility into prior customer correspondence?', options: ['Customer satisfaction scores increase dramatically.', 'Resolution speeds double across all support queues.', 'The client is forced to restate their problem from scratch, causing frustration.', 'Billing discrepancies resolve themselves automatically.'], correctAnswer: 'The client is forced to restate their problem from scratch, causing frustration.' },
      { id: 'rq_4_4', type: 'multiple_choice', question: 'Which communication channels are typically integrated into an omnichannel ecosystem?', options: ['Inbound voice calls, live web chat, support emails, and social media messaging.', 'Postal mail letters and physical fax transmissions only.', 'Internal memo broadcasting and bulletin boards.', 'Radio frequency broadcasts and television commercials.'], correctAnswer: 'Inbound voice calls, live web chat, support emails, and social media messaging.' },
      { id: 'rq_4_5', type: 'multiple_choice', question: 'How does poor channel integration impact business longevity?', options: ['It drives unnecessary customer churn across competitive markets.', 'It eliminates all operational overhead and staffing costs.', 'It guarantees long-term customer loyalty and brand exclusivity.', 'It reduces database synchronization errors to absolute zero.'], correctAnswer: 'It drives unnecessary customer churn across competitive markets.' }
    ]
  },
  {
    id: 'read_5',
    title: 'Mitigating Agent Burnout in High-Volume Call Centers',
    passage: `High-volume customer support environments place significant psychological, emotional, and cognitive demands on frontline agents, frequently leading to professional burnout, emotional exhaustion, and elevated employee turnover rates. Dealing with repetitive inquiries, verbally abusive callers, and rigid, unforgiving performance monitoring metrics can drain an agent's emotional reserves over time. Consequently, proactive wellness initiatives, ergonomic workstations, and supportive, empathetic leadership are absolute prerequisites for long-term workforce stability and operational continuity.\n\nProgressive outsourcing organizations incorporate structured mental health breaks, peer support circles, flexible scheduling options, and continuous coaching workshops to support agent well-being and floor morale. When companies actively invest in employee mental health, absenteeism drops, first-contact resolution metrics improve, and overall service delivery quality stabilizes across all accounts.\n\nAddressing burnout is not merely a human resources concern but a core operational strategy. Sustainable workforce management ensures that agents remain engaged, empathetic, and productive throughout their demanding shifts.`,
    questions: [
      { id: 'rq_5_1', type: 'multiple_choice', question: 'What are the primary consequences of psychological demands in high-volume support roles?', options: ['Instantaneous promotions to executive management tiers.', 'Professional burnout, emotional exhaustion, and elevated turnover rates.', 'Complete elimination of all customer complaints.', 'Exceeding average handle time benchmarks without effort.'], correctAnswer: 'Professional burnout, emotional exhaustion, and elevated turnover rates.' },
      { id: 'rq_5_2', type: 'multiple_choice', question: 'Which factors contribute to draining an agent\'s emotional reserves over time?', options: ['Repetitive inquiries, abusive callers, and rigid performance monitoring metrics.', 'Excessive vacation time and flexible remote work schedules.', 'Comprehensive training and supportive leadership mentorship.', 'Collaborative team-building exercises and wellness workshops.'], correctAnswer: 'Repetitive inquiries, abusive callers, and rigid performance monitoring metrics.' },
      { id: 'rq_5_3', type: 'multiple_choice', question: 'Which initiatives do progressive organizations incorporate to support agent well-being?', options: ['Extending shift lengths indefinitely without rest intervals.', 'Structured mental health breaks, peer support circles, and flexible scheduling.', 'Eliminating all communication channels between staff members.', 'Increasing financial penalties for minor documentation errors.'], correctAnswer: 'Structured mental health breaks, peer support circles, and flexible scheduling.' },
      { id: 'rq_5_4', type: 'multiple_choice', question: 'Why are proactive wellness initiatives considered prerequisites for workforce stability?', options: ['They prevent agent burnout and maintain operational continuity.', 'They legally obligate employees to work double shifts.', 'They replace the need for customer service software entirely.', 'They guarantee that no customer will ever be placed on hold.'], correctAnswer: 'They prevent agent burnout and maintain operational continuity.' },
      { id: 'rq_5_5', type: 'multiple_choice', question: 'What positive organizational changes occur when companies invest in employee mental health?', options: ['Absenteeism drops, FCR improves, and service quality stabilizes.', 'Employee salaries are permanently reduced by half.', 'Operational productivity metrics decline across all channels.', 'Customer support queues become permanently locked.'], correctAnswer: 'Absenteeism drops, FCR improves, and service quality stabilizes.' }
    ]
  },
  {
    id: 'read_6',
    title: 'The Role of Artificial Intelligence in Workflow Automation',
    passage: `Artificial intelligence (AI) and machine learning (ML) technologies have fundamentally revolutionized modern contact center operations by automating routine inquiries and assisting human agents in real time. Conversational AI chatbots efficiently handle transactional, repetitive tasks such as basic password resets, order tracking updates, and account balance inquiries. This automation frees human representatives from mundane duties, allowing them to focus on complex, high-empathy problem-solving and specialized technical troubleshooting.\n\nFurthermore, advanced sentiment analysis tools monitor customer tone, pitch, and phrasing during live interactions, automatically flagging potential dissatisfaction for immediate supervisor coaching. Despite these technological leaps, human empathy and critical reasoning remain entirely irreplaceable when navigating complex, emotionally charged dispute resolutions or nuanced policy exceptions.\n\nIntegrating AI into the support workflow creates a powerful hybrid model. By pairing automated efficiency with human emotional intelligence, contact centers achieve unprecedented levels of operational speed and customer satisfaction.`,
    questions: [
      { id: 'rq_6_1', type: 'multiple_choice', question: 'What role do conversational AI chatbots primarily play in modern contact centers?', options: ['Replacing all human supervisors and directors permanently.', 'Handling transactional, repetitive tasks like password resets and order tracking.', 'Auditing corporate financial statements for tax compliance.', 'Managing physical building security and access controls.'], correctAnswer: 'Handling transactional, repetitive tasks like password resets and order tracking.' },
      { id: 'rq_6_2', type: 'multiple_choice', question: 'What is the operational benefit of automating routine tasks for human representatives?', options: ['It allows agents to focus on complex, high-empathy problem-solving.', 'It forces agents to complete twice as many calls per hour.', 'It eliminates the need for any CRM documentation.', 'It allows companies to terminate all tier-one support staff.'], correctAnswer: 'It allows agents to focus on complex, high-empathy problem-solving.' },
      { id: 'rq_6_3', type: 'multiple_choice', question: 'What do advanced sentiment analysis tools monitor during live customer interactions?', options: ['Agent typing speed and keystroke error frequencies.', 'Customer tone, pitch, and phrasing to flag potential dissatisfaction.', 'Local office room temperature and humidity levels.', 'Power consumption metrics of server infrastructure.'], correctAnswer: 'Customer tone, pitch, and phrasing to flag potential dissatisfaction.' },
      { id: 'rq_6_4', type: 'multiple_choice', question: 'What capability remains entirely irreplaceable by artificial intelligence systems?', options: ['Basic data retrieval and database querying.', 'Automated email dispatching and template formatting.', 'Human empathy and critical reasoning during complex dispute resolutions.', 'High-speed mathematical calculation and sorting.'], correctAnswer: 'Human empathy and critical reasoning during complex dispute resolutions.' },
      { id: 'rq_6_5', type: 'multiple_choice', question: 'How has AI impacted contact center operations overall?', options: ['It has fundamentally revolutionized operations by automating routine work and assisting in real time.', 'It has rendered human communication completely obsolete in business settings.', 'It has increased average handle times across every industry sector.', 'It has eliminated the need for secure cloud networks.'], correctAnswer: 'It has fundamentally revolutionized operations by automating routine work and assisting in real time.' }
    ]
  },
  {
    id: 'read_7',
    title: 'Time Management and KPI Optimization on the Floor',
    passage: `In fast-paced outsourcing environments, effective time management is a critical core competency that directly influences vital key performance indicators (KPIs) such as occupancy rate, wrap-up time, and average handle time (AHT). Agents who fail to structure their workflow efficiently often experience severe operational bottlenecks during post-call documentation, CRM note updating, and ticket tagging procedures. These delays accumulate, inflating handle times and damaging overall shift productivity metrics.\n\nTo maintain optimal productivity without sacrificing service quality, representatives should utilize shorthand macro shortcuts, practice touch typing, and summarize customer interactions concurrently while actively listening to callers. Mastering concurrent documentation ensures that post-call wrap-up time remains minimal, allowing agents to transition smoothly to the next inbound inquiry without violating floor efficiency benchmarks.\n\nTime optimization is not about rushing callers but about streamlining administrative tasks. When agents master workflow pacing, they achieve superior KPI scores while maintaining high standards of customer care.`,
    questions: [
      { id: 'rq_7_1', type: 'multiple_choice', question: 'Which key performance indicators (KPIs) are directly influenced by efficient time management?', options: ['Total square footage of the physical facility and parking availability.', 'Occupancy rate, wrap-up time, and average handle time (AHT).', 'Cafeteria operating hours and lunch break durations.', 'Company quarterly stock valuation and profit margins.'], correctAnswer: 'Occupancy rate, wrap-up time, and average handle time (AHT).' },
      { id: 'rq_7_2', type: 'multiple_choice', question: 'What operational problem do agents experience when they fail to structure workflow efficiently?', options: ['Severe bottlenecks during post-call documentation and CRM note updating.', 'Instantaneous promotion to quality assurance coaching roles.', 'Automatic deletion of customer billing records.', 'Elimination of all inbound call volume spikes.'], correctAnswer: 'Severe bottlenecks during post-call documentation and CRM note updating.' },
      { id: 'rq_7_3', type: 'multiple_choice', question: 'Which techniques help agents maintain optimal productivity during live calls?', options: ['Placing callers on indefinite hold while typing notes from memory.', 'Skipping database documentation entirely to save time.', 'Utilizing shorthand macro shortcuts, touch typing, and concurrent summarizing.', 'Ignoring subsequent callers until all notes are finalized.'], correctAnswer: 'Utilizing shorthand macro shortcuts, touch typing, and concurrent summarizing.' },
      { id: 'rq_7_4', type: 'multiple_choice', question: 'What is the primary operational benefit of mastering concurrent documentation?', options: ['Post-call wrap-up time remains minimal, enabling smooth transitions to next inquiries.', 'Agents are permitted to leave their shifts three hours early.', 'Customer verification protocols become entirely optional.', 'CRM systems stop requiring mandatory ticket categorization.'], correctAnswer: 'Post-call wrap-up time remains minimal, enabling smooth transitions to next inquiries.' },
      { id: 'rq_7_5', type: 'multiple_choice', question: 'How do accumulated post-call delays impact shift performance?', options: ['They inflate handle times and damage overall shift productivity metrics.', 'They improve customer satisfaction scores exponentially.', 'They reduce queue congestion across all department lines.', 'They eliminate the need for supervisory performance reviews.'], correctAnswer: 'They inflate handle times and damage overall shift productivity metrics.' }
    ]
  },
  {
    id: 'read_8',
    title: 'Cross-Cultural Communication Nuances in Global BPOs',
    passage: `As outsourcing providers increasingly serve international client bases spanning North America, Europe, the Middle East, and the Asia-Pacific region, cross-cultural communication competence has become an indispensable professional skill. Representatives must successfully navigate subtle linguistic nuances, regional idioms, tone variations, and cultural phrasing expectations to ensure absolute clarity during complex technical support and financial interactions. Misunderstandings arising from cultural disconnects can rapidly sour client relationships and trigger unnecessary escalations.\n\nActive listening, patience, and avoiding regional slang, colloquialisms, or culture-specific humor help prevent misunderstandings and foster instant rapport with diverse callers. Cultivating cultural intelligence enables support professionals to project universal professionalism and empathy, bridging geographic divides effortlessly in global service delivery models.\n\nUltimately, global support excellence rests on respecting diversity and adapting communication styles to fit the caller's cultural context. This adaptability builds instant trust and establishes a welcoming support environment worldwide.`,
    questions: [
      { id: 'rq_8_1', type: 'multiple_choice', question: 'Why is cross-cultural communication competence essential in modern BPO operations?', options: ['To navigate linguistic nuances and idioms across diverse international client bases.', 'To enforce standardized local currency exchange rates globally.', 'To eliminate all foreign language support desks permanently.', 'To restrict customer access to regional phone lines only.'], correctAnswer: 'To navigate linguistic nuances and idioms across diverse international client bases.' },
      { id: 'rq_8_2', type: 'multiple_choice', question: 'What negative outcome can arise from cultural disconnects during customer interactions?', options: ['Instantaneous resolution of all technical support tickets.', 'Unnecessary escalations and soured client relationships.', 'Automatic compliance with quality assurance scoring rubrics.', 'Significant reductions in average handle times.'], correctAnswer: 'Unnecessary escalations and soured client relationships.' },
      { id: 'rq_8_3', type: 'multiple_choice', question: 'Which communication practices help prevent misunderstandings with international callers?', options: ['Using heavy regional slang and culture-specific humor liberally.', 'Active listening, patience, and avoiding colloquialisms.', 'Speaking at an extremely rapid pace to maximize efficiency.', 'Dismissing cultural differences as irrelevant to technical support.'], correctAnswer: 'Active listening, patience, and avoiding colloquialisms.' },
      { id: 'rq_8_4', type: 'multiple_choice', question: 'What does cultivating cultural intelligence enable support professionals to achieve?', options: ['Project universal professionalism and empathy across geographic divides.', 'Control international financial markets and currency valuations.', 'Bypass all mandatory multi-factor authentication protocols.', 'Operate support desks without utilizing knowledge management bases.'], correctAnswer: 'Project universal professionalism and empathy across geographic divides.' },
      { id: 'rq_8_5', type: 'multiple_choice', question: 'Which geographic regions are explicitly noted as part of modern BPO client bases?', options: ['North America, Europe, the Middle East, and Asia-Pacific.', 'Antarctica and remote deep-sea research stations exclusively.', 'Local municipal districts within a single city block.', 'Suburban residential neighborhoods only.'], correctAnswer: 'North America, Europe, the Middle East, and Asia-Pacific.' }
    ]
  },
  {
    id: 'read_9',
    title: 'Knowledge Management Bases and Editorial Maintenance',
    passage: `An up-to-date, easily navigable knowledge management base (KMB) serves as the indispensable backbone of efficient technical support and customer service operations. When troubleshooting intricate software glitches, complex billing discrepancies, or policy exceptions, frontline agents rely heavily on centralized documentation to locate precise, step-by-step resolution paths without placing customers on prolonged, frustrating holds. Without an accurate KMB, handle times soar and resolution quality becomes erratic.\n\nTo prevent documentation decay, organizations must establish dedicated editorial teams tasked with auditing knowledge articles regularly, eliminating obsolete troubleshooting steps, and rapidly publishing documentation for newly released software updates or policy revisions. Continuous KMB maintenance empowers agents to deliver consistent, accurate answers across every inbound interaction.\n\nA dynamic knowledge base directly correlates with high first-contact resolution rates. When agents have instant access to verified information, operational efficiency and customer trust increase simultaneously.`,
    questions: [
      { id: 'rq_9_1', type: 'multiple_choice', question: 'What is described as the indispensable backbone of efficient technical support operations?', options: ['Rigid physical filing cabinets stored in basement archives.', 'An up-to-date, easily navigable knowledge management base (KMB).', 'Unfiltered social media feeds and public forums.', 'Automated outbound telemarketing calling lists.'], correctAnswer: 'An up-to-date, easily navigable knowledge management base (KMB).' },
      { id: 'rq_9_2', type: 'multiple_choice', question: 'Why do frontline agents rely on centralized KMB documentation during calls?', options: ['To locate precise resolution paths without placing customers on prolonged holds.', 'To browse personal entertainment websites during shifts.', 'To bypass account verification and security protocols.', 'To submit vacation requests directly to human resources.'], correctAnswer: 'To locate precise resolution paths without placing customers on prolonged holds.' },
      { id: 'rq_9_3', type: 'multiple_choice', question: 'What negative consequence occurs when a knowledge base lacks accuracy and maintenance?', options: ['Handle times soar and resolution quality becomes erratic.', 'Customer satisfaction scores reach absolute perfection.', 'Agent training periods are reduced to zero hours.', 'Operational overhead costs drop to negligible levels.'], correctAnswer: 'Handle times soar and resolution quality becomes erratic.' },
      { id: 'rq_9_4', type: 'multiple_choice', question: 'What is the primary responsibility of dedicated editorial teams regarding the KMB?', options: ['Handle inbound customer phone calls during peak traffic hours.', 'Audit knowledge articles regularly and publish updates for new software.', 'Calculate monthly employee payroll deductions and tax withholdings.', 'Monitor physical office security cameras and badge access.'], correctAnswer: 'Audit knowledge articles regularly and publish updates for new software.' },
      { id: 'rq_9_5', type: 'multiple_choice', question: 'What outcome does continuous KMB maintenance empower agents to achieve?', options: ['Deliver consistent, accurate answers across every inbound interaction.', 'Operate support desks without utilizing computers or CRMs.', 'Eliminate the need for customer verification procedures.', 'Charge customers premium fees for technical advice.'], correctAnswer: 'Deliver consistent, accurate answers across every inbound interaction.' }
    ]
  },
  {
    id: 'read_10',
    title: 'Workplace Ergonomics and Musculoskeletal Health',
    passage: `Desk-bound customer support professionals and remote call center agents spend extended, continuous hours seated in front of computer monitors, making proper workplace ergonomics a vital physiological factor in long-term health, comfort, and occupational productivity. Poor physical posture, improperly adjusted chair heights, awkward keyboard positioning, and suboptimal monitor viewing angles frequently culminate in debilitating repetitive strain injuries (RSIs), chronic lower back pain, severe neck strain, and acute digital eye fatigue.\n\nInvesting in fully adjustable ergonomic seating, sit-stand desks, wrist support pads, footrests, and anti-glare screen filters actively safeguards employee physical well-being. Furthermore, ergonomic wellness programs reduce absenteeism due to physical injury, lower healthcare insurance claims, and foster a sustainable, health-conscious workplace culture.\n\nPrioritizing ergonomics demonstrates an organizational commitment to employee welfare. Healthy agents experience less physical fatigue, leading to sustained focus and superior service delivery throughout their shifts.`,
    questions: [
      { id: 'rq_10_1', type: 'multiple_choice', question: 'Why is workplace ergonomics considered a vital factor for desk-bound support professionals?', options: ['Because extended sitting and poor posture lead to RSIs and chronic pain.', 'Because it eliminates the need for computer monitors entirely.', 'Because ergonomic seating automatically increases typing speeds by 300%.', 'Because it replaces all software training requirements.'], correctAnswer: 'Because extended sitting and poor posture lead to RSIs and chronic pain.' },
      { id: 'rq_10_2', type: 'multiple_choice', question: 'Which physical health issues are specifically linked to suboptimal workstation setups?', options: ['Repetitive strain injuries (RSIs), chronic lower back pain, and eye fatigue.', 'Instantaneous improvements in cardiovascular endurance.', 'Enhanced visual acuity and night vision capabilities.', 'Complete immunity to seasonal viral infections.'], correctAnswer: 'Repetitive strain injuries (RSIs), chronic lower back pain, and eye fatigue.' },
      { id: 'rq_10_3', type: 'multiple_choice', question: 'Which equipment investments actively safeguard employee physical well-being?', options: ['Unpadded wooden stools and fixed-height metal desks.', 'Adjustable ergonomic seating, sit-stand desks, and wrist support pads.', 'High-intensity fluorescent desktop lamps without shades.', 'Unfiltered glass monitor panels positioned below desk level.'], correctAnswer: 'Adjustable ergonomic seating, sit-stand desks, and wrist support pads.' },
      { id: 'rq_10_4', type: 'multiple_choice', question: 'What organizational benefits arise from implementing ergonomic wellness programs?', options: ['Reduced absenteeism, lower healthcare claims, and a health-conscious culture.', 'Permanent elimination of all customer service departments.', 'Higher rates of employee turnover and burnout.', 'Mandatory extension of daily shift working hours.'], correctAnswer: 'Reduced absenteeism, lower healthcare claims, and a health-conscious culture.' },
      { id: 'rq_10_5', type: 'multiple_choice', question: 'What primary activity characterizes the daily routine of desk-bound support agents?', options: ['Extended, continuous hours seated in front of computer monitors.', 'Heavy manual lifting and warehouse inventory stocking.', 'Outdoor field service repairs and utility pole climbing.', 'Frequent international business travel and conference hosting.'], correctAnswer: 'Extended, continuous hours seated in front of computer monitors.' }
    ]
  },
  {
    id: 'read_11',
    title: 'Voice Modulation and Vocal Health for Telephone Agents',
    passage: `Voice modulation is a powerful, critical tool for telephone support agents, directly impacting how clearly instructions are communicated and how calmly customers perceive the representative during stressful exchanges. Speaking at an excessively rapid pace, maintaining a flat monotone pitch, or projecting harsh vocal tension can easily cause caller frustration, confusion, or severe misinterpretation of complex technical troubleshooting steps. Voice control is the primary medium through which telephone agents build trust in the absence of face-to-face visual cues.\n\nAgents should practice diaphragmatic breathing, maintain moderate, measured pacing, and vary vocal inflection naturally to project warmth, confidence, and professional authority throughout long calling shifts. Additionally, vocal hydration and proper rest prevent chronic vocal cord strain, ensuring agents maintain professional vocal quality and stamina day after day.\n\nMaintaining vocal health is essential for long-term telephone support careers. By treating the voice as a professional instrument, agents protect their physical well-being while enhancing the caller's listening experience.`,
    questions: [
      { id: 'rq_11_1', type: 'multiple_choice', question: 'What impact does voice modulation have on customer interactions?', options: ['It determines how clearly instructions are communicated and perceived.', 'It automatically updates customer database records in the CRM.', 'It controls the customer’s internet bandwidth speed remotely.', 'It dictates the monthly billing subscription rate.'], correctAnswer: 'It determines how clearly instructions are communicated and perceived.' },
      { id: 'rq_11_2', type: 'multiple_choice', question: 'What negative outcomes result from speaking too quickly or maintaining a flat monotone pitch?', options: ['Instantaneous resolution of billing disputes and policy questions.', 'Caller frustration, confusion, and misinterpretation of technical steps.', 'Absolute compliance with quality assurance scoring rubrics.', 'Zero customer wait times in inbound support queues.'], correctAnswer: 'Caller frustration, confusion, and misinterpretation of technical steps.' },
      { id: 'rq_11_3', type: 'multiple_choice', question: 'Why is voice control particularly important for telephone support agents?', options: ['Because visual cues are absent, making voice the primary medium for trust.', 'Because corporate software systems require verbal voice commands.', 'Because federal regulations prohibit agents from speaking softly.', 'Because monotone voices are legally required for banking accounts.'], correctAnswer: 'Because visual cues are absent, making voice the primary medium for trust.' },
      { id: 'rq_11_4', type: 'multiple_choice', question: 'Which techniques help agents project warmth, confidence, and professional authority?', options: ['Shouting loudly into microphone headsets to demonstrate passion.', 'Diaphragmatic breathing, moderate pacing, and varied vocal inflection.', 'Whispering continuously to minimize background static noise.', 'Rushing through script introductions to satisfy handle-time metrics.'], correctAnswer: 'Diaphragmatic breathing, moderate pacing, and varied vocal inflection.' },
      { id: 'rq_11_5', type: 'multiple_choice', question: 'What is the purpose of maintaining vocal hydration and proper rest during shifts?', options: ['To prevent chronic vocal cord strain and maintain professional stamina.', 'To allow agents to sing musical interludes while on hold.', 'To eliminate the requirement for knowledge base documentation.', 'To double the agent’s daily call volume capacity.'], correctAnswer: 'To prevent chronic vocal cord strain and maintain professional stamina.' }
    ]
  },
  {
    id: 'read_12',
    title: 'Quality Assurance Scoring Calibration and Coaching',
    passage: `Quality assurance (QA) calibration sessions are essential administrative processes designed to ensure that team managers, supervisors, and evaluators maintain consistent, objective grading standards across all evaluated voice calls, chats, and emails. Without regular calibration meetings, subjective scoring biases inevitably emerge among evaluators, leading to agent resentment, contested evaluations, and inaccurate performance tracking metrics that distort true operational capability.\n\nFurthermore, constructive QA coaching sessions should focus on root-cause analysis of performance errors rather than relying on punitive measures or petty reprimands. When supervisors use evaluation data as a collaborative coaching tool to help representatives refine their phrasing, procedural adherence, and problem-solving logic, agent engagement and performance metrics improve organically.\n\nCalibration builds fairness and transparency into the evaluation framework. When agents trust that grading standards are uniform and objective, they accept feedback more readily and strive for continuous professional growth.`,
    questions: [
      { id: 'rq_12_1', type: 'multiple_choice', question: 'What is the primary purpose of quality assurance (QA) calibration sessions?', options: ['To punish agents who fail to meet daily sales quotas.', 'To ensure evaluators maintain consistent, objective grading standards.', 'To calculate company quarterly financial revenue and tax obligations.', 'To test new software applications prior to corporate deployment.'], correctAnswer: 'To ensure evaluators maintain consistent, objective grading standards.' },
      { id: 'rq_12_2', type: 'multiple_choice', question: 'What negative consequences emerge when organizations skip regular calibration meetings?', options: ['Subjective scoring biases, agent resentment, and inaccurate performance tracking.', 'Instantaneous improvements in customer satisfaction scores.', 'Elimination of all operational overhead expenses.', 'Absolute perfection in first-contact resolution metrics.'], correctAnswer: 'Subjective scoring biases, agent resentment, and inaccurate performance tracking.' },
      { id: 'rq_12_3', type: 'multiple_choice', question: 'What should constructive QA coaching sessions focus on primarily?', options: ['Punitive measures, reprimands, and disciplinary wage deductions.', 'Root-cause analysis of performance errors rather than punishment.', 'Arbitrary increases in daily call volume quotas.', 'Reducing customer database security and privacy standards.'], correctAnswer: 'Root-cause analysis of performance errors rather than punishment.' },
      { id: 'rq_12_4', type: 'multiple_choice', question: 'How do agents respond when supervisors use evaluation data collaboratively?', options: ['Agent engagement and performance metrics improve organically.', 'They immediately submit formal resignations to management.', 'They refuse to utilize knowledge management bases.', 'They intentionally prolong call handle times.'], correctAnswer: 'Agent engagement and performance metrics improve organically.' },
      { id: 'rq_12_5', type: 'multiple_choice', question: 'Which communication channels are subject to QA evaluation calibration?', options: ['Voice calls, live chats, and support emails.', 'Internal office bulletin board memos only.', 'Postal mail letters and physical fax transmissions.', 'Radio frequency broadcasts and public advertisements.'], correctAnswer: 'Voice calls, live chats, and support emails.' }
    ]
  },
  {
    id: 'read_13',
    title: 'Email Etiquette and Corporate Correspondence Standards',
    passage: `Written customer support requires a distinct, highly refined set of communication skills compared to traditional voice interactions, primarily because agents lack the distinct benefits of vocal inflection, immediate verbal feedback, and real-time reassurance. Professional support emails must feature crystal-clear subject lines, concise opening greetings, well-structured paragraph formatting, and grammatically flawless phrasing. Ambiguous writing leads directly to customer confusion and follow-up inquiries.\n\nAvoiding dense corporate jargon, clarifying complex multi-step policies with bulleted lists, and concluding with a warm, reassuring closing statement ensure that written correspondence remains professional, accessible, and easy to comprehend. Mastering written etiquette builds strong digital brand loyalty and minimizes unnecessary inbound email volume.\n\nClear written communication serves as an enduring record of the company's professionalism. Taking the time to craft precise, polite emails prevents misunderstandings and reinforces customer confidence in the brand.`,
    questions: [
      { id: 'rq_13_1', type: 'multiple_choice', question: 'Why does written customer support require a distinct set of communication skills?', options: ['Because typing speeds must exceed 100 words per minute.', 'Because email systems prohibit the use of punctuation marks.', 'Because agents lack vocal inflection, immediate feedback, and verbal reassurance.', 'Because customers never read long paragraphs under any circumstances.'], correctAnswer: 'Because agents lack vocal inflection, immediate feedback, and verbal reassurance.' },
      { id: 'rq_13_2', type: 'multiple_choice', question: 'What key elements must professional support emails feature?', options: ['Clear subject lines, concise greetings, structured paragraphs, and flawless phrasing.', 'Dense corporate jargon, unstructured blocks of text, and vague headers.', 'All-capital-letter formatting and aggressive demands for payment.', 'Unrelated marketing brochures and promotional discount codes.'], correctAnswer: 'Clear subject lines, concise greetings, structured paragraphs, and flawless phrasing.' },
      { id: 'rq_13_3', type: 'multiple_choice', question: 'Which formatting practice helps clarify complex multi-step policies in emails?', options: ['Writing everything in a single, massive, unbroken paragraph.', 'Using bulleted lists and structured formatting.', 'Including random hyperlinks to external gaming websites.', 'Omitting all punctuation marks to speed up reading.'], correctAnswer: 'Using bulleted lists and structured formatting.' },
      { id: 'rq_13_4', type: 'multiple_choice', question: 'What is the consequence of ambiguous writing in customer support emails?', options: ['Customer confusion and unnecessary follow-up inquiries.', 'Instantaneous resolution of all technical support tickets.', 'Immediate promotion to senior editorial management.', 'Automatic compliance with quality assurance rubrics.'], correctAnswer: 'Customer confusion and unnecessary follow-up inquiries.' },
      { id: 'rq_13_5', type: 'multiple_choice', question: 'What organizational benefits arise from mastering written email etiquette?', options: ['Builds strong digital brand loyalty and minimizes unnecessary inbound email volume.', 'Eliminates the requirement for centralized CRM databases.', 'Doubles the average handle time for voice support desks.', 'Forces customers to utilize live chat widgets exclusively.'], correctAnswer: 'Builds strong digital brand loyalty and minimizes unnecessary inbound email volume.' }
    ]
  },
  {
    id: 'read_14',
    title: 'Workforce Management Forecasting and Staffing Models',
    passage: `Workforce management (WFM) teams utilize historical call volume data, seasonal purchasing trends, marketing campaign schedules, and advanced mathematical forecasting algorithms to schedule appropriate staffing levels throughout every operational hour of the day. Accurate forecasting prevents severe understaffing during peak inbound traffic spikes, which would otherwise cause excessive customer wait times, soaring abandonment rates, and high caller frustration. Conversely, overstaffing leads to excessive idle agent time and inflated operational overhead costs, making precise scheduling a vital pillar of BPO financial profitability.\n\nWFM specialists also monitor real-time adherence metrics, ensuring agents log into their queues promptly, take scheduled breaks on time, and avoid unapproved auxiliary states. Balancing predictive mathematical modeling with real-time floor flexibility ensures optimal service levels are maintained continuously without straining corporate budgets.\n\nEffective workforce management bridges data science and operational execution. By anticipating consumer demand patterns accurately, WFM models protect both customer experience standards and business revenue targets.`,
    questions: [
      { id: 'rq_14_1', type: 'multiple_choice', question: 'What data sources do WFM teams utilize for scheduling staffing levels?', options: ['Personal employee social media activity logs and browsing histories.', 'Historical call volume data, seasonal trends, and marketing schedules.', 'Cafeteria food consumption statistics and lunch preferences.', 'Local municipal weather temperature forecasts and rainfall data.'], correctAnswer: 'Historical call volume data, seasonal trends, and marketing schedules.' },
      { id: 'rq_14_2', type: 'multiple_choice', question: 'What are the consequences of severe understaffing during peak inbound traffic spikes?', options: ['Excessive customer wait times, soaring abandonment rates, and caller frustration.', 'Instantaneous resolution of all pending customer tickets.', 'Higher agent satisfaction and lower workplace stress levels.', 'Zero requirement for supervisory support or intervention.'], correctAnswer: 'Excessive customer wait times, soaring abandonment rates, and caller frustration.' },
      { id: 'rq_14_3', type: 'multiple_choice', question: 'What financial impact does overstaffing have on contact center operations?', options: ['It leads to excessive idle agent time and inflated operational overhead costs.', 'It guarantees a 100% increase in corporate quarterly net profit.', 'It eliminates all customer complaints regarding billing errors.', 'It reduces average handle times to absolute zero.'], correctAnswer: 'It leads to excessive idle agent time and inflated operational overhead costs.' },
      { id: 'rq_14_4', type: 'multiple_choice', question: 'What real-time responsibilities do WFM specialists manage on the floor?', options: ['Monitoring adherence metrics, queue logins, break schedules, and auxiliary states.', 'Conducting initial interviews for prospective software engineering candidates.', 'Auditing corporate tax returns and payroll disbursements.', 'Designing marketing brochures and advertising campaigns.'], correctAnswer: 'Monitoring adherence metrics, queue logins, break schedules, and auxiliary states.' },
      { id: 'rq_14_5', type: 'multiple_choice', question: 'Why is accurate workforce scheduling considered a vital pillar of BPO profitability?', options: ['Because it balances service levels and operational costs without straining budgets.', 'Because it legally exempts companies from paying employee overtime wages.', 'Because it replaces the need for customer service management software.', 'Because it allows agencies to bill clients for idle agent hours.'], correctAnswer: 'Because it balances service levels and operational costs without straining budgets.' }
    ]
  },
  {
    id: 'read_15',
    title: 'Handling Abusive or Inappropriate Caller Behavior',
    passage: `While customer service professionals are thoroughly trained to handle frustrated, anxious clients with unwavering patience and empathy, corporate policies and labor safety laws must also protect staff members from severe verbal abuse, profanity, harassment, or threats of violence. When a caller crosses ethical boundaries and continues using abusive language despite polite, firm warnings from the representative, agents are fully authorized and required to terminate the interaction.\n\nFollowing strict operational protocol, agents must state their reason for disconnection clearly and calmly, log the complete incident in the CRM ticketing system with accurate notes, and notify a supervisor immediately. Enforcing zero-tolerance policies for abuse safeguards agent psychological well-being and maintains a safe, respectful working environment across the entire organization.\n\nWorker protection is a non-negotiable standard in professional outsourcing. Setting clear boundaries against harassment ensures that agents can perform their duties in a safe atmosphere free from intimidation.`,
    questions: [
      { id: 'rq_15_1', type: 'multiple_choice', question: 'When are customer support representatives authorized to terminate an active call?', options: ['Whenever the agent feels tired of talking to clients.', 'When a caller uses abusive language or profanity despite polite warnings.', 'When the average handle time limit is reached for the shift.', 'Whenever a customer asks a difficult technical question.'], correctAnswer: 'When a caller uses abusive language or profanity despite polite warnings.' },
      { id: 'rq_15_2', type: 'multiple_choice', question: 'What protocol must an agent follow immediately after disconnecting an abusive call?', options: ['Call the customer back on their personal mobile phone to argue.', 'Delete all records of the interaction from the database permanently.', 'State the reason clearly, log the incident in the CRM, and notify a supervisor.', 'Take an unapproved two-hour mental health break off the floor.'], correctAnswer: 'State the reason clearly, log the incident in the CRM, and notify a supervisor.' },
      { id: 'rq_15_3', type: 'multiple_choice', question: 'What is the primary purpose of enforcing zero-tolerance policies for caller abuse?', options: ['To safeguard agent psychological well-being and maintain a safe workplace.', 'To punish customers who request billing refunds or discounts.', 'To reduce inbound call volumes during peak holiday seasons.', 'To eliminate the requirement for quality assurance monitoring.'], correctAnswer: 'To safeguard agent psychological well-being and maintain a safe workplace.' },
      { id: 'rq_15_4', type: 'multiple_choice', question: 'How should an agent deliver the disconnection notice to an abusive caller?', options: ['By screaming obscenities back at the customer in frustration.', 'By hanging up silently without providing any explanation.', 'By stating the reason for disconnection clearly and calmly.', 'By transferring the call to a junior trainee without notes.'], correctAnswer: 'By stating the reason for disconnection clearly and calmly.' },
      { id: 'rq_15_5', type: 'multiple_choice', question: 'What role does empathy play when interacting with frustrated versus abusive clients?', options: ['Empathy is applied to frustrated clients, while safety protocols protect staff from abuse.', 'Empathy is prohibited in all customer service interactions by law.', 'Empathy must be extended equally to individuals issuing direct threats of violence.', 'Frustrated clients must be disconnected immediately without warning.'], correctAnswer: 'Empathy is applied to frustrated clients, while safety protocols protect staff from abuse.' }
    ]
  },
  {
    id: 'read_16',
    title: 'Client Retention Strategies and Win-Back Campaigns',
    passage: `Customer churn represents a major financial risk for subscription-based businesses, software-as-a-service (SaaS) providers, and telecommunications firms, making proactive retention strategies vital to enterprise survival. Specialized retention agents are trained to identify early behavioral warning signs of cancellation—such as sudden drops in platform login frequency, unresolved technical support tickets, or repeated billing complaints—and intervene proactively by offering targeted loyalty discounts, billing cycle flexibility, or feature upgrades.\n\nFurthermore, structured win-back campaigns targeting former subscribers through personalized email offers, tailored service enhancements, and migration incentives can successfully recover lost recurring revenue and rebuild brand loyalty. Retaining an existing customer is significantly more cost-effective than acquiring a brand-new subscriber through expensive marketing channels.\n\nProactive retention transforms potential losses into long-term partnerships. By understanding customer pain points and offering customized solutions, organizations stabilize their revenue streams and secure sustainable growth.`,
    questions: [
      { id: 'rq_16_1', type: 'multiple_choice', question: 'What represents a major financial risk for subscription-based businesses?', options: ['Customer churn.', 'Excessive software licensing fees.', 'High office rental overhead expenses.', 'Upgrading employee computer hardware.'], correctAnswer: 'Customer churn.' },
      { id: 'rq_16_2', type: 'multiple_choice', question: 'What early behavioral warning signs indicate a customer is at risk of cancellation?', options: ['Sudden login drops, unresolved support tickets, or repeated billing complaints.', 'Frequent praise of customer service agents on social media.', 'Upgrading subscription tiers to enterprise packages.', 'Submitting multiple positive product reviews.'], correctAnswer: 'Sudden login drops, unresolved support tickets, or repeated billing complaints.' },
      { id: 'rq_16_3', type: 'multiple_choice', question: 'How do retention specialists intervene when a customer signals intent to cancel?', options: ['By offering targeted loyalty discounts, billing flexibility, and feature upgrades.', 'By immediately deleting the account and charging a termination fee.', 'By transferring the client to a competitor’s sales department.', 'By ignoring the cancellation request until the contract expires.'], correctAnswer: 'By offering targeted loyalty discounts, billing flexibility, and feature upgrades.' },
      { id: 'rq_16_4', type: 'multiple_choice', question: 'What is the primary objective of structured win-back campaigns?', options: ['To target former subscribers and recover lost recurring revenue.', 'To file legal lawsuits against individuals who cancel their subscriptions.', 'To prevent new customers from signing up for trial periods.', 'To eliminate the customer support department entirely.'], correctAnswer: 'To target former subscribers and recover lost recurring revenue.' },
      { id: 'rq_16_5', type: 'multiple_choice', question: 'Why do businesses prioritize customer retention over expensive new acquisitions?', options: ['Retaining an existing customer is significantly more cost-effective.', 'Acquiring new subscribers requires zero marketing expenditures.', 'Retaining customers guarantees they will never file complaints.', 'New acquisitions are legally prohibited by corporate compliance laws.'], correctAnswer: 'Retaining an existing customer is significantly more cost-effective.' }
    ]
  },
  {
    id: 'read_17',
    title: 'Vendor Management and Third-Party Marketplace Compliance',
    passage: `E-commerce marketplace platforms rely heavily on third-party independent vendors to supply diverse, extensive product catalogs, but maintaining rigorous quality control across independent sellers is a constant operational challenge. When third-party vendors ship counterfeit merchandise, misrepresent product specifications, or experience chronic, unexplained delivery delays, the marketplace's overarching brand reputation suffers severe damage among consumers.\n\nConsequently, marketplace support and trust-and-safety teams enforce strict compliance audits, implement automated machine-learning fraud detection filters, and promptly suspend non-compliant merchant storefronts to protect consumer trust. Holding third-party vendors accountable ensures that retail marketplaces remain safe, reliable shopping environments for millions of global buyers.\n\nVendor compliance management protects both the platform and its consumers. Rigorous oversight ensures high standards of product authenticity and fulfillment reliability across all marketplace transactions.`,
    questions: [
      { id: 'rq_17_1', type: 'multiple_choice', question: 'Why is maintaining quality control across independent marketplace sellers challenging?', options: ['Because vendors operate independently and may ship counterfeit or delayed items.', 'Because marketplaces do not utilize computers, databases, or software.', 'Because customers never report defective merchandise or shipping issues.', 'Because all third-party vendors are directly employed by corporate headquarters.'], correctAnswer: 'Because vendors operate independently and may ship counterfeit or delayed items.' },
      { id: 'rq_17_2', type: 'multiple_choice', question: 'What negative impact occurs when third-party vendors ship counterfeit merchandise?', options: ['The marketplace brand reputation suffers severe damage among consumers.', 'Marketplace quarterly revenue increases exponentially.', 'Customer satisfaction scores reach absolute perfection.', 'Shipping logistics costs drop to zero.'], correctAnswer: 'The marketplace brand reputation suffers severe damage among consumers.' },
      { id: 'rq_17_3', type: 'multiple_choice', question: 'What actions do marketplace trust-and-safety teams take to enforce compliance?', options: ['Enforce strict compliance audits, automated fraud filters, and prompt suspensions.', 'Award non-compliant merchants premium placement on the homepage.', 'Increase sales commission percentages for fraudulent vendors.', 'Exempt independent sellers from all customer review ratings.'], correctAnswer: 'Enforce strict compliance audits, automated fraud filters, and prompt suspensions.' },
      { id: 'rq_17_4', type: 'multiple_choice', question: 'What is the primary purpose of suspending non-compliant merchant storefronts?', options: ['To protect consumer trust and maintain a safe shopping environment.', 'To reduce the total number of products available for purchase.', 'To force customers to shop exclusively at physical retail stores.', 'To eliminate the need for customer support dispute mediation.'], correctAnswer: 'To protect consumer trust and maintain a safe shopping environment.' },
      { id: 'rq_17_5', type: 'multiple_choice', question: 'Who supplies the diverse product catalogs on e-commerce marketplace platforms?', options: ['Third-party independent vendors.', 'Internal corporate executives only.', 'Local municipal government agencies.', 'Customer service support agents.'], correctAnswer: 'Third-party independent vendors.' }
    ]
  },
  {
    id: 'read_18',
    title: 'Incident Management and Critical Outage Communication',
    passage: `When major technical infrastructure failures, server crashes, or cyber attacks disrupt enterprise software services, incident management teams must act with extreme speed and precision to minimize business disruption. Clear, transparent communication protocols are essential both internally among technical support staff and externally to affected corporate clients. Silence during an outage breeds intense client distrust and overwhelms support switchboards with frantic inbound calls.\n\nSupport agents should be equipped with standardized status broadcast templates and real-time incident dashboards, ensuring that clients receive accurate, timely updates regarding estimated times of restoration (ETR) without clogging phone queues. Effective incident communication maintains institutional credibility during high-stress technical emergencies.\n\nTransparent outage management turns a technical crisis into an opportunity to demonstrate reliability. Keeping clients informed with realistic restoration timelines preserves trust even when systems experience unexpected failures.`,
    questions: [
      { id: 'rq_18_1', type: 'multiple_choice', question: 'What is the primary goal of incident management teams during technical infrastructure failures?', options: ['Minimize business disruption and restore enterprise services swiftly.', 'Conceal system failures from corporate executives and clients.', 'Permanently shut down cloud server infrastructure to prevent attacks.', 'Increase billing charges for accounts affected by downtime.'], correctAnswer: 'Minimize business disruption and restore enterprise services swiftly.' },
      { id: 'rq_18_2', type: 'multiple_choice', question: 'What negative consequence arises from maintaining silence during a service outage?', options: ['It breeds client distrust and overwhelms support switchboards with frantic calls.', 'It automatically resolves the underlying technical server glitch.', 'It improves customer satisfaction scores across all support tiers.', 'It reduces server maintenance expenditures to zero.'], correctAnswer: 'It breeds client distrust and overwhelms support switchboards with frantic calls.' },
      { id: 'rq_18_3', type: 'multiple_choice', question: 'What tools should support agents be equipped with during critical system outages?', options: ['Standardized status broadcast templates and real-time incident dashboards.', 'Personal social media accounts for posting unverified opinions.', 'Handwritten postal letter templates for mailing updates.', 'Physical wrenches and screwdrivers for repairing server racks.'], correctAnswer: 'Standardized status broadcast templates and real-time incident dashboards.' },
      { id: 'rq_18_4', type: 'multiple_choice', question: 'Why is providing estimated times of restoration (ETR) important for clients?', options: ['It provides accurate updates and prevents clogging phone queues.', 'It legally binds the company to provide free software licenses.', 'It eliminates the requirement for technical support engineers.', 'It forces clients to cancel their service subscriptions.'], correctAnswer: 'It provides accurate updates and prevents clogging phone queues.' },
      { id: 'rq_18_5', type: 'multiple_choice', question: 'What organizational attribute is preserved through effective incident communication?', options: ['Institutional credibility and client trust during high-stress emergencies.', 'Absolute perfection in employee typing speed metrics.', 'Total immunity to future cyber security breaches.', 'Zero operational overhead expenses.'], correctAnswer: 'Institutional credibility and client trust during high-stress emergencies.' }
    ]
  },
  {
    id: 'read_19',
    title: 'Multitasking and Dual-Screen Proficiency in Live Chat',
    passage: `Live chat support environments require agents to manage multiple concurrent conversations simultaneously while maintaining high typing accuracy, grammatical precision, and rapid response times. Unlike traditional voice calls where attention is focused exclusively on a single caller, chat representatives must juggle split-screen windows, macro shortcut panels, and knowledge base lookups across dual monitors. This high cognitive load requires strict mental discipline to prevent catastrophic cross-chattering errors, such as sending a message intended for Customer A to Customer B.\n\nProficient multitasking relies on keyboard shortcut mastery, concise phrasing, and disciplined mental compartmentalization. Organizations must provide adequate dual-screen hardware and specialized training to help chat agents navigate complex concurrent dialogs without sacrificing service quality or response velocity.\n\nChat support proficiency is a distinct operational skill set. When agents master dual-screen navigation and shortcut tools, they handle high-volume interactions efficiently without compromising personal accuracy or customer satisfaction.`,
    questions: [
      { id: 'rq_19_1', type: 'multiple_choice', question: 'What is a key operational difference between live chat and voice support environments?', options: ['Chat agents manage multiple concurrent conversations simultaneously.', 'Chat agents never have to look up knowledge base articles.', 'Voice agents communicate without using spoken words.', 'Voice agents handle fifty callers at the exact same time.'], correctAnswer: 'Chat agents manage multiple concurrent conversations simultaneously.' },
      { id: 'rq_19_2', type: 'multiple_choice', question: 'What tools must chat representatives juggle across dual monitors?', options: ['Split-screen windows, macro shortcut panels, and knowledge base lookups.', 'Physical telephone switchboards and analog audio cables.', 'Paper filing cabinets and manual ledger books.', 'Radio frequency tuners and television screens.'], correctAnswer: 'Split-screen windows, macro shortcut panels, and knowledge base lookups.' },
      { id: 'rq_19_3', type: 'multiple_choice', question: 'What catastrophic error can occur due to the high cognitive load of multi-chat sessions?', options: ['Cross-chattering errors, such as mixing up messages between different customers.', 'Automatic deletion of the entire corporate customer database.', 'Permanent hardware failure of the computer processor.', 'Instantaneous cancellation of all active client subscriptions.'], correctAnswer: 'Cross-chattering errors, such as mixing up messages between different customers.' },
      { id: 'rq_19_4', type: 'multiple_choice', question: 'What skills are essential for proficient multitasking in live chat support?', options: ['Keyboard shortcut mastery, concise phrasing, and mental compartmentalization.', 'Shouting loudly into microphones to maintain engagement.', 'Typing as slowly and deliberately as possible.', 'Ignoring customer messages until shifts officially conclude.'], correctAnswer: 'Keyboard shortcut mastery, concise phrasing, and mental compartmentalization.' },
      { id: 'rq_19_5', type: 'multiple_choice', question: 'What hardware provision must organizations supply to support live chat agents?', options: ['Adequate dual-screen hardware setups and specialized training.', 'Analog telephone headsets with zero digital connectivity.', 'Handheld tablets without physical keyboards.', 'Monochrome cathode-ray tube monitors.'], correctAnswer: 'Adequate dual-screen hardware setups and specialized training.' }
    ]
  },
  {
    id: 'read_20',
    title: 'Regulatory Compliance in Financial and Banking Support',
    passage: `Financial and banking customer support operations are governed by strict, uncompromising federal and international regulations designed to prevent fraud, money laundering, terrorist financing, and identity theft. Representatives handling account verification and balance disclosures must adhere rigorously to multi-factor authentication protocols, verbal security passwords, and identity challenge questions before releasing sensitive financial details or authorizing wire transfers.\n\nFailure to comply with financial security mandates can result in severe corporate fines, legal liabilities, civil lawsuits, and permanent revocation of banking operating licenses. Compliance auditing teams monitor financial support interactions continuously to ensure adherence to statutory mandates and protect institutional stability.\n\nRegulatory compliance is the cornerstone of consumer banking trust. Rigorous enforcement of security protocols protects both the financial institution and its depositors from malicious exploitation.`,
    questions: [
      { id: 'rq_20_1', type: 'multiple_choice', question: 'What illegal activities are strict banking regulations designed to prevent?', options: ['Slow internet connection speeds and typing errors.', 'Fraud, money laundering, terrorist financing, and identity theft.', 'Excessive employee lunch break durations.', 'Software syntax compilation bugs.'], correctAnswer: 'Fraud, money laundering, terrorist financing, and identity theft.' },
      { id: 'rq_20_2', type: 'multiple_choice', question: 'What must representatives adhere to before disclosing sensitive financial details?', options: ['Personal intuition and informal guesswork.', 'Multi-factor authentication protocols, security passwords, and challenge questions.', 'Customer requests submitted via public social media comments.', 'Verbal password hints provided by unauthorized third parties.'], correctAnswer: 'Multi-factor authentication protocols, security passwords, and challenge questions.' },
      { id: 'rq_20_3', type: 'multiple_choice', question: 'What severe consequences can result from failing to comply with financial mandates?', options: ['Corporate fines, legal liabilities, and permanent revocation of banking licenses.', 'Instantaneous promotion to executive bank directorship.', 'A temporary reduction in monthly utility bills.', 'Automatic waiver of all customer debt obligations.'], correctAnswer: 'Corporate fines, legal liabilities, and permanent revocation of banking licenses.' },
      { id: 'rq_20_4', type: 'multiple_choice', question: 'What is the role of compliance auditing teams in financial support centers?', options: ['Monitor financial support interactions continuously to ensure statutory adherence.', 'Handle inbound customer phone calls during peak traffic hours.', 'Calculate monthly employee payroll deductions and bonuses.', 'Manage physical office building security and parking lots.'], correctAnswer: 'Monitor financial support interactions continuously to ensure statutory adherence.' },
      { id: 'rq_20_5', type: 'multiple_choice', question: 'Why are strict verification protocols required before authorizing wire transfers?', options: ['To prevent unauthorized access and financial fraud.', 'To increase the bank’s daily transaction fee revenue.', 'To prolong call handle times and reduce productivity metrics.', 'To force customers to visit physical bank branches.'], correctAnswer: 'To prevent unauthorized access and financial fraud.' }
    ]
  },
  {
    id: 'read_21',
    title: 'Telehealth Coordination and Patient Confidentiality',
    passage: `Telehealth coordination desks bridge the critical gap between patients and healthcare professionals, managing virtual medical appointment scheduling, prescription refill requests, and secure video consultation links. Because protected health information (PHI) is constantly involved, absolute, uncompromising adherence to healthcare privacy laws like the Health Insurance Portability and Accountability Act (HIPAA) is mandatory across all communications and documentation platforms.\n\nCoordinators must verify patient identity securely using multi-factor credentials before transmitting clinical summaries, releasing lab results, or connecting individuals with attending physicians. Maintaining medical confidentiality safeguards patient trust and ensures healthcare providers remain fully compliant with federal legal mandates.\n\nTelehealth administration requires strict adherence to privacy and security protocols. Protecting patient confidentiality is paramount in delivering trusted remote healthcare services.`,
    questions: [
      { id: 'rq_21_1', type: 'multiple_choice', question: 'What federal privacy law is mandatory across all telehealth communications?', options: ['GDPR', 'OSHA', 'HIPAA', 'FCC'], correctAnswer: 'HIPAA' },
      { id: 'rq_21_2', type: 'multiple_choice', question: 'What responsibilities do telehealth coordination desks manage?', options: ['Virtual medical appointment scheduling, prescription refills, and video links.', 'Commercial software license sales and enterprise upgrades.', 'Automotive insurance collision claim settlements.', 'International freight customs clearance and tariff classification.'], correctAnswer: 'Virtual medical appointment scheduling, prescription refills, and video links.' },
      { id: 'rq_21_3', type: 'multiple_choice', question: 'What must coordinators do before transmitting clinical summaries or lab results?', options: ['Post medical details on public online forums.', 'Email records to unverified family members.', 'Verify patient identity securely using multi-factor credentials.', 'Discard all consultation notes immediately without logging.'], correctAnswer: 'Verify patient identity securely using multi-factor credentials.' },
      { id: 'rq_21_4', type: 'multiple_choice', question: 'Why is absolute medical confidentiality emphasized in telehealth support?', options: ['To safeguard patient trust and ensure compliance with federal legal mandates.', 'To increase the cost of virtual medical consultations.', 'To eliminate the need for licensed medical doctors.', 'To bypass all healthcare insurance verification requirements.'], correctAnswer: 'To safeguard patient trust and ensure compliance with federal legal mandates.' },
      { id: 'rq_21_5', type: 'multiple_choice', question: 'What type of sensitive data is constantly involved in telehealth operations?', options: ['Protected health information (PHI).', 'Corporate financial stock portfolios.', 'Industrial manufacturing blueprints.', 'Retail e-commerce shopping cart items.'], correctAnswer: 'Protected health information (PHI).' }
    ]
  },
  {
    id: 'read_22',
    title: 'Cloud Infrastructure Backup and Disaster Recovery',
    passage: `Enterprise cloud storage and infrastructure providers maintain robust, multi-layered backup and disaster recovery frameworks to protect critical client data against accidental deletion, hardware failure, ransomware attacks, or catastrophic regional disasters. Automated weekly snapshot archives and continuous incremental backups allow cloud infrastructure support teams to restore lost project directories and corrupted databases into active working environments swiftly and securely.\n\nFurthermore, regular, scheduled disaster recovery simulations ensure that support engineers can maintain uninterrupted business continuity even during severe server hardware failures. Proactive disaster recovery planning is an essential baseline service for modern cloud-based enterprises.\n\nRobust backup systems provide essential insurance against unpredictable digital disasters. Ensuring rapid data restoration capabilities protects organizations from catastrophic operational downtime.`,
    questions: [
      { id: 'rq_22_1', type: 'multiple_choice', question: 'What purpose do multi-layered backup and disaster recovery frameworks serve?', options: ['To protect critical client data against deletion, hardware failure, and cyber attacks.', 'To permanently delete all customer database records every weekend.', 'To increase monthly electricity consumption bills for server farms.', 'To bypass mandatory cybersecurity password audits.'], correctAnswer: 'To protect critical client data against deletion, hardware failure, and cyber attacks.' },
      { id: 'rq_22_2', type: 'multiple_choice', question: 'What do automated weekly snapshot archives allow support teams to accomplish?', options: ['Restore lost project directories and corrupted databases swiftly and securely.', 'Permanently lock user accounts out of enterprise workspaces.', 'Calculate monthly employee payroll taxes and deductions.', 'Design new marketing brochures for prospective clients.'], correctAnswer: 'Restore lost project directories and corrupted databases swiftly and securely.' },
      { id: 'rq_22_3', type: 'multiple_choice', question: 'Why are regular disaster recovery simulations conducted by support engineers?', options: ['To ensure the ability to maintain uninterrupted business continuity during failures.', 'To test employee typing speed benchmarks and keyboard proficiency.', 'To determine which customers are eligible for billing discounts.', 'To eliminate the need for customer service support desks.'], correctAnswer: 'To ensure the ability to maintain uninterrupted business continuity during failures.' },
      { id: 'rq_22_4', type: 'multiple_choice', question: 'What types of threats are mitigated by enterprise backup systems?', options: ['Accidental deletion, hardware failure, ransomware attacks, and disasters.', 'Customer complaints regarding billing statement errors.', 'Language barriers during cross-cultural support calls.', 'Suboptimal monitor viewing angles and ergonomic strain.'], correctAnswer: 'Accidental deletion, hardware failure, ransomware attacks, and disasters.' },
      { id: 'rq_22_5', type: 'multiple_choice', question: 'How is proactive disaster recovery planning classified for cloud enterprises?', options: ['As an essential baseline service.', 'As an optional, unnecessary luxury expense.', 'As a violation of international privacy laws.', 'As a temporary marketing experiment.'], correctAnswer: 'As an essential baseline service.' }
    ]
  },
  {
    id: 'read_23',
    title: 'Logistics Tracking and International Freight Customs',
    passage: `International freight forwarding and supply chain logistics involve complex customs clearance procedures, tariff classifications, bill of lading documentation, and strict border inspection requirements. When commercial shipments are held at international port inspection facilities due to missing manufacturer certificates of origin or incomplete customs declarations, logistics support agents must intervene immediately.\n\nAgents guide corporate importers through electronic submission protocols, verify commercial invoice details, and update tracking statuses to ensure transparent, continuous communication with clients. Efficient customs support prevents costly demurrage storage fees and eliminates supply chain bottlenecks.\n\nNavigating international trade regulations requires meticulous attention to detail. Expert logistics support ensures that global supply chains move smoothly across international borders without costly delays.`,
    questions: [
      { id: 'rq_23_1', type: 'multiple_choice', question: 'What elements are involved in international freight forwarding and logistics?', options: ['Customs clearance procedures, tariff classifications, and bill of lading documents.', 'Smart home IoT device wireless router configurations.', 'University student course registration holds and transcript waivers.', 'Healthcare plan formulary tiers and prescription copays.'], correctAnswer: 'Customs clearance procedures, tariff classifications, and bill of lading documents.' },
      { id: 'rq_23_2', type: 'multiple_choice', question: 'Why might commercial shipments be delayed at international port inspection facilities?', options: ['Excessive delivery vehicle fuel efficiency.', 'Missing manufacturer certificates of origin or incomplete customs declarations.', 'Agent typing speed falling below shift benchmarks.', 'Customer requests for free shipping upgrades.'], correctAnswer: 'Missing manufacturer certificates of origin or incomplete customs declarations.' },
      { id: 'rq_23_3', type: 'multiple_choice', question: 'What is the primary role of logistics support agents during customs clearance delays?', options: ['Confiscate shipments permanently without providing explanations.', 'Guide importers through electronic submission protocols and verify invoices.', 'Repackage commercial merchandise for personal employee use.', 'Bypass international shipping regulations and border controls entirely.'], correctAnswer: 'Guide importers through electronic submission protocols and verify invoices.' },
      { id: 'rq_23_4', type: 'multiple_choice', question: 'What negative financial impact is prevented by efficient customs support?', options: ['Costly demurrage storage fees and supply chain bottlenecks.', 'Mandatory employee salary increases and bonuses.', 'Increases in corporate income tax rates.', 'Reductions in shipping container manufacturing.'], correctAnswer: 'Costly demurrage storage fees and supply chain bottlenecks.' },
      { id: 'rq_23_5', type: 'multiple_choice', question: 'Why is updating tracking statuses emphasized during logistics support interactions?', options: ['To ensure transparent, continuous communication with corporate clients.', 'To trick customers into paying hidden shipping surcharges.', 'To prolong call handle times and inflate productivity metrics.', 'To eliminate the requirement for CRM ticket logging.'], correctAnswer: 'To ensure transparent, continuous communication with corporate clients.' }
    ]
  },
  {
    id: 'read_24',
    title: 'Hospitality Concierge Services and Guest Experience',
    passage: `Hospitality support desks and hotel concierge teams manage complex room reservations, luxury upgrades, special dietary requests, and seamless transportation arrangements for traveling guests. Exceptional guest service requires extraordinary attention to detail, proactive problem-solving, and personalized, empathetic communication to ensure memorable travel experiences.\n\nWhether arranging private airport limousine transfers, booking exclusive theater tickets, or resolving room amenity complaints swiftly, hospitality agents represent the vital frontline of brand reputation. Delivering flawless concierge service transforms ordinary hotel stays into extraordinary brand loyalty.\n\nCreating memorable guest experiences requires a passion for service excellence. Hospitality professionals elevate hotel brands by anticipating guest needs and delivering flawless personalized care.`,
    questions: [
      { id: 'rq_24_1', type: 'multiple_choice', question: 'What responsibilities do hospitality support desks and concierge teams manage?', options: ['Room reservations, luxury upgrades, dietary requests, and transportation.', 'Corporate software source code repositories and database migrations.', 'Industrial manufacturing equipment repairs and maintenance.', 'Financial stock portfolio investments and wire transfers.'], correctAnswer: 'Room reservations, luxury upgrades, dietary requests, and transportation.' },
      { id: 'rq_24_2', type: 'multiple_choice', question: 'What attributes are required to deliver exceptional hospitality guest service?', options: ['Extraordinary attention to detail, proactive problem-solving, and empathy.', 'Rigid script compliance without listening to guest preferences.', 'Aggressive sales tactics and high-pressure upselling.', 'Indifference to guest complaints and slow response times.'], correctAnswer: 'Extraordinary attention to detail, proactive problem-solving, and empathy.' },
      { id: 'rq_24_3', type: 'multiple_choice', question: 'What role do hospitality agents represent for luxury hotel brands?', options: ['The vital frontline of brand reputation and guest satisfaction.', 'The internal accounting and tax auditing committee.', 'The software engineering maintenance and server crew.', 'The legal compliance and regulatory oversight board.'], correctAnswer: 'The vital frontline of brand reputation and guest satisfaction.' },
      { id: 'rq_24_4', type: 'multiple_choice', question: 'Which services might a hotel concierge team coordinate for traveling guests?', options: ['Airport limousine transfers, theater tickets, and amenity resolutions.', 'Commercial freight shipping customs clearance.', 'Residential utility meter calibration and power bill disputes.', 'University student financial aid scholarship disbursements.'], correctAnswer: 'Airport limousine transfers, theater tickets, and amenity resolutions.' },
      { id: 'rq_24_5', type: 'multiple_choice', question: 'What is the ultimate outcome of delivering flawless concierge service?', options: ['Transforms ordinary hotel stays into extraordinary brand loyalty.', 'Forces guests to cancel their upcoming vacation bookings.', 'Increases hotel operational overhead expenses unnecessarily.', 'Eliminates the requirement for front desk check-in staff.'], correctAnswer: 'Transforms ordinary hotel stays into extraordinary brand loyalty.' }
    ]
  },
  {
    id: 'read_25',
    title: 'Renewable Energy Inverter Diagnostics and Solar Support',
    passage: `Renewable energy customer support teams assist homeowners and commercial enterprises in troubleshooting solar panel installations, battery storage banks, and grid-tied inverter error codes. When a solar inverter displays a grid synchronization timeout error or an isolation resistance fault, technical agents guide users through safe system reset procedures and firmware diagnostics remotely.\n\nUnderstanding electrical terminology and photovoltaic principles enables support staff to resolve hardware queries efficiently without requiring unnecessary, costly on-site technician dispatches. Remote technical triage promotes sustainable energy adoption by reducing maintenance overhead.\n\nSolar technology support bridges complex electrical engineering and consumer accessibility. Empowering users with remote diagnostic guidance accelerates the global transition toward clean renewable energy sources.`,
    questions: [
      { id: 'rq_25_1', type: 'multiple_choice', question: 'What do renewable energy customer support teams assist clients with?', options: ['Troubleshooting solar panel installations, battery storage, and inverter codes.', 'Managing commercial airline flight reservations and cancellations.', 'Auditing municipal water utility meters and plumbing leaks.', 'Processing automobile insurance collision claims and adjusting payouts.'], correctAnswer: 'Troubleshooting solar panel installations, battery storage, and inverter codes.' },
      { id: 'rq_25_2', type: 'multiple_choice', question: 'What technical issues might a solar inverter display during failures?', options: ['Grid synchronization timeout errors or isolation resistance faults.', 'Encrypted multi-factor authentication token expirations.', 'Corporate payroll tax withholding calculation discrepancies.', 'University student course registration hold notices.'], correctAnswer: 'Grid synchronization timeout errors or isolation resistance faults.' },
      { id: 'rq_25_3', type: 'multiple_choice', question: 'What is a major operational benefit of resolving hardware queries remotely?', options: ['Avoids unnecessary, costly on-site technician dispatches.', 'Automatically doubles solar panel energy generation output.', 'Eliminates the need for customer identity verification.', 'Bypasses local electrical safety codes and regulations.'], correctAnswer: 'Avoids unnecessary, costly on-site technician dispatches.' },
      { id: 'rq_25_4', type: 'multiple_choice', question: 'What foundational knowledge enables support staff to troubleshoot solar systems?', options: ['Electrical terminology and photovoltaic operating principles.', 'Advanced macroeconomic forecasting and financial accounting.', 'International freight customs brokerage regulations.', 'Hospitality concierge reservation management.'], correctAnswer: 'Electrical terminology and photovoltaic operating principles.' },
      { id: 'rq_25_5', type: 'multiple_choice', question: 'How does remote technical triage impact the renewable energy sector?', options: ['Promotes sustainable energy adoption by reducing maintenance overhead.', 'Discourages homeowners from installing solar panels.', 'Increases reliance on fossil fuel power generation.', 'Forces utilities to shut down electrical grids during daylight.'], correctAnswer: 'Promotes sustainable energy adoption by reducing maintenance overhead.' }
    ]
  },
  {
    id: 'read_26',
    title: 'Academic Enrollment Verification and Student Services',
    passage: `University student services desks handle complex course registration holds, tuition payment verification inquiries, official transcript waivers, and graduation eligibility audits. When academic holds block students from registering for upcoming semesters due to unpaid lab fees or missing immunization records, support staff must provide clear, compassionate guidance on required document submissions and departmental clearance procedures.\n\nMaintaining patience and administrative accuracy ensures that students navigate university bureaucracy smoothly and remain successfully on track for timely graduation.\n\nStudent support services play a pivotal role in academic retention. Compassionate administrative guidance helps students overcome bureaucratic hurdles and achieve their educational goals.`,
    questions: [
      { id: 'rq_26_1', type: 'multiple_choice', question: 'What responsibilities do university student services desks handle?', options: ['Course registration holds, tuition verification, and graduation audits.', 'Corporate enterprise software database deployments and migrations.', 'Commercial real estate property leasing and tenant management.', 'Automotive vehicle insurance underwriting and risk assessment.'], correctAnswer: 'Course registration holds, tuition verification, and graduation audits.' },
      { id: 'rq_26_2', type: 'multiple_choice', question: 'What common issues trigger academic registration blocks for students?', options: ['Unpaid lab fees or missing immunization records.', 'Upgrading subscription tiers to enterprise software.', 'Filing automotive insurance collision claims.', 'Booking luxury hotel concierge reservations.'], correctAnswer: 'Unpaid lab fees or missing immunization records.' },
      { id: 'rq_26_3', type: 'multiple_choice', question: 'What is the role of support staff when academic registration holds occur?', options: ['Provide clear, compassionate guidance on required document submissions.', 'Expel students from the university immediately without appeal.', 'Double the student tuition fee balance owed to the bursar.', 'Delete academic transcript records from the database.'], correctAnswer: 'Provide clear, compassionate guidance on required document submissions.' },
      { id: 'rq_26_4', type: 'multiple_choice', question: 'Why are patience and administrative accuracy emphasized in student services?', options: ['To help students navigate university bureaucracy smoothly and graduate on time.', 'To encourage students to drop out of higher education programs.', 'To increase university administrative overhead revenue.', 'To eliminate the need for academic faculty advisors.'], correctAnswer: 'To help students navigate university bureaucracy smoothly and graduate on time.' },
      { id: 'rq_26_5', type: 'multiple_choice', question: 'What is the ultimate objective of student services support?', options: ['Equitable access and successful student progression toward graduation.', 'Maximizing financial penalties for minor registration delays.', 'Enforcing strict corporate dress codes on campus grounds.', 'Managing commercial supply chain freight shipments.'], correctAnswer: 'Equitable access and successful student progression toward graduation.' }
    ]
  },
  {
    id: 'read_27',
    title: 'Automotive Insurance Claims and Accident Adjusting',
    passage: `Automotive insurance claims departments guide policyholders through stressful post-accident reporting, repair shop dispatch, rental vehicle coordination, and damage reimbursement processing. When an insurance adjuster approves a collision claim, support coordinators arrange direct deposit payouts or authorize repair shop guarantees.\n\nClear, empathetic communication during high-stress post-accident situations helps alleviate client anxiety, eliminates procedural confusion, and builds enduring trust in the insurance provider.\n\nHandling insurance claims requires a delicate balance of procedural compliance and emotional empathy. Guiding clients through difficult post-accident procedures solidifies brand loyalty when customers need support the most.`,
    questions: [
      { id: 'rq_27_1', type: 'multiple_choice', question: 'What do automotive insurance claims departments guide policyholders through?', options: ['Post-accident reporting, repair shop dispatch, and damage reimbursement.', 'Purchasing brand new luxury sports cars and racing accessories.', 'Upgrading residential home solar panel energy systems.', 'Booking international vacation flights and hotel suites.'], correctAnswer: 'Post-accident reporting, repair shop dispatch, and damage reimbursement.' },
      { id: 'rq_27_2', type: 'multiple_choice', question: 'What actions do support coordinators take once a collision claim is approved?', options: ['Arrange direct deposit payouts or authorize repair shop guarantees.', 'Cancel the policyholder’s insurance coverage permanently.', 'Force the policyholder to pay double their deductible.', 'Transfer the claim to an unrelated retail marketplace.'], correctAnswer: 'Arrange direct deposit payouts or authorize repair shop guarantees.' },
      { id: 'rq_27_3', type: 'multiple_choice', question: 'Why is clear, empathetic communication vital during post-accident support?', options: ['To alleviate client anxiety, eliminate confusion, and build brand trust.', 'To convince the policyholder to purchase unnecessary vehicle upgrades.', 'To prolong call handle times and inflate productivity metrics.', 'To discourage clients from filing future insurance claims.'], correctAnswer: 'To alleviate client anxiety, eliminate confusion, and build brand trust.' },
      { id: 'rq_27_4', type: 'multiple_choice', question: 'What type of situation characterizes inbound calls to insurance claims desks?', options: ['Stressful post-accident emergencies.', 'Relaxed leisure travel planning inquiries.', 'Routine software password reset requests.', 'Smart home IoT device configuration.'], correctAnswer: 'Stressful post-accident emergencies.' },
      { id: 'rq_27_5', type: 'multiple_choice', question: 'What service is coordinated alongside vehicle repairs for stranded policyholders?', options: ['Rental vehicle coordination.', 'Complimentary airline ticket booking.', 'Emergency home security monitoring.', 'University tuition fee payment processing.'], correctAnswer: 'Rental vehicle coordination.' }
    ]
  },
  {
    id: 'read_28',
    title: 'Cryptocurrency Wallet Security and Two-Factor Recovery',
    passage: `Digital asset and cryptocurrency support desks handle complex, high-stakes security inquiries, including two-factor authentication (2FA) device loss, blockchain transaction delays, and cryptographic private key recovery. Because blockchain transactions are immutable and strictly irreversible by design, platform security protocols mandate rigorous identity verification before initiating manual account recovery.\n\nAgents must collect government-issued photo IDs, proof of address, and biometric selfie videos to prevent unauthorized wallet takeovers by malicious cyber actors. Absolute security rigor protects digital asset traders from permanent financial loss.\n\nIn the decentralized finance ecosystem, security is the ultimate priority. Enforcing strict multi-factor verification safeguards user assets against sophisticated social engineering and cyber attacks.`,
    questions: [
      { id: 'rq_28_1', type: 'multiple_choice', question: 'What inquiries do digital asset and cryptocurrency support desks handle?', options: ['2FA device loss, blockchain transaction delays, and private key recovery.', 'Hotel room reservation upgrades and concierge requests.', 'University student course registration holds and transcript waivers.', 'Corporate employee payroll direct deposit discrepancies.'], correctAnswer: '2FA device loss, blockchain transaction delays, and private key recovery.' },
      { id: 'rq_28_2', type: 'multiple_choice', question: 'Why do security protocols mandate rigorous identity verification for crypto wallets?', options: ['Because blockchain transactions are immutable and strictly irreversible.', 'Because digital assets have zero financial market value.', 'Because cryptocurrency exchanges are operated by local commercial banks.', 'Because users never misplace their authentication devices.'], correctAnswer: 'Because blockchain transactions are immutable and strictly irreversible.' },
      { id: 'rq_28_3', type: 'multiple_choice', question: 'What specific verification documents must agents collect for manual wallet recovery?', options: ['Government-issued photo IDs, proof of address, and biometric selfie videos.', 'Signed paper affidavits sent through standard postal mail.', 'Three utility bills from previous residential addresses.', 'An official corporate income tax return document.'], correctAnswer: 'Government-issued photo IDs, proof of address, and biometric selfie videos.' },
      { id: 'rq_28_4', type: 'multiple_choice', question: 'What threat are crypto support teams actively defending against with these protocols?', options: ['Unauthorized wallet takeovers and account theft by malicious cyber actors.', 'Slow internet connection speeds and router interference.', 'Customer complaints regarding high electrical power bills.', 'Delayed deliveries of online retail merchandise.'], correctAnswer: 'Unauthorized wallet takeovers and account theft by malicious cyber actors.' },
      { id: 'rq_28_5', type: 'multiple_choice', question: 'What is the ultimate goal of enforcing absolute security rigor in crypto support?', options: ['Protects digital asset traders from permanent, unrecoverable financial loss.', 'Eliminates the requirement for multi-factor authentication entirely.', 'Allows platforms to freeze customer funds indefinitely without cause.', 'Speeds up blockchain transaction confirmation times.'], correctAnswer: 'Protects digital asset traders from permanent, unrecoverable financial loss.' }
    ]
  },
  {
    id: 'read_29',
    title: 'Corporate Payroll Reconciliation and Tax Withholding',
    passage: `Corporate payroll assistance teams resolve complex employee inquiries regarding direct deposit routing discrepancies, state and federal tax withholding adjustments, and overtime pay calculations. When mid-month pay slips appear short due to statutory tax bracket modifications or unrecorded hours, payroll agents review timecard logs and tax tables to reconcile differences on upcoming pay cycles.\n\nTransparent, patient explanation of payroll deductions prevents internal employee confusion, eliminates workplace frustration, and fosters enduring organizational trust.\n\nAccurate payroll administration is essential for employee morale. Resolving financial discrepancies with transparency and care reinforces internal organizational stability and trust.`,
    questions: [
      { id: 'rq_29_1', type: 'multiple_choice', question: 'What inquiries do corporate payroll assistance teams resolve for employees?', options: ['Direct deposit discrepancies, tax withholding adjustments, and overtime pay.', 'Customer product shipping delays and lost retail merchandise.', 'Hotel room reservation upgrades and concierge services.', 'Smart home IoT device Wi-Fi network connectivity.'], correctAnswer: 'Direct deposit discrepancies, tax withholding adjustments, and overtime pay.' },
      { id: 'rq_29_2', type: 'multiple_choice', question: 'What actions do payroll agents take when a pay slip discrepancy is reported?', options: ['Review timecard logs and tax tables to reconcile differences on upcoming cycles.', 'Immediately terminate the employee without investigating the timecard.', 'Deduct double the disputed amount from the employee’s next paycheck.', 'Transfer the employee file to an external retail marketplace.'], correctAnswer: 'Review timecard logs and tax tables to reconcile differences on upcoming cycles.' },
      { id: 'rq_29_3', type: 'multiple_choice', question: 'What causes mid-month pay slips to appear shorter than expected?', options: ['Statutory tax bracket modifications or unrecorded working hours.', 'Excessive rewards points earned through corporate credit cards.', 'Upgrading software workspace licenses to enterprise tiers.', 'Booking international travel through corporate concierge desks.'], correctAnswer: 'Statutory tax bracket modifications or unrecorded working hours.' },
      { id: 'rq_29_4', type: 'multiple_choice', question: 'Why is transparent explanation of payroll deductions emphasized by support teams?', options: ['To prevent employee confusion, eliminate frustration, and foster trust.', 'To justify reducing employee salaries across all departments.', 'To complicate financial accounting records intentionally.', 'To eliminate the requirement for timecard tracking systems.'], correctAnswer: 'To prevent employee confusion, eliminate frustration, and foster trust.' },
      { id: 'rq_29_5', type: 'multiple_choice', question: 'Which department manages employee compensation and tax inquiries?', options: ['Corporate payroll assistance teams.', 'E-commerce marketplace dispute mediation.', 'Telehealth virtual medical coordination.', 'Renewable energy inverter diagnostics.'], correctAnswer: 'Corporate payroll assistance teams.' }
    ]
  },
  {
    id: 'read_30',
    title: 'Smart Home IoT Device Troubleshooting and Connectivity',
    passage: `Smart home technology support desks assist consumers with Internet of Things (IoT) device configuration, including automated thermostats, smart security cameras, wireless lighting bridges, and voice assistant hubs. When wireless network connectivity fails due to router band congestion or firewall restrictions, technical agents guide users through hardware reset sequences, 2.4GHz band selection, and static IP allocation.\n\nClear, patient, step-by-step technical instructions empower non-technical consumers to establish stable, secure smart home ecosystems effortlessly.\n\nSmart home support requires translating complex networking concepts into accessible advice. Patient troubleshooting ensures that users enjoy seamless automation without technical frustration.`,
    questions: [
      { id: 'rq_30_1', type: 'multiple_choice', question: 'What devices do smart home technology support desks assist consumers with?', options: ['Automated thermostats, smart security cameras, and wireless hubs.', 'Heavy industrial manufacturing machinery and robotic assembly arms.', 'Commercial airliner cockpit navigation systems and radar.', 'Automotive engine transmission parts and braking systems.'], correctAnswer: 'Automated thermostats, smart security cameras, and wireless hubs.' },
      { id: 'rq_30_2', type: 'multiple_choice', question: 'What common issues cause smart home wireless connectivity to fail?', options: ['Router band congestion or strict firewall security restrictions.', 'University student course registration holds and tuition fees.', 'Automotive insurance collision claim documentation errors.', 'Corporate payroll tax withholding bracket modifications.'], correctAnswer: 'Router band congestion or strict firewall security restrictions.' },
      { id: 'rq_30_3', type: 'multiple_choice', question: 'What solutions do technical agents guide users through during connectivity failures?', options: ['Hardware reset sequences, 2.4GHz band selection, and static IP allocation.', 'Complete physical rewiring of household electrical circuits.', 'Upgrading residential water utility meter hardware.', 'Filing formal legal complaints against internet providers.'], correctAnswer: 'Hardware reset sequences, 2.4GHz band selection, and static IP allocation.' },
      { id: 'rq_30_4', type: 'multiple_choice', question: 'What is the operational impact of providing clear, step-by-step technical instructions?', options: ['Empowers non-technical consumers to establish stable smart home ecosystems.', 'Forces users to hire professional electricians for minor setup tasks.', 'Increases the return rate of smart home hardware products.', 'Lengthens support call handle times indefinitely.'], correctAnswer: 'Empowers non-technical consumers to establish stable smart home ecosystems.' },
      { id: 'rq_30_5', type: 'multiple_choice', question: 'What does the acronym IoT stand for in consumer technology?', options: ['Internet of Things.', 'Internal Operational Telemetry.', 'Interactive Online Terminal.', 'Instant Offshore Transfer.'], correctAnswer: 'Internet of Things.' }
    ]
  },
  {
    id: 'read_31',
    title: 'Utility Meter Calibration and Power Bill Disputes',
    passage: `Utility customer care departments handle complex monthly billing inquiries, power consumption spikes, and digital smart meter calibration disputes. When a residential customer reports an unexpectedly high electric bill, support teams can analyze interval consumption data or dispatch certified technicians to inspect meter hardware for mechanical reading errors and software firmware glitches.\n\nTransparent, methodical investigation processes reassure consumers, correct billing inaccuracies, and ensure absolute fairness across municipal utility service providers.\n\nFair utility billing is vital for consumer confidence. Investigating consumption disputes thoroughly preserves trust between utility providers and the communities they serve.`,
    questions: [
      { id: 'rq_31_1', type: 'multiple_choice', question: 'What issues do utility customer care departments handle?', options: ['Billing inquiries, power consumption spikes, and meter calibration disputes.', 'Enterprise cloud storage file restoration and backup sync.', 'Cryptocurrency wallet security and private key recovery.', 'University student academic enrollment transcript waivers.'], correctAnswer: 'Billing inquiries, power consumption spikes, and meter calibration disputes.' },
      { id: 'rq_31_2', type: 'multiple_choice', question: 'What actions can support teams take when a customer reports an unexpectedly high bill?', options: ['Analyze interval consumption data or dispatch certified technicians for inspection.', 'Immediately disconnect the customer’s electrical service permanently.', 'Issue arbitrary cash refunds without investigating the root cause.', 'Force the customer to replace all household appliances.'], correctAnswer: 'Analyze interval consumption data or dispatch certified technicians for inspection.' },
      { id: 'rq_31_3', type: 'multiple_choice', question: 'What potential problems are certified technicians looking for during meter inspections?', options: ['Mechanical reading errors and software firmware glitches.', 'Encrypted multi-factor authentication token expirations.', 'Corporate payroll direct deposit routing discrepancies.', 'Expired software workspace licensing agreements.'], correctAnswer: 'Mechanical reading errors and software firmware glitches.' },
      { id: 'rq_31_4', type: 'multiple_choice', question: 'What is the primary goal of transparent utility meter investigations?', options: ['Reassure consumers, correct billing inaccuracies, and ensure absolute fairness.', 'Increase municipal electricity generation capacity during summer months.', 'Eliminate the requirement for monthly meter reading collections.', 'Reduce overall household water and electricity consumption.'], correctAnswer: 'Reassure consumers, correct billing inaccuracies, and ensure absolute fairness.' },
      { id: 'rq_31_5', type: 'multiple_choice', question: 'What technology measures modern residential electricity consumption?', options: ['Digital smart meters.', 'Analog mechanical pressure gauges.', 'Radio frequency broadcast receivers.', 'Thermal infrared imaging sensors.'], correctAnswer: 'Digital smart meters.' }
    ]
  },
  {
    id: 'read_32',
    title: 'Mobile Roaming Add-ons and International Travel Care',
    passage: `Mobile telecommunications care desks assist subscribers with international travel preparation, roaming data package selection, and global network coverage verification. When clients prepare to travel abroad, support agents recommend activating unlimited international roaming data passes or regional carrier bundles to prevent exorbitant overage fees from appearing on their upcoming monthly billing statements.\n\nProactive travel advisories protect consumers from unexpected financial surprises and significantly enhance mobile carrier customer satisfaction scores.\n\nProactive customer care prevents billing shock. Advising travelers on roaming options builds enduring brand loyalty and prevents costly service disputes.`,
    questions: [
      { id: 'rq_32_1', type: 'multiple_choice', question: 'What do mobile telecommunications care desks assist subscribers with?', options: ['International travel preparation, roaming data packages, and coverage verification.', 'Booking international hotel accommodations and luxury cruise liners.', 'Filing airline baggage loss and flight cancellation compensation claims.', 'Insuring personal luggage against theft during international transit.'], correctAnswer: 'International travel preparation, roaming data packages, and coverage verification.' },
      { id: 'rq_32_2', type: 'multiple_choice', question: 'What do support agents recommend when clients prepare to travel abroad?', options: ['Activating unlimited roaming data passes or regional carrier bundles.', 'Removing the SIM card from their mobile device permanently.', 'Switching to domestic landline telephone services.', 'Purchasing foreign currency exchange reserves.'], correctAnswer: 'Activating unlimited roaming data passes or regional carrier bundles.' },
      { id: 'rq_32_3', type: 'multiple_choice', question: 'What negative financial issue do proactive roaming advisories prevent?', options: ['Exorbitant overage fees appearing on upcoming monthly billing statements.', 'Accidental double-payment of cellular subscription invoices.', 'Unauthorized bank wire transfer fraud by foreign actors.', 'Unexpected charges for domestic voice call minutes.'], correctAnswer: 'Exorbitant overage fees appearing on upcoming monthly billing statements.' },
      { id: 'rq_32_4', type: 'multiple_choice', question: 'How do proactive travel advisories impact mobile carrier operations?', options: ['Enhance mobile carrier customer satisfaction scores.', 'Increase customer churn and subscription cancellations.', 'Inflate average handle times across all voice support queues.', 'Eliminate the requirement for billing dispute mediation.'], correctAnswer: 'Enhance mobile carrier customer satisfaction scores.' },
      { id: 'rq_32_5', type: 'multiple_choice', question: 'What type of service inquiry is handled by mobile roaming care desks?', options: ['International travel telecommunication planning.', 'Smart home IoT device Wi-Fi configuration.', 'University financial aid scholarship disbursement.', 'Automotive insurance collision claim reporting.'], correctAnswer: 'International travel telecommunication planning.' }
    ]
  },
  {
    id: 'read_33',
    title: 'Healthcare Plan Formularies and Prescription Coverage',
    passage: `Healthcare insurance plan support desks answer member inquiries regarding medical deductible limits, specialist copay structures, and prescription drug formulary classifications. Generic medications are typically categorized under Tier-1 formularies, providing full insurance coverage without requiring prior physician authorization or high out-of-pocket copays. Brand-name and specialty drugs often require tiered approvals.\n\nClear, precise explanation of insurance benefits empowers patients to manage their pharmaceutical expenses effectively and navigate healthcare coverage confidently.\n\nNavigating healthcare benefits requires clarity and compassion. Support desks help patients understand their prescription coverage, ensuring they receive necessary medical treatments without unexpected financial burden.`,
    questions: [
      { id: 'rq_33_1', type: 'multiple_choice', question: 'What do healthcare insurance plan support desks answer member inquiries about?', options: ['Medical deductibles, specialist copays, and prescription drug formularies.', 'Commercial enterprise software workspace licensing upgrades.', 'International freight customs clearance tariff classifications.', 'Smart home wireless router configuration and band selection.'], correctAnswer: 'Medical deductibles, specialist copays, and prescription drug formularies.' },
      { id: 'rq_33_2', type: 'multiple_choice', question: 'Under which formulary tier are generic medications typically categorized?', options: ['Tier-1 formulary, providing full coverage without prior authorization.', 'Tier-4 premium specialty formulary requiring executive board approval.', 'Exclusion medication list prohibiting all insurance coverage.', 'Pending authorization queue requiring physical paper affidavits.'], correctAnswer: 'Tier-1 formulary, providing full coverage without prior authorization.' },
      { id: 'rq_33_3', type: 'multiple_choice', question: 'What types of drugs frequently require tiered prior authorizations from insurers?', options: ['Brand-name and specialty medications.', 'Standard generic over-the-counter pain relievers.', 'Basic first-aid medical supplies and bandages.', 'Tier-1 routine maintenance pharmaceuticals.'], correctAnswer: 'Brand-name and specialty medications.' },
      { id: 'rq_33_4', type: 'multiple_choice', question: 'What is the operational benefit of clearly explaining insurance plan benefits?', options: ['Empowers patients to manage pharmaceutical expenses effectively.', 'Eliminates all prescription medication side effects permanently.', 'Guarantees immediate, same-day appointment scheduling with specialists.', 'Bypasses federal healthcare privacy regulations like HIPAA.'], correctAnswer: 'Empowers patients to manage pharmaceutical expenses effectively.' },
      { id: 'rq_33_5', type: 'multiple_choice', question: 'What aspect of healthcare plans do members inquire about regarding copays?', options: ['Specialist copay structures and deductible limits.', 'Cloud storage file backup synchronization schedules.', 'Corporate payroll tax withholding deductions.', 'Utility smart meter calibration error codes.'], correctAnswer: 'Specialist copay structures and deductible limits.' }
    ]
  },
  {
    id: 'read_34',
    title: 'Flight Itinerary Rebooking and Weather Delay Management',
    passage: `Airlines and travel booking support agencies manage complex passenger rebooking, flight cancellation notices, and baggage tracking during severe regional weather disruptions. When severe thunderstorms or blizzard conditions cause widespread runway closures and strand connecting passengers, travel coordinators must act swiftly to secure seats on upcoming available departures at no extra charge.\n\nCalm, efficient rebooking minimizes passenger stress, prevents terminal overcrowding, and maintains carrier reliability during turbulent travel emergencies.\n\nWeather disruptions test airline operational resilience. Efficient rebooking minimizes passenger distress and preserves brand trust during uncontrollable travel crises.`,
    questions: [
      { id: 'rq_34_1', type: 'multiple_choice', question: 'What do travel booking agencies manage during severe weather disruptions?', options: ['Passenger rebooking, flight cancellations, and baggage tracking.', 'Commercial cargo shipping customs clearance and tariffs.', 'Residential home security alarm monitoring and panic buttons.', 'University student course registration holds and transcripts.'], correctAnswer: 'Passenger rebooking, flight cancellations, and baggage tracking.' },
      { id: 'rq_34_2', type: 'multiple_choice', question: 'What operational events cause widespread airport runway closures?', options: ['Severe thunderstorms or blizzard conditions.', 'Routine software code compilation updates.', 'Corporate payroll direct deposit routing discrepancies.', 'Smart home wireless router band congestion.'], correctAnswer: 'Severe thunderstorms or blizzard conditions.' },
      { id: 'rq_34_3', type: 'multiple_choice', question: 'What action must travel coordinators take when connecting passengers are stranded?', options: ['Secure seats on upcoming available departures at no extra charge.', 'Charge passengers double the original ticket price for rescheduling.', 'Cancel all remaining vacation hotel and car rental bookings.', 'Advise passengers to walk to their final destination.'], correctAnswer: 'Secure seats on upcoming available departures at no extra charge.' },
      { id: 'rq_34_4', type: 'multiple_choice', question: 'Why is calm, efficient rebooking emphasized during travel emergencies?', options: ['Minimizes passenger stress and prevents airport terminal overcrowding.', 'Allows airlines to bypass aviation safety inspection regulations.', 'Eliminates the requirement for aircraft maintenance checks.', 'Forces passengers to purchase expensive first-class upgrades.'], correctAnswer: 'Minimizes passenger stress and prevents airport terminal overcrowding.' },
      { id: 'rq_34_5', type: 'multiple_choice', question: 'What organizational attribute is protected by managing weather delays effectively?', options: ['Carrier reliability and customer trust during turbulent emergencies.', 'Absolute perfection in employee typing speed metrics.', 'Total immunity to future mechanical aircraft failures.', 'Zero operational overhead expenses for fuel.'], correctAnswer: 'Carrier reliability and customer trust during turbulent emergencies.' }
    ]
  },
  {
    id: 'read_35',
    title: 'Software License Upgrades and Enterprise Workspaces',
    passage: `Software licensing support desks guide corporate organizations through the intricate transition from standard workspace tiers to comprehensive enterprise platforms. Enterprise license upgrades unlock advanced analytics dashboards, automated workflow triggers, single sign-on (SSO) security integrations, and 24/7 dedicated phone support for corporate development teams.\n\nTechnical account managers assist clients in migrating user permissions, mapping custom domains, and configuring enterprise security integrations smoothly without interrupting daily business workflows.\n\nEnterprise software transitions require specialized technical guidance. Account managers ensure that large-scale migrations occur seamlessly, maximizing the client's return on investment.`,
    questions: [
      { id: 'rq_35_1', type: 'multiple_choice', question: 'What do software licensing support desks guide organizations through?', options: ['Transitioning from standard workspace tiers to enterprise platforms.', 'Filing automotive insurance collision damage claims.', 'Managing university student financial aid scholarship funds.', 'Processing international freight customs clearance documentation.'], correctAnswer: 'Transitioning from standard workspace tiers to enterprise platforms.' },
      { id: 'rq_35_2', type: 'multiple_choice', question: 'What advanced features do software enterprise upgrades unlock?', options: ['Analytics dashboards, automated triggers, SSO security, and 24/7 support.', 'Offline desktop video editing tools for personal home videos.', 'Free physical hardware server delivery and on-site installation.', 'Unlimited personal cloud storage for family photo albums.'], correctAnswer: 'Analytics dashboards, automated triggers, SSO security, and 24/7 support.' },
      { id: 'rq_35_3', type: 'multiple_choice', question: 'What responsibilities do technical account managers handle during upgrades?', options: ['Migrating user permissions, mapping domains, and configuring security integrations.', 'Auditing employee monthly personal income tax returns.', 'Managing hotel room reservation upgrades and concierge requests.', 'Calibrating residential digital electricity consumption meters.'], correctAnswer: 'Migrating user permissions, mapping domains, and configuring security integrations.' },
      { id: 'rq_35_4', type: 'multiple_choice', question: 'Why is smooth migration planning emphasized during enterprise software transitions?', options: ['To prevent interrupting daily business workflows and operations.', 'To force employees to work overtime hours without pay.', 'To complicate database management structures intentionally.', 'To eliminate the requirement for user account authentication.'], correctAnswer: 'To prevent interrupting daily business workflows and operations.' },
      { id: 'rq_35_5', type: 'multiple_choice', question: 'Who benefits primarily from enterprise license upgrade support?', options: ['Corporate development teams and enterprise clients.', 'Individual consumers seeking personal photo editing apps.', 'Independent third-party retail e-commerce vendors.', 'Students navigating university academic registration holds.'], correctAnswer: 'Corporate development teams and enterprise clients.' }
    ]
  },
  {
    id: 'read_36',
    title: 'Banking Fraud Detection and Unauthorized Transactions',
    passage: `Banking fraud detection units monitor real-time account activity for suspicious overseas login locations, anomalous point-of-sale card purchases, and identity theft indicators. When an unrecognized, high-value transaction is flagged by machine-learning algorithms, fraud specialists contact account holders immediately via secure channels to verify purchase authenticity and instantly freeze compromised debit or credit cards.\n\nRapid, proactive fraud intervention safeguards customer liquid funds and preserves banking institutional security integrity.\n\nFinancial security demands constant technological vigilance. Automated monitoring combined with rapid human intervention protects consumers from devastating financial fraud.`,
    questions: [
      { id: 'rq_36_1', type: 'multiple_choice', question: 'What do banking fraud detection units monitor real-time account activity for?', options: ['Suspicious overseas logins, anomalous card purchases, and identity theft indicators.', 'Delayed courier deliveries for online retail shopping orders.', 'University student academic enrollment transcript verification.', 'Hotel room reservation upgrade requests and concierge bookings.'], correctAnswer: 'Suspicious overseas logins, anomalous card purchases, and identity theft indicators.' },
      { id: 'rq_36_2', type: 'multiple_choice', question: 'What triggers an immediate fraud alert within automated banking systems?', options: ['An unrecognized, high-value transaction flagged by machine-learning algorithms.', 'A routine monthly subscription payment for streaming services.', 'A standard ATM cash withdrawal within the cardholder’s home city.', 'An online bookstore purchase made during normal business hours.'], correctAnswer: 'An unrecognized, high-value transaction flagged by machine-learning algorithms.' },
      { id: 'rq_36_3', type: 'multiple_choice', question: 'What actions do fraud specialists take immediately upon flagging a suspicious charge?', options: ['Contact account holders via secure channels to verify authenticity and freeze cards.', 'Transfer the disputed funds into an external offshore bank account.', 'Close the customer’s bank account permanently without notification.', 'Ignore the alert until the customer submits a written complaint.'], correctAnswer: 'Contact account holders via secure channels to verify authenticity and freeze cards.' },
      { id: 'rq_36_4', type: 'multiple_choice', question: 'What is the primary objective of rapid, proactive fraud intervention?', options: ['Safeguard customer liquid funds and preserves banking security integrity.', 'Increase bank credit card interest rates and annual membership fees.', 'Delay wire transfers until further administrative notice is given.', 'Promote optional wealth management and investment advisory services.'], correctAnswer: 'Safeguard customer liquid funds and preserves banking security integrity.' },
      { id: 'rq_36_5', type: 'multiple_choice', question: 'What technology assists fraud units in identifying anomalous transactions?', options: ['Machine-learning algorithms.', 'Analog mechanical pressure gauges.', 'Manual paper ledger accounting books.', 'Radio frequency broadcast scanners.'], correctAnswer: 'Machine-learning algorithms.' }
    ]
  },
  {
    id: 'read_37',
    title: 'E-Commerce Marketplace Dispute Mediation and Refunds',
    passage: `E-commerce marketplace dispute mediation teams investigate complex buyer complaints regarding non-delivery, damaged merchandise, counterfeit goods, and misleading product descriptions. When a third-party merchant fails to resolve a customer service issue amicably or ignores return requests, marketplace dispute agents step in to review chat logs, issue direct refunds from escrow accounts, and penalize vendor performance ratings.\n\nFair, impartial dispute mediation maintains consumer confidence in online retail ecosystems.\n\nMarketplace integrity depends on equitable dispute resolution. Mediating conflicts fairly ensures that consumers can shop online with confidence and peace of mind.`,
    questions: [
      { id: 'rq_37_1', type: 'multiple_choice', question: 'What buyer complaints do e-commerce marketplace mediation teams investigate?', options: ['Non-delivery, damaged merchandise, counterfeit goods, and misleading descriptions.', 'Corporate payroll tax withholding and direct deposit routing errors.', 'Healthcare insurance plan prescription drug formulary classifications.', 'Smart home IoT device wireless router connectivity failures.'], correctAnswer: 'Non-delivery, damaged merchandise, counterfeit goods, and misleading descriptions.' },
      { id: 'rq_37_2', type: 'multiple_choice', question: 'When do marketplace dispute agents intervene in buyer-merchant transactions?', options: ['When a merchant fails to resolve an issue amicably or ignores return requests.', 'Before the customer has even completed their initial purchase checkout.', 'Only after law enforcement files a formal criminal indictment.', 'When the merchant requests an increase in commission percentages.'], correctAnswer: 'When a merchant fails to resolve an issue amicably or ignores return requests.' },
      { id: 'rq_37_3', type: 'multiple_choice', question: 'What corrective actions do dispute agents take against non-compliant merchants?', options: ['Review chat logs, issue direct refunds from escrow, and penalize ratings.', 'Award the merchant premium placement on the marketplace homepage.', 'Exempt the vendor from all future marketplace compliance audits.', 'Double the merchant’s payout distribution speed.'], correctAnswer: 'Review chat logs, issue direct refunds from escrow, and penalize ratings.' },
      { id: 'rq_37_4', type: 'multiple_choice', question: 'Why is fair, impartial dispute mediation essential for online retail platforms?', options: ['Maintains consumer confidence and trust in online retail ecosystems.', 'Forces buyers to accept damaged merchandise without recourse.', 'Increases shipping logistics costs for independent sellers.', 'Eliminates the requirement for customer support departments.'], correctAnswer: 'Maintains consumer confidence and trust in online retail ecosystems.' },
      { id: 'rq_37_5', type: 'multiple_choice', question: 'Where are direct buyer refunds typically sourced from during disputes?', options: ['Escrow accounts.', 'The personal salary of the support agent.', 'Municipal government tax revenues.', 'International freight customs tariffs.'], correctAnswer: 'Escrow accounts.' }
    ]
  },
  {
    id: 'read_38',
    title: 'Home Security Monitoring and False Alarm Protocols',
    passage: `Residential home security monitoring stations process critical intrusion alerts, smoke and fire alarms, carbon monoxide warnings, and medical panic button signals from connected properties. When motion sensors or door contacts trigger false alarms due to environmental dust, contractors, or household pet movement, monitoring operators contact homeowners immediately using secure verbal passcodes to verify safety.\n\nStrict, methodical adherence to verification protocols prevents unnecessary, costly emergency responder dispatches to false alarms.\n\nHome security monitoring requires vigilance and precision. Verifying alerts before dispatching emergency services prevents wasted municipal resources and reassures homeowners.`,
    questions: [
      { id: 'rq_38_1', type: 'multiple_choice', question: 'What signals do residential home security monitoring stations process?', options: ['Intrusion alerts, fire alarms, carbon monoxide warnings, and panic buttons.', 'International commercial freight customs clearance documents.', 'University student academic enrollment transcript waivers.', 'Corporate employee payroll direct deposit reconciliation logs.'], correctAnswer: 'Intrusion alerts, fire alarms, carbon monoxide warnings, and panic buttons.' },
      { id: 'rq_38_2', type: 'multiple_choice', question: 'What common factors trigger false alarms in residential security systems?', options: ['Environmental dust, contractors, or household pet movement.', 'Encrypted multi-factor authentication token expirations.', 'Corporate enterprise software workspace license upgrades.', 'Utility digital smart meter calibration error codes.'], correctAnswer: 'Environmental dust, contractors, or household pet movement.' },
      { id: 'rq_38_3', type: 'multiple_choice', question: 'How do monitoring operators verify safety when motion sensors trigger alarms?', options: ['Contact homeowners immediately using secure verbal passcodes.', 'Dispatch local police tactical units immediately without calling.', 'Ignore the alarm signal entirely until the following morning.', 'Reset the household electrical circuit breaker box remotely.'], correctAnswer: 'Contact homeowners immediately using secure verbal passcodes.' },
      { id: 'rq_38_4', type: 'multiple_choice', question: 'What negative outcome is prevented by adhering strictly to verification protocols?', options: ['Unnecessary, costly emergency responder dispatches to false alarms.', 'Accidental cancellation of the homeowner’s insurance policy.', 'Permanent disconnection of residential electricity service.', 'Unexpected increases in monthly home security subscription fees.'], correctAnswer: 'Unnecessary, costly emergency responder dispatches to false alarms.' },
      { id: 'rq_38_5', type: 'multiple_choice', question: 'What type of environment is protected by home security monitoring stations?', options: ['Connected residential properties.', 'Commercial airline flight cockpits.', 'Cryptocurrency blockchain trading floors.', 'Hospital telehealth virtual consultation rooms.'], correctAnswer: 'Connected residential properties.' }
    ]
  },
  {
    id: 'read_39',
    title: 'Cloud Storage File Restoration and Backup Sync',
    passage: `Cloud storage support teams assist enterprise and consumer users in recovering accidentally deleted files, resolving complex folder synchronization conflicts, and managing granular shared team permissions. When users experience catastrophic data loss following accidental directory deletions or ransomware infection, support engineers restore files seamlessly from automated weekly snapshot archives or point-in-time backup versions.\n\nReliable, accessible file recovery services alleviate user anxiety, prevent data loss, and protect valuable digital assets across all devices.\n\nData resilience is critical in modern digital workflows. Cloud backup support ensures that users can recover from accidental deletions or cyber attacks without losing valuable work.`,
    questions: [
      { id: 'rq_39_1', type: 'multiple_choice', question: 'What do cloud storage support teams assist users with?', options: ['Recovering deleted files, resolving sync conflicts, and managing permissions.', 'Calibrating residential digital electricity consumption meters.', 'Processing automotive insurance collision damage claims.', 'Filing airline baggage loss and flight cancellation paperwork.'], correctAnswer: 'Recovering deleted files, resolving sync conflicts, and managing permissions.' },
      { id: 'rq_39_2', type: 'multiple_choice', question: 'What events lead users to request emergency data recovery assistance?', options: ['Accidental directory deletions or ransomware infections.', 'Routine software license agreement renewals.', 'Standard monthly subscription invoice payments.', 'Updating profile pictures on social media.'], correctAnswer: 'Accidental directory deletions or ransomware infections.' },
      { id: 'rq_39_3', type: 'multiple_choice', question: 'How do support engineers restore data following accidental user deletions?', options: ['From automated weekly snapshot archives or point-in-time versions.', 'By purchasing brand new computer hardware for the user.', 'By requesting physical paper letters through postal mail.', 'By reinstalling the computer’s operating system completely.'], correctAnswer: 'From automated weekly snapshot archives or point-in-time versions.' },
      { id: 'rq_39_4', type: 'multiple_choice', question: 'What benefits do reliable file recovery services provide to users?', options: ['Alleviate user anxiety, prevent data loss, and protect digital assets.', 'Increase monthly cloud storage subscription fees automatically.', 'Double the computer processor’s operating speed.', 'Eliminate the requirement for user account passwords.'], correctAnswer: 'Alleviate user anxiety, prevent data loss, and protect digital assets.' },
      { id: 'rq_39_5', type: 'multiple_choice', question: 'What scope of users is supported by cloud storage help desks?', options: ['Both enterprise and consumer users.', 'Independent third-party retail vendors exclusively.', 'University academic faculty members only.', 'Automotive insurance claims adjusters.'], correctAnswer: 'Both enterprise and consumer users.' }
    ]
  },
  {
    id: 'read_40',
    title: 'Telehealth Video Consultation Coordination',
    passage: `Telehealth coordination desks schedule virtual medical appointments, distribute encrypted video conference links, and verify patient insurance coverage and deductible status prior to clinical consultations. Coordinators ensure that digital waiting rooms function smoothly and that attending physicians receive complete patient medical intake forms and vital sign logs beforehand.\n\nEfficient, organized virtual clinic coordination expands healthcare accessibility for remote patients while maintaining strict clinical workflows.\n\nTelehealth coordination modernizes healthcare delivery. Seamless virtual clinic management ensures that patients receive timely care regardless of geographic boundaries.`,
    questions: [
      { id: 'rq_40_1', type: 'multiple_choice', question: 'What tasks do telehealth coordination desks perform prior to clinical consultations?', options: ['Schedule appointments, distribute encrypted links, and verify insurance coverage.', 'Perform physical surgical operations and prescribe heavy medications.', 'Audit hospital financial billing ledgers and tax returns.', 'Install hardware servers and configure wireless routers.'], correctAnswer: 'Schedule appointments, distribute encrypted links, and verify insurance coverage.' },
      { id: 'rq_40_2', type: 'multiple_choice', question: 'What documents must coordinators ensure physicians receive before appointments?', options: ['Patient medical intake forms and vital sign logs.', 'Corporate enterprise software workspace license agreements.', 'International freight shipping bill of lading documents.', 'Automotive insurance collision accident report forms.'], correctAnswer: 'Patient medical intake forms and vital sign logs.' },
      { id: 'rq_40_3', type: 'multiple_choice', question: 'What is the operational purpose of maintaining smooth digital waiting rooms?', options: ['To support efficient clinic coordination and clinical workflows.', 'To force patients to wait hours before seeing a doctor.', 'To increase the financial cost of telehealth consultations.', 'To eliminate the requirement for patient identity verification.'], correctAnswer: 'To support efficient clinic coordination and clinical workflows.' },
      { id: 'rq_40_4', type: 'multiple_choice', question: 'What primary benefit does efficient virtual clinic coordination provide?', options: ['Expands healthcare accessibility for remote patients.', 'Replaces licensed medical doctors with automated chat bots.', 'Reduces pharmaceutical drug manufacturing costs globally.', 'Bypasses all federal healthcare privacy regulations.'], correctAnswer: 'Expands healthcare accessibility for remote patients.' },
      { id: 'rq_40_5', type: 'multiple_choice', question: 'What type of communication links are distributed for video consultations?', options: ['Encrypted video conference links.', 'Unencrypted public chat room URLs.', 'Public social media broadcast streams.', 'Analog telephone audio conference lines.'], correctAnswer: 'Encrypted video conference links.' }
    ]
  },
  {
    id: 'read_41',
    title: 'Internet Service Provider Bandwidth Troubleshooting',
    passage: `Broadband internet support teams troubleshoot fiber optic and cable connection slowdowns, Wi-Fi router channel interference, and gateway authentication errors. When households experience severe bandwidth throttling or high packet loss during peak evening hours, technical representatives diagnose line attenuation, test signal-to-noise ratios, and reboot remote network ports.\n\nReliable, high-speed internet connectivity is essential for remote work, education, and digital communication across modern households.\n\nInternet support excellence keeps the digital world connected. Technical troubleshooting resolves complex network bottlenecks to deliver stable, high-speed broadband performance.`,
    questions: [
      { id: 'rq_41_1', type: 'multiple_choice', question: 'What issues do broadband internet support teams troubleshoot?', options: ['Connection slowdowns, Wi-Fi router interference, and gateway errors.', 'Hotel room reservation upgrades and concierge requests.', 'Corporate employee payroll tax withholding deductions.', 'Automotive insurance collision claim settlements.'], correctAnswer: 'Connection slowdowns, Wi-Fi router interference, and gateway errors.' },
      { id: 'rq_41_2', type: 'multiple_choice', question: 'What conditions occur when households experience severe network issues during peak hours?', options: ['Bandwidth throttling or high packet loss.', 'Instantaneous downloads of massive software files.', 'Absolute perfection in wireless signal strength.', 'Zero network latency across all connected devices.'], correctAnswer: 'Bandwidth throttling or high packet loss.' },
      { id: 'rq_41_3', type: 'multiple_choice', question: 'What diagnostic actions do technical representatives take during network slowdowns?', options: ['Diagnose line attenuation, test signal-to-noise ratios, and reboot ports.', 'Dispatch a handwritten postal letter to the subscriber’s home.', 'Increase the monthly internet subscription billing rate.', 'Disconnect the customer service telephone support line.'], correctAnswer: 'Diagnose line attenuation, test signal-to-noise ratios, and reboot ports.' },
      { id: 'rq_41_4', type: 'multiple_choice', question: 'Why is reliable internet connectivity emphasized for modern households?', options: ['Essential for remote work, education, and digital communication.', 'Required for operating automotive engine transmission parts.', 'Necessary for processing international freight customs tariffs.', 'Mandatory for auditing corporate tax return documents.'], correctAnswer: 'Essential for remote work, education, and digital communication.' },
      { id: 'rq_41_5', type: 'multiple_choice', question: 'What type of connection infrastructure is supported by broadband help desks?', options: ['Fiber optic and cable connections.', 'Analog dial-up telephone lines only.', 'Radio frequency broadcast towers.', 'Postal mail delivery networks.'], correctAnswer: 'Fiber optic and cable connections.' }
    ]
  },
  {
    id: 'read_42',
    title: 'Subscription Retention and Loyalty Discount Management',
    passage: `Customer retention desks manage subscription cancellations by offering tailored loyalty discounts, billing cycle flexibility, and valuable feature upgrade incentives. When subscribers request account closure due to cost concerns, retention specialists analyze platform usage telemetry data to propose customized, cost-saving service bundles that address the user's specific operational needs.\n\nEffective retention strategies protect valuable recurring revenue streams and reduce customer acquisition expenditures.\n\nRetaining existing subscribers is a cornerstone of sustainable business growth. Tailored retention offers demonstrate customer appreciation while stabilizing long-term corporate revenue.`,
    questions: [
      { id: 'rq_42_1', type: 'multiple_choice', question: 'How do customer retention desks manage subscription cancellations?', options: ['By offering loyalty discounts, billing flexibility, and upgrade incentives.', 'By charging an extra monetary penalty fee for closing accounts.', 'By ignoring customer cancellation requests until contracts expire.', 'By deleting all account user data and history immediately.'], correctAnswer: 'By offering loyalty discounts, billing flexibility, and upgrade incentives.' },
      { id: 'rq_42_2', type: 'multiple_choice', question: 'What do retention specialists analyze when subscribers cite cost concerns?', options: ['Platform usage telemetry data to propose customized cost-saving bundles.', 'Personal employee social media profile feeds and photos.', 'Local municipal weather temperature forecasts and rainfall.', 'Commercial airline flight scheduling timetables and fares.'], correctAnswer: 'Platform usage telemetry data to propose customized cost-saving bundles.' },
      { id: 'rq_42_3', type: 'multiple_choice', question: 'What is the primary operational goal of effective retention strategies?', options: ['Protect recurring revenue streams and reduce acquisition expenditures.', 'Increase customer churn and subscription cancellation rates.', 'Force all customers to upgrade to enterprise software tiers.', 'Eliminate the requirement for customer support teams.'], correctAnswer: 'Protect recurring revenue streams and reduce acquisition expenditures.' },
      { id: 'rq_42_4', type: 'multiple_choice', question: 'What triggers intervention by customer retention specialists?', options: ['Subscribers requesting account closure due to cost concerns.', 'New customers signing up for free trial periods.', 'Employees submitting vacation requests to human resources.', 'Suppliers shipping damaged merchandise to retail buyers.'], correctAnswer: 'Subscribers requesting account closure due to cost concerns.' },
      { id: 'rq_42_5', type: 'multiple_choice', question: 'What tone characterizes interactions conducted by retention specialists?', options: ['Consultative, problem-solving, and persuasive.', 'Aggressive, punitive, and dismissive.', 'Silent, automated, and robotic.', 'Indifferent and unhelpful.'], correctAnswer: 'Consultative, problem-solving, and persuasive.' }
    ]
  },
  {
    id: 'read_43',
    title: 'Logistics Customs Clearance and Import Documentation',
    passage: `International logistics and customs brokerage desks review complex import documentation, commercial invoices, packing lists, and tariff classification codes for overseas cargo shipments. When shipments are held at border inspection checkpoints due to administrative discrepancies, trade compliance agents coordinate directly with port authorities and shipping carriers to expedite customs clearance.\n\nAccurate documentation management prevents costly demurrage storage fees and eliminates critical supply chain bottlenecks.\n\nGlobal trade compliance requires meticulous paperwork management. Expert customs brokerage ensures that international cargo moves seamlessly across borders without financial penalties.`,
    questions: [
      { id: 'rq_43_1', type: 'multiple_choice', question: 'What do international logistics brokerage desks review for cargo shipments?', options: ['Import documentation, commercial invoices, and tariff classification codes.', 'Smart home Wi-Fi router firmware version numbers.', 'University student academic course registration catalogs.', 'Hospital patient prescription drug formulary tier lists.'], correctAnswer: 'Import documentation, commercial invoices, and tariff classification codes.' },
      { id: 'rq_43_2', type: 'multiple_choice', question: 'What causes shipments to be held at border inspection checkpoints?', options: ['Administrative discrepancies in paperwork.', 'Routine software code compilation updates.', 'Customer requests for free shipping upgrades.', 'Cloud storage file backup synchronization errors.'], correctAnswer: 'Administrative discrepancies in paperwork.' },
      { id: 'rq_43_3', type: 'multiple_choice', question: 'What actions do trade compliance agents take when shipments are held at borders?', options: ['Coordinate directly with port authorities and carriers to expedite clearance.', 'Confiscate the cargo merchandise for personal employee use.', 'Repackage the freight items into smaller retail parcels.', 'Bypass international customs regulations and border controls entirely.'], correctAnswer: 'Coordinate directly with port authorities and carriers to expedite clearance.' },
      { id: 'rq_43_4', type: 'multiple_choice', question: 'What financial benefit does accurate documentation management provide?', options: ['Prevents costly demurrage storage fees and supply chain bottlenecks.', 'Guarantees free airline travel for corporate importers.', 'Eliminates all international shipping regulations globally.', 'Automatically lowers global crude oil and fuel prices.'], correctAnswer: 'Prevents costly demurrage storage fees and supply chain bottlenecks.' },
      { id: 'rq_43_5', type: 'multiple_choice', question: 'What type of operations are managed by international logistics brokerage desks?', options: ['Global cargo shipments and customs clearance.', 'Residential home security alarm monitoring.', 'Telehealth virtual medical consultations.', 'Retail e-commerce marketplace dispute mediation.'], correctAnswer: 'Global cargo shipments and customs clearance.' }
    ]
  },
  {
    id: 'read_44',
    title: 'Hospitality Reservation Management and Concierge Desks',
    passage: `Hospitality booking support teams coordinate hotel room reservations, special dietary requests, and local excursion itineraries for vacation and corporate guests. Concierge desks pride themselves on anticipating guest needs, accommodating last-minute modifications, and providing prompt, courteous service throughout every stage of the guest's stay.\n\nPersonalized hospitality interactions create lasting positive brand impressions and drive high rates of repeat bookings for luxury hotel chains.\n\nHospitality excellence relies on anticipatory service. Concierge professionals elevate guest experiences by fulfilling requests with warmth, speed, and absolute professionalism.`,
    questions: [
      { id: 'rq_44_1', type: 'multiple_choice', question: 'What do hospitality booking support teams coordinate for guests?', options: ['Room reservations, dietary requests, and excursion itineraries.', 'Corporate enterprise software database migrations and SSO setups.', 'Automotive insurance collision damage claim settlements.', 'Banking fraud detection and international wire transfers.'], correctAnswer: 'Room reservations, dietary requests, and excursion itineraries.' },
      { id: 'rq_44_2', type: 'multiple_choice', question: 'What are the primary priorities of hotel concierge desks?', options: ['Anticipating guest needs and providing prompt, courteous service.', 'Enforcing strict corporate dress codes in hotel lobbies.', 'Conducting rigorous financial credit check evaluations.', 'Auditing hotel employee monthly payroll deductions.'], correctAnswer: 'Anticipating guest needs and providing prompt, courteous service.' },
      { id: 'rq_44_3', type: 'multiple_choice', question: 'How do personalized hospitality interactions impact luxury hotel chains?', options: ['Create lasting positive brand impressions and drive repeat bookings.', 'Force guests to cancel their upcoming travel plans.', 'Increase operational overhead expenses unnecessarily.', 'Eliminate the requirement for front desk check-in staff.'], correctAnswer: 'Create lasting positive brand impressions and drive repeat bookings.' },
      { id: 'rq_44_4', type: 'multiple_choice', question: 'What type of guests utilize hospitality booking and concierge services?', options: ['Both vacation and corporate guests.', 'Independent third-party retail e-commerce vendors only.', 'University academic faculty members exclusively.', 'Automotive insurance claims adjusters.'], correctAnswer: 'Both vacation and corporate guests.' },
      { id: 'rq_44_5', type: 'multiple_choice', question: 'What level of responsiveness characterizes professional concierge desks?', options: ['Prompt and courteous service throughout the stay.', 'Slow, indifferent, and automated responses.', 'Strict adherence to robotic telephone scripts.', 'Complete refusal to handle guest requests.'], correctAnswer: 'Prompt and courteous service throughout the stay.' }
    ]
  },
  {
    id: 'read_45',
    title: 'Solar Inverter Maintenance and Photovoltaic Support',
    passage: `Photovoltaic energy support desks assist renewable energy clients with solar inverter troubleshooting, panel cleaning schedules, and battery storage optimization. When solar arrays experience sudden, unexplained energy production drops, technical support agents analyze remote monitoring telemetry data to identify shaded modules, string faults, or inverter error codes.\n\nMaximized solar efficiency and proactive remote diagnostics promote sustainable energy adoption across global markets.\n\nRenewable energy support empowers green technology users. Proactive troubleshooting ensures that solar installations operate at peak efficiency throughout their operational lifecycles.`,
    questions: [
      { id: 'rq_45_1', type: 'multiple_choice', question: 'What do photovoltaic energy support desks assist clients with?', options: ['Solar inverter troubleshooting, cleaning schedules, and battery optimization.', 'Processing airline baggage compensation paperwork and flight rebooking.', 'Auditing municipal water utility meter calibration and leaks.', 'Managing university student academic course registration holds.'], correctAnswer: 'Solar inverter troubleshooting, cleaning schedules, and battery optimization.' },
      { id: 'rq_45_2', type: 'multiple_choice', question: 'What event triggers an investigation by photovoltaic technical support agents?', options: ['Sudden, unexplained energy production drops in solar arrays.', 'Routine software license agreement renewals.', 'Standard monthly subscription invoice payments.', 'Updating profile pictures on corporate social media accounts.'], correctAnswer: 'Sudden, unexplained energy production drops in solar arrays.' },
      { id: 'rq_45_3', type: 'multiple_choice', question: 'How do support agents identify the causes of sudden solar production drops?', options: ['Analyze remote monitoring telemetry data for faults and shaded modules.', 'Dispatch postal mail letters to homeowners requesting physical inspections.', 'Increase residential electricity billing rates for the property.', 'Disconnect the solar inverter power supply permanently.'], correctAnswer: 'Analyze remote monitoring telemetry data for faults and shaded modules.' },
      { id: 'rq_45_4', type: 'multiple_choice', question: 'What broader industry goal is supported by maximized solar efficiency?', options: ['Promotes sustainable energy adoption across global markets.', 'Increases reliance on fossil fuel power generation plants.', 'Reduces overall global electricity consumption to zero.', 'Forces utilities to shut down electrical grids during daylight.'], correctAnswer: 'Promotes sustainable energy adoption across global markets.' },
      { id: 'rq_45_5', type: 'multiple_choice', question: 'What type of data is utilized for remote solar diagnostics?', options: ['Monitoring telemetry data.', 'Analog mechanical pressure gauges.', 'Handwritten paper ledger books.', 'Radio frequency broadcast audio.'], correctAnswer: 'Monitoring telemetry data.' }
    ]
  },
  {
    id: 'read_46',
    title: 'Student Financial Aid and Tuition Payment Processing',
    passage: `University financial aid offices assist students with scholarship disbursement inquiries, federal student loan verifications, and flexible tuition payment installment plans. When financial aid processing delays threaten course enrollment deadlines, support advisors coordinate directly with bursar desks to place temporary administrative holds and secure student enrollment status.\n\nCompassionate, efficient student financial support ensures equitable access to higher education for all qualified applicants.\n\nFinancial aid administration removes economic barriers to education. Dedicated support ensures students can focus on academic success without administrative anxiety.`,
    questions: [
      { id: 'rq_46_1', type: 'multiple_choice', question: 'What do university financial aid offices assist students with?', options: ['Scholarships, federal loan verifications, and tuition payment plans.', 'Commercial freight shipping customs clearance and tariffs.', 'Corporate enterprise software workspace license upgrades.', 'Smart home IoT device Wi-Fi network configuration.'], correctAnswer: 'Scholarships, federal loan verifications, and tuition payment plans.' },
      { id: 'rq_46_2', type: 'multiple_choice', question: 'What action do advisors take when financial aid delays threaten course enrollment?', options: ['Coordinate with bursar desks to place temporary administrative holds.', 'Expel students from the university immediately without appeal.', 'Double the student tuition fee balance owed to the institution.', 'Delete academic transcript records from the database entirely.'], correctAnswer: 'Coordinate with bursar desks to place temporary administrative holds.' },
      { id: 'rq_46_3', type: 'multiple_choice', question: 'What is the primary operational objective of compassionate student financial support?', options: ['Ensures equitable access to higher education for all qualified applicants.', 'Maximizes financial penalty fees for minor payment delays.', 'Enforces strict corporate dress codes across campus grounds.', 'Manages commercial supply chain freight shipping logistics.'], correctAnswer: 'Ensures equitable access to higher education for all qualified applicants.' },
      { id: 'rq_46_4', type: 'multiple_choice', question: 'What type of inquiries are handled by financial aid support desks?', options: ['Scholarship disbursement and loan verification inquiries.', 'Hotel room reservation upgrades and concierge requests.', 'Automotive insurance collision accident claim settlements.', 'Banking fraud detection and unauthorized wire transfers.'], correctAnswer: 'Scholarship disbursement and loan verification inquiries.' },
      { id: 'rq_46_5', type: 'multiple_choice', question: 'Which department collaborates with financial aid advisors during payment delays?', options: ['Bursar desks.', 'Retail e-commerce dispute mediation.', 'Telehealth virtual medical coordination.', 'Renewable energy inverter diagnostics.'], correctAnswer: 'Bursar desks.' }
    ]
  },
  {
    id: 'read_47',
    title: 'Automotive Roadside Assistance and Towing Dispatch',
    passage: `Automotive roadside assistance desks coordinate emergency towing, flat tire replacement, fuel delivery, and mobile battery jump-start services for stranded motorists. Dispatchers capture precise GPS location coordinates and vehicle breakdown details to route nearby service technicians swiftly to the scene.\n\nReliable, rapid emergency dispatch offers essential peace of mind to drivers navigating highways during stressful vehicular breakdowns.\n\nRoadside assistance provides vital support during highway emergencies. Efficient dispatching ensures motorists receive rapid help when stranded in unsafe locations.`,
    questions: [
      { id: 'rq_47_1', type: 'multiple_choice', question: 'What services do automotive roadside assistance desks coordinate?', options: ['Emergency towing, tire replacement, fuel delivery, and jump-starts.', 'Hotel room reservation upgrades and airport limousine transfers.', 'International freight customs clearance and tariff processing.', 'University academic course registration holds and transcripts.'], correctAnswer: 'Emergency towing, tire replacement, fuel delivery, and jump-starts.' },
      { id: 'rq_47_2', type: 'multiple_choice', question: 'What information do dispatchers capture to route technicians swiftly?', options: ['Precise GPS location coordinates and vehicle breakdown details.', 'Personal customer credit card PIN numbers and passwords.', 'Employee monthly payroll tax withholding forms.', 'Cloud storage file backup synchronization logs.'], correctAnswer: 'Precise GPS location coordinates and vehicle breakdown details.' },
      { id: 'rq_47_3', type: 'multiple_choice', question: 'What value does reliable emergency dispatch provide to stranded motorists?', options: ['Essential peace of mind during stressful vehicular breakdowns.', 'Guaranteed free automobile replacement from dealerships.', 'Absolute immunity to future mechanical vehicle failures.', 'Permanent exemption from highway speed limit laws.'], correctAnswer: 'Essential peace of mind during stressful vehicular breakdowns.' },
      { id: 'rq_47_4', type: 'multiple_choice', question: 'What type of situation characterizes inbound calls to roadside assistance desks?', options: ['Urgent vehicular breakdowns on highways.', 'Relaxed leisure vacation travel planning.', 'Routine software application password resets.', 'Smart home IoT device Wi-Fi setup.'], correctAnswer: 'Urgent vehicular breakdowns on highways.' },
      { id: 'rq_47_5', type: 'multiple_choice', question: 'Who is dispatched to the scene following a roadside assistance call?', options: ['Nearby service technicians.', 'Local municipal police tactical units.', 'Commercial freight shipping brokers.', 'Corporate enterprise software engineers.'], correctAnswer: 'Nearby service technicians.' }
    ]
  },
  {
    id: 'read_48',
    title: 'Cryptocurrency Exchange Compliance and Account Security',
    passage: `Digital currency exchange support desks enforce strict know-your-customer (KYC) regulations, review fiat currency deposit limits, and investigate suspicious login attempts. Compliance specialists verify user identification documents to maintain regulatory adherence and prevent illicit financial activities such as money laundering on trading platforms.\n\nRobust, uncompromising security standards protect digital asset traders and ensure platform legality.\n\nExchange compliance bridges cryptocurrency trading and regulatory oversight. Strict identity verification prevents illicit activity while protecting honest digital asset traders.`,
    questions: [
      { id: 'rq_48_1', type: 'multiple_choice', question: 'What regulations do digital currency exchange support desks enforce?', options: ['Know-your-customer (KYC) regulations.', 'Federal aviation safety and pilot training guidelines.', 'Hospital patient medical privacy and HIPAA laws.', 'Municipal zoning and building construction codes.'], correctAnswer: 'Know-your-customer (KYC) regulations.' },
      { id: 'rq_48_2', type: 'multiple_choice', question: 'What operational tasks are performed by exchange compliance specialists?', options: ['Verify ID documents, review deposit limits, and investigate login attempts.', 'Manage hotel room reservation upgrades and concierge desks.', 'Schedule telehealth virtual medical appointments and prescriptions.', 'Troubleshoot residential solar inverter grid synchronization errors.'], correctAnswer: 'Verify ID documents, review deposit limits, and investigate login attempts.' },
      { id: 'rq_48_3', type: 'multiple_choice', question: 'Why do compliance specialists verify user identification documents?', options: ['To maintain regulatory adherence and prevent illicit financial activities.', 'To share customer personal data with public marketing firms.', 'To increase cryptocurrency trading commission fee revenues.', 'To eliminate the requirement for account login passwords.'], correctAnswer: 'To maintain regulatory adherence and prevent illicit financial activities.' },
      { id: 'rq_48_4', type: 'multiple_choice', question: 'What is the broader purpose of robust exchange security standards?', options: ['Protect digital asset traders and ensure platform legality.', 'Force traders to abandon cryptocurrency in favor of fiat currency.', 'Slow down blockchain transaction confirmation times.', 'Eliminate the requirement for multi-factor authentication.'], correctAnswer: 'Protect digital asset traders and ensure platform legality.' },
      { id: 'rq_48_5', type: 'multiple_choice', question: 'What illicit activity is actively prevented by KYC enforcement?', options: ['Money laundering.', 'Software syntax compilation bugs.', 'Residential water utility meter reading errors.', 'Airline flight weather cancellations.'], correctAnswer: 'Money laundering.' }
    ]
  },
  {
    id: 'read_49',
    title: 'Corporate Expense Audit and Travel Booking Reconciliation',
    passage: `Corporate expense management teams audit employee travel reimbursement claims, corporate credit card receipts, and conference booking invoices against strict company policy limits. Expense auditors verify itemized receipts, check currency conversion rates, and ensure compliance with travel per diem guidelines prior to financial department approval.\n\nRigorous, methodical expense oversight maintains fiscal responsibility across all corporate business operations.\n\nCorporate financial governance relies on rigorous expense audits. Verifying travel receipts against company policy ensures fiscal responsibility and prudent budget management.`,
    questions: [
      { id: 'rq_49_1', type: 'multiple_choice', question: 'What do corporate expense management teams audit?', options: ['Travel reimbursement claims, credit card receipts, and booking invoices.', 'Residential home security alarm motion sensor triggers.', 'Smart home IoT device wireless router network connections.', 'University student academic enrollment transcript waivers.'], correctAnswer: 'Travel reimbursement claims, credit card receipts, and booking invoices.' },
      { id: 'rq_49_2', type: 'multiple_choice', question: 'Against what standards are employee travel reimbursement claims evaluated?', options: ['Strict company policy limits and per diem guidelines.', 'Personal employee social media profile history and photos.', 'Local municipal weather temperature forecasts and rainfall.', 'Commercial airline flight pilot licensing credentials.'], correctAnswer: 'Strict company policy limits and per diem guidelines.' },
      { id: 'rq_49_3', type: 'multiple_choice', question: 'What tasks do expense auditors perform prior to financial department approval?', options: ['Verify itemized receipts, check conversion rates, and ensure policy compliance.', 'Install hardware servers and configure wireless networking routers.', 'Manage hotel room reservation upgrades and concierge desks.', 'Process automotive insurance collision accident claims.'], correctAnswer: 'Verify itemized receipts, check conversion rates, and ensure policy compliance.' },
      { id: 'rq_49_4', type: 'multiple_choice', question: 'What is the primary operational objective of rigorous expense oversight?', options: ['Maintains fiscal responsibility across all corporate business operations.', 'Increases travel expenditures and corporate spending budgets.', 'Eliminates the requirement for business travel entirely.', 'Complicates employee payroll tax withholding calculations.'], correctAnswer: 'Maintains fiscal responsibility across all corporate business operations.' },
      { id: 'rq_49_5', type: 'multiple_choice', question: 'What type of documentation is scrutinized during expense audits?', options: ['Itemized receipts and booking invoices.', 'Unencrypted personal messaging chat logs.', 'Handwritten personal grocery shopping lists.', 'Public social media commentary.'], correctAnswer: 'Itemized receipts and booking invoices.' }
    ]
  },
  {
    id: 'read_50',
    title: 'Retail Inventory Management and Omni-Fulfillment',
    passage: `Omnichannel retail support desks assist store managers and online shoppers with real-time inventory tracking, in-store pickup coordination, and backorder status updates. When online orders require cross-store fulfillment due to localized stock shortages, inventory support agents coordinate automated stock transfers between retail branch locations.\n\nSeamless inventory synchronization bridges online shopping convenience with physical store stock availability.\n\nOmnichannel retail requires robust inventory visibility. Synchronizing online and in-store stock levels ensures a unified, reliable shopping experience for modern consumers.`,
    questions: [
      { id: 'rq_50_1', type: 'multiple_choice', question: 'What do omnichannel retail support desks assist store managers and shoppers with?', options: ['Inventory tracking, in-store pickup coordination, and backorder updates.', 'Healthcare insurance prescription drug formulary tier classifications.', 'Automotive insurance collision accident claim settlements.', 'Banking international wire transfer security verification.'], correctAnswer: 'Inventory tracking, in-store pickup coordination, and backorder updates.' },
      { id: 'rq_50_2', type: 'multiple_choice', question: 'What action do inventory support agents take when localized stock shortages occur?', options: ['Coordinate automated stock transfers between retail branch locations.', 'Permanently cancel all online customer purchase orders.', 'Increase retail product sales prices across all stores.', 'Dispose of existing merchandise inventory in local dumpsters.'], correctAnswer: 'Coordinate automated stock transfers between retail branch locations.' },
      { id: 'rq_50_3', type: 'multiple_choice', question: 'What is the primary benefit of seamless inventory synchronization?', options: ['Bridges online shopping convenience with physical store stock availability.', 'Eliminates the requirement for retail store physical locations.', 'Forces customers to wait weeks for home delivery shipments.', 'Increases shipping logistics and warehousing overhead costs.'], correctAnswer: 'Bridges online shopping convenience with physical store stock availability.' },
      { id: 'rq_50_4', type: 'multiple_choice', question: 'What type of environment utilizes omnichannel retail fulfillment support?', options: ['Modern retail ecosystems combining online and physical stores.', 'Commercial airline flight scheduling control towers.', 'Cryptocurrency blockchain trading networks.', 'Telehealth virtual medical clinics.'], correctAnswer: 'Modern retail ecosystems combining online and physical stores.' },
      { id: 'rq_50_5', type: 'multiple_choice', question: 'What triggers cross-store fulfillment procedures by support agents?', options: ['Localized stock shortages for online customer orders.', 'Routine software license agreement renewals.', 'Standard monthly subscription invoice payments.', 'Updating corporate social media profile pictures.'], correctAnswer: 'Localized stock shortages for online customer orders.' }
    ]
  }
];

function SpeakingRecorder({ prompts, onComplete }: { prompts: string[]; onComplete?: (score: number) => void }) {
  const promptList = prompts.length > 0 ? prompts : FALLBACK_SPEAKING_PROMPTS_POOL;
  const [currentPrompt, setCurrentPrompt] = useState(promptList[0]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [speakingEvaluation, setSpeakingEvaluation] = useState<{
    cefrLevel?: string;
    overallScore: number;
    taskAchievement: number;
    logicalConnectivity: number;
    lexicalDepth: number;
    grammaticalVersatility: number;
    pronunciation: number;
    feedback: string;
    transcript?: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const nextPrompt = prompts[0] || FALLBACK_SPEAKING_PROMPTS_POOL[0];
    setCurrentPrompt(nextPrompt);
    setSpeakingEvaluation(null);
    setIsAnalyzing(false);
    setRecordingSeconds(0);
  }, [prompts]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartRecording = async () => {
    setSpeakingEvaluation(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        alert('Microphone access is not supported in this browser environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const supportedMimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
      ];
      const mimeType =
        supportedMimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      const recorderMimeType = mediaRecorder.mimeType || mimeType || 'audio/webm';
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorderMimeType,
        });
        if (audioBlob.size === 0) {
          setIsAnalyzing(false);
          alert('Recorded audio was empty. Please check your microphone connection.');
          return;
        }
        await sendAudioForEvaluation(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Unable to access microphone. Please ensure permissions are allowed.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setIsRecording(false);
      setIsAnalyzing(true);
    }
  };

  const sendAudioForEvaluation = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes('mp4') ? 'm4a' : 'webm';
      formData.append('audio', audioBlob, `speech-recording.${extension}`);
      formData.append('prompt', currentPrompt);

      const res = await fetch('/api/evaluate-speaking', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed on the server.');

      const evalResult = {
        cefrLevel: data.cefrLevel || 'B2',
        overallScore: data.overallScore || 80,
        taskAchievement: data.taskAchievement || 80,
        logicalConnectivity: data.logicalConnectivity || 80,
        lexicalDepth: data.lexicalDepth || 80,
        grammaticalVersatility: data.grammaticalVersatility || 80,
        pronunciation: data.pronunciation || 80,
        feedback: data.feedback || 'Detailed evaluation report generated.',
        transcript: data.transcript || '',
      };

      setSpeakingEvaluation(evalResult);
      if (onComplete) onComplete(evalResult.overallScore);
    } catch (err: any) {
      console.error(err);
      alert(`Error during evaluation: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Speaking Prompt / Task:</span>
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">{currentPrompt}</p>
      </div>

      <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-inner">
        <div className="flex items-center gap-3">
          <span className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
          <span className="font-mono text-sm tracking-wide text-center">
            {isRecording ? `Recording Audio... (${recordingSeconds}s)` : 'Microphone Standby'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🎙️ Start Recording</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2 animate-pulse"
            >
              <span>⏹️ Stop Recording & Analyze</span>
            </button>
          )}
        </div>
      </div>

      {isAnalyzing && (
        <div className="p-5 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg className="animate-spin h-6 w-6 text-emerald-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Whisper Transcribing & AI Evaluating Speech...</span>
        </div>
      )}

      {speakingEvaluation && !isAnalyzing && (
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">Speaking Assessment Report</h4>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 self-start sm:self-auto">
              Score: {speakingEvaluation.overallScore}%
            </span>
          </div>
          <p className="text-sm text-slate-600">{speakingEvaluation.feedback}</p>
        </div>
      )}
    </div>
  );
}

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
}

interface TestData {
  id: string;
  title: string;
  audioScript?: string;
  passage?: string;
  questions: Question[];
}

type ModuleType = 'listening' | 'reading' | 'writing' | 'speaking' | 'typing';

const DEFAULT_TYPING_PASSAGES = [
  "Thank you for reaching out to TephdyTech customer support today. My name is Cally, and I am genuinely delighted to assist you with any questions or issues you might be facing. May I please have your account or ticket number so we can quickly verify your details before proceeding forward? Providing accurate information right at the beginning ensures that our support specialists can securely access your unique profile, review past interaction histories, and deliver a personalized solution tailored precisely to your specific technical needs without any unnecessary delays.",

  "The dedicated TephdyTech representative listened very carefully to the caller's concern regarding the unexpected billing discrepancy. After thoroughly checking the internal system logs, she promptly confirmed that the extra charge would be successfully refunded back to the client account within three standard business days. Financial transparency and accountability remain core priorities across all department workflows. Clients can always rely on swift investigations and transparent resolutions when unexpected discrepancies occur within their monthly subscription invoices or service usage metrics.",

  "Welcome to TephdyTech professional technical services portal. Please follow all of the on-screen prompts very carefully to ensure that your system diagnostics run seamlessly from start to finish without experiencing any frustrating interruptions or unexpected application crashes during the process. Diagnostic scans play a critical role in identifying hidden performance bottlenecks, corrupted system files, and outdated software drivers that could potentially compromise your overall device stability, security posture, and daily operational efficiency.",

  "Strict quality assurance standards implemented across TephdyTech operations consistently require prompt customer responses, active listening skills, and accurate database record updates for every single client interaction to maintain our high commitment to service excellence and overall client satisfaction. Continuous performance monitoring allows supervisors to identify training opportunities, streamline administrative workflows, and refine service delivery protocols. Ultimately, these rigorous benchmarks ensure that every client receives reliable, professional, and consistent technical assistance across all communication channels.",

  "Quality assurance standards at TephdyTech require prompt responses, active listening, and accurate database record updates for every single client interaction."
];

const MOTIVATIONAL_QUOTES = [
  "“Success is not final; failure is not fatal: It is the courage to continue that counts.” — Winston Churchill",
  "“It does not matter how slowly you go as long as you do not stop.” — Confucius",
  "“Fall seven times, stand up eight.” — Japanese Proverb",
  "“Mistakes are proof that you are trying. Keep going!”",
  "“Every expert was once a beginner. Don't give up on yourself!”"
];

export default function Home() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');

  // UI Theme State ('light' | 'dark' | 'midnight')
  const [theme, setTheme] = useState<'light' | 'dark' | 'midnight'>('light');

  const [appMode, setAppMode] = useState<'dashboard' | 'full_exam'>('dashboard');
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | ModuleType>('overview');

  const [examStepIndex, setExamStepIndex] = useState(0); 
  const examSequence: ModuleType[] = ['listening', 'reading', 'writing', 'speaking', 'typing'];

  const [examScores, setExamScores] = useState<Record<ModuleType, number>>({
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    typing: 0,
  });

  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const [hasAudioStarted, setHasAudioStarted] = useState(false);
  const [hasAudioEnded, setHasAudioEnded] = useState(false);
  const [listeningTimer, setListeningTimer] = useState<number>(60);
  const [isListeningTimerActive, setIsListeningTimerActive] = useState(false);

  const [typingPassage, setTypingPassage] = useState<string>(DEFAULT_TYPING_PASSAGES[0]);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTypingCompleted, setIsTypingCompleted] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const typingInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [writingPrompt, setWritingPrompt] = useState<string>('');
  const [speakingPrompts, setSpeakingPrompts] = useState<string[]>([FALLBACK_SPEAKING_PROMPTS_POOL[0]]);
  const [usedSpeakingPrompts, setUsedSpeakingPrompts] = useState<string[]>([]);
  const [writingText, setWritingText] = useState<string>('');
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  const [usedListeningIds, setUsedListeningIds] = useState<string[]>([]);
  const [usedReadingIds, setUsedReadingIds] = useState<string[]>([]);
  const [usedWritingPrompts, setUsedWritingPrompts] = useState<string[]>([]);

  const [userScores, setUserScores] = useState<any[]>([]);
  const [userCertificates, setUserCertificates] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('cally_ui_theme') as 'light' | 'dark' | 'midnight';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'midnight') => {
    setTheme(newTheme);
    localStorage.setItem('cally_ui_theme', newTheme);
  };

  useEffect(() => {
    if (!userId) return;

    const fetchUserStats = async () => {
      setLoadingStats(true);

      const { data: scoresData, error: scoresError } = await supabase
        .from('module_scores')
        .select('*')
        .eq('user_id', userId);

      if (scoresError) console.error('Error fetching scores:', scoresError.message);
      else setUserScores(scoresData || []);

      const { data: certsData, error: certsError } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId);

      if (certsError) console.error('Error fetching certificates:', certsError.message);
      else setUserCertificates(certsData || []);

      setLoadingStats(false);
    };

    fetchUserStats();
  }, [userId]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('cally_user_email');
    const savedName = localStorage.getItem('cally_user_name');
    const savedId = localStorage.getItem('cally_user_id');

    if (savedEmail && savedId) {
      setEmail(savedEmail);
      setUserName(savedName || '');
      setUserId(savedId);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        const googleEmail = session.user.email;
        const googleName = session.user.user_metadata?.full_name || googleEmail?.split('@')[0];

        const { data, error } = await supabase
          .from('users')
          .upsert({ email: googleEmail, name: googleName }, { onConflict: 'email' })
          .select();

        if (error) {
          console.error('Error syncing user to database:', error.message);
          return;
        }

        if (data && data.length > 0) {
          const currentUserId = (data[0] as any).id;
          setUserId(currentUserId);
          setUserName(googleName);
          setEmail(googleEmail || '');
          setIsLoggedIn(true);
        }
      }
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isTypingCompleted) {
      interval = setInterval(() => {
        const now = Date.now();
        const durationInSeconds = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(durationInSeconds);

        if (durationInSeconds > 0) {
          const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;
          const currentWpm = Math.round((wordsTyped / durationInSeconds) * 60);
          setWpm(currentWpm);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isTypingCompleted, userInput]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedModule === 'listening' && isListeningTimerActive && listeningTimer > 0 && !isSubmitted) {
      timer = setInterval(() => setListeningTimer((prev) => prev - 1), 1000);
    } else if (selectedModule === 'listening' && isListeningTimerActive && listeningTimer === 0 && !isSubmitted) {
      handleSubmitListening();
      setIsListeningTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [selectedModule, isListeningTimerActive, listeningTimer, isSubmitted]);

  const resetListeningState = () => {
    setHasAudioStarted(false);
    setHasAudioEnded(false);
    setListeningTimer(60);
    setIsListeningTimerActive(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const totalScores = userScores.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const averageScore = userScores.length > 0 ? Math.round(totalScores / userScores.length) : 0;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setAuthError('');
    const derivedName = email.split('@')[0];
    const finalName = userName.trim() || derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
    setUserName(finalName);

    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        setAuthError('An account with this email already exists. Please log in.');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ email: email, name: finalName }])
        .select();

      if (error) {
        console.error('Sign up error:', error.message);
        setAuthError('Failed to create account.');
        return;
      }

      if (data && data.length > 0) {
        const currentUserId = (data[0] as any).id;
        setUserId(currentUserId);
        localStorage.setItem('cally_user_email', email);
        localStorage.setItem('cally_user_name', finalName);
        localStorage.setItem('cally_user_id', currentUserId);
      }

      setIsLoggedIn(true);
    } catch (err) {
      console.error('Unexpected error:', err);
      setAuthError('An unexpected error occurred.');
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Google login error:', error.message);
      setAuthError('Failed to sign in with Google.');
    }
  };

  const handleSelectSidebarTab = (tab: 'overview' | 'logs' | ModuleType) => {
    setActiveTab(tab);
    if (tab === 'overview' || tab === 'logs') {
      setAppMode('dashboard');
      setSelectedModule(null);
      setTestData(null);
      setIsSubmitted(false);
      setScore(null);
      setShowScorePopup(false);
      setShowInstructionsModal(false);
      setSelectedAnswers({});
      resetListeningState();
    } else {
      handleStartDashboardModule(tab);
    }
  };

  const handleStartDashboardModule = (mod: ModuleType) => {
    setAppMode('dashboard');
    setActiveTab(mod);
    setSelectedModule(mod);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setSelectedAnswers({});
    resetListeningState();
    setShowInstructionsModal(true);

    if (mod === 'typing') {
      const targetPassage = DEFAULT_TYPING_PASSAGES[Math.floor(Math.random() * DEFAULT_TYPING_PASSAGES.length)];
      setTypingPassage(targetPassage);
      setUserInput('');
      setStartTime(null);
      setElapsedSeconds(0);
      setIsTypingCompleted(false);
      setWpm(0);
      setAccuracy(100);
    } else if (mod === 'writing' || mod === 'speaking' || mod === 'reading' || mod === 'listening') {
      generateTest(mod);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartFullExam = () => {
    setAppMode('full_exam');
    setExamStepIndex(0);
    const firstMod = examSequence[0];
    setSelectedModule(firstMod);
    setActiveTab(firstMod);
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setSelectedAnswers({});
    resetListeningState();
    setShowInstructionsModal(true);
    generateTest(firstMod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setAppMode('dashboard');
    setSelectedModule(null);
    setActiveTab('overview');
    setTestData(null);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setShowInstructionsModal(false);
    setSelectedAnswers({});
    resetListeningState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateTest = async (moduleType: ModuleType) => {
    setLoading(true);
    setIsSubmitted(false);
    setScore(null);
    setShowScorePopup(false);
    setSelectedAnswers({});
    resetListeningState();

    if (moduleType === 'typing') {
      const targetPassage = DEFAULT_TYPING_PASSAGES[Math.floor(Math.random() * DEFAULT_TYPING_PASSAGES.length)];
      setTypingPassage(targetPassage);
      setUserInput('');
      setStartTime(null);
      setElapsedSeconds(0);
      setIsTypingCompleted(false);
      setWpm(0);
      setAccuracy(100);
      setLoading(false);
      return;
    }

    if (moduleType === 'writing') {
      const availableWriting = FALLBACK_WRITING_PROMPTS_POOL.filter(p => !usedWritingPrompts.includes(p));
      const targetPool = availableWriting.length > 0 ? availableWriting : FALLBACK_WRITING_PROMPTS_POOL;
      const selectedPrompt = targetPool[Math.floor(Math.random() * targetPool.length)];

      if (availableWriting.length > 0) {
        setUsedWritingPrompts(prev => [...prev, selectedPrompt]);
      } else {
        setUsedWritingPrompts([selectedPrompt]);
      }

      setWritingPrompt(selectedPrompt);
      setWritingText('');
      setLoading(false);
      return;
    }

    if (moduleType === 'speaking') {
      const availableSpeaking = FALLBACK_SPEAKING_PROMPTS_POOL.filter(
        (prompt) => !usedSpeakingPrompts.includes(prompt)
      );
      const targetPool =
        availableSpeaking.length > 0
          ? availableSpeaking
          : FALLBACK_SPEAKING_PROMPTS_POOL;

      const selectedPrompt =
        targetPool[Math.floor(Math.random() * targetPool.length)];

      setSpeakingPrompts([selectedPrompt]);

      if (availableSpeaking.length > 0) {
        setUsedSpeakingPrompts((prev) => [...prev, selectedPrompt]);
      } else {
        setUsedSpeakingPrompts([selectedPrompt]);
      }

      setLoading(false);
      return;
    }

    if (moduleType === 'reading') {
      const availableReading = FALLBACK_READING_QUESTIONS.filter(r => !usedReadingIds.includes(r.id));
      const targetPool = availableReading.length > 0 ? availableReading : FALLBACK_READING_QUESTIONS;
      const selectedItem = targetPool[Math.floor(Math.random() * targetPool.length)];

      if (availableReading.length > 0) {
        setUsedReadingIds(prev => [...prev, selectedItem.id]);
      } else {
        setUsedReadingIds([selectedItem.id]);
      }

      setTestData(selectedItem);
      setLoading(false);
      return;
    }

    if (moduleType === 'listening') {
      const availableListening = FALLBACK_LISTENING_QUESTIONS.filter(l => !usedListeningIds.includes(l.id));
      const targetPool = availableListening.length > 0 ? availableListening : FALLBACK_LISTENING_QUESTIONS;
      const selectedItem = targetPool[Math.floor(Math.random() * targetPool.length)];

      if (availableListening.length > 0) {
        setUsedListeningIds(prev => [...prev, selectedItem.id]);
      } else {
        setUsedListeningIds([selectedItem.id]);
      }

      setTestData(selectedItem);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const handleAdvanceExamStep = (moduleScore: number) => {
    const currentMod = examSequence[examStepIndex];
    const updatedScores = { ...examScores, [currentMod]: moduleScore };
    setExamScores(updatedScores);

    const nextIndex = examStepIndex + 1;
    if (nextIndex < examSequence.length) {
      setExamStepIndex(nextIndex);
      const nextMod = examSequence[nextIndex];
      setSelectedModule(nextMod);
      setActiveTab(nextMod);
      setIsSubmitted(false);
      setScore(null);
      setShowScorePopup(false);
      setSelectedAnswers({});
      resetListeningState();

      if (nextMod === 'typing') {
        const targetPassage = DEFAULT_TYPING_PASSAGES[Math.floor(Math.random() * DEFAULT_TYPING_PASSAGES.length)];
        setTypingPassage(targetPassage);
        setUserInput('');
        setStartTime(null);
        setElapsedSeconds(0);
        setIsTypingCompleted(false);
        setWpm(0);
        setAccuracy(100);
      } else {
        generateTest(nextMod);
      }
    } else {
      setExamStepIndex(5);
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error('Confetti error:', e);
    }
  };

  const handleScoreFinalized = async (finalPct: number) => {
    setScore(finalPct);
    setIsSubmitted(true);
    setShowScorePopup(true);

    if (userId && selectedModule) {
      const { data, error } = await supabase
        .from('module_scores')
        .insert([
          { 
            user_id: userId, 
            module_name: selectedModule, 
            score: finalPct 
          }
        ])
        .select();
      
      if (error) {
        console.error('Error saving module score:', error.message);
      } else if (data && data.length > 0) {
        setUserScores(prev => [data[0], ...prev]);
      }
    }

    if (finalPct > 70) {
      triggerConfetti();
    } else {
      const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      setMotivationalQuote(randomQuote);
    }

    if (appMode === 'full_exam') {
      setTimeout(() => {
        setShowScorePopup(false);
        handleAdvanceExamStep(finalPct);
      }, 4000);
    }
  };

  const handleSubmitListening = () => {
    if (isSubmitted) return;
    setIsListeningTimerActive(false);
    if (!testData?.questions) return;

    let totalCorrect = 0;
    testData.questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id]?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      const correctAnswer = q.correctAnswer?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      if (userAnswer === correctAnswer) totalCorrect += 1;
    });

    const finalPct = Math.round((totalCorrect / testData.questions.length) * 100);
    handleScoreFinalized(finalPct);
  };

  const handleSubmitReading = () => {
    if (isSubmitted) return;
    if (!testData?.questions) return;

    let totalCorrect = 0;
    testData.questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id]?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      const correctAnswer = q.correctAnswer?.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") || '';
      if (userAnswer === correctAnswer) totalCorrect += 1;
    });

    const finalPct = Math.round((totalCorrect / testData.questions.length) * 100);
    handleScoreFinalized(finalPct);
  };

  const handleSubmitWriting = () => {
    if (!writingText.trim()) return;
    setIsEvaluatingWriting(true);

    setTimeout(() => {
      const wordCount = writingText.trim().split(/\s+/).length;
      let scoreVal = 85;
      if (wordCount < 15) scoreVal = 60;

      setIsEvaluatingWriting(false);
      handleScoreFinalized(scoreVal);
    }, 800);
  };

  const handleSpeakingComplete = (scoreVal: number) => {
    handleScoreFinalized(scoreVal);
  };

  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (isTypingCompleted) return;
    if (!startTime) setStartTime(Date.now());
    setUserInput(val);

    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === typingPassage[i]) correctChars++;
    }
    const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    setAccuracy(acc);

    if (val.length >= typingPassage.length) {
      setIsTypingCompleted(true);
      const duration = Math.max((Date.now() - (startTime || Date.now())) / 60000, 0.05);
      const words = val.trim().split(/\s+/).length;
      const finalWpm = Math.round(words / duration);
      setWpm(finalWpm);

      const typingScore = Math.min(Math.max(finalWpm * 1.2, 50), 100);
      const finalRounded = Math.round(typingScore);
      handleScoreFinalized(finalRounded);
    }
  };

  const overallExamAverage = Math.round(
    Object.values(examScores).reduce((a, b) => a + b, 0) / 5
  );

  const handleDownloadPDF = async () => {
    setIsDownloadingPdf(true);
    const element = document.getElementById('certificate-to-download');
    if (!element) {
      setIsDownloadingPdf(false);
      return;
    }

    try {
      if (!(window as any).html2pdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      window.scrollTo(0, 0);

      const opt = {
        margin: 0,
        filename: `TephdyTech_Certificate_${userName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      };

      await (window as any).html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const dashboardFeatures = [
    {
      id: 'listening' as ModuleType,
      title: 'Listening & Dictation',
      description: 'Single-play audio drills with dictation inputs and auto-evaluations.',
      tag: 'Listening',
      color: 'border-rose-200 bg-rose-50/40 text-rose-700',
      btnColor: 'bg-rose-600 hover:bg-rose-700',
      instructions: "1. Click 'Play Audio' (plays ONCE).\n2. Answer the questions before the 1-minute timer expires.",
      icon: '🎧',
    },
    {
      id: 'reading' as ModuleType,
      title: 'Sentence Completion & Grammar',
      description: 'Practice SVAR vocabulary fill-in-the-blanks and grammar rules.',
      tag: 'Reading',
      color: 'border-amber-200 bg-amber-50/40 text-amber-700',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
      instructions: "1. Review reading passage.\n2. Answer the multiple choice questions.",
      icon: '📖',
    },
    {
      id: 'writing' as ModuleType,
      title: 'Customer Email & Chat Writing',
      description: 'Draft professional customer responses and emails.',
      tag: 'Writing',
      color: 'border-indigo-200 bg-indigo-50/40 text-indigo-700',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700',
      instructions: "1. Read scenario prompt.\n2. Draft professional email response.",
      icon: '✍️',
    },
    {
      id: 'speaking' as ModuleType,
      title: 'Repeat & Retell AI',
      description: 'Record verbatim sentence repetition & prompt replies.',
      tag: 'Speaking',
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-700',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
      instructions: "1. Read prompt.\n2. Record audio via microphone and analyze.",
      icon: '🎙️',
    },
    {
      id: 'typing' as ModuleType,
      title: 'Chat & Typing Speed Test',
      description: 'Train net WPM and accuracy for BPO candidate screening.',
      tag: 'Typing',
      color: 'border-sky-200 bg-sky-50/40 text-sky-700',
      btnColor: 'bg-sky-600 hover:bg-sky-700',
      instructions: "1. Type the displayed passage accurately to complete the module.",
      icon: '⌨️',
    },
  ];

  const activeFeature = dashboardFeatures.find((f) => f.id === selectedModule);

  // Dynamic Theme Styling Classes
  const themeClasses = {
    light: {
      bg: 'min-h-screen bg-slate-50/50 text-slate-800',
      header: 'bg-white/95 border-slate-200 text-slate-900',
      sidebar: 'bg-white border-slate-200 text-slate-700',
      card: 'bg-white border-slate-200 text-slate-900',
      textMuted: 'text-slate-500',
      tableHeader: 'border-slate-100 text-slate-400',
      tableRowHover: 'hover:bg-slate-50/50',
      divider: 'border-slate-100',
    },
    dark: {
      bg: 'min-h-screen bg-slate-950 text-slate-100',
      header: 'bg-slate-900/95 border-slate-800 text-white',
      sidebar: 'bg-slate-900 border-slate-800 text-slate-300',
      card: 'bg-slate-900 border-slate-800 text-white',
      textMuted: 'text-slate-400',
      tableHeader: 'border-slate-800 text-slate-400',
      tableRowHover: 'hover:bg-slate-800/50',
      divider: 'border-slate-800',
    },
    midnight: {
      bg: 'min-h-screen bg-[#090d16] text-blue-50',
      header: 'bg-[#0f172a]/95 border-blue-950 text-blue-100',
      sidebar: 'bg-[#0f172a] border-blue-950 text-blue-200',
      card: 'bg-[#111c33] border-blue-900/60 text-blue-50',
      textMuted: 'text-blue-300/70',
      tableHeader: 'border-blue-950 text-blue-400',
      tableRowHover: 'hover:bg-blue-950/40',
      divider: 'border-blue-950',
    }
  }[theme];

  if (!isLoggedIn) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-4 ${themeClasses.bg}`}>
        <div className={`w-full max-w-md rounded-xl p-8 shadow-md text-center border ${themeClasses.card}`}>
          
          <h2 className="text-2xl font-bold mb-2">Welcome to Exam App</h2>
          <p className={`text-sm mb-6 ${themeClasses.textMuted}`}>Sign in to track your scores and certificates</p>

          {authError && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {authError}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 text-gray-700 font-medium hover:bg-gray-50 transition duration-200 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.87z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.2v3.14C3.18 21.38 7.26 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.62H1.2C.43 8.19 0 9.95 0 12s.43 3.81 1.2 5.38l4.07-3.14z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.26 0 3.18 2.62 1.2 6.62l4.07 3.14c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            Continue with Google
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClasses.bg} flex flex-col font-sans transition-colors duration-300`}>
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-8 ${themeClasses.header}`}>
        <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBackToDashboard}>
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
              <Image src="/logo.png" alt="TephdyTech Logo" fill priority className="object-contain" />
            </div>
            <span className="font-bold tracking-tight text-sm sm:text-lg">Cally Assessment Hub</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Select Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-500/10 border border-slate-500/20 px-2.5 py-1 rounded-xl text-xs font-bold">
              <span>🎨 Theme:</span>
              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value as any)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer"
              >
                <option value="light" className="text-slate-900">Light</option>
                <option value="dark" className="text-slate-900">Dark</option>
                <option value="midnight" className="text-slate-900">Midnight</option>
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="truncate max-w-[120px] sm:max-w-none">Candidate: <strong className="text-indigo-500">{userName}</strong></span>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar & Features */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1800px] mx-auto">
        {/* Sidebar Navigation */}
        <aside className={`w-full md:w-72 border-r p-4 sm:p-6 shrink-0 space-y-6 ${themeClasses.sidebar}`}>
          <div className="space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 ${themeClasses.textMuted}`}>System Navigation</span>
            <nav className="space-y-1 pt-1">
              <button
                onClick={() => handleSelectSidebarTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                  activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'hover:opacity-80'
                }`}
              >
                <span>📊</span>
                <span>Dashboard Overview</span>
              </button>
              <button
                onClick={() => handleSelectSidebarTab('logs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                  activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-md' : 'hover:opacity-80'
                }`}
              >
                <span>📈</span>
                <span>Performance Logs</span>
              </button>
            </nav>
          </div>

          <div className="space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 ${themeClasses.textMuted}`}>Practice Modules</span>
            <nav className="space-y-1 pt-1">
              {dashboardFeatures.map((feat) => (
                <button
                  key={feat.id}
                  onClick={() => handleSelectSidebarTab(feat.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    activeTab === feat.id ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold shadow-xs' : 'hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span>{feat.icon}</span>
                    <span className="truncate">{feat.title}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className={`pt-4 border-t ${themeClasses.divider}`}>
            <button
              onClick={handleStartFullExam}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-4 py-3.5 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🎓 Take Full Exam</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-3 sm:px-8 py-4 sm:py-6">
          {appMode === 'dashboard' && !selectedModule && activeTab === 'overview' && (
            <div className="space-y-8 sm:space-y-10 animate-fadeIn">
              {/* Welcome Banner */}
              <div className="p-6 sm:p-10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl space-y-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
                <div className="space-y-3 max-w-2xl relative z-10 text-center md:text-left">
                  <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-400/30">
                    Cally Assessment & Certification Portal
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black">Welcome Back, {userName || 'Candidate'}!</h1>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Select a module from the left sidebar to practice your skills, or check your <strong>Performance Logs</strong> and official <strong>Full Exam</strong> pathway.
                  </p>
                </div>
                <div className="shrink-0 relative z-10 w-full md:w-auto">
                  <button
                    onClick={handleStartFullExam}
                    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-base px-6 sm:px-8 py-4 rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-3"
                  >
                    <span>🎓 Take Full Exam & Download Certificate</span>
                  </button>
                </div>
              </div>

              {/* Individual Practice Modules Quick-Access Section */}
              <div className="space-y-6">
                <div className={`border-b pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 ${themeClasses.divider}`}>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">Individual Practice Modules</h2>
                    <p className={`text-xs ${themeClasses.textMuted}`}>Practice freely module-by-module (No certificate generated)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                  {dashboardFeatures.map((feat) => (
                    <div
                      key={feat.id}
                      className={`border rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition ${themeClasses.card}`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{feat.icon}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${feat.color}`}>
                            {feat.tag}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold">{feat.title}</h3>
                          <p className={`text-xs leading-relaxed ${themeClasses.textMuted}`}>{feat.description}</p>
                        </div>
                      </div>
                      <div className="pt-6">
                        <button
                          onClick={() => handleStartDashboardModule(feat.id)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition cursor-pointer ${feat.btnColor}`}
                        >
                          Practice Module
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {appMode === 'dashboard' && !selectedModule && activeTab === 'logs' && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`border-b pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 ${themeClasses.divider}`}>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Performance & Historical Improvement Logs</h2>
                  <p className={`text-xs ${themeClasses.textMuted}`}>Chronological tracking of every test attempt, score evolution, and exam dates</p>
                </div>
              </div>

              {/* Stats Overview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-6 rounded-2xl border shadow-xs space-y-2 ${themeClasses.card}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>Total Test Attempts</span>
                  <h3 className="text-3xl font-black">{userScores.length}</h3>
                  <p className={`text-[11px] ${themeClasses.textMuted}`}>Logged practice and exam sessions</p>
                </div>

                <div className={`p-6 rounded-2xl border shadow-xs space-y-2 ${themeClasses.card}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>Historical Average Score</span>
                  <h3 className="text-3xl font-black text-indigo-500">
                    {userScores.length > 0 
                      ? Math.round(userScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / userScores.length) 
                      : 0}%
                  </h3>
                  <p className={`text-[11px] ${themeClasses.textMuted}`}>Average across all recorded attempts</p>
                </div>

                <div className={`p-6 rounded-2xl border shadow-xs space-y-2 ${themeClasses.card}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.textMuted}`}>Best Performance</span>
                  <h3 className="text-3xl font-black text-emerald-500">
                    {userScores.length > 0 ? Math.max(...userScores.map(item => item.score || 0)) : 0}%
                  </h3>
                  <p className={`text-[11px] ${themeClasses.textMuted}`}>Highest score achieved in a single log</p>
                </div>
              </div>

              {/* Attempt History Log Table including Exam Dates */}
              <div className={`rounded-2xl border p-6 sm:p-8 shadow-xs space-y-4 ${themeClasses.card}`}>
                <h3 className="text-base font-bold">Attempt Progress Timeline & Dates</h3>
                
                {loadingStats ? (
                  <div className={`text-center py-8 font-bold text-xs sm:text-sm ${themeClasses.textMuted}`}>
                    Loading historical progress logs...
                  </div>
                ) : userScores.length === 0 ? (
                  <div className={`text-center py-8 text-xs sm:text-sm ${themeClasses.textMuted}`}>
                    No test attempts logged yet. Complete a practice module or full exam to start tracking your progress!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${themeClasses.tableHeader}`}>
                          <th className="pb-3 px-3">Date Taken</th>
                          <th className="pb-3 px-3">Module</th>
                          <th className="pb-3 px-3">Score</th>
                          <th className="pb-3 px-3">Status / Improvement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-500/10 text-xs sm:text-sm">
                        {userScores.map((log, index) => {
                          const formattedDate = log.created_at ? new Date(log.created_at).toLocaleString() : 'Recent';
                          const previousAttempt = userScores.slice(index + 1).find(item => item.module_name === log.module_name);
                          const diff = previousAttempt ? log.score - previousAttempt.score : null;

                          return (
                            <tr key={log.id || index} className={`transition ${themeClasses.tableRowHover}`}>
                              <td className={`py-3 px-3 font-medium ${themeClasses.textMuted}`}>{formattedDate}</td>
                              <td className="py-3 px-3 font-bold capitalize">{log.module_name}</td>
                              <td className="py-3 px-3 font-black text-indigo-500">{log.score}%</td>
                              <td className="py-3 px-3">
                                {diff !== null ? (
                                  <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px] ${
                                    diff > 0 ? 'bg-emerald-500/10 text-emerald-500' : diff < 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'
                                  }`}>
                                    {diff > 0 ? `📈 +${diff}% improvement` : diff < 0 ? `📉 ${diff}% drop` : '⚖️ No change'}
                                  </span>
                                ) : (
                                  <span className={`italic text-[11px] ${themeClasses.textMuted}`}>First recorded attempt</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {appMode === 'full_exam' && examStepIndex === 5 && (
            <div className="space-y-6 sm:space-y-8 max-w-[1300px] mx-auto text-center animate-fadeIn">
              <div className="p-3 sm:p-6 bg-slate-100 rounded-3xl border border-slate-200 shadow-xl flex justify-center items-center overflow-hidden w-full">
                <div className="w-full overflow-hidden flex justify-center py-2 sm:py-0">
                  <div className="w-[1100px] h-[778px] sm:h-auto shrink-0 origin-top transform scale-[0.38] min-[360px]:scale-[0.42] min-[400px]:scale-[0.47] min-[500px]:scale-[0.58] min-[640px]:scale-[0.75] md:scale-[0.88] lg:scale-100 transition-transform">
                    <div
                      id="certificate-to-download"
                      style={{
                        width: '1100px',
                        backgroundColor: '#fbf9f4',
                        border: '16px solid #1e293b',
                        padding: '40px 60px',
                        boxSizing: 'border-box',
                        position: 'relative',
                        margin: '0 auto',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ border: '2px solid #b45309', padding: '30px 40px', position: 'relative' }}>
                        
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                          <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '3px', color: '#1e293b', fontWeight: '700' }}>
                            ✨ Cally Assessment Systems ✨
                          </div>
                          <div style={{ fontSize: '11px', color: '#78350f', marginTop: '3px', fontWeight: '600' }}>EST. 2024</div>
                        </div>

                        <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#78350f', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', margin: '10px 0 5px 0', fontFamily: 'serif' }}>
                          Certificate of Achievement
                        </h1>
                        <div style={{ fontSize: '13px', color: '#1e293b', textAlign: 'center', marginBottom: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
                          Official Verification of Professional BPO Competency
                        </div>

                        <div style={{ fontSize: '14px', color: '#475569', textAlign: 'center', fontStyle: 'italic', marginBottom: '5px' }}>This is to certify that</div>
                        <div style={{ fontSize: '36px', fontWeight: '700', color: '#1e293b', textAlign: 'center', margin: '0 auto 15px auto', paddingBottom: '4px', borderBottom: '2px solid #cbd5e1', display: 'table', fontFamily: 'serif' }}>
                          {userName}
                        </div>

                        <p style={{ fontSize: '13px', color: '#334155', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                          has successfully demonstrated exceptional proficiency across all official Cally assessment modules, showcasing linguistic mastery, professional communication skills, and technical competency required for the Business Process Outsourcing (BPO) industry.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 30px', maxWidth: '850px', margin: '0 auto 25px auto', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                          <div>🎧 Listening & Dictation ({examScores.listening}%)</div>
                          <div>🎙️ Speaking Simulation ({examScores.speaking}%)</div>
                          <div>📖 Reading & Grammar ({examScores.reading}%)</div>
                          <div>⌨️ Chat & Typing Accuracy ({examScores.typing}%)</div>
                          <div>✍️ Business Writing Composition ({examScores.writing}%)</div>
                          <div style={{ color: '#b45309', fontWeight: '700' }}>⭐ Final Cumulative Rating: ({overallExamAverage}%)</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #cbd5e1', paddingTop: '20px', marginTop: '10px' }}>
                          <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600', textTransform: 'uppercase' }}>
                            Authorized Electronic Validation
                          </div>

                          <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: '#ffffff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '3px double #fef3c7', textAlign: 'center', fontSize: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <span>Official</span>
                            <span>Verified</span>
                          </div>

                          <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600', textTransform: 'uppercase' }}>
                            Cally Authority
                          </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '11px', color: '#64748b', fontWeight: '600', letterSpacing: '1px' }}>
                          DATE OF ISSUE: [{new Date().toLocaleDateString().toUpperCase()}] &bull; CERTIFICATE ID: [CALLY-BPO-2026-{Math.floor(1000 + Math.random() * 9000)}]
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 sm:p-8 border rounded-3xl space-y-6 shadow-xl ${themeClasses.card}`}>
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black">Exam Finished Successfully!</h2>
                  <p className={`text-xs sm:text-sm ${themeClasses.textMuted}`}>Your verified Cally certificate file (.pdf) is ready for download.</p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    disabled={isDownloadingPdf}
                    onClick={handleDownloadPDF}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isDownloadingPdf ? '⏳ Generating .pdf file...' : '📥 Download Certificate (.pdf)'}</span>
                  </button>
                  <button
                    onClick={handleBackToDashboard}
                    className="w-full sm:w-auto bg-slate-500/10 hover:bg-slate-500/20 font-bold text-sm px-6 py-3.5 rounded-xl transition cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedModule && (appMode === 'dashboard' || (appMode === 'full_exam' && examStepIndex < 5)) && (
            <div className="space-y-6 max-w-[1400px] mx-auto">
              <div className={`rounded-2xl border p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${themeClasses.card}`}>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    onClick={handleBackToDashboard}
                    className="px-4 py-2 bg-slate-500/10 hover:bg-slate-500/20 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    ← Back to Dashboard
                  </button>
                  {appMode === 'dashboard' && selectedModule && (
                    <button
                      onClick={() => generateTest(selectedModule)}
                      className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-xl transition cursor-pointer border border-indigo-500/30 flex items-center gap-1.5"
                    >
                      <span>🔄 Generate New Test</span>
                    </button>
                  )}
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 block">
                    {appMode === 'full_exam' ? `Full Exam Step ${examStepIndex + 1} of 5` : 'Individual Practice Mode'}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold capitalize">{selectedModule} Module</h2>
                </div>
              </div>

              {selectedModule === 'speaking' && (
                <div className={`rounded-2xl border p-5 sm:p-8 shadow-xs ${themeClasses.card}`}>
                  <SpeakingRecorder
                    key={speakingPrompts[0] || 'speaking-default'}
                    prompts={speakingPrompts}
                    onComplete={handleSpeakingComplete}
                  />
                </div>
              )}

              {selectedModule === 'writing' && (
                <div className={`rounded-2xl border p-5 sm:p-8 shadow-xs space-y-6 ${themeClasses.card}`}>
                  <div className="p-4 sm:p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase block">Writing Prompt:</span>
                    <p className="text-sm sm:text-base font-medium">{writingPrompt}</p>
                  </div>
                  <textarea
                    rows={6}
                    value={writingText}
                    onChange={(e) => setWritingText(e.target.value)}
                    placeholder="Type your professional response here..."
                    className="w-full p-4 border border-slate-500/30 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSubmitWriting}
                    disabled={isEvaluatingWriting || !writingText.trim()}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer shadow-xs"
                  >
                    {isEvaluatingWriting ? 'Evaluating...' : 'Submit Writing Assessment'}
                  </button>
                  {isSubmitted && !showScorePopup && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-bold text-sm">
                      ✓ Writing Submitted! Score: {score}% {appMode === 'full_exam' && '• Advancing to next exam module...'}
                    </div>
                  )}
                </div>
              )}

              {selectedModule === 'typing' && (
                <div className={`rounded-2xl border p-5 sm:p-8 shadow-xs space-y-6 ${themeClasses.card}`}>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-sky-500/10 rounded-xl border border-sky-500/20">
                      <span className="text-xs text-sky-400 block font-bold uppercase">WPM</span>
                      <span className="text-2xl font-black">{wpm}</span>
                    </div>
                    <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <span className="text-xs text-indigo-400 block font-bold uppercase">Accuracy</span>
                      <span className="text-2xl font-black">{accuracy}%</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-slate-950 text-slate-300 rounded-2xl font-mono text-xs sm:text-base leading-relaxed overflow-x-auto border border-slate-800">
                    {typingPassage.split('').map((char, index) => {
                      let color = 'text-slate-500';
                      if (index < userInput.length) {
                        color = userInput[index] === char ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold underline';
                      }
                      return <span key={index} className={color}>{char}</span>;
                    })}
                  </div>

                  <textarea
                    ref={typingInputRef}
                    rows={4}
                    disabled={isTypingCompleted}
                    value={userInput}
                    onChange={handleTypingChange}
                    placeholder="Type passage here..."
                    className="w-full p-4 border border-slate-500/30 bg-transparent rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
                  />
                  {isTypingCompleted && !showScorePopup && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-bold text-sm">
                      ✓ Typing Completed! Score Recorded: {score}% {appMode === 'full_exam' && '• Finalizing exam score...'}
                    </div>
                  )}
                </div>
              )}

              {(selectedModule === 'listening' || selectedModule === 'reading') && (
                <div className={`rounded-2xl border p-5 sm:p-8 shadow-xs space-y-6 ${themeClasses.card}`}>
                  {loading && <div className={`text-center py-12 font-bold ${themeClasses.textMuted}`}>Generating test questions...</div>}

                  {!loading && !testData && (
                    <button
                      onClick={() => generateTest(selectedModule)}
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer shadow-xs"
                    >
                      Load {selectedModule.toUpperCase()} Test
                    </button>
                  )}

                  {testData && (
                    <div className="space-y-6">
                      <h3 className="text-lg sm:text-xl font-bold">{testData.title}</h3>

                      {selectedModule === 'reading' && testData.passage && (
                        <div className="p-5 sm:p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl font-serif leading-relaxed shadow-xs text-xs sm:text-sm whitespace-pre-line">
                          {testData.passage}
                        </div>
                      )}

                      {selectedModule === 'listening' && testData.audioScript && !hasAudioEnded && (
                        <div className="p-4 bg-slate-950 text-white rounded-xl space-y-3 shadow-inner border border-slate-800">
                          <AudioPlayer
                            script={testData.audioScript}
                            onPlay={() => setHasAudioStarted(true)}
                            onEnded={() => {
                              setHasAudioEnded(true);
                              setIsListeningTimerActive(true);
                            }}
                          />
                        </div>
                      )}

                      {(selectedModule === 'reading' || hasAudioEnded) && (
                        <div className="space-y-6">
                          {selectedModule === 'listening' && isListeningTimerActive && !isSubmitted && (
                            <div className="p-3 bg-rose-600 text-white text-xs font-mono rounded-xl flex justify-between animate-bounce shadow-xs">
                              <span>⏱️ Time Remaining:</span>
                              <span>{listeningTimer}s</span>
                            </div>
                          )}

                          {testData.questions.map((q, idx) => (
                            <div key={q.id || idx} className="p-4 sm:p-5 bg-slate-500/5 border border-slate-500/10 rounded-xl space-y-3">
                              <p className="font-semibold text-sm sm:text-base">Question {idx + 1}: {q.question}</p>
                              <div className="grid grid-cols-1 gap-2">
                                {q.options?.map((opt, oIdx) => (
                                  <button
                                    key={oIdx}
                                    disabled={isSubmitted}
                                    onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                    className={`p-3 text-left rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer ${
                                      selectedAnswers[q.id] === opt ? 'bg-amber-500/20 border-amber-500 text-amber-500 font-bold' : 'border-slate-500/20 bg-transparent'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}

                          {!isSubmitted ? (
                            <button
                              onClick={selectedModule === 'listening' ? handleSubmitListening : handleSubmitReading}
                              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer shadow-xs"
                            >
                              Submit {selectedModule} Answers
                            </button>
                          ) : !showScorePopup && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-bold text-sm">
                              ✓ {selectedModule.toUpperCase()} Module Complete! Score Recorded: {score}% {appMode === 'full_exam' && '• Advancing to next exam module...'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showScorePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center space-y-5 transform animate-bounce-short">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner ${score !== null && score <= 70 ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
              {score !== null && score <= 70 ? '😢' : '🏆'}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">TephdyTech Module Completed</span>
              <h3 className="text-2xl font-black">Your Score</h3>
            </div>
            
            <div className={`py-3 rounded-2xl border ${score !== null && score <= 70 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
              <span className="text-5xl font-black">{score}%</span>
            </div>

            {score !== null && score <= 70 && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-xs italic font-medium leading-relaxed">
                {motivationalQuote}
              </div>
            )}

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowScorePopup(false);
                  if (appMode === 'full_exam') {
                    handleAdvanceExamStep(score || 0);
                  }
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition shadow-md cursor-pointer"
              >
                {appMode === 'full_exam' ? 'Continue to Next Exam Module →' : 'Awesome, Close'}
              </button>

              {appMode === 'dashboard' && selectedModule && (
                <button
                  onClick={() => {
                    setShowScorePopup(false);
                    generateTest(selectedModule);
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm py-3 px-4 rounded-xl transition cursor-pointer border border-slate-700"
                >
                  🔄 Generate New Test
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showInstructionsModal && activeFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-inner shrink-0">
                  📌
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-indigo-400 uppercase tracking-widest block">TephdyTech Module Guide</span>
                  <h3 className="text-base sm:text-lg font-black">{activeFeature.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer text-sm font-bold shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
              {activeFeature.instructions}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 px-4 rounded-xl transition shadow-md cursor-pointer"
              >
                Got it, Let's Begin!
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className={`w-full border-t py-6 px-4 sm:px-8 mt-auto shadow-xs ${themeClasses.header}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-center text-xs text-center">
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <span className="font-bold">Developed By TephdyTech</span>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}