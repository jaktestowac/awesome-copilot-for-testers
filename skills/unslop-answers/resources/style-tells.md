# Style Tells

The complete prose list, for when the job is editing text rather than reporting work. The claim patterns in `SKILL.md` matter more: a style tell wastes a minute, an unearned claim costs a day. Fix claims first, then come here.

Every fix names a plainer alternative. If a tell cannot be rewritten into something concrete, cut the sentence.

## Content

1. **Puffery.** "Pivotal moment", "testament to", "evolving landscape", "setting the stage for", "indelible mark". Say what happened.
2. **Promotional language.** "Groundbreaking", "renowned", "seamless", "robust", "powerful", "world-class". In QA writing "robust" is the worst of these, because it sounds like a property and names nothing measurable. Say what breaks and what does not.
3. **Superficial -ing phrases.** "Highlighting the importance of", "ensuring reliability", "reflecting best practice", "fostering confidence". Delete, or replace with the mechanism.
4. **Vague attribution.** "Experts believe", "industry reports suggest", "some argue". Name the source or delete the sentence.
5. **Formulaic challenge framing.** "Despite the complexity, the suite continues to deliver value." Replace with a fact.
6. **Name-dropping.** Listing tools or standards without saying what each one contributed.

## Language

7. **AI vocabulary.** Additionally, crucial, delve, enhance, fostering, garner, holistic, interplay, intricate, landscape (abstract), leverage, pivotal, robust, seamless, showcase, tapestry, testament, underscore, vibrant. Use the plain word.
8. **Fancy ways to say "is".** "Serves as", "stands as", "boasts", "features", "represents". Use "is" or "has".
9. **"Not just X, but Y."** State the point directly.
10. **Rule of three.** Three items because three sounds complete. Use the number you actually found. In a findings list this is worse than a style problem: it invents a third finding or drops a fourth.
11. **Synonym cycling.** Test, spec, case, scenario, check, all for the same thing in one paragraph. Pick one word and repeat it. Technical writing wants boring consistency.
12. **False ranges.** "From flaky tests to CI configuration" where the two ends are not on a scale. List the items.

## Style

13. **Em dashes.** Avoid them. Use a period or a comma. Reaching for parentheses instead trades one tell for another. If a thought needs separation, end the sentence.
14. **Colons as mid-sentence connectors.** Fine before a list or an example, not as a hinge between two clauses. Rewrite so the point stands without the crutch.
15. **Boldface on every proper noun.** Bold marks one thing per paragraph at most.
16. **Bold label restating its own line.** "**Coverage:** Coverage is now 81%." Write the sentence. A bold lead-in that names the item and is followed by new detail is fine.
17. **Title Case Headings.** Use sentence case, unless the surrounding document already does otherwise, in which case match it.
18. **Decorative emoji.** Out of headings and bullets. Emoji status markers are worse than decorative: a green tick is a claim with no evidence attached to it.
19. **Curly quotes.** Straight quotes only.
20. **Tables carrying two facts.** Structure heavier than its content. Two sentences.
21. **A bulleted list of one thing.** Write it as a sentence.

## Communication artifacts

22. **Chatbot phrases.** "I hope this helps", "let me know if", "certainly", "of course", "great catch", "found the smoking gun". Delete.
23. **Sycophancy.** "Great question", "you are absolutely right". Answer instead.
24. **Apology loops.** A paragraph of regret over a one-line correction. Correct it and continue.
25. **Cutoff disclaimers.** "While specific details are limited". Either find the detail or state plainly what you could not check.
26. **Restating the request.** The reader wrote it. Start with the answer.
27. **Summarising the bullets directly above.** Delete the closing paragraph.

## Filler

28. **Filler phrases.** "In order to" becomes "to". "Due to the fact that" becomes "because". "It is important to note that" gets deleted entirely.
29. **Stacked hedges.** "Could potentially possibly be argued that it might" becomes "may". Then check whether it needs the "may" at all.
30. **Generic conclusions.** "This puts the suite in a much healthier place." Name the numbers that moved.
31. **Fancy synonyms.** "Utilize" becomes "use". "Facilitate" becomes "help". "Numerous" becomes "many". "In the event that" becomes "if".

## Jargon

32. **Abstract metaphor nouns.** Substrate, wedge, vector, locus, nexus, primitive (as a noun), surface (as in "API surface"), bedrock, scaffolding (as a metaphor), paradigm, north star, flywheel, gold-plating, ratchet. Each has a plainer concrete word. "Substrate" is "base". "Vector" is "way". "Gold-plating" is "more than the job needs".
33. **Metaphor doing the work of a measurement.** "The suite is brittle", "the coverage is thin", "the tests are noisy". Each one has a number behind it. Use the number.

## Plain speech

34. **Say what it does, not how it feels.** "Tests you can trust", "a suite that gives confidence", "types that follow your schema" name a feeling. The fix names the mechanism or a number: "a column rename fails the build", "the flake rate went from 7 in 50 to 0 in 50". If you cannot restate a sentence as an instruction, a fact, or a number, cut it.
35. **The portable paragraph.** If a paragraph would read identically in another project's docs, it says nothing about this one. Cut it.
36. **Dense sentences.** If a reader has to backtrack to parse it, split it. One idea per sentence.
37. **Passive voice hiding the actor.** "Queries are validated" becomes "the compiler validates queries". "The test was updated" becomes "I updated the test". Passive is fine only when the actor genuinely does not matter. In a report about your own work, the actor almost always matters.
38. **Adverbs propping up weak verbs.** "Runs quickly" becomes "takes 2.9s". "Significantly improves" becomes the delta. An adverb doing the verb's job means the verb is wrong.

## Adding voice

Removing tells is half the job. Sterile, voiceless writing is its own tell, and in a report it reads as evasive.

- **Have an opinion.** "I would not ship this until the payment specs run" beats a neutral list of pros and cons.
- **Vary the rhythm.** Short sentences. Then a longer one that takes its time when the idea needs the room.
- **Say "I" when you did something.** "I could not reproduce it" is more useful than "it could not be reproduced".
- **Name what surprised you.** The unexpected finding is the most valuable line in most reports and it is usually written flat.
- **Let some mess in.** Perfectly parallel structure looks machine-made.

Voice never means inventing detail. A confident, well-phrased sentence about something you did not check is the failure the rest of this skill exists to catch.
