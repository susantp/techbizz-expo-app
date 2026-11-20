const { withAndroidManifest } = require('expo/config-plugins');

const PORTRAIT_FEATURE = 'android.hardware.screen.portrait';

/**
 * Keep the portrait orientation preference without making portrait support a
 * required device feature for Google Play catalog filtering.
 *
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
function withOptionalAndroidPortrait(config) {
  return withAndroidManifest(config, (config) => {
    const features = config.modResults.manifest['uses-feature'] ?? [];
    let portraitFeature;

    config.modResults.manifest['uses-feature'] = features.filter((feature) => {
      if (feature.$['android:name'] !== PORTRAIT_FEATURE) {
        return true;
      }

      if (!portraitFeature) {
        portraitFeature = feature;
      }

      return false;
    });

    if (!portraitFeature) {
      portraitFeature = { $: { 'android:name': PORTRAIT_FEATURE } };
    }

    portraitFeature.$['android:required'] = 'false';
    config.modResults.manifest['uses-feature'].push(portraitFeature);

    return config;
  });
}

module.exports = withOptionalAndroidPortrait;
