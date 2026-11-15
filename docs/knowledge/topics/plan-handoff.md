# Plan handoff

## Before marking Ready

For API work, name the runtime schema, the type inferred from it, and where parsing happens. Follow the [API contract and typing guide](api-contracts-and-typing.md).

For reusable infrastructure, check the existing stack and document the package choice or why custom code is justified. See the [library and state guide](library-and-state-choices.md).

- Inspect the current checkout and name the repositories, revisions, entry points, and files in scope. Define the intended outcome and behavior to preserve. Order the edits and specify mappings, interfaces, callers, and cleanup wherever the implementer would otherwise have to make a material decision. Resolve conflicts before handoff and ask a focused question if the source and user instructions leave a material choice open.
- Make acceptance runnable. Give the setup commands, working directories, test inputs, expected outcomes, and known baseline failures. For new API integrations, pin the local source revisions, ports, environment values, and response checks. State which checks close the plan. Track public endpoint verification as release work when it depends on deployment. Use mocks or read-only checks for integrations that could send messages or write data.
- For device acceptance, verify the host OS, tools, and available devices before handoff. Check whether the implementing session can use Computer Use for desktop controls and record the fallback if it cannot. Link the [Expo device runbook](expo-device-smoke-check.md) and record the task’s SDK, host-specific device choices, service ports, and expected screens or actions.
- Read the plan as a fresh implementer. It should be possible to start the dependencies, implement, verify, recover from a common failure, and close the plan from the checkout and linked docs. Resolve any step that still depends on the chat or a guess.

## During implementation and closeout

- Reuse a recorded result only when it applies to the current code, inputs, and environment and the handoff permits reuse. Identify it as reused. Run explicitly requested checks and rerun checks affected by edits. Record what actually ran, on which platform, and with what result.
- Start or restart local tools and services needed to finish verification when the task authorizes their use. For example, open Docker Desktop, wait for the engine to respond, and rerun the container check. Apply the same rule to local emulators and dev servers.
- Reproduce an inherited blocker before carrying it forward. Try the documented recovery and finish independent work. If acceptance still requires outside action, record the failed operation, current error or evidence, checks already completed, and exact resume step.
- After acceptance, add the completion date and evidence, mark **Completed**, move the plan, and update its inbound links. When a local commit is authorized, specify the repositories and files in scope, stage explicit task paths, review `git diff --cached --stat` and `git diff --cached --check`, and report the SHA and remaining working tree changes. If an interim commit is authorized, keep the plan open and commit the eventual closeout separately.
