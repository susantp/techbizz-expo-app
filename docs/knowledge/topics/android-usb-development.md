# Android development over USB

Use this from the `techbizz-expo-app` checkout to install and open the Tech Bizz development client on a physical Android phone. It uses the USB cable to reach Metro and any local portfolio APIs. Google Play and Expo Go are unnecessary for this workflow.

## Prerequisites

- Install Bun and Android SDK Platform Tools. Run `adb devices -l`, connect and unlock one Android phone with USB debugging enabled, and accept the debugging prompt on the phone. ADB should list its state as `device`. The script uses `adb -d` so it targets USB instead of an emulator.
- Download the signed Android APK from the **development** build in the [Tech Bizz Expo project's Builds page](https://expo.dev/accounts/techbizz/projects/techbizz-expo-app/builds). Use a development build for the current native dependencies. JavaScript changes use Metro, while native dependencies or config changes need a new APK.

## Run

1. Choose the API origins in ignored `.env.local` or export them in both terminals. Use the same values for Metro and the USB script. For production data use `https://www.techbizznepal.com` and `https://www.susantpaudel.com.np` for `EXPO_PUBLIC_COMPANY_ORIGIN` and `EXPO_PUBLIC_PERSONAL_ORIGIN`. For local data use `http://127.0.0.1:3102` and `http://127.0.0.1:3101` and start the portfolio servers with the [local server instructions](../plans/completed/company-app-front-door.md#local-servers-and-devices).
2. Start Metro in development-client mode, or reuse your already running Metro for this checkout.

   ```sh
   bun run start:dev-client --localhost
   ```

3. In a second terminal in the Expo checkout, install and open the downloaded APK. Omit the APK path for later launches.

   ```sh
   bun run android:usb /path/to/development.apk
   bun run android:usb
   ```

   If Metro is on another port, set `METRO_PORT` to match when running the script. The script checks Metro and loopback APIs, adds `adb reverse` mappings for the needed ports, and opens the app using its development-client URL with `127.0.0.1`. It leaves servers and the APK in place.
4. On the phone, complete any first-run development-client prompt and check Home for loaded services, Services navigation, and Company for the leadership portrait. Stop Metro or disconnect USB when finished. Remove individual mappings if needed with `adb -d reverse --remove tcp:<port>`.

## Troubleshooting

- **Unauthorized or no device.** Unlock the phone, reconnect the USB data cable, accept the USB debugging prompt, and retry `adb devices -l`.
- **More than one USB device.** Disconnect the other USB devices and retry. Emulators can remain connected.
- **Metro or local APIs unavailable.** Start the missing service on the Mac, verify its port, and rerun the script. Changing the API origins passed to Metro requires restarting Metro.
- **No handler for the development link.** Install the `development` APK. A standalone `preview` APK uses the same app identity but lacks the development launcher. If Android reports a signature mismatch, use a build signed with the installed app's key or uninstall the existing copy yourself if its local data can be discarded.
- **Building a new APK.** Run `bunx --bun eas-cli build --platform android --profile development`. If the upload fails with a request-body/Content-Length mismatch under Bun, retry that command as `bunx eas-cli build --platform android --profile development` to use the CLI's declared runtime for the upload. The EAS profile still installs and builds the app with Bun.

## Verified on 2026-11-15

Installed the signed [EAS development APK](https://expo.dev/accounts/techbizz/projects/techbizz-expo-app/builds/b806972f-0188-4f9b-8029-6b7e77b11dcd) on a physical Samsung Android phone with `bun run android:usb /tmp/techbizz-eas-b806972f-development.apk`. Metro used 8081 and both local feeds used 3101 and 3102. After unlocking and dismissing the developer menu, the phone displayed the Web development detail and its company description.
