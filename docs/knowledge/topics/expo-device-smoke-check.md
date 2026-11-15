# Expo device smoke checks

Read the task plan for the Expo SDK, local origins, ports, and acceptance scenarios. Start the Expo development server and local dependencies first. Verify they respond from the host before troubleshooting device connectivity.

## Desktop interaction preflight

For Device Hub, prefer the desktop app's **Computer Use** plugin, shown as **Computer** or `@Computer` in supported chats. Before relying on it in a handoff, confirm the local execution session exposes interactive controls and can open Device Hub. On macOS, the plugin needs Screen Recording and Accessibility permissions. If the current session lacks the tool, use an authorized local session with Computer Use enabled, or record the exact taps the user can perform in Device Hub. See [OpenAI's Computer Use setup](https://developers.openai.com/training/walkthroughs/using-your-computer-and-browser).

The ChatGPT menu bar can show **Computer Use → No Active Sessions**. This reports that no Computer Use session is running at that moment. Check the implementing chat separately for interactive controls before counting on them for acceptance.

Click the simulator's controls with Computer Use, another available UI driver, or manual input and observe the result. Screenshots and deep links can confirm rendering. To verify a button or tab, perform that interaction and observe the resulting route. Record which interaction method ran and any remaining manual step. For Android, ADB input and a UI hierarchy dump can verify the same actions. Use the CLI for lint, TypeScript, Expo export, and exact API comparisons.

On a locked Mac, a temporary XCTest UI test target can drive an already booted iOS simulator directly with `xcodebuild test`. Open the project in Expo Go, then activate `XCUIApplication(bundleIdentifier: "host.exp.Exponent")` from the test. Dismiss the Expo Go developer menu if it covers the app. Assert the selected tab and visible destination after each tap. Keep the fixture outside the app repo for a one-time check.

## Android emulator

1. Run `adb devices -l`. Reuse a booted emulator listed as `device`, or list AVDs with `"$ANDROID_HOME/emulator/emulator" -list-avds` and start the selected one with `"$ANDROID_HOME/emulator/emulator" -avd <avd-name>`. Android Studio → Device Manager → Play is the GUI equivalent. Create a phone AVD with a Google APIs image for the host architecture if the list is empty.
2. Wait for the home screen and for `adb shell getprop sys.boot_completed` to print `1`. If more than one device is connected, use `adb -s <serial>` for each command.
3. If Expo Go is missing or rejects the SDK, run `bunx --bun expo-go download android <sdk-major>` in a temporary directory and install the downloaded APK with `adb install -r <apk-path>`.
4. For each host port consumed through loopback, run `adb reverse tcp:<port> tcp:<port>`. Include Metro and any direct local API ports. With Metro on 8081, open the project using `adb shell am start -a android.intent.action.VIEW -d 'exp://127.0.0.1:8081'`. If data fails to load, check `adb reverse --list`, the configured origins, and host responses. Restart Expo after changing its environment.

## iOS simulator with Xcode 27 Device Hub

1. Open **Xcode → Open Developer Tool → Device Hub**. Select the simulator and click **View Screen**. Add a simulator in Device Hub if needed. If no iOS runtime is installed, use Xcode Settings → Components. The default Xcode installation on the verified host also opens with `open -a /Applications/Xcode.app/Contents/Applications/DeviceHub.app`.
2. Open a compatible Expo Go in the simulator. If missing or incompatible, run `bunx --bun expo-go download ios <sdk-major>` in a temporary directory and install the extracted app with `xcrun simctl install booted <app-path>` when exactly one simulator is booted. With multiple booted simulators, specify the desired UDID instead of `booted`.
3. Select the development server in Expo Go, or open `exp://127.0.0.1:8081` in the simulator with Safari when Metro uses port 8081. Click the blue **Open** button on the “Open in ‘Expo Go’?” prompt in the Device Hub device screen. If automation is denied Accessibility access, recheck the current screen and identify exactly which interaction needs a manual click.
4. Verify the first screen shows actual source data, then exercise the task’s routes and actions. If the simulator lacks a handler for an external action, record the observed fallback and the simulator limitation. If the task requires a successful handoff to that handler, use a device that has it. Verify destinations without sending messages.

Host reference: the front door verification used SDK 58 with Xcode 27.0 on macOS 27.2. See the [recorded device results](../plans/completed/company-app-front-door.md#native-device-checks), [Apple’s Device Hub setup](https://developer.apple.com/documentation/xcode/managing-your-simulated-and-physical-devices-in-device-hub), and [Expo Go version guidance](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/).
