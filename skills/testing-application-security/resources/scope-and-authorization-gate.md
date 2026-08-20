# Scope and Authorization Gate

Complete this before any probing. Not a formality: unauthorized testing is unauthorized access, regardless of intent, employment, or how obviously the system belongs to your company.

---

# Authorization record

- **System**: [name and exact hosts or URLs]
- **Environment**: [staging / preprod / **production**]
- **Authorized by**: [name, role]
- **Authorization form**: [email, ticket, signed statement, bug bounty scope page] with [link]
- **Date obtained**: [YYYY-MM-DD]
- **Window**: [start] to [end]
- **Tester**: [name]

## In scope

- Hosts: [exact list; wildcards only if the authorization uses them]
- Endpoints: [paths or "all paths on the listed hosts"]
- Accounts: [the synthetic accounts created for this]
- Roles: [which role boundaries are being checked]

Everything not listed is out of scope. A related host that "is obviously ours" is not in scope unless it is named.

## Out of scope, explicitly

- Third-party services, including the payment provider, the email service, the CDN, the auth provider
- Any host not listed above
- Any account belonging to a real person
- Production data of any kind

## Prohibited actions

- Denial of service, load generation, or resource exhaustion
- Data exfiltration beyond the minimum needed to demonstrate a finding
- Modifying or deleting data belonging to anyone else
- Social engineering, phishing, or any action involving a person rather than a system
- Physical access
- Persistence: no backdoors, no accounts created for later use
- Testing outside the authorized window

## Contact

- **Immediate contact**: [name, phone, channel]
- **When to contact them**: any unexpected outcome, any sign that real data is involved, any finding above medium severity, any action with an effect you did not predict

## Data rule

Synthetic accounts and synthetic data only. If real customer data appears at any point, **stop, do not read further, and contact the person above**. See `handling-sensitive-test-data`.

---

## What valid authorization has to state

A message saying "sure, go ahead" is not enough. The record needs:

| Element | Why |
| --- | --- |
| Named system and hosts | So scope is not inferred |
| Environment | Production carries different risk and needs its own approval |
| Named authorizer with the authority to give it | A colleague's agreement is not authorization |
| Time window | Open-ended authorization is not authorization for a year from now |
| Prohibited actions | So the boundary is written rather than assumed |
| A contact | So an unexpected outcome has an immediate path |

## Production

Production testing needs its own explicit approval, separate from any staging authorization, and even then:

- **no probing against real customer accounts**, only accounts you created
- **no destructive or state-changing actions** outside your own test accounts
- **no load generation** of any kind
- **someone watching monitoring** during the window, aware that the traffic is yours
- **an agreed abort signal** and a way to reach you instantly

Default to staging. The usual reason given for production, that staging differs, is a finding about environment parity worth reporting on its own.

## Third-party systems

- A published **bug bounty scope** is authorization for exactly what it lists. Read the exclusions; they are the part that matters.
- **No scope statement means no authorization.** A vendor's system being reachable from your test environment does not put it in scope.
- Testing an integration means testing **your side** of it. Stub the third party.

## Stop conditions

Stop immediately, and contact the person above, when:

- real customer data appears anywhere in a response
- an action has an effect you did not predict
- a service degrades or errors in a way that suggests your traffic caused it
- a finding reaches high severity, where continuing means exploiting rather than demonstrating
- you reach the edge of the written scope, even by one host
- the time window ends
- you are uncertain whether the next action is authorized

The last one is the most important. Uncertainty resolves by asking, not by proceeding and explaining afterwards.

## Depth limit

This skill covers verification that the application enforces what it claims. It stops at:

- confirming a class of finding with the minimum demonstration
- reporting it through the disclosure path

It does not cover, and a tester operating under this skill should hand off rather than attempt:

- developing a proof of concept into a working exploit
- chaining findings into a fuller compromise
- post-exploitation of any kind
- testing infrastructure, networks, or hosts rather than the application
- anything involving a person rather than a system

Handing off is the right outcome, not a failure. A confirmed IDOR reported clearly is more useful to a security team than a half-built exploit.

## If something goes wrong

1. **Stop.** No further requests.
2. **Contact** the named person immediately. Speed matters more than a complete account.
3. **Preserve** what you have: requests, responses, timestamps. Do not clean up.
4. **Do not attempt to fix it yourself**, particularly if data was modified.
5. **Write down** what you did, in order, while you remember it precisely.

Reporting an accident promptly is always better than the alternative, and every incident process assumes it.
